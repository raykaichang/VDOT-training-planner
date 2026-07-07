import { haversineDistance } from "./distance.mjs";
import {
  actualPaceFromEquivalent,
  clampGradeForModel,
  equivalentPaceFromActual,
  minettiRunningCost
} from "./minetti.mjs";
import {
  applyHeatSlowdownToPace,
  estimateHeatSlowdownPercent
} from "./heat.mjs";

function nearestIndexAtDistance(points, distanceM) {
  let low = 0;
  let high = points.length - 1;
  while (low < high) {
    const mid = Math.floor((low + high) / 2);
    if (points[mid].distanceM < distanceM) low = mid + 1;
    else high = mid;
  }
  if (low === 0) return 0;
  const prev = low - 1;
  return Math.abs(points[prev].distanceM - distanceM) <
    Math.abs(points[low].distanceM - distanceM)
    ? prev
    : low;
}

function cleanElevations(points) {
  return points.map((point, index) => {
    if (index === 0) return point.elevation;
    const previous = points[index - 1];
    const distance = haversineDistance(previous, point);
    const jump = Math.abs(point.elevation - previous.elevation);
    return distance < 100 && jump > 80 ? previous.elevation : point.elevation;
  });
}

function smoothElevations(points, elevations, windowMeters) {
  return points.map((point, index) => {
    const minDistance = point.distanceM - windowMeters / 2;
    const maxDistance = point.distanceM + windowMeters / 2;
    let total = 0;
    let count = 0;

    for (let cursor = index; cursor >= 0 && points[cursor].distanceM >= minDistance; cursor--) {
      total += elevations[cursor];
      count += 1;
    }
    for (
      let cursor = index + 1;
      cursor < points.length && points[cursor].distanceM <= maxDistance;
      cursor++
    ) {
      total += elevations[cursor];
      count += 1;
    }

    return count > 0 ? total / count : elevations[index];
  });
}

export function prepareRoutePoints(trackPoints, smoothingWindowMeters = 200) {
  let cumulativeDistanceM = 0;
  const points = trackPoints.map((point, index) => {
    if (index > 0) cumulativeDistanceM += haversineDistance(trackPoints[index - 1], point);
    return {
      ...point,
      distanceM: cumulativeDistanceM
    };
  });

  const cleaned = cleanElevations(points);
  const smoothed = smoothElevations(points, cleaned, smoothingWindowMeters);
  const route = points.map((point, index) => ({
    ...point,
    elevationM: cleaned[index],
    smoothedElevationM: smoothed[index]
  }));

  return route.map((point) => {
    const halfWindow = smoothingWindowMeters / 2;
    const prev = route[nearestIndexAtDistance(route, Math.max(0, point.distanceM - halfWindow))];
    const next = route[nearestIndexAtDistance(route, point.distanceM + halfWindow)];
    const distanceDelta = next.distanceM - prev.distanceM;
    const grade =
      distanceDelta > 0
        ? (next.smoothedElevationM - prev.smoothedElevationM) / distanceDelta
        : 0;

    return { ...point, grade };
  });
}

export function createSegments(
  routePoints,
  segmentSizeKm,
  targetEquivalentPaceSecPerKm,
  downhillFactor = 0.65,
  heatAdjustmentSettings = { enabled: false }
) {
  const totalDistanceM = routePoints.at(-1).distanceM;
  if (!Number.isFinite(totalDistanceM) || totalDistanceM <= 1) {
    throw new Error("Route distance is too short.");
  }
  const segmentSizeM = segmentSizeKm * 1000;
  const segmentCount = Math.ceil(totalDistanceM / segmentSizeM);
  const segments = [];
  const heatAdjustment = estimateHeatSlowdownPercent(heatAdjustmentSettings);
  let cumulativeGradeAdjustedTimeSec = 0;
  let cumulativeFinalTimeSec = 0;

  for (let segmentIndex = 0; segmentIndex < segmentCount; segmentIndex++) {
    const startM = segmentIndex * segmentSizeM;
    const endM = Math.min(totalDistanceM, (segmentIndex + 1) * segmentSizeM);
    const startIndex = nearestIndexAtDistance(routePoints, startM);
    const endIndex = nearestIndexAtDistance(routePoints, endM);
    const slice = routePoints.slice(startIndex, Math.max(startIndex + 2, endIndex + 1));
    const start = slice[0];
    const end = slice.at(-1);
    const distanceM = Math.max(1, end.distanceM - start.distanceM);
    let elevationGainM = 0;
    let elevationLossM = 0;

    for (let index = 1; index < slice.length; index++) {
      const delta = slice[index].smoothedElevationM - slice[index - 1].smoothedElevationM;
      if (delta > 0) elevationGainM += delta;
      if (delta < 0) elevationLossM += Math.abs(delta);
    }

    const averageGrade =
      distanceM > 0 ? (end.smoothedElevationM - start.smoothedElevationM) / distanceM : 0;
    const gradeForFormula = clampGradeForModel(averageGrade);
    const recommendedActualPaceSecPerKm = actualPaceFromEquivalent(
      targetEquivalentPaceSecPerKm,
      averageGrade,
      downhillFactor
    );
    const equivalentPaceSecPerKm = equivalentPaceFromActual(
      recommendedActualPaceSecPerKm,
      averageGrade
    );
    const heatAdjustedPaceSecPerKm = heatAdjustmentSettings?.enabled
      ? applyHeatSlowdownToPace(
          recommendedActualPaceSecPerKm,
          heatAdjustment.finalSlowdown
        )
      : recommendedActualPaceSecPerKm;
    const gradePaceDeltaSecPerKm =
      recommendedActualPaceSecPerKm - targetEquivalentPaceSecPerKm;
    const heatDeltaSecPerKm =
      heatAdjustedPaceSecPerKm - recommendedActualPaceSecPerKm;
    const finalPaceDeltaSecPerKm =
      heatAdjustedPaceSecPerKm - targetEquivalentPaceSecPerKm;
    const gradeAdjustedSegmentTimeSec =
      recommendedActualPaceSecPerKm * (distanceM / 1000);
    const finalSegmentTimeSec = heatAdjustedPaceSecPerKm * (distanceM / 1000);
    cumulativeGradeAdjustedTimeSec += gradeAdjustedSegmentTimeSec;
    cumulativeFinalTimeSec += finalSegmentTimeSec;
    const warnings = [];

    if (averageGrade > 0.08) warnings.push("STEEP_UPHILL");
    if (averageGrade < -0.08) warnings.push("STEEP_DOWNHILL");

    segments.push({
      index: segmentIndex + 1,
      startKm: startM / 1000,
      endKm: endM / 1000,
      distanceKm: distanceM / 1000,
      elevationGainM,
      elevationLossM,
      netElevationM: end.smoothedElevationM - start.smoothedElevationM,
      elevationGain: elevationGainM,
      elevationLoss: elevationLossM,
      netElevationChange: end.smoothedElevationM - start.smoothedElevationM,
      averageGrade,
      gradeForFormula,
      metabolicCost: minettiRunningCost(averageGrade),
      targetEquivalentPaceSecPerKm,
      recommendedActualPaceSecPerKm,
      equivalentPaceSecPerKm,
      gradePaceDeltaSecPerKm,
      heatAdjustedPaceSecPerKm,
      heatDeltaSecPerKm,
      finalPaceDeltaSecPerKm,
      gradeAdjustedSegmentTimeSec,
      finalSegmentTimeSec,
      cumulativeGradeAdjustedTimeSec,
      cumulativeFinalTimeSec,
      heatAdjustment,
      warnings,
      actualPaceSecPerKm: recommendedActualPaceSecPerKm,
      paceDeltaSecPerKm: gradePaceDeltaSecPerKm,
      segmentTimeSec: finalSegmentTimeSec,
      cumulativeTimeSec: cumulativeFinalTimeSec,
      warning: warnings.join("; ")
    });
  }

  return segments;
}

export function summarizeRoute(routePoints, segments) {
  const totalDistanceKm = routePoints.at(-1).distanceM / 1000;
  const totalGainM = segments.reduce((sum, segment) => sum + segment.elevationGainM, 0);
  const totalLossM = segments.reduce((sum, segment) => sum + segment.elevationLossM, 0);
  const netElevationM =
    routePoints.at(-1).smoothedElevationM - routePoints[0].smoothedElevationM;
  const averageGrade = totalDistanceKm > 0 ? netElevationM / (totalDistanceKm * 1000) : 0;
  const steepestUphill = segments.reduce(
    (best, segment) => (segment.averageGrade > best.averageGrade ? segment : best),
    segments[0]
  );
  const steepestDownhill = segments.reduce(
    (best, segment) => (segment.averageGrade < best.averageGrade ? segment : best),
    segments[0]
  );

  return {
    totalDistanceKm,
    totalGainM,
    totalLossM,
    netElevationM,
    averageGrade,
    steepestUphill,
    steepestDownhill,
    targetTotalTimeSec:
      totalDistanceKm * (segments[0]?.targetEquivalentPaceSecPerKm ?? 0),
    gradeAdjustedTotalTimeSec: segments.reduce(
      (sum, segment) => sum + segment.gradeAdjustedSegmentTimeSec,
      0
    ),
    finalTotalTimeSec: segments.reduce(
      (sum, segment) => sum + segment.finalSegmentTimeSec,
      0
    ),
    heatAdjustment: segments[0]?.heatAdjustment ?? null
  };
}
