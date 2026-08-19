const KM_PER_MILE = 1.609344;

export const NorwegianExperience = Object.freeze({
  INTRO: "intro",
  STABLE: "stable",
  LONG_TERM: "long-term"
});

export const NorwegianHealth = Object.freeze({
  HEALTHY: "healthy",
  RETURNING: "returning"
});

export const NorwegianSpecificity = Object.freeze({
  VANILLA: "vanilla",
  SPECIFIC: "specific"
});

const experienceRatios = Object.freeze({
  [NorwegianExperience.INTRO]: 0.2,
  [NorwegianExperience.STABLE]: 0.225,
  [NorwegianExperience.LONG_TERM]: 0.25
});

const NORWEGIAN_GATEWAY_MINUTES = 270;
const MIN_TWO_SESSION_BUDGET_MINUTES = 40;
const MIN_THREE_SESSION_BUDGET_MINUTES = 60;
const MAX_AUTOMATIC_SUB_T_SESSION_MINUTES = 35;
const MIN_TRANSITION_LITE_MINUTES = 10;
const MAX_TRANSITION_LITE_MINUTES = 15;

const subTConfigurations = Object.freeze({
  short: Object.freeze({
    durations: [3, 4],
    reps: [5, 12],
    preferred: 3,
    id: "SUB-T S",
    names: ["短組 Sub-T", "Short-rep Sub-T"],
    choiceLabels: ["短組 · 較高跑速", "Short reps · higher speed"],
    choiceHelp: ["單趟短、組數多；要能克制配速，別跑成 5K 間歇。", "Shorter reps at a higher absolute speed; keep them controlled rather than turning them into 5K intervals."]
  }),
  medium: Object.freeze({
    durations: [6, 7, 8],
    reps: [3, 6],
    preferred: 6,
    id: "SUB-T M",
    names: ["中組 Sub-T", "Medium-rep Sub-T"],
    choiceLabels: ["中組 · 平衡預設", "Medium reps · balanced default"],
    choiceHelp: ["沒有明確偏好時使用；較容易用體感、心率與配速控制。", "Use when there is no clear preference; the balanced default is easier to control by feel, heart rate, and pace."]
  }),
  long: Object.freeze({
    durations: [8, 9, 10, 11, 12],
    reps: [2, 4],
    preferred: 9,
    id: "SUB-T L",
    names: ["長組 Sub-T", "Long-rep Sub-T"],
    choiceLabels: ["長組 · 較少中斷", "Long reps · fewer breaks"],
    choiceHelp: ["單趟長、組數少；起跑要更保守，避免後段強度漂移。", "Longer reps with fewer breaks; start more conservatively to limit late-session drift."]
  }),
  lite: Object.freeze({
    durations: [2, 3, 4, 5],
    reps: [3, 5],
    preferred: 3,
    id: "T-LITE",
    names: ["過渡 T-lite", "Transition T-lite"],
    choiceLabels: ["T-lite", "T-lite"],
    choiceHelp: ["10–15 分鐘的過渡暴露，不提供不合理的長組選項。", "A 10–15 minute transition exposure; long-rep alternatives are intentionally unavailable."]
  })
});

const dayKeys = Object.freeze([
  ["Mon", "一"],
  ["Tue", "二"],
  ["Wed", "三"],
  ["Thu", "四"],
  ["Fri", "五"],
  ["Sat", "六"],
  ["Sun", "日"]
]);

export function generateNorwegianSinglesWeeklySchedule({
  targetRace = "10K",
  weeklyRunningMinutes = 300,
  weeklyMileageKm = 50,
  runningDays = 6,
  experience = NorwegianExperience.INTRO,
  healthStatus = NorwegianHealth.HEALTHY,
  specificity = NorwegianSpecificity.VANILLA,
  unitSystem = "metric",
  heatMultiplier = 1,
  paceAnchors = {},
  easySecondsPerKm = 360
} = {}) {
  const minutes = clamp(Math.round(Number(weeklyRunningMinutes) || 0), 0, 900);
  const mileageKm = clamp(Number(weeklyMileageKm) || 0, 0, 180);
  const days = clamp(Math.round(Number(runningDays) || 0), 1, 7);
  const normalizedExperience = Object.values(NorwegianExperience).includes(experience)
    ? experience
    : NorwegianExperience.INTRO;
  const normalizedHealth = Object.values(NorwegianHealth).includes(healthStatus)
    ? healthStatus
    : NorwegianHealth.HEALTHY;
  const requestedSpecificity = specificity === NorwegianSpecificity.SPECIFIC;
  const level = getNorwegianLevel(minutes);
  const targetRatio = experienceRatios[normalizedExperience];
  const weeklySubTTargetMinutes = Math.round(minutes * targetRatio);
  const safetyReasons = [];
  const frequencyReasons = [];
  const budgetCapacity = weeklySubTTargetMinutes <= 0
    ? 0
    : weeklySubTTargetMinutes < MIN_TWO_SESSION_BUDGET_MINUTES
      ? 1
      : weeklySubTTargetMinutes < MIN_THREE_SESSION_BUDGET_MINUTES
        ? 2
        : 3;
  const gatewayCapacity = minutes > 0 && minutes < NORWEGIAN_GATEWAY_MINUTES ? 2 : 3;
  const dayCapacity = days <= 2 ? 0 : days === 3 ? 1 : days <= 5 ? 2 : 3;
  const adaptationCapacity = normalizedExperience === NorwegianExperience.INTRO ? 2 : 3;
  const healthCapacity = normalizedHealth === NorwegianHealth.HEALTHY ? 3 : 1;
  let qualityCount = Math.min(
    budgetCapacity,
    gatewayCapacity,
    dayCapacity,
    adaptationCapacity,
    healthCapacity
  );

  if (budgetCapacity < 3) frequencyReasons.push("weekly-budget");
  if (gatewayCapacity < budgetCapacity) frequencyReasons.push("gateway-time");
  if (dayCapacity < Math.min(budgetCapacity, gatewayCapacity)) {
    frequencyReasons.push("running-days");
    safetyReasons.push("running-days");
  }
  if (adaptationCapacity < Math.min(budgetCapacity, gatewayCapacity, dayCapacity)) {
    frequencyReasons.push("adaptation");
  }
  if (healthCapacity < Math.min(budgetCapacity, gatewayCapacity, dayCapacity, adaptationCapacity)) {
    frequencyReasons.push("returning");
    safetyReasons.push("returning");
  }

  let transitionThirdSession = qualityCount === 3
    && normalizedExperience === NorwegianExperience.STABLE;
  let sessionPlans = buildSubTSessions(
    weeklySubTTargetMinutes,
    qualityCount,
    paceAnchors,
    unitSystem,
    heatMultiplier,
    { transitionThirdSession }
  );
  let longRunMinutes = getLongRunMinutes(minutes, days, level.id);

  while (
    sessionPlans.length > 0 &&
    sum(sessionPlans.map((session) => session.totalMinutes)) + longRunMinutes > minutes
  ) {
    qualityCount -= 1;
    safetyReasons.push("time-capacity");
    transitionThirdSession = qualityCount === 3
      && normalizedExperience === NorwegianExperience.STABLE;
    sessionPlans = buildSubTSessions(
      weeklySubTTargetMinutes,
      qualityCount,
      paceAnchors,
      unitSystem,
      heatMultiplier,
      { transitionThirdSession }
    );
  }

  const specificityEnabled = requestedSpecificity
    && normalizedHealth === NorwegianHealth.HEALTHY
    && sessionPlans.length >= 2
    && !transitionThirdSession;
  if (requestedSpecificity && !specificityEnabled) {
    frequencyReasons.push("specificity-deferred");
  }
  if (specificityEnabled) {
    const replacementIndex = sessionPlans.length - 1;
    sessionPlans[replacementIndex] = buildSpecificSession({
      targetRace,
      targetMinutes: sessionPlans[replacementIndex].targetMinutes,
      unitSystem,
      heatMultiplier,
      paceAnchors
    });
  }

  const committedMinutes = sum(sessionPlans.map((session) => session.totalMinutes));
  longRunMinutes = Math.min(longRunMinutes, Math.max(0, minutes - committedMinutes));
  const easyRunCount = Math.max(0, days - sessionPlans.length - (longRunMinutes > 0 ? 1 : 0));
  const remainingEasyMinutes = Math.max(0, minutes - committedMinutes - longRunMinutes);
  const easyMinutes = allocateIntegers(remainingEasyMinutes, easyRunCount);
  const layout = buildWeekLayout(sessionPlans.length, easyRunCount);
  const scheduleDraft = dayKeys.map(([enDay, zhDay], index) => {
    const role = layout[index];
    if (role?.type === "quality") {
      return makeQualityDay(enDay, zhDay, sessionPlans[role.index]);
    }
    if (role?.type === "long") {
      return makeLongRunDay(enDay, zhDay, longRunMinutes);
    }
    if (role?.type === "easy") {
      return makeEasyDay(enDay, zhDay, easyMinutes[role.index] ?? 0);
    }
    return makeRestDay(enDay, zhDay);
  });

  const plannedMinuteTotal = sum(scheduleDraft.map((day) => day.plannedMinutes));
  if (plannedMinuteTotal < minutes) {
    const easyDay = scheduleDraft.find((day) => day.scheduleRole === "easy")
      ?? scheduleDraft.find((day) => day.isLongRun)
      ?? scheduleDraft.find((day) => day.scheduleRole === "quality");
    if (easyDay) easyDay.plannedMinutes += minutes - plannedMinuteTotal;
  }

  const totalKnownWorkDistanceKm = sum(sessionPlans.map((session) => session.workDistanceKm));
  const totalKnownWorkMinutes = sum(sessionPlans.map((session) => session.subTMinutes));
  const backgroundMinutes = Math.max(0, minutes - totalKnownWorkMinutes);
  const backgroundDistanceKm = Math.max(0, mileageKm - totalKnownWorkDistanceKm);
  const backgroundEasySecondsPerKm = backgroundMinutes > 0 && backgroundDistanceKm > 0
    ? (backgroundMinutes * 60) / backgroundDistanceKm
    : Math.max(1, Number(easySecondsPerKm) || 360);
  const rawDistanceWeights = scheduleDraft.map((day) => {
    if (day.scheduleRole !== "quality") {
      return day.plannedMinutes * 60 / backgroundEasySecondsPerKm;
    }
    const knownWorkMinutes = Number(day.subTMinutes || 0);
    const backgroundSessionMinutes = Math.max(0, day.plannedMinutes - knownWorkMinutes);
    return Number(day.workDistanceKm || 0)
      + backgroundSessionMinutes * 60 / backgroundEasySecondsPerKm;
  });
  const minimumGeneratedDistanceKm = roundTo(sum(rawDistanceWeights), 1);
  const distanceCanMatchInput = mileageKm + 0.05 >= totalKnownWorkDistanceKm;
  const distanceAllocations = distanceCanMatchInput
    ? allocateTenthsByWeights(mileageKm, rawDistanceWeights)
    : rawDistanceWeights.map((distance) => roundTo(distance, 1));
  const schedule = scheduleDraft.map((day, index) => addDistanceMetadata(
    day,
    distanceAllocations[index] ?? 0,
    unitSystem
  ));
  const plannedSubTMinutes = sum(sessionPlans.map((session) => session.subTMinutes));

  return {
    schedule,
    plan: {
      method: "norwegian-singles",
      levelId: level.id,
      levelZh: level.zh,
      levelEn: level.en,
      weeklyRunningMinutes: minutes,
      weeklyMileageKm: roundTo(mileageKm, 1),
      runningDays: days,
      experience: normalizedExperience,
      healthStatus: normalizedHealth,
      targetRatio,
      hardCapRatio: 0.3,
      weeklySubTTargetMinutes,
      plannedSubTMinutes,
      qualityCount: sessionPlans.length,
      qualityCountLabelZh: transitionThirdSession ? "2 堂完整＋1 堂 T-lite" : `${sessionPlans.length} 堂`,
      qualityCountLabelEn: transitionThirdSession ? "2 full + 1 T-lite" : `${sessionPlans.length} sessions`,
      transitionThirdSession,
      specificityRequested: requestedSpecificity,
      specificityEnabled,
      safetyReasons: [...new Set(safetyReasons)],
      frequencyReasons: [...new Set(frequencyReasons)],
      backgroundEasySecondsPerKm: roundTo(backgroundEasySecondsPerKm, 1),
      distanceCanMatchInput,
      minimumGeneratedDistanceKm,
      phaseZh: specificityEnabled ? "專項替換週" : level.zh,
      phaseEn: specificityEnabled ? "Specific replacement week" : level.en,
      timeBased: true,
      easyHeartRateCapPercent: 70,
      lactateGuidance: "2.5–3.5 mmol/L",
      sourceKind: level.id === "A" ? "low-volume-adaptation" : "letsrun-thread-rule"
    }
  };
}

export function getNorwegianLevel(weeklyRunningMinutes) {
  const minutes = Math.max(0, Number(weeklyRunningMinutes) || 0);
  if (minutes < NORWEGIAN_GATEWAY_MINUTES) {
    return { id: "A", zh: "低跑量改良版", en: "Low-volume adaptation", qualityCount: 2 };
  }
  if (minutes < 360) {
    return { id: "B", zh: "Gateway Singles", en: "Gateway Singles", qualityCount: 3 };
  }
  if (minutes <= 510) {
    return { id: "C", zh: "Full Singles", en: "Full Singles", qualityCount: 3 };
  }
  return { id: "D", zh: "進階／超出自動加課範圍", en: "Advanced / no automatic fourth session", qualityCount: 3 };
}

function buildSubTSessions(
  totalTargetMinutes,
  count,
  paceAnchors,
  unitSystem,
  heatMultiplier,
  { transitionThirdSession = false } = {}
) {
  if (count <= 0 || totalTargetMinutes <= 0) return [];
  const cappedTargetMinutes = Math.min(
    totalTargetMinutes,
    count * MAX_AUTOMATIC_SUB_T_SESSION_MINUTES
  );
  const targetMinutes = allocateSubTSessionTargets(
    cappedTargetMinutes,
    count,
    transitionThirdSession
  );
  const templates = transitionThirdSession && count === 3
    ? ["medium", "medium", "lite"]
    : Array.from({ length: count }, () => "medium");
  return templates.map((type, index) => buildSubTSession({
    type,
    targetMinutes: targetMinutes[index],
    paceAnchors,
    unitSystem,
    heatMultiplier
  }));
}

function allocateSubTSessionTargets(totalTargetMinutes, count, transitionThirdSession) {
  if (transitionThirdSession && count === 3) {
    const rawLiteMinutes = clamp(
      Math.round(totalTargetMinutes * 0.2),
      MIN_TRANSITION_LITE_MINUTES,
      MAX_TRANSITION_LITE_MINUTES
    );
    const liteMinutes = [10, 12, 15]
      .filter((minutes) => minutes <= rawLiteMinutes)
      .at(-1) ?? MIN_TRANSITION_LITE_MINUTES;
    const primaryMinutes = Math.min(totalTargetMinutes - liteMinutes, 2 * MAX_AUTOMATIC_SUB_T_SESSION_MINUTES);
    return [...allocateIntegers(primaryMinutes, 2), liteMinutes];
  }
  return allocateIntegers(totalTargetMinutes, count);
}

function buildSubTSession({ type, targetMinutes, paceAnchors, unitSystem, heatMultiplier }) {
  const config = subTConfigurations[type];
  const session = buildSubTSessionFormat({
    type,
    targetMinutes,
    paceAnchors,
    unitSystem,
    heatMultiplier
  });

  if (type !== "medium") return session;

  return {
    ...session,
    workoutAlternatives: ["short", "long"].map((alternativeType) =>
      buildSubTSessionFormat({
        type: alternativeType,
        targetMinutes: session.subTMinutes,
        paceAnchors,
        unitSystem,
        heatMultiplier,
        plannedSessionMinutes: session.totalMinutes
      })
    ),
    defaultFormat: {
      id: `norwegian-medium-${session.subTMinutes}`,
      type: "medium",
      labelZh: config.choiceLabels[0],
      labelEn: config.choiceLabels[1],
      helpZh: config.choiceHelp[0],
      helpEn: config.choiceHelp[1]
    }
  };
}

function buildSubTSessionFormat({
  type,
  targetMinutes,
  paceAnchors,
  unitSystem,
  heatMultiplier,
  plannedSessionMinutes = null
}) {
  const config = subTConfigurations[type];
  const prescription = chooseRepPrescription(targetMinutes, config);
  const workMinutes = prescription.reps * prescription.repMinutes;
  const recoveryMinutes = Math.max(0, prescription.reps - 1);
  const paceRowValue = buildPaceRow(type, paceAnchors, unitSystem, heatMultiplier, config.id);
  const workDistanceKm = paceRowValue.baseSecondsPerKm > 0
    ? (workMinutes * 60) / paceRowValue.baseSecondsPerKm
    : 0;
  const ownTotalMinutes = workMinutes + recoveryMinutes + 20;
  const scheduledTotalMinutes = Math.max(
    workMinutes + recoveryMinutes,
    Number(plannedSessionMinutes) || ownTotalMinutes
  );
  return {
    id: `norwegian-${type}-${workMinutes}-${prescription.reps}x${prescription.repMinutes}`,
    type,
    zone: "T",
    targetMinutes,
    subTMinutes: workMinutes,
    totalMinutes: scheduledTotalMinutes,
    workDistanceKm: roundTo(workDistanceKm, 1),
    paceRow: paceRowValue,
    customPaceRows: [paceRowValue],
    formatLabelZh: config.choiceLabels[0],
    formatLabelEn: config.choiceLabels[1],
    formatHelpZh: config.choiceHelp[0],
    formatHelpEn: config.choiceHelp[1],
    zh: `${config.names[0]}：${prescription.reps} × ${prescription.repMinutes} 分鐘，組間 60 秒慢跑；前後以 E 補足本堂時間`,
    en: `${config.names[1]}: ${prescription.reps} × ${prescription.repMinutes} min with 60 sec jogs; use E running before and after to complete the scheduled session time`
  };
}

function chooseRepPrescription(targetMinutes, config) {
  let best = null;
  for (const duration of config.durations) {
    for (let reps = config.reps[0]; reps <= config.reps[1]; reps += 1) {
      const work = duration * reps;
      const score = (work > targetMinutes ? 1000 : 0)
        + Math.abs(work - targetMinutes) * 10
        + Math.abs(duration - config.preferred);
      if (!best || score < best.score) best = { repMinutes: duration, reps, score };
    }
  }
  return best;
}

function buildSpecificSession({ targetRace, targetMinutes, unitSystem, heatMultiplier, paceAnchors }) {
  const tenKRow = makePaceRow(
    "X",
    "10K 專項控制配速",
    "10K-specific controlled pace",
    paceAnchors.tenK,
    paceAnchors.tenK,
    unitSystem,
    heatMultiplier
  );
  const hmRow = makePaceRow(
    "X",
    "半馬／變速閾值努力",
    "Half-marathon / variable-threshold effort",
    paceAnchors.halfMarathon,
    paceAnchors.halfMarathon,
    unitSystem,
    heatMultiplier
  );

  if (targetRace === "5K") {
    return {
      type: "specific-5k",
      zone: "I",
      targetMinutes,
      subTMinutes: 0,
      totalMinutes: 42,
      workDistanceKm: null,
      paceRow: makeEffortRow(
        "X",
        "5K X-factor",
        "5K X-factor",
        "依 RPE／動作品質控制 · By RPE / form"
      ),
      zh: "5K X-factor：8–10 × 60–75 秒坡跑或 30/30；取代一堂 Sub‑T，不額外加課",
      en: "5K X-factor: 8–10 × 60–75 sec hills or 30/30s; replaces one Sub-T session"
    };
  }

  if (targetRace === "10K") {
    const thresholdMinutes = Math.max(20, Math.min(30, targetMinutes));
    return {
      type: "specific-10k",
      zone: "T",
      targetMinutes,
      subTMinutes: thresholdMinutes,
      totalMinutes: thresholdMinutes + 26,
      workDistanceKm: roundTo((thresholdMinutes * 60) / tenKRow.baseSecondsPerKm, 1),
      paceRow: tenKRow,
      zh: `10K X-factor：${thresholdMinutes >= 30 ? "3" : "2"} × 10 分鐘變化閾值，接 6 × 30/30；取代一堂 Sub‑T`,
      en: `10K X-factor: ${thresholdMinutes >= 30 ? "3" : "2"} × 10 min threshold variation plus 6 × 30/30; replaces one Sub-T`
    };
  }

  const thresholdMinutes = Math.max(20, Math.min(36, targetMinutes));
  return {
    type: "specific-half",
    zone: "T",
    targetMinutes,
    subTMinutes: thresholdMinutes,
    totalMinutes: thresholdMinutes + 24,
    workDistanceKm: roundTo((thresholdMinutes * 60) / hmRow.baseSecondsPerKm, 1),
    paceRow: hmRow,
    zh: `半馬 X-factor：${thresholdMinutes >= 30 ? "3 × 10–12 分鐘" : `${thresholdMinutes} 分鐘變化連續 T`}；取代一堂 Sub‑T`,
    en: `Half-marathon X-factor: ${thresholdMinutes >= 30 ? "3 × 10–12 min" : `${thresholdMinutes} min variable continuous T`}; replaces one Sub-T`
  };
}

function buildPaceRow(type, paceAnchors, unitSystem, heatMultiplier, id) {
  if (type === "short") {
    return makePaceRow(id, "約 15K–10 mile effort", "About 15K–10-mile effort", paceAnchors.fifteenK, paceAnchors.tenMile, unitSystem, heatMultiplier);
  }
  if (type === "medium") {
    return makePaceRow(id, "約半馬 effort", "About half-marathon effort", paceAnchors.halfMarathon, paceAnchors.halfMarathon, unitSystem, heatMultiplier);
  }
  if (type === "lite") {
    return makePaceRow(id, "約 25K–30K effort", "About 25K–30K effort", paceAnchors.twentyFiveK, paceAnchors.thirtyK, unitSystem, heatMultiplier);
  }
  return makePaceRow(id, "約 25K–30K effort", "About 25K–30K effort", paceAnchors.twentyFiveK, paceAnchors.thirtyK, unitSystem, heatMultiplier);
}

function makePaceRow(id, zh, en, fasterSeconds, slowerSeconds, unitSystem, heatMultiplier) {
  const faster = Number(fasterSeconds) || 300;
  const slower = Math.max(faster, Number(slowerSeconds) || faster);
  return {
    id,
    zh,
    en,
    baseSecondsPerKm: (faster + slower) / 2,
    base: formatPaceRange(faster, slower, unitSystem),
    adjusted: formatPaceRange(faster * heatMultiplier, slower * heatMultiplier, unitSystem)
  };
}

function makeEffortRow(id, zh, en, value) {
  return { id, zh, en, baseSecondsPerKm: 0, base: value, adjusted: value };
}

function buildWeekLayout(qualityCount, easyCount) {
  const layout = Array.from({ length: 7 }, () => null);
  const qualityDays = qualityCount >= 3 ? [1, 3, 5] : qualityCount === 2 ? [1, 4] : qualityCount === 1 ? [2] : [];
  qualityDays.forEach((dayIndex, index) => { layout[dayIndex] = { type: "quality", index }; });
  layout[6] = { type: "long", index: 0 };
  const easyPriority = qualityCount >= 3 ? [0, 2, 4] : qualityCount === 2 ? [0, 2, 3, 5] : [0, 1, 3, 4, 5];
  easyPriority.filter((index) => !layout[index]).slice(0, easyCount).forEach((dayIndex, index) => {
    layout[dayIndex] = { type: "easy", index };
  });
  return layout;
}

function makeQualityDay(enDay, zhDay, session) {
  return {
    enDay,
    zhDay,
    zone: session.zone,
    zh: session.zh,
    en: session.en,
    plannedMinutes: session.totalMinutes,
    scheduleRole: "quality",
    isPrimaryWorkout: true,
    paceZoneIds: [],
    customPaceRows: [session.paceRow],
    workoutAlternatives: session.workoutAlternatives ?? [],
    defaultFormat: session.defaultFormat ?? null,
    workDistanceKm: session.workDistanceKm,
    subTMinutes: session.subTMinutes,
    workoutType: session.type,
    easyDistributionEligible: false
  };
}

function makeEasyDay(enDay, zhDay, minutes) {
  return {
    enDay,
    zhDay,
    zone: "E",
    zh: `E 輕鬆跑 ${minutes} 分鐘；以可交談、可恢復為主，心率上限參考 ≤70% HRmax`,
    en: `Easy ${minutes} min; conversational and recoverable, with ≤70% HRmax as the method-specific reference cap`,
    plannedMinutes: minutes,
    scheduleRole: "easy",
    isPrimaryWorkout: false,
    paceZoneIds: [],
    customPaceRows: minutes > 0 ? [makeEasyEffortRow()] : [],
    easyDistributionEligible: false
  };
}

function makeLongRunDay(enDay, zhDay, minutes) {
  return {
    enDay,
    zhDay,
    zone: "E",
    zh: `Easy Long ${minutes} 分鐘；全程可控制，不做 fast finish`,
    en: `Easy Long ${minutes} min; controlled throughout, without a fast finish`,
    plannedMinutes: minutes,
    scheduleRole: "long",
    isPrimaryWorkout: true,
    isLongRun: true,
    longRunLimitPercentage: null,
    estimatedMaxMinutes: minutes,
    paceZoneIds: [],
    customPaceRows: minutes > 0 ? [makeEasyEffortRow()] : [],
    easyDistributionEligible: false
  };
}

function makeRestDay(enDay, zhDay) {
  return {
    enDay,
    zhDay,
    zone: "E",
    zh: "休息／交叉訓練",
    en: "Rest / cross-train",
    plannedMinutes: 0,
    plannedDistanceKm: 0,
    scheduleRole: "rest",
    isPrimaryWorkout: false,
    paceZoneIds: [],
    customPaceRows: [],
    easyDistributionEligible: false
  };
}

function makeEasyEffortRow() {
  return makeEffortRow(
    "E",
    "Easy 強度上限",
    "Easy intensity cap",
    "可交談／≤70% HRmax · Conversational / ≤70% HRmax"
  );
}

function addDistanceMetadata(day, distanceKm, unitSystem) {
  const rounded = roundTo(distanceKm, 1);
  const label = formatDistanceValue(rounded, unitSystem);
  return {
    ...day,
    plannedDistanceKm: rounded,
    plannedDistanceRangeKm: { min: rounded, max: rounded },
    zhDistanceLabel: day.plannedMinutes > 0 ? `約 ${label}／${day.plannedMinutes} 分鐘` : "0 km",
    enDistanceLabel: day.plannedMinutes > 0 ? `About ${label} / ${day.plannedMinutes} min` : "0 km"
  };
}

function getLongRunMinutes(weeklyMinutes, runningDays, levelId) {
  if (weeklyMinutes <= 0) return 0;
  const regularRunMinutes = weeklyMinutes / Math.max(1, runningDays);
  const minimum = levelId === "A" ? 60 : 75;
  const maximum = levelId === "A" ? 75 : 90;
  return Math.round(Math.min(weeklyMinutes, clamp(regularRunMinutes * 1.5, minimum, maximum)));
}

function allocateIntegers(total, count) {
  if (count <= 0) return [];
  const base = Math.floor(total / count);
  const remainder = total - base * count;
  return Array.from({ length: count }, (_, index) => base + (index >= count - remainder ? 1 : 0));
}

function allocateTenthsByWeights(totalKm, weights) {
  if (totalKm <= 0 || sum(weights) <= 0) return weights.map(() => 0);
  const totalTenths = Math.round(totalKm * 10);
  const weightTotal = sum(weights);
  const raw = weights.map((weight) => totalTenths * weight / weightTotal);
  const allocated = raw.map(Math.floor);
  let remainder = totalTenths - sum(allocated);
  const order = raw
    .map((value, index) => ({ index, fraction: value - Math.floor(value) }))
    .sort((a, b) => b.fraction - a.fraction || a.index - b.index);
  for (let index = 0; index < remainder; index += 1) allocated[order[index].index] += 1;
  return allocated.map((value) => value / 10);
}

function formatPaceRange(fasterSeconds, slowerSeconds, unitSystem) {
  const suffix = ` / ${unitSystem === "imperial" ? "mi" : "km"}`;
  const faster = formatPaceValue(fasterSeconds, unitSystem);
  const slower = formatPaceValue(slowerSeconds, unitSystem);
  return faster === slower ? `${faster}${suffix}` : `${faster} - ${slower}${suffix}`;
}

function formatPace(secondsPerKm, unitSystem) {
  return `${formatPaceValue(secondsPerKm, unitSystem)} / ${unitSystem === "imperial" ? "mi" : "km"}`;
}

function formatPaceValue(secondsPerKm, unitSystem) {
  const seconds = unitSystem === "imperial" ? secondsPerKm * KM_PER_MILE : secondsPerKm;
  const rounded = Math.max(1, Math.round(seconds));
  return `${Math.floor(rounded / 60)}:${String(rounded % 60).padStart(2, "0")}`;
}

function formatDistanceValue(distanceKm, unitSystem) {
  const value = unitSystem === "imperial" ? distanceKm / KM_PER_MILE : distanceKm;
  const rounded = roundTo(value, 1);
  return `${Number.isInteger(rounded) ? rounded : rounded.toFixed(1)} ${unitSystem === "imperial" ? "mi" : "km"}`;
}

function sum(values) {
  return values.reduce((total, value) => total + Number(value || 0), 0);
}

function roundTo(value, decimals = 0) {
  const factor = 10 ** decimals;
  return Math.round(Number(value) * factor) / factor;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, Number(value) || 0));
}
