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

const easy = model.zones.find((zone) => zone.id === PaceZone.EASY);
assert.match(easy.base.label, / - /);
assert.match(easy.adjusted.label, / - /);

for (const zoneId of [
  PaceZone.MARATHON,
  PaceZone.THRESHOLD,
  PaceZone.INTERVAL,
  PaceZone.REPETITION
]) {
  const zone = model.zones.find((item) => item.id === zoneId);
  assert.doesNotMatch(zone.base.label, / - /);
  assert.doesNotMatch(zone.adjusted.label, / - /);
}

const threshold = model.zones.find((zone) => zone.id === PaceZone.THRESHOLD);
assert.ok(threshold.adjusted.faster > threshold.base.faster);
assert.ok(threshold.adjusted.slower > threshold.base.slower);

const interval = model.zones.find((zone) => zone.id === PaceZone.INTERVAL);
assert.notEqual(interval.baseSplit400m, interval.adjustedSplit400m);
assert.notEqual(interval.baseSplit200m, interval.adjustedSplit200m);

const repetition = model.zones.find((zone) => zone.id === PaceZone.REPETITION);
assert.equal(repetition.base.label, repetition.adjusted.label);
assert.equal(repetition.baseSplit400m, repetition.adjustedSplit400m);
assert.equal(repetition.baseSplit200m, repetition.adjustedSplit200m);
assert.equal(repetition.heatAdjusted, false);

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

const redistributableEasyDays = model.weeklySchedule.filter(
  (day) => day.easyDistributionEligible
);
assert.ok(redistributableEasyDays.length > 0);
assert.ok(
  redistributableEasyDays.some(
    (day) => day.zh.includes("休息或 30-40") && !day.distanceRangeKm
  )
);
assert.ok(
  redistributableEasyDays
    .filter((day) => !day.zh.includes("休息或 30-40"))
    .every((day) => day.distanceRangeKm?.min > 0)
);
assert.equal(
  model.weeklySchedule.some(
    (day) => day.zh.includes("長跑") && day.easyDistributionEligible
  ),
  false
);
assert.match(
  model.weeklySchedule.find((day) => day.zh.includes("Q1 長跑"))?.zh ?? "",
  /\d+-\d+ km/
);

const coolWeather = calculateHeatAdjustment(6, 40, 50);
assert.equal(coolWeather.percentage, 0);

const warmWeather = calculateHeatAdjustment(26, 70, 50);
assert.ok(warmWeather.heatIndex > 26);
assert.ok(warmWeather.heatIndex < 27);
assert.ok(warmWeather.speedLossPercentage > 2.5);
assert.ok(warmWeather.speedLossPercentage < 3.5);
assert.ok(warmWeather.percentage > warmWeather.speedLossPercentage);
assert.ok(warmWeather.percentage < 4);

const hotWeather = calculateHeatAdjustment(30, 70, 50);
assert.ok(hotWeather.percentage >= warmWeather.percentage);
assert.ok(hotWeather.speedLossPercentage > 5);
assert.ok(hotWeather.speedLossPercentage < 6);
assert.equal(hotWeather.recoveryPercentage, 25);

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
