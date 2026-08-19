export const TrainingMethod = Object.freeze({
  DANIELS: "daniels",
  HANSONS: "hansons",
  NORWEGIAN_SINGLES: "norwegian-singles"
});

export const HansonsLevel = Object.freeze({
  BEGINNER: "beginner",
  ADVANCED: "advanced"
});

export const HansonsRace = Object.freeze({
  HALF_MARATHON: "Half Marathon",
  MARATHON: "Marathon"
});

export const HANSONS_PLAN_LENGTHS = Object.freeze({
  [HansonsRace.HALF_MARATHON]: 18,
  [HansonsRace.MARATHON]: 18
});

const KM_PER_MILE = 1.609344;
const TEN_SECONDS_PER_MILE_IN_SECONDS_PER_KM = 10 / KM_PER_MILE;
const CLASSIC_LOW_VOLUME_THRESHOLD = 0.75;

const raceDistanceKm = Object.freeze({
  [HansonsRace.HALF_MARATHON]: 21.0975,
  [HansonsRace.MARATHON]: 42.195
});

const recommendedPeakKm = Object.freeze({
  [HansonsRace.HALF_MARATHON]: {
    beginner: 47 * KM_PER_MILE,
    advanced: 50 * KM_PER_MILE
  },
  [HansonsRace.MARATHON]: {
    beginner: 57.5 * KM_PER_MILE,
    advanced: 61.5 * KM_PER_MILE
  }
});

const classicWeeklyMiles = Object.freeze({
  [HansonsRace.HALF_MARATHON]: {
    beginner: [10, 15, 21, 22, 28, 37, 37, 41, 41, 43, 44, 46, 45, 47, 47, 47, 42, 37.1],
    advanced: [17, 33, 34, 36, 40, 44, 41, 46, 41, 47, 45, 49, 47, 50, 48, 50, 44, 37.1]
  },
  [HansonsRace.MARATHON]: {
    beginner: [12, 15, 21, 20, 24, 40, 39, 42, 49, 48, 54.5, 50, 56.5, 49, 57.5, 51, 49.5, 50.2],
    advanced: [38, 41, 45, 44, 47, 47, 52, 49, 56, 50, 59.5, 54, 60.5, 53, 61.5, 55, 53.5, 52.2]
  }
});

// Published daily totals in miles, ordered Mon, Tue, Thu, Fri, Sat, Sun.
// Wednesday is Rest/Cross-Train in every Classic week.
const classicDailyMiles = Object.freeze({
  [HansonsRace.HALF_MARATHON]: {
    beginner: [
      [0, 0, 3, 0, 3, 4], [0, 2, 3, 3, 3, 4], [0, 4, 4, 4, 4, 5],
      [0, 5, 3, 3, 5, 6], [0, 5, 6, 5, 4, 8], [4, 9, 6, 4, 5, 9],
      [4, 7, 6, 4, 6, 10], [6, 7, 7, 5, 6, 10], [5, 8, 7, 6, 5, 10],
      [6, 8, 7, 5, 5, 12], [5, 10, 8, 6, 5, 10], [5, 10, 8, 5, 6, 12],
      [6, 10, 8, 6, 5, 10], [5, 10, 9, 5, 6, 12], [7, 10, 9, 6, 5, 10],
      [5, 10, 9, 5, 6, 12], [5, 10, 8, 6, 5, 8], [5, 5, 6, 5, 3, 13.1]
    ],
    advanced: [
      [0, 0, 4, 3, 4, 6], [4, 9, 6, 4, 4, 6], [4, 7, 6, 5, 5, 7],
      [5, 7, 6, 4, 6, 8], [4, 8, 7, 5, 6, 10], [5, 8, 7, 6, 6, 12],
      [5, 8, 7, 6, 5, 10], [6, 8, 8, 6, 6, 12], [5, 7, 8, 6, 5, 10],
      [7, 9, 8, 5, 6, 12], [5, 10, 9, 6, 5, 10], [5, 10, 9, 5, 6, 14],
      [7, 10, 9, 6, 5, 10], [5, 10, 10, 5, 6, 14], [7, 10, 10, 6, 5, 10],
      [5, 10, 10, 5, 6, 14], [7, 10, 8, 6, 5, 8], [5, 5, 6, 5, 3, 13.1]
    ]
  },
  [HansonsRace.MARATHON]: {
    beginner: [
      [0, 2, 3, 0, 3, 4], [0, 2, 3, 3, 3, 4], [0, 4, 4, 4, 4, 5],
      [0, 5, 3, 3, 5, 4], [0, 5, 4, 5, 4, 6], [4, 9, 7, 4, 8, 8],
      [4, 8, 7, 4, 6, 10], [6, 8, 7, 5, 6, 10], [5, 8, 10, 6, 5, 15],
      [7, 8, 10, 5, 8, 10], [5, 10.5, 10, 5, 8, 16], [5, 11, 11, 5, 8, 10],
      [7, 10.5, 11, 6, 6, 16], [5, 10, 11, 5, 8, 10], [7, 10.5, 12, 6, 6, 16],
      [5, 11, 12, 5, 8, 10], [7, 10.5, 12, 6, 6, 8], [5, 5, 6, 5, 3, 26.2]
    ],
    advanced: [
      [6, 6, 6, 6, 6, 8], [6, 9, 6, 6, 6, 8], [6, 8, 8, 7, 6, 10],
      [6, 8, 8, 6, 8, 8], [6, 8, 8, 7, 6, 12], [6, 8, 9, 6, 8, 10],
      [6, 8, 9, 7, 8, 14], [6, 8, 9, 6, 10, 10], [8, 8, 10, 7, 8, 15],
      [6, 8, 10, 6, 10, 10], [8, 10.5, 10, 7, 8, 16], [6, 11, 11, 6, 10, 10],
      [8, 10.5, 11, 7, 8, 16], [6, 10, 11, 6, 10, 10], [8, 10.5, 12, 7, 8, 16],
      [6, 11, 12, 6, 10, 10], [8, 10.5, 12, 7, 8, 8], [6, 5, 6, 6, 3, 26.2]
    ]
  }
});

const classicLongRunMiles = Object.freeze({
  [HansonsRace.HALF_MARATHON]: {
    beginner: [4, 4, 5, 6, 8, 9, 10, 10, 10, 12, 10, 12, 10, 12, 10, 12, 8, 13.1],
    advanced: [6, 6, 7, 8, 10, 12, 10, 12, 10, 12, 10, 14, 10, 14, 10, 14, 8, 13.1]
  },
  [HansonsRace.MARATHON]: {
    beginner: [4, 4, 5, 4, 6, 8, 10, 10, 15, 10, 16, 10, 16, 10, 16, 10, 8, 26.2],
    advanced: [8, 8, 10, 8, 12, 10, 14, 10, 15, 10, 16, 10, 16, 10, 16, 10, 8, 26.2]
  }
});

const classicTempoMiles = Object.freeze({
  [HansonsRace.HALF_MARATHON]: {
    beginner: [0, 0, 0, 0, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6, 5, 0],
    advanced: [0, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 7, 5, 0]
  },
  [HansonsRace.MARATHON]: {
    beginner: [0, 0, 0, 0, 0, 5, 5, 5, 8, 8, 8, 9, 9, 9, 10, 10, 10, 0],
    advanced: [0, 0, 6, 6, 6, 7, 7, 7, 8, 8, 8, 9, 9, 9, 10, 10, 10, 0]
  }
});

const marathonSpeedProgressions = Object.freeze({
  [HansonsLevel.BEGINNER]: [
    { reps: 12, distanceKm: 0.4, recoveryKm: 0.4 },
    { reps: 8, distanceKm: 0.6, recoveryKm: 0.4 },
    { reps: 6, distanceKm: 0.8, recoveryKm: 0.4 },
    { reps: 5, distanceKm: 1, recoveryKm: 0.4 },
    { reps: 4, distanceKm: 1.2, recoveryKm: 0.4 }
  ],
  [HansonsLevel.ADVANCED]: [
    { reps: 12, distanceKm: 0.4, recoveryKm: 0.4 },
    { reps: 8, distanceKm: 0.6, recoveryKm: 0.4 },
    { reps: 6, distanceKm: 0.8, recoveryKm: 0.4 },
    { reps: 5, distanceKm: 1, recoveryKm: 0.4 },
    { reps: 4, distanceKm: 1.2, recoveryKm: 0.4 },
    { reps: 3, distanceKm: KM_PER_MILE, recoveryKm: 0.8 },
    { reps: 4, distanceKm: 1.2, recoveryKm: 0.4 },
    { reps: 5, distanceKm: 1, recoveryKm: 0.4 },
    { reps: 6, distanceKm: 0.8, recoveryKm: 0.4 }
  ]
});

const halfMarathonSpeedProgressions = Object.freeze({
  [HansonsLevel.BEGINNER]: [
    { reps: 12, distanceKm: 0.4, recoveryKm: 0.4 },
    { reps: 8, distanceKm: 0.6, recoveryKm: 0.4 },
    { reps: 6, distanceKm: 0.8, recoveryKm: 0.4 },
    { reps: 5, distanceKm: 1, recoveryKm: 0.6 },
    { reps: 4, distanceKm: 1.2, recoveryKm: 0.6 }
  ],
  [HansonsLevel.ADVANCED]: [
    { reps: 12, distanceKm: 0.4, recoveryKm: 0.4 },
    { reps: 8, distanceKm: 0.6, recoveryKm: 0.4 },
    { reps: 6, distanceKm: 0.8, recoveryKm: 0.4 },
    { reps: 5, distanceKm: 1, recoveryKm: 0.6 },
    { reps: 4, distanceKm: 1.2, recoveryKm: 0.6 },
    { reps: 3, distanceKm: KM_PER_MILE, recoveryKm: 0.8 },
    { reps: 5, distanceKm: 1, recoveryKm: 0.6 },
    { reps: 6, distanceKm: 0.8, recoveryKm: 0.4 },
    { reps: 12, distanceKm: 0.4, recoveryKm: 0.4 }
  ]
});

const strengthProgression = Object.freeze([
  { reps: 6, distanceKm: KM_PER_MILE, recoveryKm: 0.4 },
  { reps: 4, distanceKm: 1.5 * KM_PER_MILE, recoveryKm: 0.8 },
  { reps: 3, distanceKm: 2 * KM_PER_MILE, recoveryKm: 0.8 },
  { reps: 2, distanceKm: 3 * KM_PER_MILE, recoveryKm: KM_PER_MILE },
  { reps: 3, distanceKm: 2 * KM_PER_MILE, recoveryKm: 0.8 },
  { reps: 4, distanceKm: 1.5 * KM_PER_MILE, recoveryKm: 0.8 },
  { reps: 6, distanceKm: KM_PER_MILE, recoveryKm: 0.4 }
]);

export function getHansonsPlanLength(targetRace) {
  return HANSONS_PLAN_LENGTHS[normalizeRace(targetRace)] ?? 18;
}

export function getHansonsDefaultWeek(targetRace, level = HansonsLevel.BEGINNER) {
  const race = normalizeRace(targetRace);
  const normalizedLevel = normalizeLevel(level);
  if (normalizedLevel === HansonsLevel.BEGINNER) return 6;
  return race === HansonsRace.MARATHON ? 3 : 2;
}

export function generateHansonsWeeklySchedule({
  targetRace = HansonsRace.HALF_MARATHON,
  planWeek = 1,
  level = HansonsLevel.BEGINNER,
  peakMileageKm = 55,
  unitSystem = "metric",
  zones = [],
  vdot = 45,
  heatMultiplier = 1,
  goalTimeSeconds = null
} = {}) {
  const race = normalizeRace(targetRace);
  const normalizedLevel = normalizeLevel(level);
  const totalWeeks = getHansonsPlanLength(race);
  const week = clamp(Math.round(Number(planWeek) || 1), 1, totalWeeks);
  const peak = roundTo(clamp(Number(peakMileageKm) || 0, 0, 180), 1);
  const classicPhase = getHansonsPhase(race, week, normalizedLevel);
  const minimumPeak = roundTo(recommendedPeakKm[race][normalizedLevel], 1);
  const rawPlanScale = minimumPeak > 0 ? peak / minimumPeak : 0;
  const raceWeek = week === totalWeeks;
  const foundationFinishRoute = !raceWeek
    && peak > 0
    && rawPlanScale < CLASSIC_LOW_VOLUME_THRESHOLD;
  const phase = foundationFinishRoute
    ? { id: "foundation-finish", zh: "基礎／完賽路線", en: "Foundation / finish route" }
    : classicPhase;
  const plannedFromProfile = getPlannedMileageKm(race, normalizedLevel, week, peak);
  const minimumRaceWeekKm = raceWeek ? raceDistanceKm[race] + (race === HansonsRace.MARATHON ? 4 : 2) : 0;
  const plannedWeeklyMileageKm = roundTo(
    Math.max(plannedFromProfile, minimumRaceWeekKm),
    1
  );
  const qualityScale = peak <= 0 ? 0 : clamp(rawPlanScale, 0, 1);
  const classicWorkoutScale = peak <= 0
    ? 0
    : clamp(0.5 + 0.5 * Math.min(rawPlanScale, 1), 0.5, 1);
  const zoneById = Object.fromEntries(zones.map((zone) => [zone.id, zone]));
  const specificPacePlan = buildHansonsSpecificPacePlan({
    race,
    level: normalizedLevel,
    week,
    vdot,
    goalTimeSeconds
  });
  const paces = buildHansonsPaces(
    vdot,
    heatMultiplier,
    unitSystem,
    zoneById,
    race,
    specificPacePlan
  );
  const workouts = foundationFinishRoute
    ? { primary: null, secondary: null }
    : buildClassicWorkouts({
        race,
        level: normalizedLevel,
        week,
        qualityScale: classicWorkoutScale,
        unitSystem,
        paces,
        publishedDayMiles: classicDailyMiles[race][normalizedLevel][week - 1],
        allowPrimaryQuality: peak > 0,
        allowSecondaryQuality: peak > 0
      });

  const longRun = buildHansonsLongRun({
    race,
    level: normalizedLevel,
    week,
    qualityScale,
    plannedWeeklyMileageKm,
    unitSystem,
    paces,
    zoneById,
    distanceOverrideKm: foundationFinishRoute
      ? Math.floor(plannedWeeklyMileageKm * 0.3 * 10) / 10
      : null,
    foundationFinishRoute
  });
  const schedule = buildHansonsWeek({
    race,
    level: normalizedLevel,
    week,
    qualityScale,
    plannedWeeklyMileageKm,
    unitSystem,
    primary: workouts.primary,
    secondary: workouts.secondary,
    longRun,
    phase
  });
  const scheduledWeeklyMileageKm = roundTo(
    schedule.reduce((sum, day) => sum + Number(day.plannedDistanceKm || 0), 0),
    1
  );

  return {
    schedule,
    plan: {
      week,
      totalWeeks,
      phase: phase.id,
      phaseZh: phase.zh,
      phaseEn: phase.en,
      level: normalizedLevel,
      plannedWeeklyMileageKm: scheduledWeeklyMileageKm,
      profileWeeklyMileageKm: plannedWeeklyMileageKm,
      peakWeeklyMileageKm: peak,
      fraction: peak > 0 ? roundTo(scheduledWeeklyMileageKm / peak, 3) : 0,
      qualityPriorityExpansion: scheduledWeeklyMileageKm > plannedWeeklyMileageKm + 0.05,
      lowVolumeAdaptation: false,
      foundationFinishRoute,
      recommendedMinimumPeakKm: minimumPeak,
      belowRecommendedVolume: peak > 0 && peak < minimumPeak,
      qualityNoteZh: foundationFinishRoute
          ? "本週使用基礎／完賽路線：保留 E、strides 與不超過 30% 的長跑；目前不把縮短後的 Speed、Strength 或 Tempo 標成 Hansons Classic SOS。"
          : getClassicQualityNote(race, normalizedLevel, week, workouts, "zh"),
      qualityNoteEn: foundationFinishRoute
          ? "This week uses the foundation / finish route: E running, strides, and a long run capped at 30%; shortened Speed, Strength, and Tempo sessions are not labeled as Hansons Classic SOS."
          : getClassicQualityNote(race, normalizedLevel, week, workouts, "en"),
      goalTimeSeconds: specificPacePlan.goalTimeSeconds,
      hasExplicitGoalTime: specificPacePlan.hasExplicitGoalTime,
      currentEquivalentTimeSeconds: specificPacePlan.currentEquivalentTimeSeconds,
      currentEquivalentPaceSecondsPerKm: roundTo(specificPacePlan.currentPaceSecondsPerKm, 1),
      goalPaceSecondsPerKm: roundTo(specificPacePlan.goalPaceSecondsPerKm, 1),
      specificPaceSecondsPerKm: roundTo(specificPacePlan.specificPaceSecondsPerKm, 1),
      goalGapSecondsPerKm: roundTo(specificPacePlan.goalGapSecondsPerKm, 1),
      goalGapTooLarge: specificPacePlan.goalGapTooLarge,
      goalProgressionApplied: specificPacePlan.goalProgressionApplied,
      goalProgressFraction: roundTo(specificPacePlan.goalProgressFraction, 3),
      sourceKind: foundationFinishRoute
        ? "foundation-finish-route"
        : "classic-free-plan"
    },
    taperRecommendation: raceWeek
      ? {
          automatic: true,
          zh: `${race} 比賽週：保留短量專項刺激，其餘以 E 跑或休息完成；比賽本身取代本週長跑。不要補做前一週漏掉的 SOS。`,
          en: `${race} race week: retain one short race-specific stimulus, use E running or rest otherwise, and let the race replace the long run. Do not make up missed SOS sessions.`
        }
      : null
  };
}

function getPlannedMileageKm(race, level, week, peakMileageKm) {
  const profile = classicWeeklyMiles[race][level];
  const profilePeak = Math.max(...profile);
  return roundTo(peakMileageKm * (profile[week - 1] / profilePeak), 1);
}

function getHansonsPhase(race, week, level) {
  const speedStartWeek = level === HansonsLevel.ADVANCED ? 2 : 6;
  if (week < speedStartWeek) return { id: "foundation", zh: "基礎跑量", en: "Foundation mileage" };
  if (week <= 10) return { id: "speed", zh: "Speed 速度期", en: "Speed phase" };
  if (week <= 17) return { id: "strength", zh: "Strength 專項耐力期", en: "Strength phase" };
  return { id: "race", zh: "比賽週", en: "Race week" };
}

function getClassicQualityNote(race, level, week, workouts, locale) {
  const isZh = locale === "zh";
  if (week === 18) {
    return isZh
      ? "比賽週：取消完整間歇與 Tempo，讓比賽取代本週主要專項刺激。"
      : "Race week: full intervals and Tempo are removed so the race becomes the week's primary specific stimulus.";
  }

  const tempoName = race === HansonsRace.HALF_MARATHON
    ? (isZh ? "目標 HMP Tempo" : "goal-HMP Tempo")
    : (isZh ? "目標 MP Tempo" : "goal-MP Tempo");
  const intervalName = week <= 10
    ? (isZh ? "Speed 間歇（5K–10K 配速）" : "Speed intervals at 5K-10K pace")
    : race === HansonsRace.HALF_MARATHON
      ? level === HansonsLevel.ADVANCED
        ? (isZh ? "Strength 長間歇（10K 配速）" : "Strength long intervals at 10K pace")
        : (isZh ? "Strength 長間歇（HMP 每英里快 10 秒）" : "Strength long intervals at HMP minus 10 sec/mi")
      : (isZh ? "Strength 長間歇（MP 每英里快 10 秒）" : "Strength long intervals at MP minus 10 sec/mi");

  if (workouts.primary && workouts.secondary) {
    return isZh
      ? `本週兩堂主課：星期二 ${intervalName}；星期四 ${tempoName}。間歇距離、組數與配速會隨 Speed／Strength 週期切換。`
      : `Two SOS sessions this week: Tuesday ${intervalName}; Thursday ${tempoName}. Interval distance, repetitions, and pace change with the Speed/Strength cycle.`;
  }
  if (workouts.primary) {
    return isZh
      ? `官方 Speed 導入週：星期二先做 ${intervalName}；星期四 Tempo 會在下一階段加入。`
      : `Official Speed introduction week: Tuesday starts with ${intervalName}; Thursday Tempo is added in the next stage.`;
  }
  if (workouts.secondary) {
    return isZh
      ? `官方 Tempo 導入週：星期四先做 ${tempoName}；完整的星期二間歇會在下一週加入。`
      : `Official Tempo introduction week: Thursday starts with ${tempoName}; the full Tuesday interval session is added next week.`;
  }
  return isZh
    ? "官方基礎週：本週尚未進入兩堂主課，先用 E 跑建立可承受後續 Speed＋Tempo 的跑量。"
    : "Official foundation week: the two-SOS structure has not started yet; E running prepares the athlete for the later Speed + Tempo load.";
}

function buildClassicWorkouts({
  race,
  level,
  week,
  qualityScale,
  unitSystem,
  paces,
  publishedDayMiles,
  allowPrimaryQuality,
  allowSecondaryQuality
}) {
  const primaryWarmupCooldownKm = 3 * KM_PER_MILE;
  const tempoWarmupCooldownKm = (race === HansonsRace.HALF_MARATHON ? 3 : 2) * KM_PER_MILE;
  const speedStartWeek = level === HansonsLevel.ADVANCED
    ? 2
    : race === HansonsRace.HALF_MARATHON
      ? 6
      : 6;
  const speedEndWeek = 10;
  let primary = null;

  if (allowPrimaryQuality && week >= speedStartWeek && week <= speedEndWeek) {
    const progression = race === HansonsRace.HALF_MARATHON
      ? halfMarathonSpeedProgressions[level]
      : marathonSpeedProgressions[level];
    const template = progression[week - speedStartWeek];
    primary = repeatWorkout({
      template,
      qualityScale,
      unitSystem,
      warmupCooldownKm: primaryWarmupCooldownKm,
      adaptRepDistance: false,
      paceRows: [paces.fiveToTenK],
      zone: "I",
      nameZh: "Speed：5K–10K 配速間歇",
      nameEn: "Speed: 5K-10K pace intervals"
    });
  } else if (allowPrimaryQuality && week >= 11 && week <= 17) {
    const template = strengthProgression[week - 11];
    const paceRows = race === HansonsRace.HALF_MARATHON
      ? [level === HansonsLevel.ADVANCED ? paces.tenK : paces.hmpMinus]
      : [paces.mpMinus];
    primary = repeatWorkout({
      template,
      qualityScale,
      unitSystem,
      warmupCooldownKm: primaryWarmupCooldownKm,
      paceRows,
      zone: "I",
      nameZh: race === HansonsRace.HALF_MARATHON
        ? "Strength：半馬專項長間歇"
        : "Strength：馬拉松專項長間歇",
      nameEn: race === HansonsRace.HALF_MARATHON
        ? "Strength: half-marathon-specific long repeats"
        : "Strength: marathon-specific long repeats"
    });
  }

  if (primary && qualityScale >= 0.999 && publishedDayMiles?.[1] > 0) {
    primary.plannedDistanceKm = roundTo(publishedDayMiles[1] * KM_PER_MILE, 1);
  }

  const officialTempoMiles = classicTempoMiles[race][level][week - 1];
  const secondary = allowSecondaryQuality && officialTempoMiles > 0
    ? distanceTempoWorkout({
        workDistanceKm: officialTempoMiles * KM_PER_MILE * qualityScale,
        warmupCooldownKm: tempoWarmupCooldownKm,
        unitSystem,
        paceRow: race === HansonsRace.HALF_MARATHON ? paces.hmp : paces.mp,
        zone: race === HansonsRace.HALF_MARATHON ? "T" : "M",
        nameZh: race === HansonsRace.HALF_MARATHON
          ? "Tempo：目標半馬配速"
          : "Tempo：目標馬拉松配速",
        nameEn: race === HansonsRace.HALF_MARATHON
          ? "Tempo: goal half-marathon pace"
          : "Tempo: goal marathon pace"
      })
    : null;

  if (secondary && qualityScale >= 0.999 && publishedDayMiles?.[2] > 0) {
    secondary.plannedDistanceKm = roundTo(publishedDayMiles[2] * KM_PER_MILE, 1);
  }

  return { primary, secondary };
}

function repeatWorkout({
  template,
  qualityScale,
  unitSystem,
  warmupCooldownKm = null,
  targetTotalKm = null,
  adaptRepDistance = false,
  paceRows,
  zone,
  nameZh,
  nameEn
}) {
  const desiredReps = template.reps <= 2
    ? template.reps
    : Math.max(3, Math.round(template.reps * qualityScale));
  const hasTargetTotal = Number.isFinite(targetTotalKm);
  const targetKm = hasTargetTotal ? Math.max(0, Number(targetTotalKm)) : null;
  let repDistanceKm = template.distanceKm;
  let recoveryPerRepKm = template.recoveryKm;
  let warmupAndCooldownKm = warmupCooldownKm ?? (desiredReps * template.distanceKm >= 8 ? 3 : 2);
  let reps = desiredReps;

  if (hasTargetTotal) {
    const minimumReps = Math.min(template.reps, adaptRepDistance ? 2 : 3);
    const minimumRepDistanceKm = adaptRepDistance
      ? Math.min(template.distanceKm, 1.2)
      : template.distanceKm;
    recoveryPerRepKm = adaptRepDistance
      ? Math.min(template.recoveryKm, 0.8)
      : template.recoveryKm;
    const minimumWorkAndRecoveryKm = minimumReps * minimumRepDistanceKm
      + Math.max(0, minimumReps - 1) * recoveryPerRepKm;
    warmupAndCooldownKm = Math.min(
      warmupAndCooldownKm,
      Math.max(0.8, targetKm - minimumWorkAndRecoveryKm)
    );
    let maxFittingReps = desiredReps;
    while (
      maxFittingReps > 1
      && maxFittingReps * minimumRepDistanceKm
        + Math.max(0, maxFittingReps - 1) * recoveryPerRepKm
        + warmupAndCooldownKm
        > targetKm + 1e-9
    ) {
      maxFittingReps -= 1;
    }
    reps = Math.max(1, Math.min(desiredReps, maxFittingReps));

    if (adaptRepDistance) {
      const availableWorkKm = targetKm
        - warmupAndCooldownKm
        - Math.max(0, reps - 1) * recoveryPerRepKm;
      const availablePerRepKm = Math.max(minimumRepDistanceKm, availableWorkKm / reps);
      repDistanceKm = Math.min(
        template.distanceKm,
        Math.floor(availablePerRepKm * 10) / 10
      );
    }
  }

  const workKm = roundTo(reps * repDistanceKm, 1);
  const recoveryCount = Math.max(0, reps - 1);
  const recoveryKm = roundTo(recoveryCount * recoveryPerRepKm, 1);
  const totalKm = roundTo(workKm + recoveryKm + warmupAndCooldownKm, 1);
  const repDistance = formatDistanceValue(repDistanceKm, unitSystem);
  const recovery = formatDistanceValue(recoveryPerRepKm, unitSystem);

  return qualityDay({
    zone,
    totalKm,
    workKm,
    recoveryKm,
    warmupCooldownKm: roundTo(warmupAndCooldownKm, 1),
    paceRows,
    zh: `${nameZh}：${reps} x ${repDistance}，組間 ${recovery} E 慢跑恢復；另含熱身與收操`,
    en: `${nameEn}: ${reps} x ${repDistance} with ${recovery} E jog between reps, plus warm-up and cooldown`
  });
}

function distanceTempoWorkout({
  workDistanceKm,
  warmupCooldownKm = null,
  targetTotalKm = null,
  unitSystem,
  paceRow,
  zone,
  nameZh,
  nameEn
}) {
  const hasTargetTotal = Number.isFinite(targetTotalKm);
  const targetKm = hasTargetTotal ? Math.max(0, Number(targetTotalKm)) : null;
  const desiredWorkKm = Math.max(2, workDistanceKm);
  let warmupAndCooldownKm = warmupCooldownKm ?? (desiredWorkKm >= 8 ? 3 : 2);
  let roundedWorkKm;

  if (hasTargetTotal) {
    const workCapacityKm = Math.max(2, targetKm - warmupAndCooldownKm);
    roundedWorkKm = roundTo(Math.min(desiredWorkKm, workCapacityKm), 1);
    warmupAndCooldownKm = Math.min(
      warmupAndCooldownKm,
      Math.max(0.8, targetKm - roundedWorkKm)
    );
  } else {
    roundedWorkKm = roundTo(desiredWorkKm, 1);
  }

  const totalKm = roundTo(roundedWorkKm + warmupAndCooldownKm, 1);
  const workDistance = formatDistanceValue(roundedWorkKm, unitSystem);
  return qualityDay({
    zone,
    totalKm,
    workKm: roundedWorkKm,
    recoveryKm: 0,
    warmupCooldownKm: roundTo(warmupAndCooldownKm, 1),
    paceRows: [paceRow],
    zh: `${nameZh} ${workDistance}；另含 E 熱身與收操`,
    en: `${nameEn} ${workDistance}, plus E warm-up and cooldown`
  });
}

function qualityDay({
  zone,
  totalKm,
  workKm = null,
  recoveryKm = 0,
  warmupCooldownKm = 0,
  paceRows,
  zh,
  en
}) {
  return {
    zone,
    plannedDistanceKm: totalKm,
    workDistanceKm: workKm,
    recoveryDistanceKm: recoveryKm,
    warmupCooldownKm,
    paceZoneIds: [],
    customPaceRows: paceRows,
    zh,
    en
  };
}

function buildHansonsLongRun({
  race,
  level,
  week,
  qualityScale,
  plannedWeeklyMileageKm,
  unitSystem,
  paces,
  zoneById,
  distanceOverrideKm = null,
  foundationFinishRoute = false
}) {
  const isRaceWeek = week === getHansonsPlanLength(race);
  const eventKm = raceDistanceKm[race];
  const longRunLimit = 0.3;
  let distanceKm;

  if (Number.isFinite(distanceOverrideKm)) {
    distanceKm = distanceOverrideKm;
  } else if (isRaceWeek) {
    distanceKm = eventKm;
  } else {
    const officialKm = classicLongRunMiles[race][level][week - 1] * KM_PER_MILE;
    distanceKm = officialKm * qualityScale;
  }

  distanceKm = roundTo(distanceKm, 1);
  const distance = formatDistanceValue(distanceKm, unitSystem);
  const racePaceRow = race === HansonsRace.HALF_MARATHON
    ? paces.goalHmp
    : paces.goalMp;
  const easySeconds = Number(zoneById.E?.adjusted?.slower || 0);

  return {
    enDay: "Sun",
    zhDay: "日",
    zone: isRaceWeek ? (race === HansonsRace.MARATHON ? "M" : "T") : "E",
    zh: isRaceWeek
      ? `目標 ${race} 比賽 ${distance}`
      : foundationFinishRoute
        ? `基礎長跑 ${distance}：以可交談的 E 強度完成，不追求累積疲勞`
        : `累積疲勞長跑 ${distance}：以可恢復的 E 強度完成，不把它跑成測驗`,
    en: isRaceWeek
      ? `Goal ${race} race ${distance}`
      : foundationFinishRoute
        ? `Foundation long run ${distance}: stay at conversational E effort without chasing cumulative fatigue`
        : `Cumulative-fatigue long run ${distance}: stay at recoverable E effort, not race effort`,
    plannedDistanceKm: distanceKm,
    distanceRangeKm: { min: distanceKm, max: distanceKm },
    scheduleRole: "long",
    isLongRun: true,
    isPrimaryWorkout: true,
    longRunLimitPercentage: isRaceWeek || plannedWeeklyMileageKm <= 0
      ? 100
      : Math.round((distanceKm / plannedWeeklyMileageKm) * 100),
    estimatedMaxMinutes: easySeconds > 0 ? roundTo((distanceKm * easySeconds) / 60, 0) : null,
    longRunTimeLimitMinutes: null,
    paceZoneIds: isRaceWeek ? [] : ["E"],
    customPaceRows: isRaceWeek ? [racePaceRow] : [],
    zhDistanceLabel: `本課總量 ${distance}`,
    enDistanceLabel: `Session total ${distance}`
  };
}

function buildHansonsWeek({
  race,
  level,
  week,
  qualityScale,
  plannedWeeklyMileageKm,
  unitSystem,
  primary,
  secondary,
  longRun,
  phase
}) {
  const isClassic = race === HansonsRace.HALF_MARATHON || race === HansonsRace.MARATHON;
  const foundationFinishRoute = phase.id === "foundation-finish";
  const fixedKm = longRun.plannedDistanceKm + Number(primary?.plannedDistanceKm || 0) + Number(secondary?.plannedDistanceKm || 0);
  const adjustedWeeklyTotal = roundTo(Math.max(plannedWeeklyMileageKm, fixedKm), 1);
  const remainingKm = roundTo(Math.max(0, adjustedWeeklyTotal - fixedKm), 1);
  const easyKeys = isClassic
    ? ["mon", "fri", "sat", ...(primary ? [] : ["tue"]), ...(secondary ? [] : ["thu"])]
    : ["mon", "wed", "thu", "sat", ...(primary ? [] : ["tue"]), ...(secondary ? [] : ["fri"])] ;
  const classicProfile = isClassic ? classicDailyMiles[race][level][week - 1] : null;
  const classicDayIndex = { mon: 0, tue: 1, thu: 2, fri: 3, sat: 4 };
  const easyAllocations = isClassic
    ? allocateByWeights(
        remainingKm,
        easyKeys.map((key) => Number(classicProfile?.[classicDayIndex[key]] || 0) * qualityScale)
      )
    : easyKeys.map((key, index) => allocateEvenly(remainingKm, easyKeys.length, index));
  const easyDistances = Object.fromEntries(
    easyKeys.map((key, index) => [key, easyAllocations[index]])
  );
  const primaryDay = primary
    ? attachDay(primary, "Tue", "二", unitSystem)
    : easyDay("Tue", "二", easyDistances.tue || 0, unitSystem, foundationFinishRoute);
  const secondaryDayName = isClassic ? ["Thu", "四"] : ["Fri", "五"];
  const secondaryDay = secondary
    ? attachDay(secondary, secondaryDayName[0], secondaryDayName[1], unitSystem)
    : easyDay(
        secondaryDayName[0],
        secondaryDayName[1],
        easyDistances[isClassic ? "thu" : "fri"] || 0,
        unitSystem,
        !isClassic
      );

  const days = [
    longRun,
    easyDay("Mon", "一", easyDistances.mon || 0, unitSystem, !isClassic),
    primaryDay,
    isClassic
      ? restDay("Wed", "三")
      : easyDay("Wed", "三", easyDistances.wed || 0, unitSystem, false),
    isClassic
      ? secondaryDay
      : easyDay("Thu", "四", easyDistances.thu || 0, unitSystem, false),
    isClassic
      ? easyDay("Fri", "五", easyDistances.fri || 0, unitSystem, false)
      : secondaryDay,
    easyDay(
      "Sat",
      "六",
      easyDistances.sat || 0,
      unitSystem,
      foundationFinishRoute || (!isClassic && phase.id === "foundation")
    )
  ];

  const actualTotal = days.reduce((sum, day) => sum + Number(day.plannedDistanceKm || 0), 0);
  const delta = roundTo(adjustedWeeklyTotal - actualTotal, 1);
  if (Math.abs(delta) >= 0.05) {
    const receiver = days.find((day) => day.easyDistributionEligible);
    if (receiver) updateEasyDistance(receiver, receiver.plannedDistanceKm + delta, unitSystem);
  }

  return days;
}

function attachDay(workout, enDay, zhDay, unitSystem) {
  const distance = formatDistanceValue(workout.plannedDistanceKm, unitSystem);
  return {
    ...workout,
    enDay,
    zhDay,
    distanceRangeKm: { min: workout.plannedDistanceKm, max: workout.plannedDistanceKm },
    scheduleRole: "quality",
    isLongRun: false,
    isPrimaryWorkout: true,
    zhDistanceLabel: `本課總量 ${distance}（含熱身、恢復與收操）`,
    enDistanceLabel: `Session total ${distance}, including warm-up, recovery, and cooldown`
  };
}

function easyDay(enDay, zhDay, distanceKm, unitSystem, strides) {
  const distance = roundTo(Math.max(0, distanceKm), 1);
  const label = formatDistanceValue(distance, unitSystem);
  return {
    enDay,
    zhDay,
    zone: "E",
    zh: distance > 0 ? `E ${label}${strides ? " + 6–8 次 15–20 秒加速跑" : ""}` : "休息",
    en: distance > 0 ? `E ${label}${strides ? " + 6-8 x 15-20 sec strides" : ""}` : "Rest",
    plannedDistanceKm: distance,
    distanceRangeKm: { min: distance, max: distance },
    scheduleRole: "easy",
    isLongRun: false,
    isPrimaryWorkout: false,
    easyDistributionEligible: distance > 0,
    paceZoneIds: distance > 0 ? ["E"] : [],
    customPaceRows: [],
    zhDistanceLabel: distance > 0 ? `本課總量 ${label}` : "0 km",
    enDistanceLabel: distance > 0 ? `Session total ${label}` : "0 km"
  };
}

function restDay(enDay, zhDay) {
  return {
    enDay,
    zhDay,
    zone: "E",
    zh: "休息或交叉訓練",
    en: "Rest or cross-train",
    plannedDistanceKm: 0,
    distanceRangeKm: { min: 0, max: 0 },
    scheduleRole: "rest",
    isLongRun: false,
    isPrimaryWorkout: false,
    easyDistributionEligible: false,
    paceZoneIds: [],
    customPaceRows: [],
    zhDistanceLabel: "0 km",
    enDistanceLabel: "0 km"
  };
}

function updateEasyDistance(day, distanceKm, unitSystem) {
  const distance = roundTo(Math.max(0, distanceKm), 1);
  const label = formatDistanceValue(distance, unitSystem);
  day.plannedDistanceKm = distance;
  day.distanceRangeKm = { min: distance, max: distance };
  day.zh = `E ${label}`;
  day.en = `E ${label}`;
  day.zhDistanceLabel = `本課總量 ${label}`;
  day.enDistanceLabel = `Session total ${label}`;
}

function buildHansonsSpecificPacePlan({ race, level, week, vdot, goalTimeSeconds }) {
  const eventDistanceKm = raceDistanceKm[race];
  const eventDistanceMeters = eventDistanceKm * 1000;
  const currentPaceSecondsPerKm = estimateRacePaceSecondsPerKm(vdot, eventDistanceMeters);
  const currentEquivalentTimeSeconds = Math.round(currentPaceSecondsPerKm * eventDistanceKm);
  const explicitGoalSeconds = Number(goalTimeSeconds);
  const hasExplicitGoalTime = Number.isFinite(explicitGoalSeconds) && explicitGoalSeconds > 0;
  const normalizedGoalTimeSeconds = hasExplicitGoalTime
    ? Math.round(explicitGoalSeconds)
    : currentEquivalentTimeSeconds;
  const goalPaceSecondsPerKm = normalizedGoalTimeSeconds / eventDistanceKm;
  const goalGapSecondsPerKm = currentPaceSecondsPerKm - goalPaceSecondsPerKm;
  const isClassicRace = race === HansonsRace.HALF_MARATHON || race === HansonsRace.MARATHON;
  const goalGapTooLarge = isClassicRace
    && hasExplicitGoalTime
    && goalGapSecondsPerKm > TEN_SECONDS_PER_MILE_IN_SECONDS_PER_KM;
  const tempoStartIndex = isClassicRace
    ? classicTempoMiles[race][level].findIndex((miles) => miles > 0)
    : -1;
  const tempoStartWeek = tempoStartIndex >= 0 ? tempoStartIndex + 1 : 1;
  const goalProgressFraction = goalGapTooLarge
    ? week >= HANSONS_PLAN_LENGTHS[race]
      ? 1
      : clamp((week - tempoStartWeek) / Math.max(1, 17 - tempoStartWeek), 0, 1)
    : 1;
  const specificPaceSecondsPerKm = goalGapTooLarge
    ? currentPaceSecondsPerKm
      - goalGapSecondsPerKm * goalProgressFraction
    : goalPaceSecondsPerKm;

  return {
    hasExplicitGoalTime,
    goalTimeSeconds: normalizedGoalTimeSeconds,
    currentEquivalentTimeSeconds,
    currentPaceSecondsPerKm,
    goalPaceSecondsPerKm,
    goalGapSecondsPerKm,
    goalGapTooLarge,
    goalProgressFraction,
    goalProgressionApplied: goalGapTooLarge && goalProgressFraction < 1,
    specificPaceSecondsPerKm
  };
}

function buildHansonsPaces(
  vdot,
  heatMultiplier,
  unitSystem,
  zoneById,
  race,
  specificPacePlan
) {
  const seconds = {
    mile: estimateRacePaceSecondsPerKm(vdot, 1609.344),
    threeK: estimateRacePaceSecondsPerKm(vdot, 3000),
    fiveK: estimateRacePaceSecondsPerKm(vdot, 5000),
    eightK: estimateRacePaceSecondsPerKm(vdot, 8000),
    tenK: estimateRacePaceSecondsPerKm(vdot, 10000),
    hmp: estimateRacePaceSecondsPerKm(vdot, 21097.5),
    mp: estimateRacePaceSecondsPerKm(vdot, 42195)
  };
  const point = (id, zh, en, baseSecondsPerKm, adjust = true) =>
    paceRow(id, zh, en, baseSecondsPerKm, baseSecondsPerKm, adjust ? heatMultiplier : 1, unitSystem);
  const range = (id, zh, en, faster, slower, adjust = true) =>
    paceRow(id, zh, en, faster, slower, adjust ? heatMultiplier : 1, unitSystem);
  const hmpSeconds = race === HansonsRace.HALF_MARATHON
    ? specificPacePlan.specificPaceSecondsPerKm
    : seconds.hmp;
  const mpSeconds = race === HansonsRace.MARATHON
    ? specificPacePlan.specificPaceSecondsPerKm
    : seconds.mp;
  const hmpLabelZh = race === HansonsRace.HALF_MARATHON
    && specificPacePlan.goalProgressionApplied
    ? "本週漸進半馬配速"
    : "目標半馬配速";
  const hmpLabelEn = race === HansonsRace.HALF_MARATHON
    && specificPacePlan.goalProgressionApplied
    ? "This-week progressive HMP"
    : "Goal HMP";
  const mpLabelZh = race === HansonsRace.MARATHON
    && specificPacePlan.goalProgressionApplied
    ? "本週漸進馬拉松配速"
    : "目標馬拉松配速";
  const mpLabelEn = race === HansonsRace.MARATHON
    && specificPacePlan.goalProgressionApplied
    ? "This-week progressive MP"
    : "Goal MP";

  return {
    fiveK: point("5K", "5K 配速", "5K pace", seconds.fiveK),
    tenK: point("10K", "10K 配速", "10K pace", seconds.tenK),
    hmp: point("HMP", hmpLabelZh, hmpLabelEn, hmpSeconds),
    mp: point("MP", mpLabelZh, mpLabelEn, mpSeconds),
    goalHmp: point("HMP", "目標半馬配速", "Goal HMP", race === HansonsRace.HALF_MARATHON ? specificPacePlan.goalPaceSecondsPerKm : seconds.hmp),
    goalMp: point("MP", "目標馬拉松配速", "Goal MP", race === HansonsRace.MARATHON ? specificPacePlan.goalPaceSecondsPerKm : seconds.mp),
    hmpMinus: point("HMP−10", `${hmpLabelZh}每英里快 10 秒`, `${hmpLabelEn} minus 10 sec/mi`, hmpSeconds - TEN_SECONDS_PER_MILE_IN_SECONDS_PER_KM),
    mpMinus: point("MP−10", `${mpLabelZh}每英里快 10 秒`, `${mpLabelEn} minus 10 sec/mi`, mpSeconds - TEN_SECONDS_PER_MILE_IN_SECONDS_PER_KM),
    threeK: point("3K", "3K 配速", "3K pace", seconds.threeK, false),
    fiveToTenK: range("5K–10K", "5K–10K 配速", "5K-10K pace", seconds.fiveK, seconds.tenK),
    eightToTenK: range("8K–10K", "8K–10K／CV 配速", "8K-10K / CV pace", seconds.eightK, seconds.tenK),
    mileToThreeK: range("Mile–3K", "Mile–3K 配速", "Mile-3K pace", seconds.mile, seconds.threeK, false),
    lt: {
      id: "LT",
      zh: "乳酸閾值配速",
      en: "Lactate-threshold pace",
      baseSecondsPerKm: Number(zoneById.T?.base?.faster || seconds.tenK),
      base: zoneById.T?.base?.label || formatPace(seconds.tenK, unitSystem),
      adjusted: zoneById.T?.adjusted?.label || formatPace(seconds.tenK * heatMultiplier, unitSystem)
    }
  };
}

function paceRow(id, zh, en, fasterSeconds, slowerSeconds, multiplier, unitSystem) {
  return {
    id,
    zh,
    en,
    baseSecondsPerKm: (fasterSeconds + slowerSeconds) / 2,
    base: formatPaceRange(fasterSeconds, slowerSeconds, unitSystem),
    adjusted: formatPaceRange(fasterSeconds * multiplier, slowerSeconds * multiplier, unitSystem)
  };
}

function estimateRacePaceSecondsPerKm(vdot, distanceMeters) {
  let fastSeconds = (distanceMeters / 700) * 60;
  let slowSeconds = (distanceMeters / 50) * 60;

  for (let iteration = 0; iteration < 70; iteration += 1) {
    const midpoint = (fastSeconds + slowSeconds) / 2;
    const estimate = calculateVdot(distanceMeters, midpoint);
    if (estimate > vdot) fastSeconds = midpoint;
    else slowSeconds = midpoint;
  }

  return ((fastSeconds + slowSeconds) / 2) / (distanceMeters / 1000);
}

function calculateVdot(distanceMeters, seconds) {
  const minutes = seconds / 60;
  const metersPerMinute = distanceMeters / minutes;
  const oxygenCost = -4.6 + 0.182258 * metersPerMinute + 0.000104 * metersPerMinute ** 2;
  const effortFraction =
    0.8 +
    0.1894393 * Math.exp(-0.012778 * minutes) +
    0.2989558 * Math.exp(-0.1932605 * minutes);
  return oxygenCost / effortFraction;
}

function formatPaceRange(fasterSeconds, slowerSeconds, unitSystem) {
  const faster = formatPace(fasterSeconds, unitSystem);
  const slower = formatPace(slowerSeconds, unitSystem);
  return faster === slower ? faster : `${faster} - ${slower}`;
}

function formatPace(secondsPerKm, unitSystem) {
  const seconds = unitSystem === "imperial" ? secondsPerKm * KM_PER_MILE : secondsPerKm;
  const rounded = Math.max(1, Math.round(seconds));
  const minutes = Math.floor(rounded / 60);
  const remaining = String(rounded % 60).padStart(2, "0");
  return `${minutes}:${remaining} / ${unitSystem === "imperial" ? "mi" : "km"}`;
}

function formatDistanceValue(distanceKm, unitSystem) {
  const value = unitSystem === "imperial" ? distanceKm / KM_PER_MILE : distanceKm;
  const rounded = roundTo(value, 1);
  return `${Number.isInteger(rounded) ? rounded : rounded.toFixed(1)} ${unitSystem === "imperial" ? "mi" : "km"}`;
}

function allocateEvenly(totalKm, count, index) {
  if (count <= 0) return 0;
  const totalTenths = Math.round(totalKm * 10);
  const base = Math.floor(totalTenths / count);
  const remainder = totalTenths - base * count;
  return (base + (index < remainder ? 1 : 0)) / 10;
}

function allocateByWeights(totalKm, weights) {
  if (!weights.length) return [];
  const normalizedWeights = weights.map((weight) => Math.max(0, Number(weight) || 0));
  const weightTotal = normalizedWeights.reduce((sum, weight) => sum + weight, 0);
  if (weightTotal <= 0) {
    return weights.map((_, index) => allocateEvenly(totalKm, weights.length, index));
  }

  const totalTenths = Math.round(totalKm * 10);
  const raw = normalizedWeights.map((weight) => (totalTenths * weight) / weightTotal);
  const allocated = raw.map(Math.floor);
  let remainder = totalTenths - allocated.reduce((sum, value) => sum + value, 0);
  const order = raw
    .map((value, index) => ({ index, fraction: value - Math.floor(value) }))
    .sort((a, b) => b.fraction - a.fraction || a.index - b.index);
  for (let index = 0; index < remainder; index += 1) {
    allocated[order[index % order.length].index] += 1;
  }
  return allocated.map((value) => value / 10);
}

function normalizeRace(race) {
  if (race === "15K-30K") return HansonsRace.HALF_MARATHON;
  return race === HansonsRace.MARATHON
    ? HansonsRace.MARATHON
    : HansonsRace.HALF_MARATHON;
}

function normalizeLevel(level) {
  return Object.values(HansonsLevel).includes(level) ? level : HansonsLevel.BEGINNER;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, Number.isFinite(value) ? value : min));
}

function roundTo(value, digits) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}
