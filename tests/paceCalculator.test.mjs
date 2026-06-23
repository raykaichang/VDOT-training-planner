import assert from "node:assert/strict";
import {
  TargetRace,
  TrainingCycle,
  UnitSystem,
  PaceZone,
  calculateHeatAdjustment,
  calculatePaceModel,
  calculateVdotFromRaceResult,
  getMileageClass,
  getWorkoutExamplesForMileage
} from "../src/training-planner/paceCalculator.mjs";

const model = calculatePaceModel({
  vdot: 50,
  weeklyMileage: 70,
  temperatureC: 30,
  humidity: 80
});

assert.equal(model.zones.length, 5);
assert.equal(model.zones[0].id, PaceZone.EASY);
assert.equal(model.mileageClass.id, "C");
assert.ok(model.workoutExamples.length > 6);
assert.equal(
  model.workoutExamples.some((example) => example.zone === PaceZone.THRESHOLD),
  true
);
assert.equal(
  model.workoutExamples.some((example) => example.zone === PaceZone.INTERVAL),
  true
);
assert.equal(
  model.workoutExamples.some((example) => example.zone === PaceZone.REPETITION),
  true
);
assert.ok(model.heatAdjustment.percentage > 0);
assert.ok(model.heatAdjustment.recoveryPercentage > model.heatAdjustment.percentage);

const threshold = model.zones.find((zone) => zone.id === PaceZone.THRESHOLD);
assert.ok(threshold.base.faster < threshold.base.slower);
assert.ok(threshold.adjusted.faster > threshold.base.faster);
assert.ok(threshold.adjusted.slower > threshold.base.slower);

const interval = model.zones.find((zone) => zone.id === PaceZone.INTERVAL);
assert.notEqual(interval.baseSplit400m, interval.adjustedSplit400m);
assert.notEqual(interval.baseSplit200m, interval.adjustedSplit200m);

const imperialModel = calculatePaceModel({
  vdot: 50,
  unitSystem: UnitSystem.IMPERIAL,
  weeklyMileage: 36,
  targetRace: TargetRace.MARATHON,
  trainingCycle: TrainingCycle.PHASE_IV,
  temperatureC: 20,
  humidity: 60
});
assert.ok(imperialModel.weeklyMileageKm > 57);
assert.match(imperialModel.zones[0].base.label, /\/ mi/);
assert.equal(
  imperialModel.weeklySchedule.some((day) => day.zone === PaceZone.THRESHOLD),
  true
);
assert.equal(
  imperialModel.weeklySchedule.some((day) => day.zone === PaceZone.MARATHON),
  true
);
assert.match(imperialModel.weeklySchedule[0].pace, /\/ mi/);

const roadModel = calculatePaceModel({
  vdot: 50,
  weeklyMileage: 58,
  targetRace: TargetRace.ROAD_15K_30K,
  trainingCycle: TrainingCycle.PHASE_III,
  temperatureC: 20,
  humidity: 60
});
assert.equal(roadModel.targetRace, TargetRace.ROAD_15K_30K);
assert.equal(
  roadModel.weeklySchedule.some((day) => day.zone === PaceZone.THRESHOLD),
  true
);
assert.equal(
  roadModel.weeklySchedule.some((day) => day.zone === PaceZone.MARATHON),
  true
);

const lowMileageModel = calculatePaceModel({
  vdot: 45,
  weeklyMileage: 30,
  targetRace: TargetRace.FIVE_TEN_K,
  trainingCycle: TrainingCycle.PHASE_I
});
assert.equal(
  lowMileageModel.weeklySchedule.some((day) => day.zone === PaceZone.THRESHOLD),
  true
);

const coolWeather = calculateHeatAdjustment(10, 40);
assert.equal(coolWeather.percentage, 0);

const fiveKTwenty = calculateVdotFromRaceResult(5000, 20 * 60);
assert.ok(fiveKTwenty > 49);
assert.ok(fiveKTwenty < 52);

const marathonThreeThirty = calculateVdotFromRaceResult(42195, 3 * 3600 + 30 * 60);
assert.ok(marathonThreeThirty > 43);
assert.ok(marathonThreeThirty < 47);

assert.equal(getMileageClass(40).id, "A");
assert.equal(getMileageClass(55).id, "B");
assert.equal(getMileageClass(90).id, "D");
assert.equal(getMileageClass(120).id, "E");

const classBExamples = getWorkoutExamplesForMileage(55, 1.05, 50);
assert.equal(classBExamples.length, 15);
assert.equal(
  classBExamples.filter((example) => example.zone === PaceZone.THRESHOLD).length,
  5
);
assert.equal(
  classBExamples.filter((example) => example.zone === PaceZone.INTERVAL).length,
  5
);
assert.equal(
  classBExamples.filter((example) => example.zone === PaceZone.REPETITION).length,
  5
);
assert.ok(classBExamples.every((example) => example.recoveryExtensionPercentage > 0));
assert.equal(
  classBExamples.find((example) => example.id === "T-A1").enRecoveryLabel,
  "As prescribed"
);
assert.match(
  classBExamples.find((example) => example.id === "T-A1").enHeatRecoveryLabel,
  /As prescribed/
);
assert.match(
  classBExamples.find((example) => example.id === "T-A2").heatRecoveryLabel,
  /1:0/
);
assert.match(
  classBExamples.find((example) => example.id === "R-B4").recoveryLabel,
  /400 公尺慢跑/
);

console.log("paceCalculator tests passed");
