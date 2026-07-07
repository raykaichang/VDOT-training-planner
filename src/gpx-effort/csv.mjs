export function segmentsToCsv(segments, formatters, heatSettings = null, heatAdjustment = null) {
  const header = [
    "segmentIndex",
    "startKm",
    "endKm",
    "distanceKm",
    "elevationGain",
    "elevationLoss",
    "netElevationChange",
    "averageGrade",
    "gradeForFormula",
    "targetEquivalentPace",
    "gradeAdjustedPace",
    "gradePaceDelta",
    "heatAdjustedPace",
    "heatDelta",
    "finalPaceDelta",
    "gradeAdjustedSegmentTime",
    "finalSegmentTime",
    "cumulativeGradeAdjustedTime",
    "cumulativeFinalTime",
    "warning"
  ];

  const rows = segments.map((segment) => [
    segment.index,
    segment.startKm.toFixed(2),
    segment.endKm.toFixed(2),
    segment.distanceKm.toFixed(2),
    Math.round(segment.elevationGainM),
    Math.round(segment.elevationLossM),
    Math.round(segment.netElevationM),
    (segment.averageGrade * 100).toFixed(2),
    (segment.gradeForFormula * 100).toFixed(2),
    formatters.formatPace(segment.targetEquivalentPaceSecPerKm),
    formatters.formatPace(segment.recommendedActualPaceSecPerKm),
    formatters.formatPaceDelta(segment.gradePaceDeltaSecPerKm),
    formatters.formatPace(segment.heatAdjustedPaceSecPerKm),
    formatters.formatPaceDelta(segment.heatDeltaSecPerKm),
    formatters.formatPaceDelta(segment.finalPaceDeltaSecPerKm),
    formatters.formatDuration(segment.gradeAdjustedSegmentTimeSec),
    formatters.formatDuration(segment.finalSegmentTimeSec),
    formatters.formatDuration(segment.cumulativeGradeAdjustedTimeSec),
    formatters.formatDuration(segment.cumulativeFinalTimeSec),
    segment.warnings?.join("; ") ?? segment.warning
  ]);
  const metadata =
    heatSettings?.enabled && heatAdjustment
      ? [
          ["temperatureC", heatSettings.temperatureC],
          ["relativeHumidity", heatSettings.relativeHumidity],
          ["heatIndexC", heatAdjustment.heatIndexC.toFixed(1)],
          ["heatSlowdownPercent", (heatAdjustment.finalSlowdown * 100).toFixed(1)],
          ["raceType", heatSettings.raceType],
          ["acclimationLevel", heatSettings.acclimationLevel],
          ["sunExposure", heatSettings.sunExposure],
          ["windCondition", heatSettings.windCondition],
          []
        ]
      : [];

  return [...metadata, header, ...rows]
    .map((row) =>
      row
        .map((cell) => String(cell).replaceAll('"', '""'))
        .map((cell) => `"${cell}"`)
        .join(",")
    )
    .join("\n");
}
