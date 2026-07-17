import assert from "node:assert/strict";
import {
  HalfMarathonWeek,
  TargetRace,
  TrainingCycle,
  UnitSystem,
  PaceZone,
  calculateHeatAdjustment,
  calculatePaceModel,
  calculateVdotFromRaceResult,
  getMarathonTrainingLimits,
  getMarathonSwapCandidates,
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
assert.equal(roadModel.halfMarathonWeek, HalfMarathonWeek.ODD);
assert.equal(
  roadModel.weeklySchedule.some((day) => day.zone === PaceZone.THRESHOLD),
  true
);
assert.equal(
  roadModel.weeklySchedule.some((day) => day.zone === PaceZone.REPETITION),
  true
);

for (const trainingCycle of [
  TrainingCycle.PHASE_II,
  TrainingCycle.PHASE_III,
  TrainingCycle.PHASE_IV
]) {
  const oddWeek = calculatePaceModel({
    vdot: 50,
    weeklyMileage: 58,
    targetRace: TargetRace.ROAD_15K_30K,
    trainingCycle,
    halfMarathonWeek: HalfMarathonWeek.ODD
  });
  const evenWeek = calculatePaceModel({
    vdot: 50,
    weeklyMileage: 58,
    targetRace: TargetRace.ROAD_15K_30K,
    trainingCycle,
    halfMarathonWeek: HalfMarathonWeek.EVEN
  });
  assert.deepEqual(
    oddWeek.weeklySchedule.filter((day) => day.isPrimaryWorkout).map((day) => day.zone),
    [PaceZone.THRESHOLD, PaceZone.REPETITION]
  );
  assert.deepEqual(
    evenWeek.weeklySchedule.filter((day) => day.isPrimaryWorkout).map((day) => day.zone),
    [PaceZone.THRESHOLD, PaceZone.INTERVAL]
  );
}

const phaseIOdd = calculatePaceModel({
  weeklyMileage: 58,
  targetRace: TargetRace.ROAD_15K_30K,
  trainingCycle: TrainingCycle.PHASE_I,
  halfMarathonWeek: HalfMarathonWeek.ODD
});
const phaseIEven = calculatePaceModel({
  weeklyMileage: 58,
  targetRace: TargetRace.ROAD_15K_30K,
  trainingCycle: TrainingCycle.PHASE_I,
  halfMarathonWeek: HalfMarathonWeek.EVEN
});
assert.deepEqual(
  phaseIOdd.weeklySchedule.map((day) => day.zone),
  phaseIEven.weeklySchedule.map((day) => day.zone)
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

for (const weeklyMileage of [1, 5, 20, 30, 40, 55, 70, 90, 120]) {
  const scheduleModel = calculatePaceModel({
    weeklyMileage,
    targetRace: TargetRace.FIVE_TEN_K,
    trainingCycle: TrainingCycle.PHASE_II
  });
  const schedule = scheduleModel.weeklySchedule;
  const plannedTotal = schedule.reduce(
    (total, day) => total + day.plannedDistanceKm,
    0
  );
  const longRun = schedule.find((day) => day.isLongRun);
  const qualityDays = schedule.filter((day) => day.isPrimaryWorkout);
  const easyDays = schedule.filter((day) => day.scheduleRole === "easy");

  assert.equal(schedule.length, 7);
  assert.ok(Math.abs(plannedTotal - weeklyMileage) < 0.05);
  assert.ok(longRun);
  assert.ok(longRun.plannedDistanceKm / weeklyMileage <= 0.3);
  assert.equal(qualityDays.length, weeklyMileage >= 32 ? 2 : 1);
  assert.ok(qualityDays.some((day) => day.zone === PaceZone.THRESHOLD));
  assert.ok(
    easyDays.every(
      (day) =>
        day.distanceRangeKm?.min === day.plannedDistanceKm &&
        day.distanceRangeKm?.max === day.plannedDistanceKm &&
        !/分鐘|min/i.test(`${day.zh} ${day.en}`)
    )
  );
}

const lowMileageQuality = calculatePaceModel({ weeklyMileage: 30 })
  .weeklySchedule.find((day) => day.isPrimaryWorkout);
const highMileageQuality = calculatePaceModel({ weeklyMileage: 90 })
  .weeklySchedule.find((day) => day.isPrimaryWorkout);
assert.notEqual(lowMileageQuality.zh, highMileageQuality.zh);

for (let weeklyMileage = 1; weeklyMileage <= 180; weeklyMileage += 1) {
  const schedule = calculatePaceModel({ weeklyMileage }).weeklySchedule;
  const total = schedule.reduce((sum, day) => sum + day.plannedDistanceKm, 0);
  const longRun = schedule.find((day) => day.isLongRun);
  assert.ok(Math.abs(total - weeklyMileage) < 0.05);
  assert.ok(longRun.plannedDistanceKm / weeklyMileage <= 0.3);
}

for (const targetRace of Object.values(TargetRace)) {
  for (const trainingCycle of Object.values(TrainingCycle)) {
    const scheduleModel = calculatePaceModel({
      weeklyMileage: 70,
      targetRace,
      trainingCycle
    });
    const schedule = scheduleModel.weeklySchedule;
    const total = schedule.reduce((sum, day) => sum + day.plannedDistanceKm, 0);
    const expectedTotal = targetRace === TargetRace.MARATHON
      ? scheduleModel.marathonPlan.plannedWeeklyMileageKm
      : 70;
    assert.ok(Math.abs(total - expectedTotal) < 0.05);
    assert.ok(schedule.find((day) => day.isLongRun).plannedDistanceKm <= 21);
    if (targetRace !== TargetRace.MARATHON) {
      assert.ok(schedule.some((day) => day.zone === PaceZone.THRESHOLD));
    }
  }
}

const marathonPhaseI = calculatePaceModel({
  weeklyMileage: 80,
  targetRace: TargetRace.MARATHON,
  trainingCycle: TrainingCycle.PHASE_I,
  marathonPhaseWeek: 4
});
assert.equal(
  marathonPhaseI.weeklySchedule.some((day) => ["M", "T", "I", "R"].includes(day.zone)),
  false
);
assert.equal(marathonPhaseI.weeklySchedule.filter((day) => day.isPrimaryWorkout).length, 1);

const marathonPhaseIIWeeks = Array.from({ length: 6 }, (_, index) =>
  calculatePaceModel({
    weeklyMileage: 80,
    targetRace: TargetRace.MARATHON,
    trainingCycle: TrainingCycle.PHASE_II,
    marathonPhaseWeek: index + 1
  })
);
assert.deepEqual(
  marathonPhaseIIWeeks.map((model) => model.weeklySchedule[0].paceZoneIds),
  [
    [PaceZone.EASY, PaceZone.MARATHON, PaceZone.THRESHOLD],
    [PaceZone.EASY, PaceZone.THRESHOLD],
    [PaceZone.EASY],
    [PaceZone.EASY, PaceZone.MARATHON, PaceZone.THRESHOLD],
    [PaceZone.EASY, PaceZone.THRESHOLD],
    [PaceZone.EASY]
  ]
);
assert.deepEqual(
  marathonPhaseIIWeeks.map(
    (model) => model.weeklySchedule.find((day) => day.enDay === "Wed").paceZoneIds
  ),
  [
    [PaceZone.THRESHOLD],
    [PaceZone.INTERVAL, PaceZone.REPETITION],
    [PaceZone.THRESHOLD],
    [PaceZone.THRESHOLD],
    [PaceZone.INTERVAL],
    [PaceZone.THRESHOLD]
  ]
);
assert.ok(
  marathonPhaseIIWeeks.every((model) =>
    model.weeklySchedule.some((day) =>
      day.paceZoneIds?.some((zone) => [PaceZone.MARATHON, PaceZone.THRESHOLD, PaceZone.INTERVAL].includes(zone))
    )
  )
);
assert.deepEqual(
  marathonPhaseIIWeeks.map((model) => model.marathonPlan.fraction),
  [0.8, 0.8, 0.9, 0.9, 0.9, 0.9]
);

const marathonPhaseIIIWeeks = Array.from({ length: 6 }, (_, index) =>
  calculatePaceModel({
    weeklyMileage: 80,
    targetRace: TargetRace.MARATHON,
    trainingCycle: TrainingCycle.PHASE_III,
    marathonPhaseWeek: index + 1
  })
);
assert.deepEqual(
  marathonPhaseIIIWeeks.map((model) => model.weeklySchedule[0].paceZoneIds),
  [
    [PaceZone.EASY, PaceZone.MARATHON, PaceZone.THRESHOLD],
    [PaceZone.EASY, PaceZone.THRESHOLD],
    [PaceZone.EASY],
    [PaceZone.EASY, PaceZone.MARATHON, PaceZone.THRESHOLD],
    [PaceZone.EASY, PaceZone.MARATHON],
    [PaceZone.EASY]
  ]
);
assert.deepEqual(
  marathonPhaseIIIWeeks.map(
    (model) => model.weeklySchedule.find((day) => day.enDay === "Wed").paceZoneIds
  ),
  [
    [PaceZone.THRESHOLD],
    [PaceZone.INTERVAL, PaceZone.REPETITION],
    [PaceZone.EASY, PaceZone.MARATHON],
    [PaceZone.THRESHOLD],
    [PaceZone.INTERVAL],
    [PaceZone.EASY, PaceZone.THRESHOLD, PaceZone.MARATHON]
  ]
);
assert.deepEqual(
  marathonPhaseIIIWeeks.map((model) => model.marathonPlan.fraction),
  [1, 0.9, 1, 1, 0.9, 0.9]
);

const marathonPhaseIII = marathonPhaseIIIWeeks[3];
const marathonPhaseIIIQ1 = marathonPhaseIII.weeklySchedule.find((day) => day.enDay === "Sun");
const marathonPhaseIIIQ2 = marathonPhaseIII.weeklySchedule.find((day) => day.enDay === "Wed");
assert.deepEqual(marathonPhaseIIIQ1.paceZoneIds, [PaceZone.EASY, PaceZone.MARATHON, PaceZone.THRESHOLD]);
assert.equal(marathonPhaseIIIQ2.zone, PaceZone.THRESHOLD);
assert.ok(marathonPhaseIIIQ1.intensityKm.M > 0);
assert.ok(marathonPhaseIIIQ1.intensityKm.T > 0);

const marathonPhaseIVWeeks = Array.from({ length: 6 }, (_, index) =>
  calculatePaceModel({
    weeklyMileage: 80,
    targetRace: TargetRace.MARATHON,
    trainingCycle: TrainingCycle.PHASE_IV,
    marathonPhaseWeek: index + 1
  })
);
assert.deepEqual(
  marathonPhaseIVWeeks.map((model) => model.weeklySchedule[0].paceZoneIds),
  [
    [PaceZone.EASY, PaceZone.MARATHON],
    [PaceZone.EASY, PaceZone.THRESHOLD],
    [PaceZone.EASY],
    [PaceZone.EASY, PaceZone.MARATHON],
    [PaceZone.EASY, PaceZone.THRESHOLD],
    [PaceZone.EASY]
  ]
);
assert.deepEqual(
  marathonPhaseIVWeeks.map(
    (model) => model.weeklySchedule.find((day) => day.enDay === "Wed").paceZoneIds
  ),
  [
    [PaceZone.THRESHOLD],
    [PaceZone.INTERVAL, PaceZone.REPETITION],
    [PaceZone.INTERVAL, PaceZone.THRESHOLD],
    [PaceZone.THRESHOLD],
    [PaceZone.EASY, PaceZone.THRESHOLD, PaceZone.MARATHON],
    [PaceZone.THRESHOLD]
  ]
);
assert.deepEqual(
  marathonPhaseIVWeeks.map((model) => model.marathonPlan.fraction),
  [1, 1, 0.9, 0.9, 0.9, 0.75]
);

const marathonPhaseIVPeak = marathonPhaseIVWeeks[0];
const marathonPhaseIVRaceWeek = marathonPhaseIVWeeks[5];
assert.ok(
  marathonPhaseIVRaceWeek.marathonPlan.plannedWeeklyMileageKm <
    marathonPhaseIVPeak.marathonPlan.plannedWeeklyMileageKm
);
assert.equal(marathonPhaseIVRaceWeek.taperRecommendation.automatic, true);
assert.equal(marathonPhaseIVRaceWeek.weeklySchedule[0].longRunTimeLimitMinutes, 90);
assert.ok(marathonPhaseIVRaceWeek.weeklySchedule[0].estimatedMaxMinutes <= 90);
assert.match(marathonPhaseIVRaceWeek.taperRecommendation.zh, /比賽週/);
assert.equal(
  marathonPhaseIVRaceWeek.weeklySchedule.find((day) => day.enDay === "Wed").zone,
  PaceZone.THRESHOLD
);

for (const phaseModels of [
  marathonPhaseIIWeeks,
  marathonPhaseIIIWeeks,
  marathonPhaseIVWeeks
]) {
  for (const phaseModel of phaseModels) {
    for (const day of phaseModel.weeklySchedule.filter((entry) => entry.workoutType)) {
      const candidates = getMarathonSwapCandidates(day, phaseModel.unitSystem);
      const isFixedRaceWeekQ1 = day.workoutType === "marathon-q1-race";

      if (isFixedRaceWeekQ1) {
        assert.equal(candidates.length, 0);
        continue;
      }

      assert.ok(candidates.length >= 2, day.workoutType);
      assert.equal(new Set(candidates.map((candidate) => candidate.id)).size, candidates.length);
      for (const candidate of candidates) {
        assert.ok(candidate.zh.length > 10);
        assert.ok(candidate.en.length > 10);
        assert.match(candidate.zhDistanceLabel, /本課總量/);
        assert.match(candidate.enDistanceLabel, /Session total/);
        assert.ok(Array.isArray(candidate.paceZoneIds));
        assert.ok(candidate.paceZoneIds.length > 0);
      }
    }
  }
}

const imperialMarathonSwap = getMarathonSwapCandidates(
  marathonPhaseIIIWeeks[0].weeklySchedule[0],
  UnitSystem.IMPERIAL
);
assert.match(imperialMarathonSwap[0].zhDistanceLabel, /mi/);

for (const trainingCycle of [
  TrainingCycle.PHASE_II,
  TrainingCycle.PHASE_III,
  TrainingCycle.PHASE_IV
]) {
  for (const phaseWeek of [1, 2, 3, 4, 5, 6]) {
    for (const weeklyMileage of [40, 64, 65, 100, 180]) {
      const marathonModel = calculatePaceModel({
        vdot: 30,
        weeklyMileage,
        temperatureC: 35,
        humidity: 80,
        targetRace: TargetRace.MARATHON,
        trainingCycle,
        marathonPhaseWeek: phaseWeek
      });
      const plannedMileage = marathonModel.marathonPlan.plannedWeeklyMileageKm;
      const longRun = marathonModel.weeklySchedule.find((day) => day.isLongRun);
      const longRunRatioLimit = plannedMileage > 64 ? 0.25 : 0.3;
      const limits = getMarathonTrainingLimits(plannedMileage);

      assert.ok(longRun.plannedDistanceKm / plannedMileage <= longRunRatioLimit);
      assert.ok(longRun.estimatedMaxMinutes <= longRun.longRunTimeLimitMinutes);
      for (const day of marathonModel.weeklySchedule) {
        if (!day.intensityKm) continue;
        assert.ok(day.intensityKm.M <= limits.M);
        assert.ok(day.intensityKm.T <= limits.T);
        assert.ok(day.intensityKm.I <= limits.I);
        assert.ok(day.intensityKm.R <= limits.R);
      }
    }
  }
}

const marathonQualityIndexes = marathonPhaseIII.weeklySchedule
  .map((day, index) => ({ day, index }))
  .filter(({ day }) => day.isPrimaryWorkout)
  .map(({ index }) => index);
assert.deepEqual(marathonQualityIndexes, [0, 3]);
assert.ok(marathonPhaseIII.weeklySchedule.slice(1, 3).every((day) => day.zone === PaceZone.EASY));

for (const targetRace of Object.values(TargetRace)) {
  const phaseIVModel = calculatePaceModel({
    weeklyMileage: 70,
    targetRace,
    trainingCycle: TrainingCycle.PHASE_IV
  });
  assert.ok(phaseIVModel.taperRecommendation);
}

const halfMarathonPhaseIV = calculatePaceModel({
  weeklyMileage: 70,
  targetRace: TargetRace.ROAD_15K_30K,
  trainingCycle: TrainingCycle.PHASE_IV
});
assert.equal(halfMarathonPhaseIV.taperRecommendation.automatic, false);
assert.match(halfMarathonPhaseIV.taperRecommendation.zh, /並非整期減量/);
assert.match(halfMarathonPhaseIV.taperRecommendation.zh, /2\/3/);
assert.match(halfMarathonPhaseIV.taperRecommendation.zh, /3×1T/);
assert.match(halfMarathonPhaseIV.taperRecommendation.zh, /7 個 E 日/);
assert.doesNotMatch(halfMarathonPhaseIV.taperRecommendation.zh, /20.?40%/);

const fiveTenKPhaseIV = calculatePaceModel({
  weeklyMileage: 70,
  targetRace: TargetRace.FIVE_TEN_K,
  trainingCycle: TrainingCycle.PHASE_IV
});
assert.match(fiveTenKPhaseIV.taperRecommendation.zh, /90 分鐘/);
assert.match(fiveTenKPhaseIV.taperRecommendation.zh, /取消原本的 I 課/);

const coolWeather = calculateHeatAdjustment(10, 40, 50);
assert.equal(coolWeather.percentage, 0);

const warmWeather = calculateHeatAdjustment(26, 70, 50);
assert.ok(warmWeather.heatIndex > 26);
assert.ok(warmWeather.heatIndex < 27);
assert.ok(warmWeather.logSpeedAdjust < 0);
assert.ok(warmWeather.speedLossPercentage > 3);
assert.ok(warmWeather.speedLossPercentage < 4);
assert.ok(warmWeather.percentage > warmWeather.speedLossPercentage);
assert.ok(warmWeather.percentage < 4.5);

const hotWeather = calculateHeatAdjustment(30, 70, 50);
assert.ok(hotWeather.percentage >= warmWeather.percentage);
assert.ok(hotWeather.speedLossPercentage > 5);
assert.ok(hotWeather.speedLossPercentage < 5.5);
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
const allMileageExamples = [30, 55, 70, 85, 100, 130].flatMap((mileage) =>
  getWorkoutExamplesForMileage(mileage, 1.05, 50)
);
assert.ok(
  allMileageExamples.every((example) =>
    !/\bH\b/.test(`${example.zh} ${example.en}`)
  )
);
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
