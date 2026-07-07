export function segmentsToCsv(segments, formatters) {
  const header = [
    "segment",
    "start_km",
    "end_km",
    "distance_km",
    "gain_m",
    "loss_m",
    "avg_grade_percent",
    "target_equivalent_pace",
    "recommended_actual_pace",
    "pace_delta",
    "segment_time",
    "cumulative_time",
    "warning"
  ];

  const rows = segments.map((segment) => [
    segment.index,
    segment.startKm.toFixed(2),
    segment.endKm.toFixed(2),
    segment.distanceKm.toFixed(2),
    Math.round(segment.elevationGainM),
    Math.round(segment.elevationLossM),
    (segment.averageGrade * 100).toFixed(1),
    formatters.formatPace(segment.targetEquivalentPaceSecPerKm),
    formatters.formatPace(segment.actualPaceSecPerKm),
    formatters.formatPaceDelta(segment.paceDeltaSecPerKm),
    formatters.formatDuration(segment.segmentTimeSec),
    formatters.formatDuration(segment.cumulativeTimeSec),
    segment.warning
  ]);

  return [header, ...rows]
    .map((row) =>
      row
        .map((cell) => String(cell).replaceAll('"', '""'))
        .map((cell) => `"${cell}"`)
        .join(",")
    )
    .join("\n");
}
