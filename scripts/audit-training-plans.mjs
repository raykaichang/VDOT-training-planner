import {
  HalfMarathonWeek,
  HansonsLevel,
  PaceZone,
  TargetRace,
  TrainingCycle,
  TrainingMethod,
  UnitSystem,
  calculatePaceModel,
  getMarathonTrainingLimits
} from "../src/training-planner/paceCalculator.mjs";

const scenarios = [
  daniels("D01", "低 VDOT／低跑量／5K-10K Phase I", 35, 20, TargetRace.FIVE_TEN_K, TrainingCycle.PHASE_I),
  daniels("D02", "單品質課邊界前／5K-10K Phase II", 45, 31.9, TargetRace.FIVE_TEN_K, TrainingCycle.PHASE_II),
  daniels("D03", "雙品質課邊界／5K-10K Phase II", 45, 32, TargetRace.FIVE_TEN_K, TrainingCycle.PHASE_II),
  daniels("D04", "標準跑量／5K-10K Phase II／熱天", 50, 58, TargetRace.FIVE_TEN_K, TrainingCycle.PHASE_II, { temperatureC: 30, humidity: 80 }),
  daniels("D05", "標準跑量／5K-10K Phase III", 50, 58, TargetRace.FIVE_TEN_K, TrainingCycle.PHASE_III),
  daniels("D06", "高跑量／5K-10K Phase IV", 55, 70, TargetRace.FIVE_TEN_K, TrainingCycle.PHASE_IV),
  daniels("D07", "半馬單週 T+R", 50, 70, TargetRace.ROAD_15K_30K, TrainingCycle.PHASE_II, { halfMarathonWeek: HalfMarathonWeek.ODD }),
  daniels("D08", "半馬雙週 T+I", 50, 70, TargetRace.ROAD_15K_30K, TrainingCycle.PHASE_II, { halfMarathonWeek: HalfMarathonWeek.EVEN }),
  daniels("D09", "半馬低跑量 Phase III", 45, 35, TargetRace.ROAD_15K_30K, TrainingCycle.PHASE_III),
  daniels("D10", "半馬 Phase IV", 50, 64, TargetRace.ROAD_15K_30K, TrainingCycle.PHASE_IV),
  daniels("D11", "馬拉松 Phase I 起始週", 40, 40, TargetRace.MARATHON, TrainingCycle.PHASE_I, { marathonPhaseWeek: 1 }),
  daniels("D12", "馬拉松 64 km 邊界", 40, 64, TargetRace.MARATHON, TrainingCycle.PHASE_II, { marathonPhaseWeek: 3 }),
  daniels("D13", "馬拉松 65 km 邊界", 40, 65, TargetRace.MARATHON, TrainingCycle.PHASE_II, { marathonPhaseWeek: 1 }),
  daniels("D14", "馬拉松 Phase III 混合長課", 50, 80, TargetRace.MARATHON, TrainingCycle.PHASE_III, { marathonPhaseWeek: 4 }),
  daniels("D15", "馬拉松比賽週", 50, 100, TargetRace.MARATHON, TrainingCycle.PHASE_IV, { marathonPhaseWeek: 6 }),
  daniels("D16", "慢速跑者／高跑量／一般長跑時間上限", 30, 70, TargetRace.FIVE_TEN_K, TrainingCycle.PHASE_II, { temperatureC: 35, humidity: 80 }),
  daniels("D17", "低跑量馬拉松比賽週 Q2 邊界", 35, 27, TargetRace.MARATHON, TrainingCycle.PHASE_IV, { marathonPhaseWeek: 6 }),
  hansons("H01", "半馬 Beginner 官方峰值／目標 HMP", 40, 47 * 1.609344, TargetRace.HALF_MARATHON, HansonsLevel.BEGINNER, 5, { hansonsGoalTimeSeconds: 1 * 3600 + 50 * 60 }),
  hansons("H02", "半馬 Advanced 官方峰值／Strength", 50, 50 * 1.609344, TargetRace.HALF_MARATHON, HansonsLevel.ADVANCED, 11, { hansonsGoalTimeSeconds: 1 * 3600 + 25 * 60 }),
  hansons("H03", "半馬 Beginner 低量基礎／完賽路線", 38, 30, TargetRace.HALF_MARATHON, HansonsLevel.BEGINNER, 5, { hansonsGoalTimeSeconds: 2 * 3600 }),
  hansons("H04", "馬拉松 Beginner 官方峰值／大目標落差保護", 40, 57.5 * 1.609344, TargetRace.MARATHON, HansonsLevel.BEGINNER, 6, { hansonsGoalTimeSeconds: 3 * 3600 + 20 * 60 }),
  hansons("H05", "馬拉松 Advanced 官方峰值／Strength", 55, 61.5 * 1.609344, TargetRace.MARATHON, HansonsLevel.ADVANCED, 11, { hansonsGoalTimeSeconds: 2 * 3600 + 55 * 60 }),
  hansons("H06", "馬拉松 Beginner 低量基礎／完賽路線", 35, 35, TargetRace.MARATHON, HansonsLevel.BEGINNER, 13, { hansonsGoalTimeSeconds: 4 * 3600 + 30 * 60 }),
  hansons("H07", "馬拉松 Beginner 目標配速比賽週", 45, 57.5 * 1.609344, TargetRace.MARATHON, HansonsLevel.BEGINNER, 18, { hansonsGoalTimeSeconds: 3 * 3600 + 25 * 60 })
];

const officialPaceAnchors = [
  {
    id: "P01",
    source: "VDOT 官方 2019 低 VDOT 修正範例",
    vdot: 35,
    expectedEasySecondsPerKm: [636 / 1.609344, 698 / 1.609344]
  },
  {
    id: "P02",
    source: "VDOT 官方教練案例 James McKirdy",
    vdot: 71.3,
    expectedEasySecondsPerKm: [371 / 1.609344, 409 / 1.609344]
  }
];

const results = scenarios.map(runScenario);
const paceResults = officialPaceAnchors.map(runPaceAnchor);

if (process.argv.includes("--json")) {
  console.log(JSON.stringify({ scenarios: results, paceAnchors: paceResults }, null, 2));
} else {
  printHumanReport(results, paceResults);
}

function daniels(id, label, vdot, weeklyMileage, targetRace, trainingCycle, extra = {}) {
  return {
    id,
    label,
    input: {
      trainingMethod: TrainingMethod.DANIELS,
      vdot,
      weeklyMileage,
      targetRace,
      trainingCycle,
      temperatureC: 10,
      humidity: 40,
      ...extra
    }
  };
}

function hansons(id, label, vdot, weeklyMileage, targetRace, hansonsLevel, hansonsWeek, extra = {}) {
  return {
    id,
    label,
    input: {
      trainingMethod: TrainingMethod.HANSONS,
      vdot,
      weeklyMileage,
      targetRace,
      hansonsLevel,
      hansonsWeek,
      temperatureC: 10,
      humidity: 40,
      ...extra
    }
  };
}

function runScenario(scenario) {
  const model = calculatePaceModel(scenario.input);
  const schedule = model.weeklySchedule;
  const totalKm = round(schedule.reduce((sum, day) => sum + Number(day.plannedDistanceKm || 0), 0));
  const expectedKm = round(
    model.hansonsPlan?.plannedWeeklyMileageKm
      ?? model.marathonPlan?.plannedWeeklyMileageKm
      ?? model.weeklyMileageKm
  );
  const longRun = schedule.find((day) => day.isLongRun);
  const longShare = expectedKm > 0 && longRun ? round((longRun.plannedDistanceKm / expectedKm) * 100) : 0;
  const easySlowSeconds = model.zones.find((zone) => zone.id === PaceZone.EASY)?.adjusted?.slower ?? 0;
  const estimatedLongMinutes = longRun && easySlowSeconds > 0
    ? round((longRun.plannedDistanceKm * easySlowSeconds) / 60)
    : null;
  const qualityIndexes = schedule
    .map((day, index) => ({ day, index }))
    .filter(({ day }) => day.isPrimaryWorkout)
    .map(({ index }) => index);
  const warnings = [];
  const failures = [];

  check(schedule.length === 7, "不是 7 天課表", failures);
  check(Math.abs(totalKm - expectedKm) < 0.06, `週總量 ${totalKm} km 與標示 ${expectedKm} km 不一致`, failures);
  check(
    schedule.every((day) => Number.isFinite(day.plannedDistanceKm) && day.plannedDistanceKm >= 0),
    "出現負值或非數值距離",
    failures
  );
  check(hasNoAdjacentQuality(qualityIndexes, schedule.length), "品質／SOS 課相鄰", failures);

  const isRaceWeek = Boolean(model.taperRecommendation?.automatic)
    && (model.trainingMethod === TrainingMethod.HANSONS || model.marathonPlan?.phaseWeek === 6);
  const longShareLimit = getLongShareLimit(model, expectedKm);
  if (!isRaceWeek && longRun && expectedKm > 0) {
    check(longShare <= longShareLimit * 100 + 0.11, `長跑占比 ${longShare}% 超過 ${longShareLimit * 100}%`, failures);
  }

  if (model.trainingMethod === TrainingMethod.DANIELS && !isRaceWeek && estimatedLongMinutes !== null) {
    check(estimatedLongMinutes <= 150.1, `長跑慢端估時 ${estimatedLongMinutes} 分鐘超過 150 分鐘`, failures);
  }

  if (model.trainingMethod === TrainingMethod.DANIELS && model.targetRace !== TargetRace.MARATHON) {
    auditGenericDaniels(model, warnings, failures);
  }

  if (model.trainingMethod === TrainingMethod.DANIELS && model.targetRace === TargetRace.MARATHON) {
    auditDanielsMarathon(model, warnings, failures);
  }

  if (model.trainingMethod === TrainingMethod.HANSONS) {
    auditHansons(model, longShare, warnings, failures);
  }

  return {
    id: scenario.id,
    label: scenario.label,
    method: model.trainingMethod,
    race: model.targetRace,
    vdot: model.vdot,
    inputMileageKm: model.weeklyMileageKm,
    plannedMileageKm: expectedKm,
    totalKm,
    longRunKm: longRun?.plannedDistanceKm ?? null,
    longShare,
    estimatedLongMinutes,
    qualityDays: qualityIndexes.map((index) => schedule[index].enDay),
    qualityZones: schedule.filter((day) => day.isPrimaryWorkout).map((day) => day.paceZoneIds ?? [day.zone]),
    failures,
    warnings,
    status: failures.length > 0 ? "FAIL" : warnings.length > 0 ? "REVIEW" : "PASS"
  };
}

function auditGenericDaniels(model, warnings, failures) {
  const qualityDays = model.weeklySchedule.filter((day) => day.scheduleRole === "quality");

  if (model.trainingCycle === TrainingCycle.PHASE_I && qualityDays.length > 0) {
    warnings.push("一般距離 Phase I 安排正式 T/R；這是網站自訂哲學，不是 Daniels 的純 E＋strides 基礎期");
  }

  for (const day of qualityDays) {
    if (day.zone === PaceZone.THRESHOLD) {
      const example = model.workoutExamples.find(
        (item) => item.id === day.defaultWorkoutId || item.en === day.en
      );
      const tMinutes = example ? maxNumber(example.totalTime) : null;
      const tSecondsPerKm = model.zones.find((zone) => zone.id === PaceZone.THRESHOLD)?.base?.faster;
      if (tMinutes && tSecondsPerKm) {
        const workKm = (tMinutes * 60) / tSecondsPerKm;
        const tLimit = model.weeklyMileageKm * 0.1;
        if (workKm > tLimit * 1.02 + 0.1) {
          failures.push(`T 工作量約 ${round(workKm)} km，超過週量 10%（${round(tLimit)} km）`);
        }
        if (day.plannedDistanceKm < workKm + 0.5 - 0.05) {
          failures.push(`T 課總量 ${day.plannedDistanceKm} km 幾乎沒有空間容納約 ${round(workKm)} km 主課與熱身收操`);
        }
      }
    }
  }

  if (model.trainingCycle === TrainingCycle.PHASE_IV) {
    warnings.push("Phase IV 僅顯示比賽週文字提醒，週課表本身不會依比賽日自動減量");
  }
}

function auditDanielsMarathon(model, warnings, failures) {
  const limits = getMarathonTrainingLimits(model.marathonPlan.plannedWeeklyMileageKm);
  for (const day of model.weeklySchedule) {
    if (!day.intensityKm) continue;
    for (const zone of [PaceZone.MARATHON, PaceZone.THRESHOLD, PaceZone.INTERVAL, PaceZone.REPETITION]) {
      if (Number(day.intensityKm[zone] || 0) > limits[zone] + 0.05) {
        failures.push(`${day.enDay} ${zone} 工作量超過 Daniels 單堂上限`);
      }
    }
  }

  const q2 = model.weeklySchedule.find((day) => day.workoutType?.includes("q2-raceThreshold"));
  if (q2) {
    const prescribedKm = (Number(q2.en.match(/(\d+) x 800/)?.[1]) || 0) * 0.8;
    if (Math.abs(prescribedKm - Number(q2.intensityKm?.T || 0)) > 0.05) {
      failures.push(`比賽週 Q2 文字為 ${round(prescribedKm)} km T，但內部記錄為 ${q2.intensityKm.T} km`);
    }
  }

  if (model.trainingCycle === TrainingCycle.PHASE_I
      && model.weeklySchedule.some((day) => ["M", "T", "I", "R"].includes(day.zone))) {
    failures.push("馬拉松 Phase I 出現正式 M/T/I/R");
  }

  if (model.marathonPlan.phaseWeek === 6 && model.trainingCycle === TrainingCycle.PHASE_IV) {
    warnings.push("75% 比賽週跑量是網站依表格估算的保守改編，不是書中明列的單一比例");
  }
}

function auditHansons(model, longShare, warnings, failures) {
  if (model.hansonsPlan?.sourceKind === "foundation-finish-route") {
    const formalQuality = model.weeklySchedule.filter((day) => day.scheduleRole === "quality");
    check(formalQuality.length === 0, "基礎／完賽路線仍出現 Classic SOS", failures);
    check(longShare <= 30.11, `基礎／完賽路線長跑占比 ${longShare}% 超過 30%`, failures);
    warnings.push("峰值低於官方 Classic 約 75%，已切換成基礎／完賽路線而非等比例縮小 SOS");
  }

  if (model.hansonsPlan?.belowRecommendedVolume) {
    warnings.push(`峰值跑量低於此級別建議值 ${round(model.hansonsPlan.recommendedMinimumPeakKm)} km`);
    if (Math.abs(model.weeklyMileageKm - model.hansonsPlan.recommendedMinimumPeakKm) < 0.11) {
      failures.push("輸入官方峰值換算值仍被浮點／四捨五入判成低於建議跑量");
    }
  }

  if (!model.hansonsPlan?.hasExplicitGoalTime) {
    warnings.push("未輸入 goal finish time；Tempo／Strength 暫以目前 VDOT 等效 MP/HMP 代替");
  }

  if (model.hansonsPlan?.hasExplicitGoalTime) {
    check(
      Number(model.hansonsPlan.goalPaceSecondsPerKm) > 0,
      "已輸入目標完賽時間但沒有有效 goal MP/HMP",
      failures
    );
    if (model.hansonsPlan.goalGapTooLarge && !model.hansonsPlan.foundationFinishRoute) {
      const current = Number(model.hansonsPlan.currentEquivalentPaceSecondsPerKm);
      const goal = Number(model.hansonsPlan.goalPaceSecondsPerKm);
      const applied = Number(model.hansonsPlan.specificPaceSecondsPerKm);
      check(
        applied <= current + 0.11 && applied >= goal - 0.11,
        "大目標落差的本週專項配速沒有落在 current 與 goal 之間",
        failures
      );
      warnings.push("目標落差超過每英里 10 秒，已套用 current→goal 漸進保護");
    }
  }
}

function runPaceAnchor(anchor) {
  const model = calculatePaceModel({ vdot: anchor.vdot, temperatureC: 10, humidity: 40 });
  const easy = model.zones.find((zone) => zone.id === PaceZone.EASY).base;
  const actual = [easy.faster, easy.slower];
  const expected = anchor.expectedEasySecondsPerKm;
  const edgeErrors = actual.map((value, index) => round(value - expected[index]));
  return {
    ...anchor,
    actualEasySecondsPerKm: actual.map(round),
    expectedEasySecondsPerKm: expected.map(round),
    edgeErrorsSecondsPerKm: edgeErrors,
    status: edgeErrors.every((value) => Math.abs(value) <= 3) ? "PASS" : "FAIL"
  };
}

function getLongShareLimit(model, plannedMileageKm) {
  if (model.trainingMethod === TrainingMethod.HANSONS) {
    return 0.3;
  }
  if (model.targetRace === TargetRace.MARATHON) return plannedMileageKm > 64 ? 0.25 : 0.3;
  return 0.3;
}

function hasNoAdjacentQuality(indexes, length) {
  const set = new Set(indexes);
  return indexes.every((index) => !set.has((index + 1) % length));
}

function check(condition, message, failures) {
  if (!condition) failures.push(message);
}

function maxNumber(value) {
  const values = `${value}`.match(/\d+(?:\.\d+)?/g)?.map(Number) ?? [];
  return values.length > 0 ? Math.max(...values) : null;
}

function round(value, digits = 1) {
  const factor = 10 ** digits;
  return Math.round(Number(value) * factor) / factor;
}

function printHumanReport(items, anchors) {
  const counts = countStatuses(items);
  console.log(`Training-plan audit: ${items.length} scenarios`);
  console.log(`PASS ${counts.PASS || 0} / REVIEW ${counts.REVIEW || 0} / FAIL ${counts.FAIL || 0}`);
  console.log("");
  for (const item of items) {
    console.log(`${item.id} ${item.status} | ${item.label}`);
    console.log(`  ${item.plannedMileageKm} km; long ${item.longRunKm} km (${item.longShare}%, ${item.estimatedLongMinutes ?? "n/a"} min); quality ${item.qualityDays.join("/") || "none"}`);
    for (const failure of item.failures) console.log(`  FAIL: ${failure}`);
    for (const warning of item.warnings) console.log(`  REVIEW: ${warning}`);
  }
  console.log("");
  console.log("Official pace anchors:");
  for (const anchor of anchors) {
    console.log(`${anchor.id} ${anchor.status} | VDOT ${anchor.vdot} E pace edge errors ${anchor.edgeErrorsSecondsPerKm.join(" / ")} sec/km`);
  }
}

function countStatuses(items) {
  return items.reduce((counts, item) => {
    counts[item.status] = (counts[item.status] || 0) + 1;
    return counts;
  }, {});
}
