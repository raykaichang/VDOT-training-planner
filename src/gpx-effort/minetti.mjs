export const FLAT_RUNNING_COST = 3.6;

export function minettiRunningCost(grade) {
  const g = Number(grade);
  if (!Number.isFinite(g)) return FLAT_RUNNING_COST;
  return (
    155.4 * Math.pow(g, 5) -
    30.4 * Math.pow(g, 4) -
    43.3 * Math.pow(g, 3) +
    46.3 * Math.pow(g, 2) +
    19.5 * g +
    3.6
  );
}

export function clampGradeForModel(grade) {
  return Math.max(-0.45, Math.min(0.45, Number(grade) || 0));
}

export function equivalentPaceFromActual(actualPaceSecondsPerKm, grade) {
  const costRatio = minettiRunningCost(clampGradeForModel(grade)) / FLAT_RUNNING_COST;
  return actualPaceSecondsPerKm / costRatio;
}

export function actualPaceFromEquivalent(equivalentPaceSecondsPerKm, grade, downhillFactor = 1) {
  const modelGrade = clampGradeForModel(grade);
  const costRatio = minettiRunningCost(modelGrade) / FLAT_RUNNING_COST;
  const rawPace = equivalentPaceSecondsPerKm * costRatio;

  if (modelGrade >= 0) return rawPace;

  const fullyAdjustedDelta = rawPace - equivalentPaceSecondsPerKm;
  return equivalentPaceSecondsPerKm + fullyAdjustedDelta * downhillFactor;
}
