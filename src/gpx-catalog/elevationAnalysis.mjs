function classifyGrade(averageGradePercent) {
  if (averageGradePercent <= -3) return "明顯下坡";
  if (averageGradePercent <= -1) return "緩下坡";
  if (averageGradePercent < 1) return "平路";
  if (averageGradePercent < 3) return "緩上坡";
  return "明顯上坡";
}

function interpolatePoint(points, targetKm) {
  if (targetKm <= 0) return points[0];
  const last = points.at(-1);
  if (targetKm >= last.distanceFromStartKm) return last;

  for (let index = 1; index < points.length; index += 1) {
    const previous = points[index - 1];
    const current = points[index];
    if (current.distanceFromStartKm >= targetKm) {
      const span = current.distanceFromStartKm - previous.distanceFromStartKm;
      const ratio = span > 0 ? (targetKm - previous.distanceFromStartKm) / span : 0;
      const ele =
        previous.ele != null && current.ele != null
          ? previous.ele + (current.ele - previous.ele) * ratio
          : null;
      return {
        lat: previous.lat + (current.lat - previous.lat) * ratio,
        lng: previous.lng + (current.lng - previous.lng) * ratio,
        ele,
        index: previous.index,
        distanceFromStartKm: targetKm
      };
    }
  }

  return last;
}

export function analyzeElevationBySegments(points, segmentDistanceKm) {
  if (!points.length || !points.every((point) => point.ele != null)) return [];

  const totalDistanceKm = points.at(-1).distanceFromStartKm;
  const segmentCount = Math.ceil(totalDistanceKm / segmentDistanceKm);
  const segments = [];

  for (let index = 0; index < segmentCount; index += 1) {
    const startKm = index * segmentDistanceKm;
    const endKm = Math.min(totalDistanceKm, (index + 1) * segmentDistanceKm);
    const segmentPoints = [
      interpolatePoint(points, startKm),
      ...points.filter((point) => point.distanceFromStartKm > startKm && point.distanceFromStartKm < endKm),
      interpolatePoint(points, endKm)
    ];

    let ascentM = 0;
    let descentM = 0;
    for (let pointIndex = 1; pointIndex < segmentPoints.length; pointIndex += 1) {
      const diff = segmentPoints[pointIndex].ele - segmentPoints[pointIndex - 1].ele;
      if (diff > 0) ascentM += diff;
      if (diff < 0) descentM += Math.abs(diff);
    }

    const distanceKm = endKm - startKm;
    const netElevationM = segmentPoints.at(-1).ele - segmentPoints[0].ele;
    const averageGradePercent =
      distanceKm > 0 ? (netElevationM / (distanceKm * 1000)) * 100 : 0;

    segments.push({
      startKm,
      endKm,
      distanceKm,
      ascentM,
      descentM,
      netElevationM,
      averageGradePercent,
      gradeCategory: classifyGrade(averageGradePercent)
    });
  }

  return segments;
}

