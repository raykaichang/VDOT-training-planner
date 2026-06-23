export const Phase = Object.freeze({
  BASE: "base",
  BUILD: "build",
  RACE_SPECIFIC: "raceSpecific",
  PEAK: "peak"
});

export const Race = Object.freeze({
  FIVE_K: "5K",
  TEN_K: "10K",
  HALF_MARATHON: "Half Marathon",
  MARATHON: "Marathon"
});

export const WorkoutType = Object.freeze({
  THRESHOLD: "Threshold",
  INTERVAL: "Interval",
  REPETITION: "Repetition",
  MARATHON_PACE: "Marathon Pace"
});

export const RotationStrategy = Object.freeze({
  CLASSIC_DANIELS: "classicDanielsProgression",
  ALTERNATING_TI_TR: "alternatingTI_TR",
  MILEAGE_ADAPTIVE: "mileageAdaptive"
});

export const StrategyLabel = Object.freeze({
  [RotationStrategy.CLASSIC_DANIELS]: {
    zh: "經典 Daniels 週期進展",
    en: "Classic Daniels Progression"
  },
  [RotationStrategy.ALTERNATING_TI_TR]: {
    zh: "T+I / T+R 交替",
    en: "Alternating T+I / T+R"
  },
  [RotationStrategy.MILEAGE_ADAPTIVE]: {
    zh: "跑量自適應",
    en: "Mileage Adaptive"
  }
});

export const UiCopy = Object.freeze({
  defaultLocale: "zh-TW",
  availableLocales: [
    { code: "zh-TW", label: "中文" },
    { code: "en", label: "EN" }
  ],
  labels: {
    title: {
      "zh-TW": "訓練課表規劃器",
      en: "Training Planner"
    },
    rotationStrategy: {
      "zh-TW": "課表輪替策略",
      en: "Workout Rotation Strategy"
    },
    languageToggle: {
      "zh-TW": "語言",
      en: "Language"
    },
    thresholdGuardrail: {
      "zh-TW": "Threshold 是所有比賽距離的主要品質課。",
      en: "Threshold remains the primary quality session for every race distance."
    }
  }
});

const ALL_RACES = Object.values(Race);
const ALL_PHASES = Object.values(Phase);
const ALL_STRATEGIES = Object.values(RotationStrategy);

export const WorkoutTemplates = Object.freeze([
  {
    id: "T_CRUISE_INTERVALS",
    type: WorkoutType.THRESHOLD,
    name: {
      zh: "T 配速巡航間歇",
      en: "Threshold Cruise Intervals"
    },
    metadata: {
      phase: ALL_PHASES,
      targetRace: ALL_RACES,
      priority: 100,
      compatibleRotationStrategy: ALL_STRATEGIES,
      minimumMileage: 0,
      maximumMileage: null,
      recoveryRule: "Keep at least one easy day before the next quality session.",
      physiologicalPurpose:
        "Raise lactate threshold and make strong aerobic running sustainable."
    }
  },
  {
    id: "T_CONTINUOUS_TEMPO",
    type: WorkoutType.THRESHOLD,
    name: {
      zh: "連續節奏跑",
      en: "Continuous Threshold Tempo"
    },
    metadata: {
      phase: [Phase.BASE, Phase.BUILD, Phase.RACE_SPECIFIC],
      targetRace: ALL_RACES,
      priority: 94,
      compatibleRotationStrategy: ALL_STRATEGIES,
      minimumMileage: 25,
      maximumMileage: null,
      recoveryRule: "Do not place after a hard long run or marathon-pace session.",
      physiologicalPurpose:
        "Build durable threshold strength with a controlled continuous stimulus."
    }
  },
  {
    id: "I_VO2MAX_REPEATS",
    type: WorkoutType.INTERVAL,
    name: {
      zh: "I 配速 VO2max 間歇",
      en: "VO2max Interval Repeats"
    },
    metadata: {
      phase: [Phase.BUILD, Phase.RACE_SPECIFIC, Phase.PEAK],
      targetRace: [Race.FIVE_K, Race.TEN_K, Race.HALF_MARATHON, Race.MARATHON],
      priority: 82,
      compatibleRotationStrategy: ALL_STRATEGIES,
      minimumMileage: 30,
      maximumMileage: null,
      recoveryRule: "Avoid scheduling within 48 hours of repetition work.",
      physiologicalPurpose:
        "Improve aerobic power, oxygen uptake, and controlled race-pace tolerance."
    }
  },
  {
    id: "I_CONTROLLED_10K_STRENGTH",
    type: WorkoutType.INTERVAL,
    name: {
      zh: "受控 10K 強度間歇",
      en: "Controlled 10K Strength Intervals"
    },
    metadata: {
      phase: [Phase.RACE_SPECIFIC, Phase.PEAK],
      targetRace: [Race.TEN_K, Race.HALF_MARATHON],
      priority: 76,
      compatibleRotationStrategy: [
        RotationStrategy.CLASSIC_DANIELS,
        RotationStrategy.MILEAGE_ADAPTIVE
      ],
      minimumMileage: 40,
      maximumMileage: null,
      recoveryRule: "Use lower volume if the previous week also contained intervals.",
      physiologicalPurpose:
        "Bridge threshold strength and race-specific aerobic power without overreaching."
    }
  },
  {
    id: "R_ECONOMY_STRIDES",
    type: WorkoutType.REPETITION,
    name: {
      zh: "R 配速跑姿經濟性訓練",
      en: "Repetition Economy Session"
    },
    metadata: {
      phase: ALL_PHASES,
      targetRace: ALL_RACES,
      priority: 72,
      compatibleRotationStrategy: ALL_STRATEGIES,
      minimumMileage: 20,
      maximumMileage: null,
      recoveryRule: "Keep full recoveries and stop before mechanics degrade.",
      physiologicalPurpose:
        "Maintain speed, neuromuscular coordination, and efficient mechanics."
    }
  },
  {
    id: "R_HILL_SPRINTS",
    type: WorkoutType.REPETITION,
    name: {
      zh: "短坡衝刺",
      en: "Short Hill Sprints"
    },
    metadata: {
      phase: [Phase.BASE, Phase.BUILD],
      targetRace: ALL_RACES,
      priority: 68,
      compatibleRotationStrategy: [
        RotationStrategy.CLASSIC_DANIELS,
        RotationStrategy.MILEAGE_ADAPTIVE
      ],
      minimumMileage: 15,
      maximumMileage: 70,
      recoveryRule: "Separate from intervals by at least two easy days.",
      physiologicalPurpose:
        "Develop power and running economy with low metabolic load."
    }
  },
  {
    id: "M_STEADY_SEGMENTS",
    type: WorkoutType.MARATHON_PACE,
    name: {
      zh: "M 配速穩定段落",
      en: "Steady Marathon-Pace Segments"
    },
    metadata: {
      phase: [Phase.BUILD, Phase.RACE_SPECIFIC, Phase.PEAK],
      targetRace: [Race.HALF_MARATHON, Race.MARATHON],
      priority: 78,
      compatibleRotationStrategy: ALL_STRATEGIES,
      minimumMileage: 45,
      maximumMileage: null,
      recoveryRule: "Do not pair with intervals unless weekly mileage supports three quality exposures.",
      physiologicalPurpose:
        "Practice sustained aerobic rhythm, fueling, and muscular endurance."
    }
  },
  {
    id: "M_LONG_RUN_FINISH",
    type: WorkoutType.MARATHON_PACE,
    name: {
      zh: "長跑後段 M 配速",
      en: "Long Run with Marathon-Pace Finish"
    },
    metadata: {
      phase: [Phase.RACE_SPECIFIC],
      targetRace: [Race.MARATHON],
      priority: 88,
      compatibleRotationStrategy: [
        RotationStrategy.CLASSIC_DANIELS,
        RotationStrategy.MILEAGE_ADAPTIVE
      ],
      minimumMileage: 60,
      maximumMileage: null,
      recoveryRule: "Follow with two easy days and avoid repetition work in the same microcycle.",
      physiologicalPurpose:
        "Build marathon-specific endurance while preserving threshold work elsewhere in the week."
    }
  }
]);

const raceWeights = Object.freeze({
  [Race.FIVE_K]: {
    [WorkoutType.THRESHOLD]: 100,
    [WorkoutType.INTERVAL]: 88,
    [WorkoutType.REPETITION]: 84,
    [WorkoutType.MARATHON_PACE]: 0
  },
  [Race.TEN_K]: {
    [WorkoutType.THRESHOLD]: 100,
    [WorkoutType.INTERVAL]: 86,
    [WorkoutType.REPETITION]: 78,
    [WorkoutType.MARATHON_PACE]: 0
  },
  [Race.HALF_MARATHON]: {
    [WorkoutType.THRESHOLD]: 100,
    [WorkoutType.INTERVAL]: 66,
    [WorkoutType.REPETITION]: 48,
    [WorkoutType.MARATHON_PACE]: 42
  },
  [Race.MARATHON]: {
    [WorkoutType.THRESHOLD]: 96,
    [WorkoutType.INTERVAL]: 42,
    [WorkoutType.REPETITION]: 34,
    [WorkoutType.MARATHON_PACE]: 100
  }
});

export function selectWorkoutPlan(input) {
  const context = normalizeContext(input);
  const candidates = WorkoutTemplates.filter((template) =>
    isTemplateEligible(template, context)
  );
  const desiredTypes = buildDesiredTypes(context);
  const qualityCapacity = getQualityCapacity(context.weeklyMileage);
  const selected = [];

  for (const type of desiredTypes) {
    if (selected.length >= qualityCapacity) break;
    const candidate = chooseBestCandidate(candidates, context, selected, type);
    if (candidate) selected.push(candidate);
  }

  if (!selected.some((template) => template.type === WorkoutType.THRESHOLD)) {
    const threshold = chooseBestCandidate(
      candidates,
      context,
      selected,
      WorkoutType.THRESHOLD
    );
    if (threshold) {
      selected.length >= qualityCapacity ? selected.splice(-1, 1, threshold) : selected.push(threshold);
    }
  }

  while (selected.length < qualityCapacity) {
    const candidate = chooseBestCandidate(candidates, context, selected);
    if (!candidate) break;
    selected.push(candidate);
  }

  return {
    locale: context.locale,
    ui: getUiModel(context.locale),
    rotationStrategy: context.rotationStrategy,
    strategyLabel: translateStrategy(context.rotationStrategy, context.locale),
    workouts: selected.map((template) => serializeWorkout(template, context.locale)),
    deferredCandidates: candidates
      .filter((template) => !selected.includes(template))
      .sort((a, b) => scoreTemplate(b, context, selected) - scoreTemplate(a, context, selected))
      .slice(0, 4)
      .map((template) => serializeWorkout(template, context.locale)),
    coachingNotes: buildCoachingNotes(context, selected)
  };
}

export function validateTemplateMetadata(templates = WorkoutTemplates) {
  const requiredMetadataFields = [
    "phase",
    "targetRace",
    "priority",
    "compatibleRotationStrategy",
    "minimumMileage",
    "maximumMileage",
    "recoveryRule",
    "physiologicalPurpose"
  ];

  return templates.map((template) => ({
    id: template.id,
    valid: requiredMetadataFields.every((field) =>
      Object.hasOwn(template.metadata, field)
    ),
    missing: requiredMetadataFields.filter(
      (field) => !Object.hasOwn(template.metadata, field)
    )
  }));
}

function normalizeContext(input = {}) {
  return {
    currentPhase: input.currentPhase ?? Phase.BASE,
    goalRace: input.goalRace ?? Race.FIVE_K,
    weeklyMileage: Number(input.weeklyMileage ?? 40),
    previousWorkouts: Array.isArray(input.previousWorkouts)
      ? input.previousWorkouts
      : [],
    rotationStrategy: input.rotationStrategy ?? RotationStrategy.CLASSIC_DANIELS,
    weekNumber: Number(input.weekNumber ?? 1),
    locale: input.locale === "en" ? "en" : UiCopy.defaultLocale
  };
}

function isTemplateEligible(template, context) {
  const metadata = template.metadata;
  return (
    metadata.phase.includes(context.currentPhase) &&
    metadata.targetRace.includes(context.goalRace) &&
    metadata.compatibleRotationStrategy.includes(context.rotationStrategy) &&
    context.weeklyMileage >= metadata.minimumMileage &&
    (metadata.maximumMileage === null || context.weeklyMileage <= metadata.maximumMileage)
  );
}

function buildDesiredTypes(context) {
  const strategyTypes = buildStrategyTypes(context);
  const raceTypes = buildRaceEmphasisTypes(context);
  return uniqueTypes([
    WorkoutType.THRESHOLD,
    ...mergeCoachPriorities(strategyTypes, raceTypes, context)
  ]);
}

function buildStrategyTypes(context) {
  if (context.rotationStrategy === RotationStrategy.ALTERNATING_TI_TR) {
    return [
      WorkoutType.THRESHOLD,
      context.weekNumber % 2 === 1
        ? WorkoutType.INTERVAL
        : WorkoutType.REPETITION
    ];
  }

  if (context.rotationStrategy === RotationStrategy.MILEAGE_ADAPTIVE) {
    const secondary = chooseLeastRecentType(context, [
      WorkoutType.INTERVAL,
      WorkoutType.REPETITION
    ]);

    if (context.weeklyMileage < 40) {
      return [WorkoutType.THRESHOLD, secondary];
    }

    if (context.weeklyMileage <= 70) {
      return [WorkoutType.THRESHOLD, secondary, WorkoutType.MARATHON_PACE];
    }

    return [
      WorkoutType.THRESHOLD,
      context.goalRace === Race.MARATHON ? WorkoutType.MARATHON_PACE : secondary,
      context.goalRace === Race.MARATHON ? secondary : WorkoutType.MARATHON_PACE
    ];
  }

  if (context.currentPhase === Phase.BASE) {
    return [WorkoutType.THRESHOLD, WorkoutType.REPETITION];
  }

  if (context.currentPhase === Phase.BUILD) {
    return [WorkoutType.THRESHOLD, WorkoutType.INTERVAL];
  }

  if (context.currentPhase === Phase.PEAK) {
    return [
      WorkoutType.THRESHOLD,
      chooseLeastRecentType(context, [WorkoutType.INTERVAL, WorkoutType.REPETITION])
    ];
  }

  return [
    WorkoutType.THRESHOLD,
    chooseLeastRecentType(context, [
      WorkoutType.INTERVAL,
      WorkoutType.REPETITION,
      WorkoutType.MARATHON_PACE
    ])
  ];
}

function buildRaceEmphasisTypes(context) {
  if (context.goalRace === Race.FIVE_K || context.goalRace === Race.TEN_K) {
    return [
      WorkoutType.THRESHOLD,
      WorkoutType.INTERVAL,
      WorkoutType.REPETITION
    ];
  }

  if (context.goalRace === Race.HALF_MARATHON) {
    return [
      WorkoutType.THRESHOLD,
      chooseLeastRecentType(context, [WorkoutType.INTERVAL, WorkoutType.REPETITION]),
      WorkoutType.MARATHON_PACE
    ];
  }

  return [
    WorkoutType.MARATHON_PACE,
    WorkoutType.THRESHOLD,
    chooseLeastRecentType(context, [WorkoutType.INTERVAL, WorkoutType.REPETITION])
  ];
}

function mergeCoachPriorities(strategyTypes, raceTypes, context) {
  if (context.goalRace === Race.MARATHON) {
    return uniqueTypes([
      WorkoutType.MARATHON_PACE,
      ...strategyTypes,
      ...raceTypes
    ]);
  }

  if (context.goalRace === Race.HALF_MARATHON) {
    return uniqueTypes([
      ...strategyTypes,
      ...raceTypes
    ]);
  }

  return uniqueTypes([
    ...strategyTypes,
    ...raceTypes
  ]);
}

function getQualityCapacity(weeklyMileage) {
  if (weeklyMileage < 30) return 1;
  if (weeklyMileage < 75) return 2;
  return 3;
}

function chooseBestCandidate(candidates, context, selected, type = null) {
  const selectedIds = new Set(selected.map((template) => template.id));
  const pool = candidates.filter(
    (template) =>
      !selectedIds.has(template.id) &&
      (!type || template.type === type) &&
      !selected.some((chosen) => chosen.type === template.type && template.type !== WorkoutType.THRESHOLD)
  );

  if (pool.length === 0) return null;

  return pool
    .map((template) => ({
      template,
      score: scoreTemplate(template, context, selected)
    }))
    .sort((a, b) => b.score - a.score)[0].template;
}

function scoreTemplate(template, context, selected) {
  const recent = context.previousWorkouts.slice(-4);
  const sameTypeCount = recent.filter((workout) => workout.type === template.type).length;
  const sameTemplateCount = recent.filter((workout) => workout.id === template.id).length;
  const alreadySelectedType = selected.some((workout) => workout.type === template.type);
  const raceWeight = raceWeights[context.goalRace]?.[template.type] ?? 0;
  const mileageWindowBonus = getMileageWindowBonus(template, context.weeklyMileage);
  const thresholdPrimaryBonus = template.type === WorkoutType.THRESHOLD ? 30 : 0;
  const repetitionPenalty = template.type === WorkoutType.THRESHOLD ? 8 : 24;

  return (
    template.metadata.priority +
    raceWeight +
    mileageWindowBonus +
    thresholdPrimaryBonus -
    sameTypeCount * repetitionPenalty -
    sameTemplateCount * 40 -
    (alreadySelectedType ? 30 : 0)
  );
}

function getMileageWindowBonus(template, weeklyMileage) {
  const minimum = template.metadata.minimumMileage;
  const maximum = template.metadata.maximumMileage ?? Math.max(weeklyMileage, 120);
  const middle = (minimum + maximum) / 2;
  const distanceFromMiddle = Math.abs(weeklyMileage - middle);
  return Math.max(0, 20 - distanceFromMiddle / 4);
}

function chooseLeastRecentType(context, types) {
  const recent = context.previousWorkouts.slice(-4);
  return types
    .map((type) => ({
      type,
      count: recent.filter((workout) => workout.type === type).length
    }))
    .sort((a, b) => a.count - b.count)[0].type;
}

function uniqueTypes(types) {
  return [...new Set(types.filter(Boolean))];
}

function translateStrategy(strategy, locale) {
  const labels = StrategyLabel[strategy] ?? StrategyLabel[RotationStrategy.CLASSIC_DANIELS];
  return locale === "en" ? labels.en : labels.zh;
}

function getUiModel(locale) {
  return {
    defaultLocale: UiCopy.defaultLocale,
    activeLocale: locale,
    availableLocales: UiCopy.availableLocales,
    labels: Object.fromEntries(
      Object.entries(UiCopy.labels).map(([key, value]) => [
        key,
        value[locale] ?? value[UiCopy.defaultLocale]
      ])
    )
  };
}

function serializeWorkout(template, locale) {
  return {
    id: template.id,
    type: template.type,
    name: locale === "en" ? template.name.en : template.name.zh,
    metadata: template.metadata
  };
}

function buildCoachingNotes(context, selected) {
  const notes = [
    context.locale === "en"
      ? "Threshold is protected as the primary quality stimulus."
      : "Threshold 會被保留為主要品質刺激。"
  ];

  if (context.currentPhase === Phase.RACE_SPECIFIC) {
    notes.push(
      context.locale === "en"
        ? "Race-specific work is weighted by event needs and recent history, not by a fixed pace bundle."
        : "比賽專項訓練會依目標賽事與近期課表加權，不使用固定配速組合。"
    );
  }

  if (selected.length < 2) {
    notes.push(
      context.locale === "en"
        ? "Weekly mileage limits the plan to one quality exposure."
        : "目前週跑量較低，因此本週只安排一個品質刺激。"
    );
  }

  return notes;
}
