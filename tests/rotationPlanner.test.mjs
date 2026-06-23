import assert from "node:assert/strict";
import {
  Phase,
  Race,
  RotationStrategy,
  WorkoutTemplates,
  WorkoutType,
  selectWorkoutPlan,
  validateTemplateMetadata
} from "../src/training-planner/rotationPlanner.mjs";

function workoutTypes(plan) {
  return plan.workouts.map((workout) => workout.type);
}

const metadataResults = validateTemplateMetadata(WorkoutTemplates);
assert.equal(
  metadataResults.every((result) => result.valid),
  true,
  `Missing metadata: ${JSON.stringify(metadataResults.filter((result) => !result.valid))}`
);

const oddAlternating5K = selectWorkoutPlan({
  currentPhase: Phase.RACE_SPECIFIC,
  goalRace: Race.FIVE_K,
  weeklyMileage: 55,
  rotationStrategy: RotationStrategy.ALTERNATING_TI_TR,
  weekNumber: 5
});
assert.deepEqual(workoutTypes(oddAlternating5K), [
  WorkoutType.THRESHOLD,
  WorkoutType.INTERVAL
]);

const evenAlternating5K = selectWorkoutPlan({
  currentPhase: Phase.RACE_SPECIFIC,
  goalRace: Race.FIVE_K,
  weeklyMileage: 55,
  rotationStrategy: RotationStrategy.ALTERNATING_TI_TR,
  weekNumber: 6
});
assert.deepEqual(workoutTypes(evenAlternating5K), [
  WorkoutType.THRESHOLD,
  WorkoutType.REPETITION
]);

const lowMileageMarathon = selectWorkoutPlan({
  currentPhase: Phase.RACE_SPECIFIC,
  goalRace: Race.MARATHON,
  weeklyMileage: 52,
  rotationStrategy: RotationStrategy.CLASSIC_DANIELS,
  previousWorkouts: [
    { id: "M_STEADY_SEGMENTS", type: WorkoutType.MARATHON_PACE },
    { id: "M_STEADY_SEGMENTS", type: WorkoutType.MARATHON_PACE }
  ]
});
assert.equal(
  workoutTypes(lowMileageMarathon).includes(WorkoutType.THRESHOLD),
  true,
  "Marathon plan must never remove Threshold."
);

const raceSpecificAvoidsFixedBundle = selectWorkoutPlan({
  currentPhase: Phase.RACE_SPECIFIC,
  goalRace: Race.TEN_K,
  weeklyMileage: 58,
  rotationStrategy: RotationStrategy.CLASSIC_DANIELS,
  previousWorkouts: [
    { id: "I_VO2MAX_REPEATS", type: WorkoutType.INTERVAL },
    { id: "I_VO2MAX_REPEATS", type: WorkoutType.INTERVAL },
    { id: "T_CRUISE_INTERVALS", type: WorkoutType.THRESHOLD }
  ]
});
assert.equal(
  workoutTypes(raceSpecificAvoidsFixedBundle).includes(WorkoutType.REPETITION),
  true,
  "Race-specific phase should rotate away from repetitive interval selection."
);

const highMileageAdaptiveHalf = selectWorkoutPlan({
  currentPhase: Phase.RACE_SPECIFIC,
  goalRace: Race.HALF_MARATHON,
  weeklyMileage: 82,
  rotationStrategy: RotationStrategy.MILEAGE_ADAPTIVE,
  previousWorkouts: [{ id: "R_ECONOMY_STRIDES", type: WorkoutType.REPETITION }]
});
assert.equal(workoutTypes(highMileageAdaptiveHalf).length, 3);
assert.equal(
  workoutTypes(highMileageAdaptiveHalf).includes(WorkoutType.THRESHOLD),
  true
);

const defaultLocalePlan = selectWorkoutPlan({});
assert.equal(defaultLocalePlan.locale, "zh-TW");
assert.equal(defaultLocalePlan.ui.defaultLocale, "zh-TW");
assert.equal(
  defaultLocalePlan.ui.availableLocales.some((locale) => locale.code === "en"),
  true
);

const englishPlan = selectWorkoutPlan({ locale: "en" });
assert.equal(englishPlan.locale, "en");
assert.equal(englishPlan.ui.labels.languageToggle, "Language");

console.log("rotationPlanner tests passed");
