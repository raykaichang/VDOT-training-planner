import {
  KM_PER_MILE,
  TargetRace,
  TrainingCycle,
  UnitSystem,
  calculatePaceModel,
  calculateVdotFromRaceResult
} from "../src/training-planner/paceCalculator.mjs";
import { segmentsToCsv } from "../src/gpx-effort/csv.mjs";
import { parseGpxTrackPoints } from "../src/gpx-effort/gpxParser.mjs";
import { RaceType } from "../src/gpx-effort/heat.mjs";
import {
  formatDuration as formatGpxDuration,
  formatPace as formatGpxPace,
  formatPaceDelta as formatGpxPaceDelta,
  parsePaceToSeconds as parseGpxPace
} from "../src/gpx-effort/pace.mjs";
import {
  createSegments,
  prepareRoutePoints,
  summarizeRoute
} from "../src/gpx-effort/segmentation.mjs";
import { gpxCatalog } from "../src/gpx-catalog/catalog.mjs";
import { downloadGpxFile } from "../src/gpx-catalog/download.mjs";
import { analyzeElevationBySegments } from "../src/gpx-catalog/elevationAnalysis.mjs";
import { filterCatalogItems } from "../src/gpx-catalog/filters.mjs";
import {
  formatDistanceKm,
  formatMeters,
  formatPercent as formatCatalogPercent,
  sourceTypeLabel
} from "../src/gpx-catalog/format.mjs";
import { parseGpxText } from "../src/gpx-catalog/parser.mjs";

const copy = {
  "zh-TW": {
    appTitle: "VDOT 配速工具",
    subtitle:
      "輸入 VDOT、週跑量、溫度與濕度，取得能力對應的訓練配速與熱環境調整。",
    language: "語言",
    inputs: "跑者資料",
    toolMode: "功能模式",
    plannerMode: "VDOT 配速",
    trainingPlanMode: "訓練課表",
    heatEquivalentMode: "熱適應換算",
    toolSection: "工具",
    collapseSidebar: "收合側邊欄",
    expandSidebar: "展開側邊欄",
    themeMode: "外觀",
    darkTheme: "深色",
    lightTheme: "淺色",
    vdot: "VDOT",
    vdotSource: "能力來源",
    directVdot: "直接輸入 VDOT",
    raceResult: "近期成績換算",
    raceDistance: "比賽距離",
    raceTime: "最佳成績",
    converterType: "換算類型",
    paceConverter: "配速換算",
    raceConverter: "成績換算",
    converterDirection: "換算方向",
    coolToHot: "理想基準 → 熱環境",
    hotToCool: "熱環境 → 理想基準",
    baselinePace: "基準配速",
    heatEnvironmentPace: "熱環境配速",
    estimatedBaselinePace: "推估基準配速",
    equivalentRace: "理想成績",
    heatEnvironmentResult: "熱環境成績",
    equivalentResult: "等效換算結果",
    equivalentPace: "熱環境等強配速",
    heatEquivalentTime: "熱環境等效成績",
    baselineTime: "基準成績",
    averagePace: "平均配速",
    converterAssumption:
      "假設輸入值是在涼爽或基準條件下的目標；下方用目前溫濕度估算相同主觀強度在熱環境下的大約配速或成績。每個人對熱的生理反應與熱適應程度不同，結果僅供參考。",
    reverseConverterAssumption:
      "假設輸入值是在目前溫濕度下實際可跑出的配速或成績；下方會回推涼爽或基準條件下大約相當的配速或成績。每個人對熱的生理反應與熱適應程度不同，結果僅供參考。",
    hours: "時",
    minutes: "分",
    seconds: "秒",
    estimatedVdot: "換算 VDOT",
    vdotEquivalentTitle: "該 VDOT 等效成績",
    vdotEquivalentNote:
      "原始等效成績以 Daniels VDOT 比賽成績公式反推；熱影響後成績使用目前溫濕度的配速倍率估算，作為同等努力參考。",
    heatAdjustedEquivalentResult: "熱影響後成績",
    heatAdjustedEquivalentPace: "熱影響後配速",
    finishTime: "完賽時間",
    estimatedPace: "平均配速",
    invalidRaceTime: "請輸入有效的時分秒。",
    weeklyMileage: "週跑量",
    unitSystem: "單位",
    metricUnit: "公制 km",
    imperialUnit: "英制 mile",
    targetRace: "目前專項",
    trainingCycle: "訓練週期",
    trainingCycleHelp:
      "四期週期用來決定本週品質課重點。以 24 週備賽為例，各期約 6 週；若只有 16-18 週，常壓縮為各 4-5 週。Phase I 基礎與防傷；Phase II 初始品質；Phase III 專項品質；Phase IV 保留關鍵刺激並降低疲勞。",
    temperature: "溫度",
    humidity: "濕度",
    kmPerWeek: "km / 週",
    miPerWeek: "mi / 週",
    celsius: "°C",
    percent: "%",
    paceZones: "能力配速",
    vdotPaces: "VDOT 配速",
    basePace: "原始配速",
    adjustedPace: "熱環境調整後配速",
    basePaceShort: "未調整",
    adjustedPaceShort: "調整後",
    rTargetPaceShort: "R 不降速",
    rTargetPace: "R 不降速目標",
    easyPaceGuidance:
      "E 跑的目的在於用可恢復、可交談的強度累積有氧跑量，而不是精準刺激單一生理門檻，所以能依疲勞、天氣與地形在一段配速範圍內調整。",
    rHeatGuidance:
      "R 是短距離、以順暢快速與技術品質為主，熱天不降目標配速，改延長恢復、降低組數或改到較涼時段。",
    rReferences: [
      "Daniels 第 4 版：R 訓練原則",
      "Racinais et al. 2015, BJSM, DOI: 10.1136/bjsports-2015-094915",
      "Nybo, Rasmussen & Sawka 2014, Performance in the Heat-Physiological Factors of Importance for Hyperthermia-Induced Fatigue, Comprehensive Physiology, DOI: 10.1002/cphy.c130012"
    ],
    heatAdjustment: "熱環境調整",
    slowerBy: "配速增加",
    heatIndex: "Heat Index",
    speedLoss: "速度下降",
    dewPoint: "露點",
    heatFormulaTitle: "熱環境估算式",
    heatFormula:
      "配速調整沿用 Running Writings / John Davis 2025 開源模型邏輯：以氣溫與相對濕度查詢二維 logspeed_adjust 表，並用雙線性插值估算熱環境下的速度變化。若 log 速度調整值為 a，熱環境調整後配速 = 原始配速 / exp(a)。本工具採用其 coarse v2025-09-04 溫濕度表；Heat Index 仍顯示為熱壓力輔助指標，但不再作為主要降速模型。此估算主要適用於馬拉松、M 配速長跑與長時間穩定跑；短 T/I/R 不宜完整照搬。恢復時間採安全規則：Heat Index 24-29°C 約 +10%，29-35°C 約 +15-25%，35°C 以上以 +25% 為上限並優先考慮減量、改課或移至較涼時段。R 不套用配速降速，只調整恢復或總量。每個人對熱的生理反應與熱適應程度不同，結果僅供參考。",
    heatReferencesTitle: "熱環境參考文獻",
    heatReferences: [
      "Running Writings / John Davis 2025 heat-adjusted pace app：<a href=\"https://apps.runningwritings.com/heat-adjusted-pace/\" target=\"_blank\" rel=\"noreferrer\">https://apps.runningwritings.com/heat-adjusted-pace/</a>",
      "Running Writings model source code and data, MIT License：<a href=\"https://github.com/johnjdavisiv/heat-adjusted-pace\" target=\"_blank\" rel=\"noreferrer\">https://github.com/johnjdavisiv/heat-adjusted-pace</a>",
      "Mantzios et al. 2022, marathon weather/performance dataset used by Running Writings, Med Sci Sports Exerc, PMID: 34652333.",
      "Racinais et al. 2015, Consensus recommendations on training and competing in the heat, BJSM, DOI: 10.1136/bjsports-2015-094915",
      "Nybo, Rasmussen & Sawka 2014, Performance in the Heat-Physiological Factors of Importance for Hyperthermia-Induced Fatigue, Comprehensive Physiology, DOI: 10.1002/cphy.c130012"
    ],
    mileageClass: "跑量課表級距",
    availableQuality: "可開品質課",
    weeklyPlan: "本週建議安排",
    weeklyPlanNote: "依 Daniels 第 4 版賽事分法、四期週期與跑量動態安排；T 閾值訓練固定保留。",
    switchWorkout: "換堂課",
    coachPick: "教練建議",
    skipEasyRun: "今天不跑",
    restoreEasyRun: "恢復跑步",
    workoutExamples: "跑量可用課表",
    draggableWorkoutHint: "提示：課表卡片可左右拖曳交換順序。",
    recovery: "恢復",
    recoveryHot: "熱天恢復",
    totalTime: "總時間",
    split400: "400m",
    split200: "200m",
    noteTitle: "使用提醒",
    note:
      "Daniels VDOT 表通常把 M/T/I/R 顯示為單一目標配速；本分支也改用單點配速。E 保留範圍，因為 E 跑的目的在於用可恢復、可交談的強度累積有氧跑量，而不是精準刺激單一生理門檻，所以能依疲勞、天氣與地形在一段配速範圍內調整。",
    sourceTitle: "資料來源與計算方式",
    sourceNote:
      "配速推算參考 Jack Daniels《Daniels' Running Formula》第 4 版的 VDOT 架構、E/M/T/I/R 訓練強度概念與四期週期。先前用強度比例帶呈現 E/M/T/I/R 區間時，相鄰區間可能因比例帶接近、四捨五入與熱天降速後看起來重合；這不是 Daniels VDOT 表本身有多個 T/I/R 配速，而是區間呈現造成的視覺結果。現在 E 仍以 59-74% VDOT 的範圍估算；M/T/I/R 改用單點目標強度，並以跑步氧耗方程 VO2 = -4.60 + 0.182258v + 0.000104v² 反解速度後換算成配速。熱天配速調整保留在 E/M/T/I；R 的處理方式請見下方 R 反覆跑卡片。課量上限以 Daniels 原則估算：T 上限為週跑量 10%，但不超過 24 km（15 mi）；I 上限為週跑量 8%，但不超過 10 km；R 上限為週跑量 5%，但不超過 8 km（5 mi）。",
    zoneNames: {
      E: "E 輕鬆跑",
      M: "M 馬拉松配速",
      T: "T 乳酸閾值",
      I: "I 間歇",
      R: "R 反覆跑"
    },
    classNames: {
      A: "A 級距",
      B: "B 級距",
      C: "C 級距",
      D: "D 級距",
      E: "E 級距"
    },
    targetRaceNames: {
      "800m": "800 公尺",
      "1500m-2mi": "1500 公尺到 2 英里",
      "5K-10K": "5K / 10K",
      "Cross Country": "越野賽",
      "15K-30K": "15K 到 30K / 半馬",
      Marathon: "馬拉松"
    },
    cycleNames: {
      phaseI: "Phase I 基礎與防傷",
      phaseII: "Phase II 初始品質",
      phaseIII: "Phase III 轉換品質",
      phaseIV: "Phase IV 最終品質"
    }
  },
  en: {
    appTitle: "VDOT Pace Zone Tool",
    subtitle:
      "Enter VDOT, mileage, temperature, and humidity to estimate training paces with heat adjustment.",
    language: "Language",
    inputs: "Runner Inputs",
    toolMode: "Tool Mode",
    plannerMode: "VDOT Paces",
    trainingPlanMode: "Training Plan",
    heatEquivalentMode: "Heat Adaptation Converter",
    toolSection: "Tools",
    collapseSidebar: "Collapse sidebar",
    expandSidebar: "Expand sidebar",
    themeMode: "Theme",
    darkTheme: "Dark",
    lightTheme: "Light",
    vdot: "VDOT",
    vdotSource: "Ability Source",
    directVdot: "Enter VDOT",
    raceResult: "Convert Race Result",
    raceDistance: "Race Distance",
    raceTime: "Best Time",
    converterType: "Converter Type",
    paceConverter: "Pace Converter",
    raceConverter: "Race Result Converter",
    converterDirection: "Conversion Direction",
    coolToHot: "Baseline → Heat",
    hotToCool: "Heat → Baseline",
    baselinePace: "Baseline Pace",
    heatEnvironmentPace: "Hot-condition Pace",
    estimatedBaselinePace: "Estimated Baseline Pace",
    equivalentRace: "Goal Result",
    heatEnvironmentResult: "Hot-condition Result",
    equivalentResult: "Equivalent Result",
    equivalentPace: "Heat-Equivalent Pace",
    heatEquivalentTime: "Heat-Equivalent Result",
    baselineTime: "Baseline Result",
    averagePace: "Average Pace",
    converterAssumption:
      "Assumption: the input is a cool-condition or baseline target. The result estimates the pace or finish time for roughly the same effort under the selected temperature and humidity. Heat response and heat adaptation vary by runner, so use the estimate as a reference only.",
    reverseConverterAssumption:
      "Assumption: the input is what you can run under the selected hot condition. The result estimates the roughly equivalent cool-condition or baseline pace/result. Heat response and heat adaptation vary by runner, so use the estimate as a reference only.",
    hours: "Hr",
    minutes: "Min",
    seconds: "Sec",
    estimatedVdot: "Estimated VDOT",
    vdotEquivalentTitle: "Equivalent Race Results",
    vdotEquivalentNote:
      "Baseline equivalents are estimated from the Daniels VDOT race-performance equation; heat-adjusted results apply the current temperature/humidity pace multiplier as an equal-effort reference.",
    heatAdjustedEquivalentResult: "Heat-adjusted result",
    heatAdjustedEquivalentPace: "Heat-adjusted pace",
    finishTime: "Finish Time",
    estimatedPace: "Average Pace",
    invalidRaceTime: "Enter a valid race time.",
    weeklyMileage: "Weekly Mileage",
    unitSystem: "Units",
    metricUnit: "Metric km",
    imperialUnit: "Imperial mile",
    targetRace: "Target Event",
    trainingCycle: "Training Cycle",
    trainingCycleHelp:
      "The four-phase cycle changes the weekly quality emphasis. In a 24-week build, each phase is roughly 6 weeks; a 16-18 week build often compresses phases to about 4-5 weeks. Phase I builds durability, Phase II adds initial quality, Phase III shifts event-specific, and Phase IV keeps key stimulus while reducing fatigue.",
    temperature: "Temperature",
    humidity: "Humidity",
    kmPerWeek: "km / week",
    miPerWeek: "mi / week",
    celsius: "°C",
    percent: "%",
    paceZones: "Ability-Based Paces",
    vdotPaces: "VDOT Paces",
    basePace: "Base Pace",
    adjustedPace: "Heat-Adjusted Pace",
    basePaceShort: "Base",
    adjustedPaceShort: "Adjusted",
    rTargetPaceShort: "R target",
    rTargetPace: "R target pace",
    easyPaceGuidance:
      "E running uses a recoverable, conversational effort to build aerobic volume rather than target one precise physiological threshold, so the pace can flex with fatigue, weather, and terrain.",
    rHeatGuidance:
      "R is short, smooth-fast mechanics work. Hot days do not slow the R target pace; extend recovery, reduce reps, or move the session cooler instead.",
    rReferences: [
      "Daniels 4th ed.: R-training principles",
      "Racinais et al. 2015, BJSM, DOI: 10.1136/bjsports-2015-094915",
      "Nybo, Rasmussen & Sawka 2014, Performance in the Heat-Physiological Factors of Importance for Hyperthermia-Induced Fatigue, Comprehensive Physiology, DOI: 10.1002/cphy.c130012"
    ],
    heatAdjustment: "Heat Adjustment",
    slowerBy: "Pace increase",
    heatIndex: "Heat Index",
    speedLoss: "Speed loss",
    dewPoint: "Dew Point",
    heatFormulaTitle: "Heat Adjustment Formula",
    heatFormula:
      "Pace adjustment follows the open-source Running Writings / John Davis 2025 model logic: air temperature and relative humidity are looked up in a 2D logspeed_adjust table, then bilinearly interpolated. If the log-speed adjustment is a, heat-adjusted pace = base pace / exp(a). This app uses the coarse v2025-09-04 temperature/humidity table. Heat Index is still shown as a heat-stress context metric, but it is no longer the primary slowdown model. This estimate is most appropriate for marathon racing, M-pace long runs, and long steady running; short T/I/R work should not inherit the full marathon adjustment. Recovery uses a safety rule: Heat Index 24-29°C about +10%, 29-35°C about +15-25%, and 35°C+ capped at +25% while prioritizing lower volume, workout changes, or cooler timing. R pace is not slowed; adjust recovery or volume instead. Heat response and heat adaptation vary by runner, so use the estimate as a reference only.",
    heatReferencesTitle: "Heat References",
    heatReferences: [
      "Running Writings / John Davis 2025 heat-adjusted pace app: <a href=\"https://apps.runningwritings.com/heat-adjusted-pace/\" target=\"_blank\" rel=\"noreferrer\">https://apps.runningwritings.com/heat-adjusted-pace/</a>",
      "Running Writings model source code and data, MIT License: <a href=\"https://github.com/johnjdavisiv/heat-adjusted-pace\" target=\"_blank\" rel=\"noreferrer\">https://github.com/johnjdavisiv/heat-adjusted-pace</a>",
      "Mantzios et al. 2022, marathon weather/performance dataset used by Running Writings, Med Sci Sports Exerc, PMID: 34652333.",
      "Racinais et al. 2015, Consensus recommendations on training and competing in the heat, BJSM, DOI: 10.1136/bjsports-2015-094915",
      "Nybo, Rasmussen & Sawka 2014, Performance in the Heat-Physiological Factors of Importance for Hyperthermia-Induced Fatigue, Comprehensive Physiology, DOI: 10.1002/cphy.c130012"
    ],
    mileageClass: "Mileage Class",
    availableQuality: "Available Quality Work",
    weeklyPlan: "Suggested Week",
    weeklyPlanNote: "Built from Daniels 4th ed. event groups, phase logic, and mileage. Threshold stays in every plan.",
    switchWorkout: "Swap Workout",
    coachPick: "Coach Pick",
    skipEasyRun: "Skip Run",
    restoreEasyRun: "Restore Run",
    workoutExamples: "Mileage-Based Workouts",
    draggableWorkoutHint: "Tip: drag workout cards sideways to swap their order.",
    recovery: "Recovery",
    recoveryHot: "Hot Recovery",
    totalTime: "Total Time",
    split400: "400m",
    split200: "200m",
    noteTitle: "Reminder",
    note:
      "Daniels VDOT tables generally present M/T/I/R as point target paces, so this branch now displays them as point targets. E remains a range because easy running is meant to accumulate aerobic volume at a recoverable, conversational effort rather than hit one precise physiological threshold; it can flex with fatigue, weather, and terrain.",
    sourceTitle: "Source & Calculation",
    sourceNote:
      "The pace model references Jack Daniels' Daniels' Running Formula, 4th ed., for the VDOT framework, E/M/T/I/R intensity concepts, and four-phase planning. The earlier range-based display could make adjacent zones appear to overlap because intensity bands were close, values were rounded, and heat adjustment slowed E/M/T/I paces. That overlap was a display choice, not a claim that the VDOT table has multiple T/I/R paces for one VDOT. E is still estimated as a 59-74% VDOT range; M/T/I/R now use point target intensities and the running oxygen-cost equation VO2 = -4.60 + 0.182258v + 0.000104v² to solve velocity and convert it to pace. Heat/humidity pace adjustment is still applied to E/M/T/I only; R guidance is shown on the R Repetition card below. Daniels-style volume guardrails: T is capped at 10% of weekly mileage and not more than 24 km (15 mi); I is capped at 8% and not more than 10 km; R is capped at 5% and not more than 8 km (5 mi).",
    zoneNames: {
      E: "E Easy",
      M: "M Marathon",
      T: "T Threshold",
      I: "I Interval",
      R: "R Repetition"
    },
    classNames: {
      A: "Class A",
      B: "Class B",
      C: "Class C",
      D: "Class D",
      E: "Class E"
    },
    targetRaceNames: {
      "800m": "800 m",
      "1500m-2mi": "1500 m to 2 mi",
      "5K-10K": "5K / 10K",
      "Cross Country": "Cross Country",
      "15K-30K": "15K to 30K / Half",
      Marathon: "Marathon"
    },
    cycleNames: {
      phaseI: "Phase I Foundation",
      phaseII: "Phase II Initial Quality",
      phaseIII: "Phase III Transition Quality",
      phaseIV: "Phase IV Final Quality"
    }
  }
};

const zoneTone = {
  E: "easy",
  M: "marathon",
  T: "threshold",
  I: "interval",
  R: "repetition"
};

const raceDistanceOptions = [
  { meters: 3000, zh: "3K", en: "3K" },
  { meters: 5000, zh: "5K", en: "5K" },
  { meters: 10000, zh: "10K", en: "10K" },
  { meters: 21097.5, zh: "半程馬拉松", en: "Half Marathon" },
  { meters: 42195, zh: "馬拉松", en: "Marathon" }
];

const equivalentRaceOptions = raceDistanceOptions.filter(
  (optionItem) => optionItem.meters >= 5000
);

const vdotEquivalentRaceMeters = new Set([3000, 5000, 10000, 21097.5, 42195]);

const targetRaceOptions = [
  TargetRace.EIGHT_HUNDRED,
  TargetRace.MILE_TO_TWO_MILE,
  TargetRace.FIVE_TEN_K,
  TargetRace.CROSS_COUNTRY,
  TargetRace.ROAD_15K_30K,
  TargetRace.MARATHON
];

const trainingCycleOptions = [
  TrainingCycle.PHASE_I,
  TrainingCycle.PHASE_II,
  TrainingCycle.PHASE_III,
  TrainingCycle.PHASE_IV
];

const state = {
  locale: "zh-TW",
  toolMode: "pace",
  sidebarOpen: true,
  theme: "light",
  abilityMode: "vdot",
  converterType: "pace",
  equivalentDirection: "coolToHot",
  openMenu: null,
  unitSystem: UnitSystem.METRIC,
  targetRace: TargetRace.FIVE_TEN_K,
  trainingCycle: TrainingCycle.PHASE_II,
  vdot: 50,
  raceDistanceMeters: 5000,
  raceHours: 0,
  raceMinutes: 20,
  raceSeconds: 0,
  equivalentRaceDistanceMeters: 5000,
  equivalentRaceHours: 0,
  equivalentRaceMinutes: 20,
  equivalentRaceSeconds: 0,
  paceMinutes: 5,
  paceSeconds: 0,
  weeklyMileage: 58,
  temperatureC: 26,
  humidity: 70,
  gpxFileName: "",
  gpxTrackPoints: null,
  gpxAnalysis: null,
  gpxError: "",
  gpxSourceMode: "upload",
  gpxPresetRoute: "",
  gpxTargetMode: "pace",
  gpxTargetPaceInput: "4:30",
  gpxTargetHours: 1,
  gpxTargetMinutes: 35,
  gpxTargetSeconds: 0,
  gpxSegmentSizeKm: 5,
  gpxSmoothingWindowM: 200,
  gpxDownhillStrategy: "standard",
  gpxHeatEnabled: false,
  gpxHeatTemperatureC: 26,
  gpxHeatHumidity: 70,
  gpxHeatRaceType: RaceType.HALF_MARATHON,
  catalogMonth: "all",
  catalogDistanceCategory: "all",
  catalogKeyword: "",
  catalogSort: "month-asc",
  catalogSelectedId: "",
  catalogPanelMode: "empty",
  catalogParsedGpx: null,
  catalogLoading: false,
  catalogError: "",
  catalogSegmentDistanceKm: 1,
  catalogTargetPaceInput: "4:30",
  planOrder: null,
  draggedPlanIndex: null,
  planTouchDrag: null,
  exampleOrder: {},
  draggedExample: null,
  planWorkoutOverrides: {},
  skippedEasyDays: {}
};

const app = document.querySelector("#app");
let pacePanelObserver = null;

const downhillStrategyOptions = {
  conservative: 0.35,
  standard: 0.65,
  aggressive: 1
};

const popularGpxRoutes = [
  {
    file: "2025台北馬拉松-半馬組.gpx",
    zh: "2025 台北馬拉松 - 半馬組",
    en: "2025 Taipei Marathon Half"
  },
  {
    file: "2026_台南古都半程馬拉松-半馬組.gpx",
    zh: "2026 台南古都半程馬拉松 - 半馬組",
    en: "2026 Tainan Historic Capital Half"
  },
  {
    file: "2026渣打馬拉松-半馬組.gpx",
    zh: "2026 渣打馬拉松 - 半馬組",
    en: "2026 Standard Chartered Half"
  },
  {
    file: "2026萬金石馬拉松-10k組.gpx",
    zh: "2026 萬金石馬拉松 - 10K組",
    en: "Wan Jin Shi Challenge 10K"
  }
];

function getGpxCopy() {
  if (state.locale === "en") {
    return {
      sidebarLabel: "GPX Grade Pace",
      inputsTitle: "GPX Route Inputs",
      resultsTitle: "GPX Grade-Adjusted Pace",
      sourceMode: "GPX source",
      uploadSource: "Upload your own GPX",
      presetSource: "Popular race routes",
      presetRoute: "Popular race route",
      uploadLabel: "Upload GPX",
      uploadButton: "Choose GPX file",
      targetInputMode: "Target input",
      paceMode: "Flat-equivalent pace",
      finishTimeMode: "Goal finish time",
      targetPace: "Target flat-equivalent pace",
      targetFinishTime: "Goal finish time",
      derivedPace: "Equivalent pace from route",
      uploadFirstForTime: "Upload GPX first so the app can use route distance.",
      segmentSize: "Segment size",
      smoothingWindow: "Elevation smoothing",
      downhillStrategy: "Downhill strategy",
      conservative: "Conservative",
      standard: "Standard",
      aggressive: "Aggressive",
      heatTitle: "Race-day heat/humidity adjustment",
      heatEnabled: "Enable heat/humidity adjustment",
      heatTemperature: "Temperature",
      heatHumidity: "Relative humidity",
      heatRaceType: "Race distance type",
      raceTypes: {
        [RaceType.FIVE_K]: "5K",
        [RaceType.TEN_K]: "10K",
        [RaceType.HALF_MARATHON]: "Half marathon",
        [RaceType.MARATHON]: "Marathon",
        [RaceType.LONG_CONTINUOUS]: "Long continuous run"
      },
      targetTotalTime: "Target flat total",
      gradeTotalTime: "Grade-adjusted total",
      finalTotalTime: "Final recommended total",
      heatSummaryTitle: "Race-day Heat Adjustment",
      heatSlowdown: "Estimated speed loss",
      heatPaceIncrease: "Pace increase at target",
      heatAppliedNote:
        "This slowdown is applied to every GPX segment after grade adjustment.",
      heatSafetyNote:
        "Heat adjustment is a statistical estimate, not medical advice or a safety guarantee. Heat Index does not fully capture solar radiation, wind, road reflection, fueling, sleep, clothing, sweat rate, or individual adaptation. Stop and seek help if dizziness, chills, unstable gait, confusion, chest tightness, or abnormal sweating occurs.",
      heatWarnings: {
        HEAT_INDEX_HIGH:
          "Heat Index is in a high-risk range. Prioritize safety, hydration, cooling, and a lower target.",
        HOT_HUMID:
          "Hot and humid conditions can raise perceived effort and heart rate sharply. Treat Taiwan summer racing conservatively.",
        HEAT_SLOWDOWN_HIGH:
          "Estimated heat impact is large. Do not rely only on pace; watch effort and heart rate."
      },
      gradeWarnings: {
        STEEP_UPHILL:
          "Steep uphill: control by effort and heart rate rather than pace alone.",
        STEEP_DOWNHILL:
          "Steep downhill: real speed may be limited by technique, surface, and eccentric muscle load."
      },
      noFile: "Upload a GPX file to calculate grade-adjusted target paces.",
      routeSummary: "Route Summary",
      totalDistance: "Total Distance",
      elevationGain: "Elevation Gain",
      elevationLoss: "Elevation Loss",
      avgGrade: "Average Grade",
      steepestClimb: "Steepest Climb",
      steepestDescent: "Steepest Descent",
      elevationProfile: "Elevation Profile",
      paceProfile: "Segment Pace",
      gainLossProfile: "Gain / Loss",
      segmentTable: "Segment Details",
      exportCsv: "Export CSV",
      fileReady: "Loaded",
      formulaTitle: "Model",
      formula:
        "This tool first segments the GPX route, applies the Minetti et al. 2002 running grade-cost model to convert a flat-equivalent target pace into each segment's grade-adjusted pace, then optionally applies race-day heat/humidity slowdown to that grade-adjusted pace. Cr = 155.4g^5 - 30.4g^4 - 43.3g^3 + 46.3g^2 + 19.5g + 3.6; grade pace = flat-equivalent pace x Cr(g) / Cr(0). Heat adjustment uses the same temperature/humidity model used elsewhere in this site, with a conservative event-duration factor.",
      sourceTitle: "Source & Limits",
      source:
        "Source: Minetti, Moia, Roi, Susta & Ferretti 2002, Energy cost of walking and running at extreme uphill and downhill slopes, Journal of Applied Physiology, DOI: 10.1152/japplphysiol.01177.2001. GPS elevation is noisy; use this as a route-planning estimate, not a race guarantee.",
      tableHeaders: [
        "Seg",
        "Distance",
        "Grade",
        "Gain/Loss",
        "Equivalent",
        "Actual Pace",
        "Delta",
        "Time"
      ]
    };
  }

  return {
    sidebarLabel: "GPX 坡度換算",
    inputsTitle: "GPX 路線設定",
    resultsTitle: "GPX 坡度代謝等效配速",
    sourceMode: "GPX 來源",
    uploadSource: "自行匯入",
    presetSource: "常用比賽路線",
    presetRoute: "常用比賽路線",
    uploadLabel: "匯入 GPX",
    uploadButton: "選擇 GPX 檔",
    targetInputMode: "目標輸入方式",
    paceMode: "輸入平路等效配速",
    finishTimeMode: "輸入目標完賽時間",
    targetPace: "目標平路等效配速",
    targetFinishTime: "目標完賽時間",
    derivedPace: "依路線換算等效配速",
    uploadFirstForTime: "請先匯入 GPX，系統才能依路線總距離換算配速。",
    segmentSize: "分段距離",
    smoothingWindow: "海拔平滑視窗",
    downhillStrategy: "下坡策略",
    conservative: "保守",
    standard: "標準",
    aggressive: "積極",
    heatTitle: "比賽當天溫濕度修正",
    heatEnabled: "啟用溫濕度修正",
    heatTemperature: "氣溫",
    heatHumidity: "相對濕度",
    heatRaceType: "比賽距離類型",
    raceTypes: {
      [RaceType.FIVE_K]: "5K",
      [RaceType.TEN_K]: "10K",
      [RaceType.HALF_MARATHON]: "半馬",
      [RaceType.MARATHON]: "馬拉松",
      [RaceType.LONG_CONTINUOUS]: "長時間穩定跑"
    },
    targetTotalTime: "原始目標總時間",
    gradeTotalTime: "坡度修正後總時間",
    finalTotalTime: "最終建議總時間",
    heatSummaryTitle: "比賽當天熱環境修正",
    heatSlowdown: "估計速度下降",
    heatPaceIncrease: "以目標配速約增加",
    heatAppliedNote: "此放慢比例會套用到 GPX 每個分段的坡度修正配速上。",
    heatSafetyNote:
      "溫濕度修正是統計與經驗性估算，不是醫療建議，也不是安全保證。Heat Index 主要由氣溫與相對濕度推估，未完整納入太陽輻射、風速、黑球溫度、路面反射、補給、睡眠、衣著、個人流汗率與熱適應差異。若比賽當天出現頭暈、寒顫、步態不穩、意識混亂、胸悶、停止流汗等症狀，應立即停止比賽並尋求協助。",
    heatWarnings: {
      HEAT_INDEX_HIGH:
        "Heat Index 已達高風險區間，建議優先考慮安全、補水、降溫與降低目標。",
      HOT_HUMID:
        "高溫高濕環境可能使體感與心率明顯上升，台灣夏季路跑需保守看待配速。",
      HEAT_SLOWDOWN_HIGH:
        "估計熱環境影響較大，建議不要只依賴配速，應同時觀察體感與心率。"
    },
    gradeWarnings: {
      STEEP_UPHILL:
        "此段坡度較陡，建議以努力程度與心率控制，不要完全依賴配速。",
      STEEP_DOWNHILL:
        "此段下坡較陡，實際速度可能受技術、路面與肌肉離心負荷限制，建議保守。"
    },
    noFile: "匯入 GPX 後，系統會依坡度換算每段建議實際配速。",
    routeSummary: "路線摘要",
    totalDistance: "總距離",
    elevationGain: "爬升",
    elevationLoss: "下降",
    avgGrade: "平均坡度",
    steepestClimb: "最陡上坡",
    steepestDescent: "最陡下坡",
    elevationProfile: "海拔剖面",
    paceProfile: "分段配速",
    gainLossProfile: "爬升 / 下降",
    segmentTable: "分段明細",
    exportCsv: "匯出 CSV",
    fileReady: "已載入",
    formulaTitle: "模型",
    formula:
      "本工具先根據 GPX 路線分段計算坡度，使用 Minetti et al. (2002) 的跑步坡度能量成本模型，將目標平地等效配速換算為每段坡度下的建議實際配速。若啟用比賽當天溫濕度修正，工具會再根據氣溫、相對濕度與比賽距離，估算熱環境可能造成的速度下降，並套用到每段坡度修正配速上。Cr = 155.4g^5 - 30.4g^4 - 43.3g^3 + 46.3g^2 + 19.5g + 3.6；坡度修正配速 = 平路等效配速 x Cr(g) / Cr(0)。",
    sourceTitle: "來源與限制",
    source:
      "來源：Minetti, Moia, Roi, Susta & Ferretti 2002, Energy cost of walking and running at extreme uphill and downhill slopes, Journal of Applied Physiology, DOI: 10.1152/japplphysiol.01177.2001。GPS 海拔容易有雜訊，本工具適合作為路線規劃估算，不是比賽結果保證。",
    tableHeaders: [
      "段",
      "距離",
      "坡度",
      "爬升/下降",
      "等效配速",
      "實際配速",
      "差異",
      "時間"
    ]
  };
}

function render() {
  const t = copy[state.locale];
  const activeVdot = getActiveVdot();
  const model = calculatePaceModel({ ...state, vdot: activeVdot });
  const isConverter = state.toolMode === "equivalent";
  const isPlan = state.toolMode === "plan";
  const isGpx = state.toolMode === "gpx";
  const isGpxCatalog = state.toolMode === "gpxCatalog";

  document.documentElement.lang = state.locale === "en" ? "en" : "zh-Hant";
  document.documentElement.dataset.theme = state.theme;
  app.innerHTML = `
    <div class="app-workspace ${state.sidebarOpen ? "" : "sidebar-collapsed"}">
      ${renderToolSidebar(t)}
      <div class="content-shell">
        <header class="topbar">
          <div>
            <p class="eyebrow">VDOT Pace Lab</p>
            <h1>${t.appTitle}</h1>
            <p class="subtitle">${t.subtitle}</p>
          </div>
          <div class="topbar-controls">
            ${renderThemeSwitch(t)}
            ${renderMenuField(t.language, "locale", state.locale, [
              { value: "zh-TW", label: "中文" },
              { value: "en", label: "EN" }
            ], "language-toggle")}
          </div>
        </header>

        <main class="pace-layout">
          <section class="control-panel" aria-labelledby="inputs-title">
            <div class="section-heading">
              <p class="eyebrow">Runner</p>
              <h2 id="inputs-title">${isGpxCatalog ? "賽事庫篩選" : isGpx ? getGpxCopy().inputsTitle : t.inputs}</h2>
            </div>
            ${
              isGpxCatalog
                ? renderGpxCatalogFilters()
                : isGpx
                ? renderGpxInputs()
                : `
                  ${renderInputs(t)}
                  ${renderEnvironmentSummary(model, t)}
                  ${isPlan ? renderMileageClass(model, t) : ""}
                `
            }
          </section>

          <section class="results-panel" aria-live="polite">
            ${
              isGpxCatalog
                ? renderGpxCatalogPage()
                : isGpx
                ? renderGpxResults()
                : isConverter
                ? renderEquivalentResults(model, t)
                : isPlan
                  ? renderTrainingPlanResults(model, t)
                  : `
                  <div class="section-heading">
                    <p class="eyebrow">VDOT ${model.vdot}</p>
                    <h2>${t.vdotPaces}</h2>
                  </div>
                  ${renderPaceZonePanel(model, t, true)}
                  ${renderVdotEquivalentResults(model, t)}
                `
            }
          </section>
        </main>
      </div>
    </div>
  `;

  bindEvents();
  if (!isConverter && !isGpx && !isGpxCatalog) fitPaceZonePanel();
  if (isGpxCatalog) initializeCatalogMap();
}

function renderInputs(t) {
  const mileageMax = state.unitSystem === UnitSystem.IMPERIAL ? 112 : 180;
  const mileageUnit =
    state.unitSystem === UnitSystem.IMPERIAL ? t.miPerWeek : t.kmPerWeek;
  const isConverter = state.toolMode === "equivalent";
  const isPlan = state.toolMode === "plan";

  return `
    <div class="field-grid">
      ${renderMenuField(t.unitSystem, "unitSystem", state.unitSystem, [
        { value: UnitSystem.METRIC, label: t.metricUnit },
        { value: UnitSystem.IMPERIAL, label: t.imperialUnit }
      ])}
      ${
        isConverter
          ? renderEquivalentInputs(t)
          : `
            ${renderAbilityInput(t)}
            ${
              isPlan
                ? `
                  ${renderMenuField(
                    t.targetRace,
                    "targetRace",
                    state.targetRace,
                    targetRaceOptions.map((value) => ({
                      value,
                      label: t.targetRaceNames[value]
                    }))
                  )}
                  ${renderMenuField(
                    t.trainingCycle,
                    "trainingCycle",
                    state.trainingCycle,
                    trainingCycleOptions.map((value) => ({
                      value,
                      label: t.cycleNames[value]
                    }))
                  )}
                  <p class="field-note">${t.trainingCycleHelp}</p>
                  ${renderRangeField(
                    t.weeklyMileage,
                    "weeklyMileage",
                    state.weeklyMileage,
                    0,
                    mileageMax,
                    1,
                    mileageUnit
                  )}
                `
                : ""
            }
          `
      }
      ${renderRangeField(
        t.temperature,
        "temperatureC",
        state.temperatureC,
        -5,
        45,
        1,
        t.celsius
      )}
      ${renderRangeField(t.humidity, "humidity", state.humidity, 0, 100, 1, t.percent)}
    </div>
  `;
}

function renderToolSidebar(t) {
  const items = [
    {
      value: "pace",
      label: t.plannerMode,
      icon: renderSidebarIcon("pace")
    },
    {
      value: "equivalent",
      label: t.heatEquivalentMode,
      icon: renderSidebarIcon("heat")
    },
    {
      value: "plan",
      label: t.trainingPlanMode,
      icon: renderSidebarIcon("plan")
    },
    {
      value: "gpx",
      label: getGpxCopy().sidebarLabel,
      icon: renderSidebarIcon("gpx")
    },
    {
      value: "gpxCatalog",
      label: "GPX 開源賽事庫",
      icon: renderSidebarIcon("library")
    }
  ];

  return `
    <aside class="tool-sidebar" aria-label="${t.toolMode}">
      <div class="tool-sidebar-head">
        <div>
          <span>${t.toolSection}</span>
          <strong>VDOT</strong>
        </div>
        <button
          type="button"
          class="sidebar-toggle"
          data-action="toggle-sidebar"
          aria-label="${state.sidebarOpen ? t.collapseSidebar : t.expandSidebar}"
          aria-expanded="${state.sidebarOpen}"
        >
          ${state.sidebarOpen ? "‹" : "›"}
        </button>
      </div>
      <nav class="tool-sidebar-nav">
        ${items
          .map(
            (item) => `
              <button
                type="button"
                class="${state.toolMode === item.value ? "active" : ""}"
                data-action="select-menu-option"
                data-field="toolMode"
                data-value="${item.value}"
                aria-current="${state.toolMode === item.value ? "page" : "false"}"
                title="${item.label}"
              >
                <span class="tool-icon" aria-hidden="true">${item.icon}</span>
                <span class="tool-label">${item.label}</span>
              </button>
            `
          )
          .join("")}
      </nav>
    </aside>
  `;
}

function renderThemeSwitch(t) {
  return `
    <div class="theme-switch" aria-label="${t.themeMode}">
      <span>${t.themeMode}</span>
      <div>
        <button
          type="button"
          class="${state.theme === "dark" ? "active" : ""}"
          data-action="set-theme"
          data-theme="dark"
          aria-pressed="${state.theme === "dark"}"
          title="${t.darkTheme}"
        >
          <span aria-hidden="true">☾</span>
          <b>${t.darkTheme}</b>
        </button>
        <button
          type="button"
          class="${state.theme === "light" ? "active" : ""}"
          data-action="set-theme"
          data-theme="light"
          aria-pressed="${state.theme === "light"}"
          title="${t.lightTheme}"
        >
          <span aria-hidden="true">☼</span>
          <b>${t.lightTheme}</b>
        </button>
      </div>
    </div>
  `;
}

function renderSidebarIcon(type) {
  if (type === "heat") {
    return `
      <svg viewBox="0 0 24 24" focusable="false">
        <path d="M14 14.8V5.5a3 3 0 0 0-6 0v9.3a5 5 0 1 0 6 0Z" />
        <path d="M11 17.5v-6" />
        <path d="M17 6h3" />
        <path d="M17 10h3" />
      </svg>
    `;
  }

  if (type === "plan") {
    return `
      <svg viewBox="0 0 24 24" focusable="false">
        <path d="M8 4v3" />
        <path d="M16 4v3" />
        <path d="M5 8h14" />
        <path d="M6 5h12a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" />
        <path d="M8 12h3" />
        <path d="M8 16h6" />
      </svg>
    `;
  }

  if (type === "gpx") {
    return `
      <svg viewBox="0 0 24 24" focusable="false">
        <path d="M4 18c2.2-5.4 4-8 6-8 2.8 0 2.7 5 5 5 1.5 0 2.8-1.3 5-5" />
        <path d="M5 19h14" />
        <path d="M7 16l3-7 3 7" />
      </svg>
    `;
  }

  if (type === "library") {
    return `
      <svg viewBox="0 0 24 24" focusable="false">
        <path d="M5 5h14v14H5z" />
        <path d="M8 8h8" />
        <path d="M8 12h8" />
        <path d="M8 16h5" />
      </svg>
    `;
  }

  return `
    <svg viewBox="0 0 24 24" focusable="false">
      <path d="M4 17h3l2-10 3 10 2-6 2 6h4" />
      <path d="M5 21h14" />
    </svg>
  `;
}

function renderAbilityInput(t) {
  const estimate = getRaceEstimate();
  return `
    <section class="ability-card">
      ${renderMenuField(t.vdotSource, "abilityMode", state.abilityMode, [
        { value: "vdot", label: t.directVdot },
        { value: "race", label: t.raceResult }
      ])}
      ${
        state.abilityMode === "vdot"
          ? renderRangeField(t.vdot, "vdot", state.vdot, 30, 85, 1, "")
          : renderRaceResultInput(t, estimate)
      }
    </section>
  `;
}

function renderRaceResultInput(t, estimate) {
  return `
    <div class="race-result-grid">
      ${renderMenuField(
        t.raceDistance,
        "raceDistanceMeters",
        String(state.raceDistanceMeters),
        raceDistanceOptions.map((optionItem) => ({
          value: String(optionItem.meters),
          label: state.locale === "en" ? optionItem.en : optionItem.zh
        }))
      )}
    </div>
    <fieldset class="time-fieldset">
      <legend>${t.raceTime}</legend>
      <label>
        <span>${t.hours}</span>
        <input data-field="raceHours" type="number" inputmode="numeric" pattern="[0-9]*" min="0" max="9" step="1" value="${state.raceHours}" />
      </label>
      <label>
        <span>${t.minutes}</span>
        <input data-field="raceMinutes" type="number" inputmode="numeric" pattern="[0-9]*" min="0" max="59" step="1" value="${state.raceMinutes}" />
      </label>
      <label>
        <span>${t.seconds}</span>
        <input data-field="raceSeconds" type="number" inputmode="numeric" pattern="[0-9]*" min="0" max="59" step="1" value="${state.raceSeconds}" />
      </label>
    </fieldset>
    <div class="vdot-estimate ${estimate.valid ? "" : "invalid"}">
      <span>${estimate.valid ? t.estimatedVdot : t.invalidRaceTime}</span>
      ${estimate.valid ? `<strong>${estimate.vdot}</strong>` : ""}
    </div>
  `;
}

function renderEquivalentInputs(t) {
  return `
    ${renderMenuField(t.converterType, "converterType", state.converterType, [
      { value: "pace", label: t.paceConverter },
      { value: "race", label: t.raceConverter }
    ])}
    ${renderMenuField(t.converterDirection, "equivalentDirection", state.equivalentDirection, [
      { value: "coolToHot", label: t.coolToHot },
      { value: "hotToCool", label: t.hotToCool }
    ])}
    ${
      state.converterType === "pace"
        ? renderPaceEquivalentInput(t)
        : renderRaceEquivalentInput(t)
    }
    <p class="field-note">${getEquivalentAssumption(t)}</p>
  `;
}

function renderPaceEquivalentInput(t) {
  const unit = state.unitSystem === UnitSystem.IMPERIAL ? "/ mi" : "/ km";
  const legend =
    state.equivalentDirection === "hotToCool"
      ? t.heatEnvironmentPace
      : t.baselinePace;
  return `
    <fieldset class="time-fieldset pace-time-fieldset">
      <legend>${legend} ${unit}</legend>
      <label>
        <span>${t.minutes}</span>
        <input data-field="paceMinutes" type="number" inputmode="numeric" pattern="[0-9]*" min="0" max="30" step="1" value="${state.paceMinutes}" />
      </label>
      <label>
        <span>${t.seconds}</span>
        <input data-field="paceSeconds" type="number" inputmode="numeric" pattern="[0-9]*" min="0" max="59" step="1" value="${state.paceSeconds}" />
      </label>
    </fieldset>
  `;
}

function renderRaceEquivalentInput(t) {
  const legend =
    state.equivalentDirection === "hotToCool"
      ? t.heatEnvironmentResult
      : t.equivalentRace;
  return `
    <div class="race-result-grid single">
      ${renderMenuField(
        t.raceDistance,
        "equivalentRaceDistanceMeters",
        String(state.equivalentRaceDistanceMeters),
        equivalentRaceOptions.map((optionItem) => ({
          value: String(optionItem.meters),
          label: state.locale === "en" ? optionItem.en : optionItem.zh
        }))
      )}
    </div>
    <fieldset class="time-fieldset">
      <legend>${legend}</legend>
      <label>
        <span>${t.hours}</span>
        <input data-field="equivalentRaceHours" type="number" inputmode="numeric" pattern="[0-9]*" min="0" max="9" step="1" value="${state.equivalentRaceHours}" />
      </label>
      <label>
        <span>${t.minutes}</span>
        <input data-field="equivalentRaceMinutes" type="number" inputmode="numeric" pattern="[0-9]*" min="0" max="59" step="1" value="${state.equivalentRaceMinutes}" />
      </label>
      <label>
        <span>${t.seconds}</span>
        <input data-field="equivalentRaceSeconds" type="number" inputmode="numeric" pattern="[0-9]*" min="0" max="59" step="1" value="${state.equivalentRaceSeconds}" />
      </label>
    </fieldset>
  `;
}

function getEquivalentAssumption(t) {
  return state.equivalentDirection === "hotToCool"
    ? t.reverseConverterAssumption
    : t.converterAssumption;
}

function renderRangeField(label, field, value, min, max, step, unit) {
  return `
    <label class="field range-field">
      <span>${label}</span>
      <div class="range-row">
        <input data-field="${field}" type="range" min="${min}" max="${max}" step="${step}" value="${value}" />
        <input data-field="${field}" type="number" inputmode="decimal" min="${min}" max="${max}" step="${step}" value="${value}" />
        <b>${unit}</b>
      </div>
    </label>
  `;
}

function renderGpxInputs() {
  const gpx = getGpxCopy();
  return `
    <div class="field-grid gpx-control-grid">
      ${renderNativeSelect(
        gpx.sourceMode,
        "gpxSourceMode",
        state.gpxSourceMode,
        [
          { value: "upload", label: gpx.uploadSource },
          { value: "preset", label: gpx.presetSource }
        ]
      )}
      ${renderGpxSourceInput(gpx)}
      ${renderNativeSelect(
        gpx.targetInputMode,
        "gpxTargetMode",
        state.gpxTargetMode,
        [
          { value: "pace", label: gpx.paceMode },
          { value: "time", label: gpx.finishTimeMode }
        ]
      )}
      ${renderGpxTargetInput(gpx)}
      ${renderNativeSelect(
        gpx.segmentSize,
        "gpxSegmentSizeKm",
        String(state.gpxSegmentSizeKm),
        Array.from({ length: 42 }, (_, index) => {
          const km = index + 1;
          return { value: String(km), label: `${km} km` };
        })
      )}
      ${renderNativeSelect(
        gpx.downhillStrategy,
        "gpxDownhillStrategy",
        state.gpxDownhillStrategy,
        [
          { value: "conservative", label: gpx.conservative },
          { value: "standard", label: gpx.standard },
          { value: "aggressive", label: gpx.aggressive }
        ]
      )}
      ${renderGpxHeatSettings(gpx)}
      <aside class="note-panel gpx-note">
        <h3>${gpx.formulaTitle}</h3>
        <p>${gpx.formula}</p>
        <h3>${gpx.sourceTitle}</h3>
        <p>${gpx.source}</p>
      </aside>
    </div>
  `;
}

function renderGpxHeatSettings(gpx) {
  return `
    <details class="gpx-heat-settings" ${state.gpxHeatEnabled ? "open" : ""}>
      <summary>${gpx.heatTitle}</summary>
      <label class="gpx-toggle-row">
        <input data-gpx-field="gpxHeatEnabled" type="checkbox" ${state.gpxHeatEnabled ? "checked" : ""} />
        <span>${gpx.heatEnabled}</span>
      </label>
      ${
        state.gpxHeatEnabled
          ? `
            <div class="gpx-heat-grid">
              <label class="field">
                <span>${gpx.heatTemperature}</span>
                <div class="inline-unit-input">
                  <input data-gpx-field="gpxHeatTemperatureC" type="number" inputmode="decimal" min="-5" max="45" step="1" value="${state.gpxHeatTemperatureC}" />
                  <b>°C</b>
                </div>
              </label>
              <label class="field">
                <span>${gpx.heatHumidity}</span>
                <div class="inline-unit-input">
                  <input data-gpx-field="gpxHeatHumidity" type="number" inputmode="decimal" min="0" max="100" step="1" value="${state.gpxHeatHumidity}" />
                  <b>%</b>
                </div>
              </label>
              ${renderNativeSelect(
                gpx.heatRaceType,
                "gpxHeatRaceType",
                state.gpxHeatRaceType,
                Object.values(RaceType).map((value) => ({
                  value,
                  label: gpx.raceTypes[value]
                }))
              )}
            </div>
          `
          : ""
      }
    </details>
  `;
}

function renderGpxSourceInput(gpx) {
  if (state.gpxSourceMode === "preset") {
    return `
      ${renderNativeSelect(
        gpx.presetRoute,
        "gpxPresetRoute",
        state.gpxPresetRoute,
        popularGpxRoutes.map((route) => ({
          value: route.file,
          label: state.locale === "en" ? route.en : route.zh
        }))
      )}
      <p class="field-note">${state.gpxFileName ? `${gpx.fileReady}: ${escapeHtml(state.gpxFileName)}` : gpx.noFile}</p>
    `;
  }

  return `
    <label class="field gpx-upload-field">
      <span>${gpx.uploadLabel}</span>
      <input data-gpx-file type="file" accept=".gpx,application/gpx+xml" />
      <small>${state.gpxFileName ? `${gpx.fileReady}: ${escapeHtml(state.gpxFileName)}` : gpx.noFile}</small>
    </label>
  `;
}

function renderGpxTargetInput(gpx) {
  if (state.gpxTargetMode === "time") {
    const derivedPace = getGpxDerivedPaceLabel();
    return `
      <fieldset class="time-fieldset gpx-time-fieldset">
        <legend>${gpx.targetFinishTime}</legend>
        <label>
          <span>${copy[state.locale].hours}</span>
          <input data-gpx-field="gpxTargetHours" type="number" inputmode="numeric" min="0" max="99" step="1" value="${state.gpxTargetHours}" />
        </label>
        <label>
          <span>${copy[state.locale].minutes}</span>
          <input data-gpx-field="gpxTargetMinutes" type="number" inputmode="numeric" min="0" max="59" step="1" value="${state.gpxTargetMinutes}" />
        </label>
        <label>
          <span>${copy[state.locale].seconds}</span>
          <input data-gpx-field="gpxTargetSeconds" type="number" inputmode="numeric" min="0" max="59" step="1" value="${state.gpxTargetSeconds}" />
        </label>
      </fieldset>
      <p class="field-note">${derivedPace ? `${gpx.derivedPace}: ${derivedPace}` : gpx.uploadFirstForTime}</p>
    `;
  }

  return `
    <label class="field">
      <span>${gpx.targetPace}</span>
      <input
        data-gpx-field="gpxTargetPaceInput"
        type="text"
        inputmode="numeric"
        value="${escapeHtml(state.gpxTargetPaceInput)}"
        placeholder="4:30"
      />
    </label>
  `;
}

function renderNativeSelect(label, field, value, items) {
  return `
    <label class="field">
      <span>${label}</span>
      <select data-gpx-field="${field}">
        ${items
          .map(
            (item) => `
              <option value="${item.value}" ${String(item.value) === String(value) ? "selected" : ""}>
                ${item.label}
              </option>
            `
          )
          .join("")}
      </select>
    </label>
  `;
}

function renderGpxResults() {
  const gpx = getGpxCopy();
  const analysis = state.gpxAnalysis;
  return `
    <div class="section-heading">
      <p class="eyebrow">GPX</p>
      <h2>${gpx.resultsTitle}</h2>
    </div>
    ${
      state.gpxError
        ? `<p class="gpx-error">${escapeHtml(state.gpxError)}</p>`
        : ""
    }
    ${
      analysis
        ? `
          ${renderGpxSummary(analysis.summary, gpx)}
          ${renderGpxHeatSummary(analysis, gpx)}
          <section class="gpx-chart-grid">
            ${renderElevationChart(analysis.points, gpx)}
            ${renderPaceChart(analysis.segments, gpx)}
            ${renderGainLossChart(analysis.segments, gpx)}
          </section>
          <section class="summary-card gpx-segment-panel">
            <div class="gpx-panel-head">
              <div>
                <p class="eyebrow">${gpx.segmentTable}</p>
                <h3>${state.gpxFileName ? escapeHtml(state.gpxFileName) : gpx.resultsTitle}</h3>
              </div>
            </div>
            ${renderGpxTable(analysis.segments, gpx)}
          </section>
        `
        : `
          <section class="summary-card gpx-empty">
            <p>${gpx.noFile}</p>
          </section>
        `
    }
  `;
}

function renderGpxSummary(summary, gpx) {
  const climb = summary.steepestUphill;
  const descent = summary.steepestDownhill;
  return `
    <section class="summary-card gpx-summary">
      <p class="eyebrow">${gpx.routeSummary}</p>
      <div class="metric-row">
        <div>
          <span>${gpx.totalDistance}</span>
          <strong>${summary.totalDistanceKm.toFixed(2)} km</strong>
        </div>
        <div>
          <span>${gpx.elevationGain}</span>
          <strong>${Math.round(summary.totalGainM)} m</strong>
        </div>
        <div>
          <span>${gpx.elevationLoss}</span>
          <strong>${Math.round(summary.totalLossM)} m</strong>
        </div>
        <div>
          <span>${gpx.avgGrade}</span>
          <strong>${formatGrade(summary.averageGrade)}</strong>
        </div>
        <div>
          <span>${gpx.steepestClimb}</span>
          <strong>#${climb.index} ${formatGrade(climb.averageGrade)}</strong>
        </div>
        <div>
          <span>${gpx.steepestDescent}</span>
          <strong>#${descent.index} ${formatGrade(descent.averageGrade)}</strong>
        </div>
        <div>
          <span>${gpx.targetTotalTime}</span>
          <strong>${formatGpxDuration(summary.targetTotalTimeSec)}</strong>
        </div>
        <div>
          <span>${gpx.gradeTotalTime}</span>
          <strong>${formatGpxDuration(summary.gradeAdjustedTotalTimeSec)}</strong>
        </div>
        ${
          summary.heatAdjustment?.finalSlowdown > 0
            ? `
              <div>
                <span>${gpx.finalTotalTime}</span>
                <strong>${formatGpxDuration(summary.finalTotalTimeSec)}</strong>
              </div>
            `
            : ""
        }
      </div>
    </section>
  `;
}

function renderGpxHeatSummary(analysis, gpx) {
  const heat = analysis.heatAdjustment;
  const settings = analysis.heatSettings;
  if (!settings?.enabled || !heat) return "";
  const targetPace = analysis.segments[0]?.targetEquivalentPaceSecPerKm ?? 0;
  const paceIncrease = targetPace / (1 - heat.finalSlowdown) - targetPace;

  return `
    <section class="summary-card gpx-heat-summary">
      <p class="eyebrow">${gpx.heatSummaryTitle}</p>
      <div class="metric-row">
        <div>
          <span>${gpx.heatTemperature}</span>
          <strong>${settings.temperatureC}°C</strong>
        </div>
        <div>
          <span>${gpx.heatHumidity}</span>
          <strong>${settings.relativeHumidity}%</strong>
        </div>
        <div>
          <span>Heat Index</span>
          <strong>${heat.heatIndexC.toFixed(1)}°C</strong>
        </div>
        <div>
          <span>${gpx.heatSlowdown}</span>
          <strong>${formatPercent(heat.finalSlowdown * 100)}</strong>
        </div>
        <div>
          <span>${gpx.heatPaceIncrease}</span>
          <strong>${formatGpxPaceDelta(paceIncrease)}</strong>
        </div>
      </div>
      <p>${gpx.heatAppliedNote}</p>
      ${renderWarningList(heat.warnings, gpx.heatWarnings)}
      <p class="gpx-safety-note">${gpx.heatSafetyNote}</p>
    </section>
  `;
}

function renderElevationChart(points, gpx) {
  const sampled = sampleSeries(points, 220);
  const values = sampled.map((point) => point.smoothedElevationM);
  return renderLineChart(gpx.elevationProfile, sampled, values, "m");
}

function renderPaceChart(segments, gpx) {
  const hasHeat = segments.some((segment) => segment.heatDeltaSecPerKm > 0.1);
  return renderPaceComparisonChart(gpx.paceProfile, segments, hasHeat);
}

function renderGainLossChart(segments, gpx) {
  const values = segments.map((segment) => segment.elevationGainM - segment.elevationLossM);
  return renderBarChart(
    gpx.gainLossProfile,
    segments,
    values,
    (value) => `${Math.round(value)} m`,
    true
  );
}

function renderPaceComparisonChart(title, segments, hasHeat) {
  const width = 640;
  const height = 240;
  const margin = { top: 12, right: 18, bottom: 48, left: 62 };
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;
  const allValues = segments.flatMap((segment) => [
    segment.targetEquivalentPaceSecPerKm,
    segment.recommendedActualPaceSecPerKm,
    ...(hasHeat ? [segment.heatAdjustedPaceSecPerKm] : [])
  ]);
  const axis = buildNiceAxis(Math.min(...allValues), Math.max(...allValues), "pace");
  const totalDistanceKm = Math.max(0.01, segments.at(-1)?.endKm ?? segments.length);
  const xTicks = buildDistanceTicks(totalDistanceKm);
  const series = [
    {
      key: "target",
      label: state.locale === "en" ? "Flat target" : "目標平路等效",
      className: "target",
      values: segments.map((segment) => segment.targetEquivalentPaceSecPerKm)
    },
    {
      key: "grade",
      label: state.locale === "en" ? "Grade adjusted" : "坡度修正",
      className: "grade",
      values: segments.map((segment) => segment.recommendedActualPaceSecPerKm)
    },
    ...(hasHeat
      ? [
          {
            key: "final",
            label: state.locale === "en" ? "Grade + heat" : "坡度 + 溫濕度",
            className: "final",
            values: segments.map((segment) => segment.heatAdjustedPaceSecPerKm)
          }
        ]
      : [])
  ];

  const pointX = (segment) =>
    margin.left +
    (((segment.startKm + segment.endKm) / 2) / totalDistanceKm) * plotWidth;
  const pointY = (value) => mapValueToY(value, axis.min, axis.max, margin.top, plotHeight);

  return `
    <article class="summary-card gpx-chart-card">
      <h3>${title}</h3>
      <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${title}">
        ${renderChartAxes({
          width,
          height,
          margin,
          plotWidth,
          plotHeight,
          xTicks,
          yTicks: axis.ticks,
          yFormatter: (value) => formatClock(value),
          yMin: axis.min,
          yMax: axis.max,
          xLabel: "km",
          yLabel: "/km"
        })}
        ${series
          .map((item) => {
            const path = item.values
              .map((value, index) => {
                const x = pointX(segments[index]);
                const y = pointY(value);
                return `${index === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
              })
              .join(" ");
            return `<path class="gpx-pace-line ${item.className}" d="${path}" />`;
          })
          .join("")}
        ${segments
          .map((segment) => {
            const x = pointX(segment);
            const tooltip = [
              `#${segment.index}`,
              `${series[0].label}: ${formatGpxPace(segment.targetEquivalentPaceSecPerKm)}`,
              `${series[1].label}: ${formatGpxPace(segment.recommendedActualPaceSecPerKm)}`,
              ...(hasHeat
                ? [`${series[2].label}: ${formatGpxPace(segment.heatAdjustedPaceSecPerKm)}`]
                : [])
            ].join(" | ");
            return series
              .map((item) => {
                const value = item.values[segment.index - 1];
                return `<circle class="gpx-pace-dot ${item.className}" cx="${x.toFixed(1)}" cy="${pointY(value).toFixed(1)}" r="4"><title>${tooltip}</title></circle>`;
              })
              .join("");
          })
          .join("")}
      </svg>
      <div class="gpx-chart-legend">
        ${series
          .map(
            (item) => `
              <span><i class="${item.className}"></i>${item.label}</span>
            `
          )
          .join("")}
      </div>
      <p>${formatGpxPace(axis.min)} - ${formatGpxPace(axis.max)} · x: km · y: /km</p>
    </article>
  `;
}

function buildNiceAxis(rawMin, rawMax, type) {
  const minValue = Number.isFinite(rawMin) ? rawMin : 0;
  const maxValue = Number.isFinite(rawMax) ? rawMax : minValue + 1;
  const span = Math.max(0.01, maxValue - minValue);
  const buckets =
    type === "pace"
      ? [
          { range: 10, tick: 1 },
          { range: 50, tick: 5 },
          { range: 100, tick: 10 },
          { range: 250, tick: 25 },
          { range: 500, tick: 50 }
        ]
      : [
          { range: 10, tick: 1 },
          { range: 50, tick: 5 },
          { range: 100, tick: 10 },
          { range: 250, tick: 25 },
          { range: 500, tick: 50 }
        ];
  const bucket =
    buckets.find((item) => span <= item.range) ??
    {
      range: Math.ceil(span / 500) * 500,
      tick: 100
    };
  const center = (minValue + maxValue) / 2;
  const min = Math.floor((center - bucket.range / 2) / bucket.tick) * bucket.tick;
  const max = min + bucket.range;
  const ticks = [];

  for (let value = min; value <= max + bucket.tick / 2; value += bucket.tick) {
    ticks.push(Math.round(value * 10) / 10);
  }

  return { min, max, ticks };
}

function buildDistanceTicks(totalDistanceKm) {
  const targetStep = totalDistanceKm / 4;
  const magnitude = Math.pow(10, Math.floor(Math.log10(Math.max(0.01, targetStep))));
  const normalized = targetStep / magnitude;
  const step =
    normalized <= 1
      ? magnitude
      : normalized <= 2
        ? 2 * magnitude
        : normalized <= 5
          ? 5 * magnitude
          : 10 * magnitude;
  const ticks = [];

  for (let value = 0; value <= totalDistanceKm + step / 2; value += step) {
    ticks.push(Math.round(value * 10) / 10);
  }

  const roundedTotal = Math.round(totalDistanceKm * 10) / 10;
  if (ticks.at(-1) !== roundedTotal) ticks.push(roundedTotal);
  return ticks;
}

function mapValueToY(value, min, max, top, plotHeight) {
  const span = Math.max(0.01, max - min);
  return top + plotHeight - ((value - min) / span) * plotHeight;
}

function renderChartAxes({
  margin,
  plotWidth,
  plotHeight,
  xTicks,
  yTicks,
  yFormatter,
  yMin,
  yMax,
  xLabel,
  yLabel
}) {
  const totalDistanceKm = Math.max(0.01, xTicks.at(-1) ?? 1);
  const left = margin.left;
  const right = margin.left + plotWidth;
  const top = margin.top;
  const bottom = margin.top + plotHeight;

  return `
    <g class="gpx-axis">
      ${yTicks
        .map((tick) => {
          const y = mapValueToY(tick, yMin, yMax, margin.top, plotHeight);
          return `
            <line class="gpx-grid-line" x1="${left}" y1="${y}" x2="${right}" y2="${y}" />
            <text class="gpx-y-tick" x="${left - 8}" y="${y + 4}">${yFormatter(tick)}</text>
          `;
        })
        .join("")}
      ${xTicks
        .map((tick) => {
          const x = left + (tick / totalDistanceKm) * plotWidth;
          return `
            <line class="gpx-x-tick-line" x1="${x}" y1="${bottom}" x2="${x}" y2="${bottom + 5}" />
            <text class="gpx-x-tick" x="${x}" y="${bottom + 22}">${tick}</text>
          `;
        })
        .join("")}
      <line class="gpx-chart-axis" x1="${left}" y1="${bottom}" x2="${right}" y2="${bottom}" />
      <line class="gpx-chart-axis" x1="${left}" y1="${top}" x2="${left}" y2="${bottom}" />
      <text class="gpx-x-label" x="${right}" y="${bottom + 40}">${xLabel}</text>
      <text class="gpx-y-label" x="${left}" y="${top - 2}">${yLabel}</text>
    </g>
  `;
}

function renderLineChart(title, samples, values, suffix) {
  const width = 640;
  const height = 240;
  const margin = { top: 12, right: 18, bottom: 48, left: 58 };
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;
  const axis = buildNiceAxis(Math.min(...values), Math.max(...values), "meter");
  const totalDistanceKm = Math.max(0.01, (samples.at(-1)?.distanceM ?? 1) / 1000);
  const xTicks = buildDistanceTicks(totalDistanceKm);
  const path = samples
    .map((point, index) => {
      const x = margin.left + (point.distanceM / 1000 / totalDistanceKm) * plotWidth;
      const y = mapValueToY(values[index], axis.min, axis.max, margin.top, plotHeight);
      return `${index === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");

  return `
    <article class="summary-card gpx-chart-card">
      <h3>${title}</h3>
      <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${title}">
        ${renderChartAxes({
          width,
          height,
          margin,
          plotWidth,
          plotHeight,
          xTicks,
          yTicks: axis.ticks,
          yFormatter: (value) => `${Math.round(value)}m`,
          yMin: axis.min,
          yMax: axis.max,
          xLabel: "km",
          yLabel: suffix
        })}
        <path class="gpx-chart-fill" d="${path} L ${margin.left + plotWidth} ${margin.top + plotHeight} L ${margin.left} ${margin.top + plotHeight} Z" />
        <path class="gpx-chart-line" d="${path}" />
      </svg>
      <p>${axis.min}-${axis.max} ${suffix} · x: km · y: ${suffix}</p>
    </article>
  `;
}

function renderBarChart(title, segments, values, formatValue, allowNegative = false) {
  const width = 640;
  const height = 240;
  const margin = { top: 12, right: 18, bottom: 48, left: 62 };
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;
  const axis = buildNiceAxis(Math.min(...values), Math.max(...values), allowNegative ? "meter" : "pace");
  const totalDistanceKm = Math.max(0.01, segments.at(-1)?.endKm ?? segments.length);
  const xTicks = buildDistanceTicks(totalDistanceKm);
  const zeroY = mapValueToY(0, axis.min, axis.max, margin.top, plotHeight);

  return `
    <article class="summary-card gpx-chart-card">
      <h3>${title}</h3>
      <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${title}">
        ${renderChartAxes({
          width,
          height,
          margin,
          plotWidth,
          plotHeight,
          xTicks,
          yTicks: axis.ticks,
          yFormatter: allowNegative
            ? (value) => `${Math.round(value)}m`
            : (value) => formatClock(value),
          yMin: axis.min,
          yMax: axis.max,
          xLabel: "km",
          yLabel: allowNegative ? "m" : "/km"
        })}
        ${allowNegative ? `<line class="gpx-zero-axis" x1="${margin.left}" y1="${zeroY}" x2="${margin.left + plotWidth}" y2="${zeroY}" />` : ""}
        ${values
          .map((value, index) => {
            const segment = segments[index];
            const segmentStartRatio = (segment?.startKm ?? index) / totalDistanceKm;
            const segmentEndRatio = (segment?.endKm ?? index + 1) / totalDistanceKm;
            const x = margin.left + segmentStartRatio * plotWidth + 2;
            const barWidth = Math.max(4, (segmentEndRatio - segmentStartRatio) * plotWidth - 4);
            const y = mapValueToY(Math.max(value, 0), axis.min, axis.max, margin.top, plotHeight);
            const barHeight = allowNegative
              ? Math.abs(mapValueToY(value, axis.min, axis.max, margin.top, plotHeight) - zeroY)
              : margin.top + plotHeight - y;
            const top = allowNegative && value < 0 ? zeroY : y;
            return `<rect x="${x.toFixed(1)}" y="${top.toFixed(1)}" width="${barWidth.toFixed(1)}" height="${Math.max(2, barHeight).toFixed(1)}" />`;
          })
          .join("")}
      </svg>
      <p>${formatValue(axis.min)} - ${formatValue(axis.max)} · x: km · y: ${allowNegative ? "m" : "/km"}</p>
    </article>
  `;
}

function renderGpxTable(segments, gpx) {
  const hasHeat = segments.some((segment) => segment.heatDeltaSecPerKm > 0.1);
  const headers = [
    state.locale === "en" ? "Seg" : "段落",
    state.locale === "en" ? "Range" : "距離範圍",
    state.locale === "en" ? "Distance" : "段距離",
    state.locale === "en" ? "Gain" : "爬升",
    state.locale === "en" ? "Loss" : "下降",
    state.locale === "en" ? "Net" : "淨海拔",
    state.locale === "en" ? "Avg grade" : "平均坡度",
    state.locale === "en" ? "Formula grade" : "公式用坡度",
    state.locale === "en" ? "Equivalent" : "目標等效配速",
    state.locale === "en" ? "Grade pace" : "坡度修正配速",
    state.locale === "en" ? "Grade delta" : "坡度修正差",
    ...(hasHeat
      ? [
          state.locale === "en" ? "Heat pace" : "溫濕度修正後配速",
          state.locale === "en" ? "Heat delta" : "溫濕度增加秒數",
          state.locale === "en" ? "Final delta" : "最終配速差"
        ]
      : []),
    state.locale === "en" ? "Grade time" : "坡度修正段時間",
    state.locale === "en" ? "Grade cumulative" : "坡度修正累積",
    ...(hasHeat
      ? [
          state.locale === "en" ? "Final time" : "最終段時間",
          state.locale === "en" ? "Final cumulative" : "最終累積時間"
        ]
      : []),
    state.locale === "en" ? "Notes" : "提示"
  ];

  return `
    <div class="gpx-table-wrap">
      <table class="gpx-table">
        <thead>
          <tr>${headers.map((header) => `<th>${header}</th>`).join("")}</tr>
        </thead>
        <tbody>
          ${segments
            .map(
              (segment) => `
                <tr>
                  <td>#${segment.index}</td>
                  <td>${segment.startKm.toFixed(1)}-${segment.endKm.toFixed(1)} km</td>
                  <td>${segment.distanceKm.toFixed(2)} km</td>
                  <td>${Math.round(segment.elevationGainM)} m</td>
                  <td>${Math.round(segment.elevationLossM)} m</td>
                  <td>${Math.round(segment.netElevationM)} m</td>
                  <td>${formatGrade(segment.averageGrade)}</td>
                  <td>${formatGrade(segment.gradeForFormula)}</td>
                  <td>${formatGpxPace(segment.targetEquivalentPaceSecPerKm)}</td>
                  <td><strong>${formatGpxPace(segment.recommendedActualPaceSecPerKm)}</strong></td>
                  <td>${formatGpxPaceDelta(segment.gradePaceDeltaSecPerKm)}</td>
                  ${
                    hasHeat
                      ? `
                        <td><strong>${formatGpxPace(segment.heatAdjustedPaceSecPerKm)}</strong></td>
                        <td>${formatGpxPaceDelta(segment.heatDeltaSecPerKm)}</td>
                        <td>${formatGpxPaceDelta(segment.finalPaceDeltaSecPerKm)}</td>
                      `
                      : ""
                  }
                  <td>${formatGpxDuration(segment.gradeAdjustedSegmentTimeSec)}</td>
                  <td>${formatGpxDuration(segment.cumulativeGradeAdjustedTimeSec)}</td>
                  ${
                    hasHeat
                      ? `
                        <td>${formatGpxDuration(segment.finalSegmentTimeSec)}</td>
                        <td>${formatGpxDuration(segment.cumulativeFinalTimeSec)}</td>
                      `
                      : ""
                  }
                  <td>${renderWarningInline(segment.warnings, gpx.gradeWarnings)}</td>
                </tr>
              `
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderWarningList(warnings, dictionary) {
  if (!warnings?.length) return "";
  return `
    <ul class="gpx-warning-list">
      ${warnings
        .map((warning) => `<li>${dictionary[warning] ?? warning}</li>`)
        .join("")}
    </ul>
  `;
}

function renderWarningInline(warnings, dictionary) {
  if (!warnings?.length) return "";
  return warnings
    .map((warning) => `<span class="gpx-warning-pill">${dictionary[warning] ?? warning}</span>`)
    .join("");
}

function renderEquivalentResults(model, t) {
  const result =
    state.converterType === "pace"
      ? getPaceEquivalent(model.heatAdjustment.multiplier)
      : getRaceEquivalent(model.heatAdjustment.multiplier);

  return `
    <div class="section-heading">
      <p class="eyebrow">${t.heatEquivalentMode}</p>
      <h2>${t.equivalentResult}</h2>
    </div>
    <section class="equivalent-panel">
      <p class="equivalent-lead">${getEquivalentAssumption(t)}</p>
      <div class="equivalent-grid">
        ${result.cards
          .map(
            (card) => `
              <article class="equivalent-card ${card.highlight ? "highlight" : ""}">
                <span>${card.label}</span>
                <strong>${card.value}</strong>
                ${card.meta ? `<small>${card.meta}</small>` : ""}
              </article>
            `
          )
          .join("")}
      </div>
      <aside class="note-panel equivalent-note">
        <h2>${t.heatAdjustment}</h2>
        <p>${t.slowerBy}: ${model.heatAdjustment.percentage}% · ${t.dewPoint}: ${model.heatAdjustment.dewPoint}${t.celsius}</p>
        <p>${state.converterType === "pace" ? t.paceConverter : t.raceConverter} · ${state.equivalentDirection === "hotToCool" ? t.hotToCool : t.coolToHot}</p>
      </aside>
    </section>
  `;
}

function renderGpxCatalogFilters() {
  return `
    <div class="field-grid catalog-filter-grid">
      <label class="field">
        <span>月份篩選</span>
        <select data-catalog-field="catalogMonth">
          ${[
            { value: "all", label: "全部月份" },
            ...Array.from({ length: 12 }, (_, index) => ({
              value: String(index + 1),
              label: `${index + 1} 月`
            }))
          ]
            .map(
              (option) =>
                `<option value="${option.value}" ${String(state.catalogMonth) === option.value ? "selected" : ""}>${option.label}</option>`
            )
            .join("")}
        </select>
      </label>
      <label class="field">
        <span>關鍵字搜尋</span>
        <input
          type="search"
          data-catalog-field="catalogKeyword"
          value="${escapeHtml(state.catalogKeyword)}"
          placeholder="搜尋賽事、城市、地點、標籤"
        />
      </label>
      <aside class="note-panel catalog-warning">
        <strong>資料提醒</strong>
        <p>目前資料為人工收錄或手動重建 GPX，不保證與官方丈量或當日封路動線完全一致。使用前請自行確認官方公告與賽道資訊。</p>
      </aside>
    </div>
  `;
}

function getFilteredCatalogItems() {
  return filterCatalogItems(gpxCatalog, {
    month: state.catalogMonth,
    keyword: state.catalogKeyword
  });
}

function getSelectedCatalogItem() {
  return gpxCatalog.find((item) => item.id === state.catalogSelectedId) ?? null;
}

function renderGpxCatalogPage() {
  const items = getFilteredCatalogItems();
  return `
    <section class="gpx-catalog-page">
      <div class="section-heading">
        <p class="eyebrow">GPX</p>
        <h2>GPX 開源賽事庫</h2>
        <p class="subtitle">依月份與關鍵字尋找賽事 GPX，可下載，或直接帶入 GPX 坡度分析工具。</p>
      </div>
      <aside class="note-panel catalog-warning">
        目前資料為人工收錄或手動重建 GPX，不保證與官方丈量或當日封路動線完全一致。使用前請自行確認官方公告與賽道資訊。
      </aside>
      <div class="catalog-count">目前顯示 ${items.length} 筆 GPX。</div>
      <div class="catalog-list">
        ${
          items.length
            ? items.map((item) => renderGpxRaceCard(item)).join("")
            : `<p class="gpx-empty">沒有符合條件的 GPX。</p>`
        }
      </div>
      ${renderCatalogAboutPanel()}
    </section>
  `;
}

function renderGpxRaceCard(item) {
  return `
    <article class="catalog-card ${state.catalogSelectedId === item.id ? "selected" : ""}">
      <div>
        <p class="eyebrow">${item.eventYear ?? "年份待補"} · ${item.eventMonth} 月</p>
        <h3>${escapeHtml(formatCatalogRaceTitle(item))}</h3>
      </div>
      <dl class="catalog-meta">
        <div><dt>月份</dt><dd>${item.eventMonth} 月</dd></div>
        <div><dt>地點</dt><dd>${escapeHtml([item.city, item.location].filter(Boolean).join(" / ") || "待補")}</dd></div>
        <div><dt>來源</dt><dd>${sourceTypeLabel(item.sourceType)}</dd></div>
      </dl>
      <p>${escapeHtml(item.sourceNote || item.description)}</p>
      <div class="catalog-actions">
        <button type="button" class="secondary-button" data-action="catalog-download" data-catalog-id="${item.id}">下載 GPX</button>
        <button type="button" class="secondary-button" data-action="catalog-analysis" data-catalog-id="${item.id}">GPX 坡度分析</button>
      </div>
    </article>
  `;
}

function renderCatalogDetailPanel() {
  const item = getSelectedCatalogItem();
  if (state.catalogLoading) {
    return `<section class="summary-card catalog-detail"><p class="gpx-empty">GPX 讀取中...</p></section>`;
  }
  if (state.catalogError) {
    return `<section class="summary-card catalog-detail"><p class="gpx-error">${escapeHtml(state.catalogError)}</p></section>`;
  }
  if (!item || !state.catalogParsedGpx) {
    return `<section class="summary-card catalog-detail"><p class="gpx-empty">請先選擇一筆 GPX 進行預覽或坡度分析。</p></section>`;
  }

  return `
    <section class="summary-card catalog-detail">
      <div class="section-heading">
        <p class="eyebrow">${state.catalogPanelMode === "analysis" ? "坡度分析" : "路線預覽"}</p>
        <h2>${escapeHtml(formatCatalogRaceTitle(item))}</h2>
      </div>
      ${renderCatalogRouteSummary(item, state.catalogParsedGpx)}
      ${renderCatalogPreviewMap(state.catalogParsedGpx)}
      ${
        state.catalogPanelMode === "analysis"
          ? renderCatalogSlopeAnalysis(item, state.catalogParsedGpx)
          : ""
      }
    </section>
  `;
}

function formatCatalogRaceTitle(item) {
  const year = item.eventYear ?? "年份待補";
  return `${year} ${item.raceName} - ${item.distanceLabel}`;
}

function renderCatalogRouteSummary(item, parsed) {
  return `
    <div class="gpx-summary">
      ${[
        ["官方距離", item.officialDistanceKm == null ? "待補" : `${item.officialDistanceKm} km`],
        ["GPX 計算距離", formatDistanceKm(parsed.distanceKm)],
        ["海拔資料", parsed.hasElevation ? "有 elevation" : "沒有 elevation"],
        ["總爬升", parsed.totalAscentM == null ? "-" : formatMeters(parsed.totalAscentM)],
        ["總下降", parsed.totalDescentM == null ? "-" : formatMeters(parsed.totalDescentM)]
      ]
        .map(
          ([label, value]) => `
            <div class="metric-card">
              <span>${label}</span>
              <strong>${value}</strong>
            </div>
          `
        )
        .join("")}
    </div>
    ${
      parsed.points.length
        ? ""
        : `<p class="gpx-error">此 GPX 未包含可解析的 trkpt 路線點。</p>`
    }
    ${
      !parsed.hasElevation
        ? `<p class="field-note">此 GPX 沒有海拔資料，坡度分析需要匯入海拔資料或串接 DEM / elevation API。</p>`
        : `<p class="field-note">GPS elevation 未平滑，爬升下降可能因 GPS 雜訊而有誤差。</p>`
    }
  `;
}

function renderCatalogPreviewMap(parsed) {
  if (!parsed.points.length) return "";
  const bounds = getCatalogBounds(parsed.points);
  const width = 720;
  const height = 340;
  const path = parsed.points
    .map((point, index) => {
      const x = mapRange(point.lng, bounds.minLng, bounds.maxLng, 24, width - 24);
      const y = mapRange(point.lat, bounds.minLat, bounds.maxLat, height - 24, 24);
      return `${index === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");

  const start = parsed.points[0];
  const end = parsed.points.at(-1);
  const startX = mapRange(start.lng, bounds.minLng, bounds.maxLng, 24, width - 24);
  const startY = mapRange(start.lat, bounds.minLat, bounds.maxLat, height - 24, 24);
  const endX = mapRange(end.lng, bounds.minLng, bounds.maxLng, 24, width - 24);
  const endY = mapRange(end.lat, bounds.minLat, bounds.maxLat, height - 24, 24);

  return `
    <div class="catalog-map-shell">
      <div id="catalog-leaflet-map" class="catalog-leaflet-map" aria-label="GPX 路線地圖"></div>
      <svg class="catalog-route-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="GPX 路線預覽">
        <rect x="0" y="0" width="${width}" height="${height}" rx="10" />
        <path d="${path}" />
        <circle cx="${startX.toFixed(1)}" cy="${startY.toFixed(1)}" r="7" class="start" />
        <circle cx="${endX.toFixed(1)}" cy="${endY.toFixed(1)}" r="7" class="end" />
        <text x="${startX + 10}" y="${startY - 8}">起點</text>
        <text x="${endX + 10}" y="${endY - 8}">終點</text>
      </svg>
    </div>
  `;
}

function renderCatalogSlopeAnalysis(item, parsed) {
  if (!parsed.points.length) return "";
  if (!parsed.hasElevation) {
    return `
      <section class="catalog-analysis-panel">
        <h3>分段坡度表</h3>
        <p class="gpx-error">此 GPX 沒有海拔資料，暫時無法計算坡度。未來版本可加入 DEM elevation lookup 或使用外部 elevation API 補齊海拔。</p>
      </section>
    `;
  }

  const segments = analyzeElevationBySegments(parsed.points, state.catalogSegmentDistanceKm);
  return `
    <section class="catalog-analysis-panel">
      <div class="catalog-analysis-controls">
        <label class="field">
          <span>分段距離</span>
          <select data-catalog-field="catalogSegmentDistanceKm">
            ${[0.5, 1, 2, 5]
              .map(
                (value) =>
                  `<option value="${value}" ${Number(state.catalogSegmentDistanceKm) === value ? "selected" : ""}>${value} km</option>`
              )
              .join("")}
          </select>
        </label>
        <label class="field">
          <span>目標平路配速</span>
          <input type="text" data-catalog-field="catalogTargetPaceInput" value="${escapeHtml(state.catalogTargetPaceInput)}" placeholder="4:30/km" />
        </label>
        <button type="button" class="secondary-button" disabled>計算等強配速</button>
      </div>
      <aside class="note-panel">
        <strong>等強配速換算：尚未啟用</strong>
        <p>此功能尚未啟用。未來版本會根據坡度成本模型估算每段建議配速。</p>
      </aside>
      <div class="gpx-table-wrap">
        <table class="gpx-table">
          <thead>
            <tr>
              <th>起點</th>
              <th>終點</th>
              <th>段距離</th>
              <th>爬升</th>
              <th>下降</th>
              <th>淨高差</th>
              <th>平均坡度</th>
              <th>坡度分類</th>
            </tr>
          </thead>
          <tbody>
            ${segments
              .map(
                (segment) => `
                  <tr>
                    <td>${segment.startKm.toFixed(1)} km</td>
                    <td>${segment.endKm.toFixed(1)} km</td>
                    <td>${formatDistanceKm(segment.distanceKm)}</td>
                    <td>${formatMeters(segment.ascentM)}</td>
                    <td>${formatMeters(segment.descentM)}</td>
                    <td>${formatMeters(segment.netElevationM)}</td>
                    <td>${formatCatalogPercent(segment.averageGradePercent)}</td>
                    <td><strong>${segment.gradeCategory}</strong></td>
                  </tr>
                `
              )
              .join("")}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function renderCatalogAboutPanel() {
  return `
    <section class="note-panel catalog-about">
      <h2>關於 GPX 開源賽事庫</h2>
      <p>此賽事庫的目標是收錄可供跑者參考的路跑賽道 GPX。資料可能來自官方公告、人工重建或使用者提供。由於路跑賽事常涉及封路、高架、折返點與臨時動線，本工具不保證 GPX 與官方丈量結果完全一致。</p>
      <p>使用前請確認官方公告、比賽當日路線與實際交通管制。</p>
    </section>
  `;
}

function getCatalogBounds(points) {
  const lats = points.map((point) => point.lat);
  const lngs = points.map((point) => point.lng);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  return {
    minLat,
    maxLat: maxLat === minLat ? maxLat + 0.001 : maxLat,
    minLng,
    maxLng: maxLng === minLng ? maxLng + 0.001 : maxLng
  };
}

function mapRange(value, min, max, outputMin, outputMax) {
  if (max === min) return (outputMin + outputMax) / 2;
  return outputMin + ((value - min) / (max - min)) * (outputMax - outputMin);
}

function initializeCatalogMap() {
  const container = document.querySelector("#catalog-leaflet-map");
  const parsed = state.catalogParsedGpx;
  if (!container || !parsed?.points?.length || !window.L) return;

  container.innerHTML = "";
  const map = window.L.map(container, {
    attributionControl: true,
    scrollWheelZoom: false
  });
  window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  const latLngs = parsed.points.map((point) => [point.lat, point.lng]);
  window.L.polyline(latLngs, { color: "#0a7d6b", weight: 5 }).addTo(map);
  window.L.marker(latLngs[0]).addTo(map).bindPopup("起點");
  window.L.marker(latLngs.at(-1)).addTo(map).bindPopup("終點");
  map.fitBounds(latLngs, { padding: [18, 18] });

  const svg = document.querySelector(".catalog-route-svg");
  if (svg) svg.classList.add("leaflet-active");
}

function renderMenuField(label, field, value, items, className = "field") {
  const selected = items.find((item) => String(item.value) === String(value)) ?? items[0];
  const isOpen = state.openMenu === field;
  const labelMarkup =
    field === "locale"
      ? `<span class="menu-label-with-icon">${renderGlobeIcon()}<span>${label}</span></span>`
      : `<span>${label}</span>`;

  return `
    <div class="${className}">
      ${labelMarkup}
      <div class="ability-select ${isOpen ? "open" : ""}">
        <button
          type="button"
          class="ability-select-trigger"
          data-action="toggle-menu"
          data-menu="${field}"
          aria-haspopup="listbox"
          aria-expanded="${isOpen}"
        >
          <span>${selected.label}</span>
          <b aria-hidden="true">⌄</b>
        </button>
        <div class="ability-menu" role="listbox" aria-label="${label}">
          ${items
            .map((item) => renderMenuOption(field, String(item.value), item.label, value))
            .join("")}
        </div>
      </div>
    </div>
  `;
}

function renderGlobeIcon() {
  return `
    <svg class="menu-label-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a13 13 0 0 1 0 18" />
      <path d="M12 3a13 13 0 0 0 0 18" />
    </svg>
  `;
}

function renderMenuOption(field, value, label, selectedValue) {
  const active = String(value) === String(selectedValue);
  return `
    <button
      type="button"
      class="ability-option ${active ? "active" : ""}"
      data-action="select-menu-option"
      data-field="${field}"
      data-value="${value}"
      role="option"
      aria-selected="${active}"
    >
      ${label}
    </button>
  `;
}

function renderEnvironmentSummary(model, t) {
  return `
    <section class="summary-card heat-card">
      <p class="eyebrow">${t.heatAdjustment}</p>
      <div class="metric-row">
        <div>
          <span>${t.heatIndex}</span>
          <strong>${model.heatAdjustment.heatIndex}${t.celsius}</strong>
        </div>
        <div>
          <span>${t.speedLoss}</span>
          <strong>${model.heatAdjustment.speedLossPercentage}%</strong>
        </div>
        <div>
          <span>${t.slowerBy}</span>
          <strong>${model.heatAdjustment.percentage}%</strong>
        </div>
        <div>
          <span>${t.recoveryHot}</span>
          <strong>+${model.heatAdjustment.recoveryPercentage}%</strong>
        </div>
        <div>
          <span>${t.dewPoint}</span>
          <strong>${model.heatAdjustment.dewPoint}${t.celsius}</strong>
        </div>
      </div>
      <div class="heat-formula">
        <h3>${t.heatFormulaTitle}</h3>
        <p>${t.heatFormula}</p>
        <h3>${t.heatReferencesTitle}</h3>
        <ul>
          ${t.heatReferences.map((reference) => `<li>${reference}</li>`).join("")}
        </ul>
      </div>
    </section>
  `;
}

function renderVdotEquivalentResults(model, t) {
  const results = getVdotEquivalentRaceResults(model.vdot);

  return `
    <section class="summary-card vdot-equivalent-card">
      <p class="eyebrow">${t.vdotEquivalentTitle}</p>
      <div class="vdot-equivalent-grid">
        ${results
          .map((result) => {
            const basePaceSeconds = result.seconds / (result.meters / 1000);
            const heatAdjustedSeconds = result.seconds * model.heatAdjustment.multiplier;
            const heatAdjustedPaceSeconds =
              basePaceSeconds * model.heatAdjustment.multiplier;

            return `
              <article>
                <span>${state.locale === "en" ? result.en : result.zh}</span>
                <strong>${formatFinishTime(result.seconds)}</strong>
                <small>${t.estimatedPace} ${formatPaceForUnit(
                  basePaceSeconds,
                  state.unitSystem
                )}</small>
                <div class="vdot-heat-equivalent">
                  <small>${t.heatAdjustedEquivalentResult} ${formatFinishTime(
                    heatAdjustedSeconds
                  )}</small>
                  <small>${t.heatAdjustedEquivalentPace} ${formatPaceForUnit(
                    heatAdjustedPaceSeconds,
                    state.unitSystem
                  )}</small>
                </div>
              </article>
            `;
          })
          .join("")}
      </div>
      <p>${t.vdotEquivalentNote}</p>
    </section>
  `;
}

function renderMileageClass(model, t) {
  const qualityLabels = model.mileageClass.qualityTypes
    .map((type) => t.zoneNames[type])
    .join(" / ");

  return `
    <section class="summary-card">
      <p class="eyebrow">${t.mileageClass}</p>
      <h2>${t.classNames[model.mileageClass.id]}</h2>
      <p>${model.mileageClass.min}-${model.mileageClass.max ?? "120+"} km</p>
      <dl class="simple-list">
        <div>
          <dt>${t.availableQuality}</dt>
          <dd>${qualityLabels}</dd>
        </div>
      </dl>
    </section>
  `;
}

function renderTrainingPlanResults(model, t) {
  return `
    <div class="section-heading">
      <p class="eyebrow">VDOT ${model.vdot}</p>
      <h2>${t.trainingPlanMode}</h2>
    </div>
    ${renderWeeklySchedule(model, t)}
    ${renderWorkoutExamples(model, t)}
    <aside class="note-panel">
      <h2>${t.noteTitle}</h2>
      <p>${t.note}</p>
      <h3>${t.sourceTitle}</h3>
      <p>${t.sourceNote}</p>
    </aside>
  `;
}

function renderPaceZonePanel(model, t, embedded = false, options = {}) {
  const showAdjusted = options.showAdjusted ?? true;
  return `
    <section class="${embedded ? "" : "summary-card"} pace-zone-panel ${embedded ? "embedded" : ""} ${state.locale === "en" ? "english" : ""}">
      ${embedded ? "" : `<p class="eyebrow">${t.paceZones}</p>`}
      <div class="pace-zone-grid">
        ${model.zones.map((zone) => renderPaceZone(zone, t, { showAdjusted })).join("")}
      </div>
    </section>
  `;
}

function renderWeeklySchedule(model, t) {
  const schedule = applyEasyRunRedistribution(model.weeklySchedule);
  const orderedSchedule = getOrderedSchedule(schedule);
  const fixedDayLabels = schedule.map((day) =>
    state.locale === "en" ? day.enDay : day.zhDay
  );
  const hasOpenSwapMenu = typeof state.openMenu === "string" &&
    state.openMenu.startsWith("plan-workout-");

  return `
    <section class="weekly-plan ${hasOpenSwapMenu ? "swap-open" : ""}">
      <div class="weekly-plan-head">
        <div>
          <p class="eyebrow">${t.targetRaceNames[model.targetRace]} · ${t.cycleNames[model.trainingCycle]}</p>
          <h3>${t.weeklyPlan}</h3>
        </div>
        <p>${t.weeklyPlanNote}</p>
      </div>
      <div class="week-scroll">
        <div class="week-day-row" aria-hidden="true">
          ${fixedDayLabels.map((label) => `<span>${label}</span>`).join("")}
        </div>
        <div class="week-grid" data-plan-grid>
          ${orderedSchedule
            .map(({ day, index }) => renderPlanDay(day, t, index, model))
            .join("")}
        </div>
      </div>
    </section>
  `;
}

function renderPlanDay(day, t, index, model) {
  const candidates = getPlanWorkoutCandidates(day, model);
  const selectedWorkout = getSelectedPlanWorkout(index, candidates);
  const title = selectedWorkout
    ? state.locale === "en"
      ? selectedWorkout.en
      : selectedWorkout.zh
    : state.locale === "en"
      ? day.en
      : day.zh;
  const paceBlock = day.pace
    ? `<div class="plan-pace">
        <strong><small>${day.zone === "R" ? t.rTargetPaceShort : t.adjustedPaceShort}</small>${day.pace}</strong>
        <em><small>${t.basePaceShort}</small>${day.base}</em>
      </div>`
    : "";
  const easyRestControl = renderEasyRestControl(day, index, t);

  return `
    <article
      class="plan-day ${zoneTone[day.zone]} ${day.isSkippedEasyRun ? "is-rest" : ""}"
      draggable="true"
      data-plan-card
      data-plan-index="${index}"
      aria-label="${title}"
    >
      ${renderPlanWorkoutSwitcher(index, candidates, selectedWorkout, t)}
      ${easyRestControl}
      <div>
        <b>${day.zone}</b>
        <p>${title}</p>
        ${paceBlock}
      </div>
    </article>
  `;
}

function renderEasyRestControl(day, index, t) {
  if (!day.easyDistributionEligible) return "";

  return `
    <button
      type="button"
      class="easy-rest-toggle ${day.isSkippedEasyRun ? "active" : ""}"
      data-action="toggle-easy-rest"
      data-plan-index="${index}"
      draggable="false"
      aria-pressed="${day.isSkippedEasyRun ? "true" : "false"}"
    >
      ${day.isSkippedEasyRun ? t.restoreEasyRun : t.skipEasyRun}
    </button>
  `;
}

function renderPlanWorkoutSwitcher(index, candidates, selectedWorkout, t) {
  if (candidates.length === 0) return "";

  const menuId = `plan-workout-${index}`;
  const isOpen = state.openMenu === menuId;

  return `
    <div class="plan-swap ${isOpen ? "open" : ""}">
      <button
        type="button"
        class="plan-swap-trigger"
        data-action="toggle-plan-workout-menu"
        data-menu="${menuId}"
        draggable="false"
        aria-expanded="${isOpen}"
      >
        <span>${t.switchWorkout}</span>
      </button>
      <div class="plan-swap-menu">
        <button
          type="button"
          class="plan-swap-option ${selectedWorkout ? "" : "active"}"
          data-action="select-plan-workout"
          data-plan-index="${index}"
          data-workout-id=""
          draggable="false"
        >
          ${t.coachPick}
        </button>
        ${candidates
          .map((workout) => renderPlanWorkoutOption(index, workout, selectedWorkout))
          .join("")}
      </div>
    </div>
  `;
}

function renderPlanWorkoutOption(index, workout, selectedWorkout) {
  const active = selectedWorkout?.id === workout.id;
  const label = state.locale === "en" ? workout.en : workout.zh;
  return `
    <button
      type="button"
      class="plan-swap-option ${active ? "active" : ""}"
      data-action="select-plan-workout"
      data-plan-index="${index}"
      data-workout-id="${workout.id}"
      draggable="false"
    >
      ${label}
    </button>
  `;
}

function renderWorkoutExamples(model, t) {
  const zoneById = Object.fromEntries(model.zones.map((zone) => [zone.id, zone]));
  const groupedExamples = [WorkoutGroup.THRESHOLD, WorkoutGroup.INTERVAL, WorkoutGroup.REPETITION]
    .map((zoneId) => ({
      zoneId,
      zone: zoneById[zoneId],
      examples: model.workoutExamples.filter((example) => example.zone === zoneId)
    }))
    .filter((group) => group.examples.length > 0);

  return `
    <div class="example-list">
      <p class="drag-hint">${t.draggableWorkoutHint}</p>
      ${groupedExamples.map((group) => renderWorkoutGroup(group, t)).join("")}
    </div>
  `;
}

const WorkoutGroup = {
  THRESHOLD: "T",
  INTERVAL: "I",
  REPETITION: "R"
};

function renderWorkoutGroup(group, t) {
  const examples = getOrderedWorkoutExamples(group.zoneId, group.examples);

  return `
    <section class="example-group ${zoneTone[group.zoneId]}">
      <div class="example-group-heading">
        <span>${group.zoneId}</span>
        <div>
          <h3>${t.zoneNames[group.zoneId]}</h3>
          <p>${group.zone?.adjusted.label ?? ""}</p>
        </div>
      </div>
      <div class="example-row">
        ${examples
          .map((example) => renderWorkoutExample(example, t, group.zone))
          .join("")}
      </div>
    </section>
  `;
}

function renderWorkoutExample(example, t, zone) {
  const title = state.locale === "en" ? example.en : example.zh;
  const adjustedPace = zone?.adjusted.label ?? "";
  const basePace = zone?.base.label ?? "";
  const primaryPaceLabel =
    zone?.id === "R" ? t.rTargetPaceShort : t.adjustedPaceShort;
  const recoveryLabel =
    state.locale === "en" ? example.enRecoveryLabel : example.recoveryLabel;
  const heatRecoveryLabel =
    state.locale === "en" ? example.enHeatRecoveryLabel : example.heatRecoveryLabel;

  return `
    <article
      class="example-card ${zoneTone[example.zone]}"
      data-example-card
      data-example-zone="${example.zone}"
      data-example-id="${example.id}"
      draggable="false"
    >
      <div class="example-header">
        <div class="example-zone">
          <span>${example.zone}</span>
          <div class="example-pace-pair">
            <strong><small>${primaryPaceLabel}</small>${adjustedPace}</strong>
            <em><small>${t.basePaceShort}</small>${basePace}</em>
          </div>
        </div>
      </div>
      <h3>${title}</h3>
      <dl class="example-meta">
        <div>
          <dt>${t.recovery}</dt>
          <dd>
            <span>${localizeRecovery(recoveryLabel)}</span>
            ${
              example.recoveryExtensionPercentage > 0
                ? `<em>${t.recoveryHot}: ${localizeRecovery(heatRecoveryLabel)}</em>`
                : ""
            }
          </dd>
        </div>
        <div>
          <dt>${t.totalTime}</dt>
          <dd>${localizeTimeText(example.totalTime)}</dd>
        </div>
      </dl>
    </article>
  `;
}

function getOrderedWorkoutExamples(zoneId, examples) {
  const ids = examples.map((example) => example.id);
  const current = state.exampleOrder[zoneId];

  if (
    !Array.isArray(current) ||
    current.length !== ids.length ||
    current.some((id) => !ids.includes(id))
  ) {
    state.exampleOrder[zoneId] = ids;
  }

  return state.exampleOrder[zoneId]
    .map((id) => examples.find((example) => example.id === id))
    .filter(Boolean);
}

function renderPaceZone(zone, t, options = {}) {
  const showAdjusted = options.showAdjusted ?? true;
  const adjustedLabel = zone.id === "R" ? t.rTargetPace : t.adjustedPace;
  const paceValuesClass =
    zone.id === "R" || !showAdjusted ? "pace-values single" : "pace-values";

  return `
    <article class="pace-card ${zoneTone[zone.id]}">
      <div class="pace-card-header">
        <span>${zone.id}</span>
        <h3>${t.zoneNames[zone.id]}</h3>
      </div>
      <div class="${paceValuesClass}">
        <div>
          <dt>${t.basePace}</dt>
          <dd>${zone.base.label}</dd>
        </div>
        ${
          zone.id === "R" || !showAdjusted
            ? ""
            : `<div class="adjusted">
                <dt>${adjustedLabel}</dt>
                <dd>${zone.adjusted.label}</dd>
              </div>`
        }
      </div>
      ${
        zone.id === "I" && showAdjusted
          ? `<div class="split-row">
              ${renderSplitComparison(t.split400, zone.adjustedSplit400m, zone.baseSplit400m, t, zone.id)}
              ${renderSplitComparison(t.split200, zone.adjustedSplit200m, zone.baseSplit200m, t, zone.id)}
            </div>`
          : ""
      }
      ${zone.id === "E" && showAdjusted ? renderEasyPaceNote(t) : ""}
      ${zone.id === "R" && showAdjusted ? renderRepetitionHeatNote(t) : ""}
    </article>
  `;
}

function renderEasyPaceNote(t) {
  return `
    <div class="pace-card-note easy-note">
      <p>${t.easyPaceGuidance}</p>
    </div>
  `;
}

function renderRepetitionHeatNote(t) {
  return `
    <div class="pace-card-note">
      <p>${t.rHeatGuidance}</p>
      <ul>
        ${t.rReferences.map((reference) => `<li>${reference}</li>`).join("")}
      </ul>
    </div>
  `;
}

function renderSplitComparison(label, adjusted, base, t, zoneId) {
  const primaryPaceLabel = zoneId === "R" ? t.rTargetPaceShort : t.adjustedPaceShort;

  return `
    <span class="split-comparison">
      <b>${label}</b>
      <strong><small>${primaryPaceLabel}</small>${adjusted}</strong>
      <em><small>${t.basePaceShort}</small>${base}</em>
    </span>
  `;
}

function localizeRecovery(label) {
  if (state.locale === "en") {
    return label
      .replaceAll("依課表內容", "As prescribed")
      .replaceAll("熱天依體感延長", "extend by feel in heat");
  }
  return label.replace("jog", "慢跑");
}

function localizeTimeText(label) {
  if (state.locale === "en") return label.replaceAll("分鐘", "min");
  return label;
}

function bindEvents() {
  app.querySelectorAll("[data-field]").forEach((input) => {
    input.addEventListener("input", handleFieldChange);
    input.addEventListener("change", handleFieldChange);
  });

  app.querySelectorAll("[data-gpx-field]").forEach((input) => {
    input.addEventListener("input", handleGpxFieldChange);
    input.addEventListener("change", handleGpxFieldChange);
  });

  app.querySelectorAll("[data-gpx-file]").forEach((input) => {
    input.addEventListener("change", handleGpxFileChange);
  });

  app.querySelectorAll("[data-catalog-field]").forEach((input) => {
    input.addEventListener("input", handleCatalogFieldChange);
    input.addEventListener("change", handleCatalogFieldChange);
  });

  app.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", handleAction);
  });

  const prefersTouchScrolling =
    window.innerWidth <= 900 ||
    navigator.maxTouchPoints > 0 ||
    window.matchMedia?.("(pointer: coarse)").matches ||
    window.matchMedia?.("(hover: none)").matches;

  if (!prefersTouchScrolling) {
    app.querySelectorAll("[data-plan-card]").forEach((card) => {
      card.addEventListener("dragstart", handlePlanDragStart);
      card.addEventListener("dragover", handlePlanDragOver);
      card.addEventListener("dragend", handlePlanDragEnd);
      card.addEventListener("drop", handlePlanDrop);
    });
  } else {
    app.querySelectorAll("[data-plan-card]").forEach((card) => {
      card.addEventListener("touchstart", handlePlanTouchStart, { passive: true });
      card.addEventListener("touchmove", handlePlanTouchMove, { passive: false });
      card.addEventListener("touchend", handlePlanTouchEnd);
      card.addEventListener("touchcancel", handlePlanTouchEnd);
    });
  }

  app.querySelectorAll(".week-scroll").forEach((scroller) => {
    scroller.addEventListener("scroll", positionOpenPlanSwapMenu, { passive: true });
  });

  window.removeEventListener("scroll", positionOpenPlanSwapMenu);
  window.removeEventListener("resize", positionOpenPlanSwapMenu);
  window.removeEventListener("mousemove", handleExampleMouseMove);
  window.removeEventListener("mouseup", handleExampleMouseEnd);
  window.addEventListener("scroll", positionOpenPlanSwapMenu, { passive: true });
  window.addEventListener("resize", positionOpenPlanSwapMenu);
  window.addEventListener("mousemove", handleExampleMouseMove);
  window.addEventListener("mouseup", handleExampleMouseEnd);

  positionOpenPlanSwapMenu();
}

function fitPaceZonePanel() {
  const panel = app.querySelector(".pace-zone-panel");
  if (!panel) return;

  const applyFit = () => {
    const width = panel.getBoundingClientRect().width;
    const columns = Math.max(1, Math.min(3, Math.floor(width / 460)));
    const scale = Math.max(0.86, Math.min(1.02, width / (columns * 500)));

    panel.style.setProperty("--pace-columns", String(columns));
    panel.style.setProperty("--pace-font-scale", String(scale.toFixed(3)));
  };

  if ("ResizeObserver" in window) {
    pacePanelObserver?.disconnect();
    pacePanelObserver = new ResizeObserver(applyFit);
    pacePanelObserver.observe(panel);
  } else {
    window.removeEventListener("resize", applyFit);
    window.addEventListener("resize", applyFit);
  }

  applyFit();
}

function handleFieldChange(event) {
  const field = event.currentTarget.dataset.field;
  const value = event.currentTarget.value;

  if (event.currentTarget.type === "range" && event.type === "input") {
    syncRangeNumber(field, value);
    return;
  }

  if (event.currentTarget.type === "number" && event.type === "input") {
    updateFieldValue(field, value);
    syncRangeSlider(field, value);
    return;
  }

  updateFieldValue(field, value);
  render();
}

function syncRangeNumber(field, value) {
  app.querySelectorAll(`input[data-field="${field}"]`).forEach((input) => {
    if (input.type === "number") input.value = value;
  });
}

function syncRangeSlider(field, value) {
  app.querySelectorAll(`input[data-field="${field}"]`).forEach((input) => {
    if (input.type === "range") input.value = value;
  });
}

function updateFieldValue(field, value) {
  state.openMenu = null;

  if (field === "unitSystem") {
    updateUnitSystem(value);
    return;
  }

  if (
    field === "locale" ||
    field === "toolMode" ||
    field === "converterType" ||
    field === "equivalentDirection" ||
    field === "abilityMode" ||
    field === "targetRace" ||
    field === "trainingCycle"
  ) {
    state[field] = value;
  } else {
    state[field] = Number(value);
  }
}

function updateUnitSystem(nextUnitSystem) {
  if (state.unitSystem === nextUnitSystem) return;

  const weeklyMileageKm =
    state.unitSystem === UnitSystem.IMPERIAL
      ? state.weeklyMileage * KM_PER_MILE
      : state.weeklyMileage;
  const paceSecondsPerKm =
    state.unitSystem === UnitSystem.IMPERIAL
      ? getPaceInputSeconds() / KM_PER_MILE
      : getPaceInputSeconds();

  state.unitSystem = nextUnitSystem;
  const convertedMileage =
    nextUnitSystem === UnitSystem.IMPERIAL
      ? Math.round(weeklyMileageKm / KM_PER_MILE)
      : Math.round(weeklyMileageKm);
  const nextMax = nextUnitSystem === UnitSystem.IMPERIAL ? 112 : 180;
  state.weeklyMileage = Math.min(nextMax, Math.max(0, convertedMileage));

  const convertedPaceSeconds =
    nextUnitSystem === UnitSystem.IMPERIAL
      ? paceSecondsPerKm * KM_PER_MILE
      : paceSecondsPerKm;
  state.paceMinutes = Math.floor(convertedPaceSeconds / 60);
  state.paceSeconds = Math.round(convertedPaceSeconds % 60);
  if (state.paceSeconds >= 60) {
    state.paceMinutes += 1;
    state.paceSeconds = 0;
  }
}

function handleAction(event) {
  const action = event.currentTarget.dataset.action;

  if (action === "toggle-menu") {
    const menu = event.currentTarget.dataset.menu;
    state.openMenu = state.openMenu === menu ? null : menu;
  }

  if (action === "toggle-sidebar") {
    state.sidebarOpen = !state.sidebarOpen;
    state.openMenu = null;
  }

  if (action === "set-theme") {
    state.theme = event.currentTarget.dataset.theme === "light" ? "light" : "dark";
    state.openMenu = null;
  }

  if (action === "select-menu-option") {
    updateFieldValue(
      event.currentTarget.dataset.field,
      event.currentTarget.dataset.value
    );
  }

  if (action === "toggle-plan-workout-menu") {
    const menu = event.currentTarget.dataset.menu;
    state.openMenu = state.openMenu === menu ? null : menu;
  }

  if (action === "select-plan-workout") {
    const index = event.currentTarget.dataset.planIndex;
    const workoutId = event.currentTarget.dataset.workoutId;

    if (workoutId) {
      state.planWorkoutOverrides[index] = workoutId;
    } else {
      delete state.planWorkoutOverrides[index];
    }
    state.openMenu = null;
  }

  if (action === "toggle-easy-rest") {
    const index = event.currentTarget.dataset.planIndex;
    if (state.skippedEasyDays[index]) {
      delete state.skippedEasyDays[index];
    } else {
      state.skippedEasyDays[index] = true;
    }
    state.openMenu = null;
  }

  if (action === "export-gpx-csv") {
    exportGpxCsv();
    return;
  }

  if (action === "catalog-download") {
    handleCatalogDownload(event.currentTarget.dataset.catalogId);
    return;
  }

  if (action === "catalog-analysis") {
    loadCatalogItemAsGpxAnalysis(event.currentTarget.dataset.catalogId);
    return;
  }

  render();
}

async function loadCatalogItemAsGpxAnalysis(id) {
  const item = gpxCatalog.find((entry) => entry.id === id);
  if (!item) return;

  state.catalogError = "";
  state.catalogSelectedId = item.id;
  state.toolMode = "gpx";
  state.gpxSourceMode = "preset";
  state.gpxPresetRoute = item.gpxUrl.split("/").pop() ?? "";
  state.gpxFileName = item.gpxUrl.split("/").pop() ?? formatCatalogRaceTitle(item);
  state.gpxError = "";
  state.gpxTrackPoints = null;
  state.gpxAnalysis = null;
  render();

  try {
    const response = await fetch(item.gpxUrl);
    if (!response.ok) throw new Error(`無法讀取 GPX：${item.gpxUrl}`);
    const text = await response.text();
    state.gpxTrackPoints = parseGpxTrackPoints(text);
    state.gpxFileName = item.gpxUrl.split("/").pop() ?? formatCatalogRaceTitle(item);
    state.gpxError = "";
    recalculateGpxAnalysis();
  } catch (error) {
    state.gpxTrackPoints = null;
    state.gpxAnalysis = null;
    state.gpxError = error instanceof Error ? error.message : "GPX 載入失敗。";
  }

  render();
}

function handleCatalogFieldChange(event) {
  const field = event.currentTarget.dataset.catalogField;
  const value = event.currentTarget.value;
  state[field] = value;
  state.catalogError = "";
  refreshCatalogResultsPanel();
}

function refreshCatalogResultsPanel() {
  const panel = app.querySelector(".results-panel");
  if (!panel) {
    render();
    return;
  }
  panel.innerHTML = renderGpxCatalogPage();
  panel.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", handleAction);
  });
}

async function handleCatalogDownload(id) {
  const item = gpxCatalog.find((entry) => entry.id === id);
  if (!item) return;
  try {
    state.catalogError = "";
    await downloadGpxFile(item);
  } catch (error) {
    state.catalogError = error instanceof Error ? error.message : "GPX 下載失敗。";
    render();
  }
}

async function loadCatalogItem(id, mode) {
  const item = gpxCatalog.find((entry) => entry.id === id);
  if (!item) return;

  state.catalogSelectedId = item.id;
  state.catalogPanelMode = mode;
  state.catalogLoading = true;
  state.catalogError = "";
  state.catalogParsedGpx = null;
  render();

  try {
    const response = await fetch(item.gpxUrl);
    if (!response.ok) throw new Error(`無法讀取 GPX：${item.gpxUrl}`);
    const text = await response.text();
    const parsed = parseGpxText(text);
    if (!parsed.points.length) {
      throw new Error("此 GPX 未包含可解析的 trkpt 路線點。");
    }
    state.catalogParsedGpx = parsed;
    state.catalogError = "";
  } catch (error) {
    state.catalogParsedGpx = null;
    state.catalogError = error instanceof Error ? error.message : "GPX 解析失敗。";
  } finally {
    state.catalogLoading = false;
    render();
  }
}

async function handleGpxFieldChange(event) {
  const field = event.currentTarget.dataset.gpxField;
  const value =
    event.currentTarget.type === "checkbox"
      ? event.currentTarget.checked
      : event.currentTarget.value;

  if (
    field === "gpxSourceMode" ||
    field === "gpxPresetRoute" ||
    field === "gpxTargetMode" ||
    field === "gpxTargetPaceInput" ||
    field === "gpxDownhillStrategy" ||
    field === "gpxHeatRaceType" ||
    field === "gpxHeatEnabled"
  ) {
    state[field] = value;
  } else {
    state[field] = Number(value);
  }

  if (field === "gpxSourceMode" && value === "preset") {
    await loadPresetGpxRoute(state.gpxPresetRoute);
    render();
    return;
  }

  if (field === "gpxPresetRoute") {
    await loadPresetGpxRoute(value);
    render();
    return;
  }

  recalculateGpxAnalysis();
  render();
}

async function handleGpxFileChange(event) {
  const file = event.currentTarget.files?.[0];
  if (!file) return;

  try {
    const text = await file.text();
    state.gpxFileName = file.name;
    state.gpxTrackPoints = parseGpxTrackPoints(text);
    state.gpxError = "";
    recalculateGpxAnalysis();
  } catch (error) {
    state.gpxTrackPoints = null;
    state.gpxAnalysis = null;
    state.gpxError = error instanceof Error ? error.message : "Unable to read GPX.";
  }

  render();
}

function recalculateGpxAnalysis() {
  if (!state.gpxTrackPoints) return;

  try {
    const points = prepareRoutePoints(
      state.gpxTrackPoints,
      state.gpxSmoothingWindowM
    );
    const targetPace = getGpxTargetPaceSeconds(points);
    if (!targetPace) {
      state.gpxAnalysis = null;
      state.gpxError =
        state.gpxTargetMode === "time"
          ? state.locale === "en"
            ? "Enter a valid goal finish time."
            : "請輸入有效的目標完賽時間。"
          : state.locale === "en"
            ? "Enter target pace as mm:ss, for example 4:30."
            : "請用 mm:ss 輸入目標配速，例如 4:30。";
      return;
    }
    const segments = createSegments(
      points,
      state.gpxSegmentSizeKm,
      targetPace,
      downhillStrategyOptions[state.gpxDownhillStrategy] ?? downhillStrategyOptions.standard,
      getGpxHeatAdjustmentSettings()
    );
    state.gpxAnalysis = {
      points,
      segments,
      summary: summarizeRoute(points, segments),
      heatAdjustment: segments[0]?.heatAdjustment ?? null,
      heatSettings: getGpxHeatAdjustmentSettings()
    };
    state.gpxError = "";
  } catch (error) {
    state.gpxAnalysis = null;
    state.gpxError = error instanceof Error ? error.message : "Unable to calculate GPX.";
  }
}

async function loadPresetGpxRoute(fileName) {
  try {
    const route = popularGpxRoutes.find((item) => item.file === fileName) ?? popularGpxRoutes[0];
    state.gpxPresetRoute = route.file;
    const response = await fetch(`/Gpx/${encodeURIComponent(route.file)}`);
    if (!response.ok) throw new Error(`Unable to load ${route.file}.`);
    const text = await response.text();
    state.gpxFileName = route.file;
    state.gpxTrackPoints = parseGpxTrackPoints(text);
    state.gpxError = "";
    recalculateGpxAnalysis();
  } catch (error) {
    state.gpxTrackPoints = null;
    state.gpxAnalysis = null;
    state.gpxError =
      error instanceof Error
        ? error.message
        : state.locale === "en"
          ? "Unable to load preset GPX."
          : "無法載入常用路線 GPX。";
  }
}

function getGpxHeatAdjustmentSettings() {
  return {
    enabled: Boolean(state.gpxHeatEnabled),
    temperatureC: state.gpxHeatTemperatureC,
    relativeHumidity: state.gpxHeatHumidity,
    raceType: state.gpxHeatRaceType
  };
}

function getGpxTargetPaceSeconds(points = state.gpxAnalysis?.points) {
  if (state.gpxTargetMode === "time") {
    const totalSeconds =
      Number(state.gpxTargetHours) * 3600 +
      Number(state.gpxTargetMinutes) * 60 +
      Number(state.gpxTargetSeconds);
    const totalDistanceKm = points?.at(-1)?.distanceM / 1000;
    if (
      !Number.isFinite(totalSeconds) ||
      totalSeconds <= 0 ||
      !Number.isFinite(totalDistanceKm) ||
      totalDistanceKm <= 0
    ) {
      return null;
    }
    return totalSeconds / totalDistanceKm;
  }

  return parseGpxPace(state.gpxTargetPaceInput);
}

function getGpxDerivedPaceLabel() {
  const seconds = getGpxTargetPaceSeconds();
  return seconds ? formatGpxPace(seconds) : "";
}

function exportGpxCsv() {
  if (!state.gpxAnalysis) return;

  const csv = segmentsToCsv(state.gpxAnalysis.segments, {
    formatPace: formatGpxPace,
    formatPaceDelta: formatGpxPaceDelta,
    formatDuration: formatGpxDuration
  }, state.gpxAnalysis.heatSettings, state.gpxAnalysis.heatAdjustment);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "gpx-grade-equivalent-paces.csv";
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function handlePlanDragStart(event) {
  const card = event.currentTarget;
  state.draggedPlanIndex = Number(card.dataset.planIndex);
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("text/plain", card.dataset.planIndex);
  setTransparentDragImage(event);
  requestAnimationFrame(() => {
    card.classList.add("is-dragging");
  });
}

function handlePlanDragOver(event) {
  event.preventDefault();
  swapPlanWithTarget(event.currentTarget, event.clientX);
}

function swapPlanWithTarget(target, clientX) {
  const grid = target.closest("[data-plan-grid]");
  const draggedIndex = state.draggedPlanIndex;
  const targetIndex = Number(target.dataset.planIndex);

  if (!grid || draggedIndex === null || draggedIndex === targetIndex) return;

  const from = state.planOrder.indexOf(draggedIndex);
  const to = state.planOrder.indexOf(targetIndex);
  if (from < 0 || to < 0 || from === to) return;

  const targetRect = target.getBoundingClientRect();
  const pointerRatio = (clientX - targetRect.left) / targetRect.width;
  const movingRight = from < to;
  const crossedThreshold = movingRight ? pointerRatio > 0.5 : pointerRatio < 0.5;
  if (!crossedThreshold) return;

  animatePlanReorder(grid, () => {
    [state.planOrder[from], state.planOrder[to]] = [
      state.planOrder[to],
      state.planOrder[from]
    ];
    reorderPlanCards(grid);
  });
}

function handlePlanDrop(event) {
  event.preventDefault();
}

function handlePlanDragEnd() {
  app.querySelectorAll("[data-plan-card]").forEach((card) => {
    card.classList.remove("is-dragging");
  });
  state.draggedPlanIndex = null;
}

function handlePlanTouchStart(event) {
  if (event.target.closest("button, input, textarea, select, a")) return;
  const touch = event.touches[0];
  if (!touch) return;

  const card = event.currentTarget;
  clearPlanTouchDragState();

  const touchDrag = {
    touchId: touch.identifier,
    index: Number(card.dataset.planIndex),
    startX: touch.clientX,
    startY: touch.clientY,
    active: false,
    timerId: window.setTimeout(() => {
      touchDrag.active = true;
      state.draggedPlanIndex = touchDrag.index;
      card.classList.add("is-dragging");
    }, 360)
  };

  state.planTouchDrag = touchDrag;
}

function handlePlanTouchMove(event) {
  const touchDrag = state.planTouchDrag;
  if (!touchDrag) return;

  const touch = [...event.changedTouches].find(
    (item) => item.identifier === touchDrag.touchId
  );
  if (!touch) return;

  const distanceX = Math.abs(touch.clientX - touchDrag.startX);
  const distanceY = Math.abs(touch.clientY - touchDrag.startY);

  if (!touchDrag.active) {
    if (Math.hypot(distanceX, distanceY) > 10) {
      clearPlanTouchDragState();
    }
    return;
  }

  event.preventDefault();

  const target = document
    .elementFromPoint(touch.clientX, touch.clientY)
    ?.closest("[data-plan-card]");
  if (!target || target === event.currentTarget) return;

  swapPlanWithTarget(target, touch.clientX);
}

function handlePlanTouchEnd(event) {
  const touchDrag = state.planTouchDrag;
  if (!touchDrag) return;

  const touchFinished = [...event.changedTouches].some(
    (item) => item.identifier === touchDrag.touchId
  );
  if (!touchFinished) return;

  clearPlanTouchDragState();
}

function clearPlanTouchDragState() {
  if (state.planTouchDrag?.timerId) {
    window.clearTimeout(state.planTouchDrag.timerId);
  }
  app.querySelectorAll("[data-plan-card]").forEach((card) => {
    card.classList.remove("is-dragging");
  });
  state.draggedPlanIndex = null;
  state.planTouchDrag = null;
}

function handleExampleDragStart(event) {
  event.preventDefault();
}

function handleExampleDragOver(event) {
  event.preventDefault();
  swapExampleWithTarget(event.currentTarget, event.clientX);
}

function handleExamplePointerDown(event) {
  if (event.button !== 0 && event.pointerType !== "touch") return;
  if (event.target.closest("button, input, textarea, select, a")) return;

  const card = event.currentTarget;
  startExampleCardDrag(card, event.clientX, event.clientY, {
    pointerId: event.pointerId,
    mode: "pointer"
  });

  card.setPointerCapture?.(event.pointerId);
}

function handleExamplePointerMove(event) {
  const dragged = state.draggedExample;
  if (!dragged || dragged.pointerId !== event.pointerId) return;

  const distance = Math.hypot(event.clientX - dragged.startX, event.clientY - dragged.startY);
  if (!dragged.active) {
    if (distance < 8) return;
    dragged.active = true;
    event.currentTarget.classList.add("is-dragging");
  }

  event.preventDefault();

  const target = document
    .elementFromPoint(event.clientX, event.clientY)
    ?.closest("[data-example-card]");
  if (!target || target === event.currentTarget) return;

  swapExampleWithTarget(target, event.clientX);
}

function handleExamplePointerEnd(event) {
  const dragged = state.draggedExample;
  if (!dragged || dragged.pointerId !== event.pointerId) return;

  event.currentTarget.releasePointerCapture?.(event.pointerId);
  clearExampleDragState();
}

function handleExampleMouseDown(event) {
  if (event.button !== 0) return;
  if (event.target.closest("button, input, textarea, select, a")) return;

  startExampleCardDrag(event.currentTarget, event.clientX, event.clientY, {
    mode: "mouse"
  });
  event.preventDefault();
}

function handleExampleMouseMove(event) {
  const dragged = state.draggedExample;
  if (!dragged || dragged.mode !== "mouse") return;

  const distance = Math.hypot(event.clientX - dragged.startX, event.clientY - dragged.startY);
  const card = getDraggedExampleCard();
  if (!dragged.active) {
    if (distance < 8) return;
    dragged.active = true;
    card?.classList.add("is-dragging");
  }

  event.preventDefault();

  const target = document
    .elementFromPoint(event.clientX, event.clientY)
    ?.closest("[data-example-card]");
  if (!target || target === card) return;

  swapExampleWithTarget(target, event.clientX);
}

function handleExampleMouseEnd() {
  const dragged = state.draggedExample;
  if (!dragged || dragged.mode !== "mouse") return;
  clearExampleDragState();
}

function startExampleCardDrag(card, startX, startY, details) {
  state.draggedExample = {
    zone: card.dataset.exampleZone,
    id: card.dataset.exampleId,
    startX,
    startY,
    active: false,
    ...details
  };
}

function getDraggedExampleCard() {
  const dragged = state.draggedExample;
  if (!dragged) return null;

  return (
    [...app.querySelectorAll("[data-example-card]")].find(
      (card) =>
        card.dataset.exampleZone === dragged.zone &&
        card.dataset.exampleId === dragged.id
    ) ?? null
  );
}

function swapExampleWithTarget(target, clientX) {
  const row = target.closest(".example-row");
  const dragged = state.draggedExample;
  const zone = target.dataset.exampleZone;
  const targetId = target.dataset.exampleId;

  if (!row || !dragged || dragged.zone !== zone || dragged.id === targetId) return;

  const order = state.exampleOrder[zone];
  if (!Array.isArray(order)) return;

  const from = order.indexOf(dragged.id);
  const to = order.indexOf(targetId);
  if (from < 0 || to < 0 || from === to) return;

  const targetRect = target.getBoundingClientRect();
  const pointerRatio = (clientX - targetRect.left) / targetRect.width;
  const movingRight = from < to;
  const crossedThreshold = movingRight ? pointerRatio > 0.5 : pointerRatio < 0.5;
  if (!crossedThreshold) return;

  animatePlanReorder(row, () => {
    [order[from], order[to]] = [order[to], order[from]];
    reorderExampleCards(row, zone);
  });
}

function handleExampleDrop(event) {
  event.preventDefault();
}

function handleExampleDragEnd() {
  clearExampleDragState();
}

function clearExampleDragState() {
  app.querySelectorAll("[data-example-card]").forEach((card) => {
    card.classList.remove("is-dragging");
  });
  state.draggedExample = null;
}

function setTransparentDragImage(event) {
  if (!event.dataTransfer?.setDragImage) return;

  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  event.dataTransfer.setDragImage(canvas, 0, 0);
}

function positionOpenPlanSwapMenu() {
  const openSwap = app.querySelector(".plan-swap.open");
  if (!openSwap) return;

  const menu = openSwap.querySelector(".plan-swap-menu");
  const plan = openSwap.closest(".weekly-plan");
  const trigger = openSwap.querySelector(".plan-swap-trigger");
  if (!menu || !plan || !trigger) return;

  const triggerRect = trigger.getBoundingClientRect();
  const planRect = plan.getBoundingClientRect();
  const availableWidth = Math.max(180, Math.min(planRect.width - 24, window.innerWidth - 24));
  const desiredWidth = Math.min(300, Math.max(250, availableWidth));
  const minLeft = Math.max(12, planRect.left + 12);
  const maxLeft = Math.min(window.innerWidth - desiredWidth - 12, planRect.right - desiredWidth - 12);
  const left = Math.max(minLeft, Math.min(triggerRect.left, maxLeft));
  const top = triggerRect.bottom + 6;
  const maxHeight = Math.max(140, Math.min(260, window.innerHeight - top - 12));

  menu.style.setProperty("--swap-menu-top", `${Math.round(top)}px`);
  menu.style.setProperty("--swap-menu-left", `${Math.round(left)}px`);
  menu.style.setProperty("--swap-menu-width", `${Math.round(desiredWidth)}px`);
  menu.style.setProperty("--swap-menu-max-height", `${Math.round(maxHeight)}px`);
}

function animatePlanReorder(grid, mutate) {
  const selector = "[data-plan-card], [data-example-card]";
  const getCardKey = (card) => card.dataset.planIndex ?? card.dataset.exampleId;
  const firstRects = new Map(
    [...grid.querySelectorAll(selector)].map((card) => [
      getCardKey(card),
      card.getBoundingClientRect()
    ])
  );

  mutate();

  grid.querySelectorAll(selector).forEach((card) => {
    const first = firstRects.get(getCardKey(card));
    if (!first) return;

    const last = card.getBoundingClientRect();
    const deltaX = first.left - last.left;
    const deltaY = first.top - last.top;
    if (deltaX === 0 && deltaY === 0) return;

    card.style.transition = "none";
    card.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    requestAnimationFrame(() => {
      card.style.transition = "transform 180ms cubic-bezier(0.2, 0.8, 0.2, 1)";
      card.style.transform = "";
    });
  });
}

function reorderPlanCards(grid) {
  const cards = new Map(
    [...grid.querySelectorAll("[data-plan-card]")].map((card) => [
      Number(card.dataset.planIndex),
      card
    ])
  );

  state.planOrder.forEach((index) => {
    const card = cards.get(index);
    if (card) grid.append(card);
  });
}

function reorderExampleCards(row, zone) {
  const cards = new Map(
    [...row.querySelectorAll("[data-example-card]")].map((card) => [
      card.dataset.exampleId,
      card
    ])
  );

  state.exampleOrder[zone].forEach((id) => {
    const card = cards.get(id);
    if (card) row.append(card);
  });
}

function getOrderedSchedule(schedule) {
  if (
    !Array.isArray(state.planOrder) ||
    state.planOrder.length !== schedule.length ||
    state.planOrder.some((index) => index < 0 || index >= schedule.length)
  ) {
    state.planOrder = schedule.map((_, index) => index);
  }

  return state.planOrder.map((index) => ({
    index,
    day: schedule[index]
  }));
}

function applyEasyRunRedistribution(schedule) {
  const distanceEligible = schedule
    .map((day, index) => ({ day, index }))
    .filter(({ day }) => day.easyDistributionEligible && day.distanceRangeKm);
  const skipped = distanceEligible.filter(({ index }) => state.skippedEasyDays[index]);
  const receivers = distanceEligible.filter(({ index }) => !state.skippedEasyDays[index]);

  if (
    skipped.length === 0 &&
    !schedule.some((day, index) => day.easyDistributionEligible && state.skippedEasyDays[index])
  ) {
    return schedule;
  }

  const skippedTotal = skipped.reduce(
    (total, { day }) => ({
      min: total.min + Number(day.distanceRangeKm.min ?? 0),
      max: total.max + Number(day.distanceRangeKm.max ?? 0)
    }),
    { min: 0, max: 0 }
  );
  const addRange =
    receivers.length > 0
      ? {
          min: skippedTotal.min / receivers.length,
          max: skippedTotal.max / receivers.length
        }
      : { min: 0, max: 0 };
  const receiverIndexes = new Set(receivers.map(({ index }) => index));

  return schedule.map((day, index) => {
    if (!day.easyDistributionEligible) return day;

    if (state.skippedEasyDays[index]) {
      const hasRedistributedMileage = Boolean(day.distanceRangeKm);
      return {
        ...day,
        zh: hasRedistributedMileage
          ? "休息（跑量平均分配到其他 E 課）"
          : "休息",
        en: hasRedistributedMileage
          ? "Rest (mileage redistributed to other E runs)"
          : "Rest",
        pace: "",
        base: "",
        isSkippedEasyRun: true
      };
    }

    if (!day.distanceRangeKm) return day;

    if (!receiverIndexes.has(index) || skippedTotal.min <= 0) return day;

    const nextRangeKm = {
      min: day.distanceRangeKm.min + addRange.min,
      max: day.distanceRangeKm.max + addRange.max
    };

    return {
      ...day,
      distanceRangeKm: nextRangeKm,
      zh: buildRedistributedEasyTitle(day, nextRangeKm, "zh"),
      en: buildRedistributedEasyTitle(day, nextRangeKm, "en")
    };
  });
}

function buildRedistributedEasyTitle(day, rangeKm, locale) {
  const range = formatPlanDistanceRange(rangeKm);
  const zh = day.zh;
  const en = day.en;

  if (locale === "en") {
    if (en.includes("strides")) return `E ${range} + 6-8 strides`;
    if (en.startsWith("Recovery")) return `Recovery ${range}`;
    return `E ${range}`;
  }

  if (zh.includes("加速跑")) return `E ${range} + 6-8 次加速跑`;
  if (zh.startsWith("恢復跑")) return `恢復跑 ${range}`;
  return `E ${range}`;
}

function formatPlanDistanceRange(rangeKm) {
  const min = state.unitSystem === UnitSystem.IMPERIAL
    ? rangeKm.min / KM_PER_MILE
    : rangeKm.min;
  const max = state.unitSystem === UnitSystem.IMPERIAL
    ? rangeKm.max / KM_PER_MILE
    : rangeKm.max;
  const suffix = state.unitSystem === UnitSystem.IMPERIAL ? "mi" : "km";
  return `${formatPlanDistance(min)}-${formatPlanDistance(max)} ${suffix}`;
}

function formatPlanDistance(value) {
  const rounded = value >= 10 ? Math.round(value) : Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : String(rounded.toFixed(1));
}

function getPlanWorkoutCandidates(day, model) {
  if (!["T", "I", "R"].includes(day.zone)) return [];
  return model.workoutExamples.filter((example) => example.zone === day.zone);
}

function getSelectedPlanWorkout(index, candidates) {
  const selectedId = state.planWorkoutOverrides[index];
  return candidates.find((workout) => workout.id === selectedId) ?? null;
}

function getActiveVdot() {
  if (state.abilityMode !== "race") return state.vdot;
  return getRaceEstimate().vdot ?? state.vdot;
}

function getRaceEstimate() {
  const timeSeconds = getRaceTimeSeconds();
  const vdot = calculateVdotFromRaceResult(state.raceDistanceMeters, timeSeconds);
  return {
    valid: vdot !== null,
    vdot
  };
}

function getRaceTimeSeconds() {
  const hours = Number(state.raceHours);
  const minutes = Number(state.raceMinutes);
  const seconds = Number(state.raceSeconds);

  if (
    [hours, minutes, seconds].some((part) => !Number.isFinite(part) || part < 0) ||
    minutes >= 60 ||
    seconds >= 60
  ) {
    return null;
  }

  const totalSeconds = hours * 3600 + minutes * 60 + seconds;
  return totalSeconds > 0 ? totalSeconds : null;
}

function getPaceEquivalent(heatMultiplier) {
  const inputSeconds = getPaceInputSeconds();
  const secondsPerKm =
    state.unitSystem === UnitSystem.IMPERIAL ? inputSeconds / KM_PER_MILE : inputSeconds;
  const t = copy[state.locale];
  const reverse = state.equivalentDirection === "hotToCool";

  if (reverse) {
    const baselineSecondsPerKm = secondsPerKm / heatMultiplier;
    return {
      cards: [
        {
          label: t.heatEnvironmentPace,
          value: formatPaceForUnit(secondsPerKm, state.unitSystem),
          meta: state.unitSystem === UnitSystem.IMPERIAL ? "per mile" : "per km"
        },
        {
          label: t.estimatedBaselinePace,
          value: formatPaceForUnit(baselineSecondsPerKm, state.unitSystem),
          meta: `-${formatPercent((1 - 1 / heatMultiplier) * 100)}`,
          highlight: true
        }
      ]
    };
  }

  const hotSecondsPerKm = secondsPerKm * heatMultiplier;

  return {
    cards: [
      {
        label: t.baselinePace,
        value: formatPaceForUnit(secondsPerKm, state.unitSystem),
        meta: state.unitSystem === UnitSystem.IMPERIAL ? "per mile" : "per km"
      },
      {
        label: t.equivalentPace,
        value: formatPaceForUnit(hotSecondsPerKm, state.unitSystem),
        meta: `+${formatPercent((heatMultiplier - 1) * 100)}`,
        highlight: true
      }
    ]
  };
}

function getRaceEquivalent(heatMultiplier) {
  const inputSeconds = getEquivalentRaceTimeSeconds();
  const distanceKm = Number(state.equivalentRaceDistanceMeters) / 1000;
  const t = copy[state.locale];
  const reverse = state.equivalentDirection === "hotToCool";

  if (reverse) {
    const baselineSeconds = inputSeconds / heatMultiplier;
    return {
      cards: [
        {
          label: t.heatEnvironmentResult,
          value: formatFinishTime(inputSeconds),
          meta: getEquivalentRaceLabel()
        },
        {
          label: t.baselineTime,
          value: formatFinishTime(baselineSeconds),
          meta: `-${formatPercent((1 - 1 / heatMultiplier) * 100)}`,
          highlight: true
        },
        {
          label: t.averagePace,
          value: formatPaceForUnit(baselineSeconds / distanceKm, state.unitSystem),
          meta: state.unitSystem === UnitSystem.IMPERIAL ? "per mile" : "per km"
        }
      ]
    };
  }

  const hotSeconds = inputSeconds * heatMultiplier;

  return {
    cards: [
      {
        label: t.baselineTime,
        value: formatFinishTime(inputSeconds),
        meta: getEquivalentRaceLabel()
      },
      {
        label: t.heatEquivalentTime,
        value: formatFinishTime(hotSeconds),
        meta: `+${formatPercent((heatMultiplier - 1) * 100)}`,
        highlight: true
      },
      {
        label: t.averagePace,
        value: formatPaceForUnit(hotSeconds / distanceKm, state.unitSystem),
        meta: state.unitSystem === UnitSystem.IMPERIAL ? "per mile" : "per km"
      }
    ]
  };
}

function getVdotEquivalentRaceResults(vdot) {
  return raceDistanceOptions
    .filter((optionItem) => vdotEquivalentRaceMeters.has(optionItem.meters))
    .map((optionItem) => ({
      ...optionItem,
      seconds: estimateRaceSecondsFromVdot(vdot, optionItem.meters)
    }));
}

function estimateRaceSecondsFromVdot(vdot, distanceMeters) {
  let fastSeconds = distanceMeters / 700 * 60;
  let slowSeconds = distanceMeters / 50 * 60;

  for (let step = 0; step < 64; step += 1) {
    const midpoint = (fastSeconds + slowSeconds) / 2;
    const estimatedVdot = calculateVdotFromRaceResult(distanceMeters, midpoint);
    if (estimatedVdot === null) break;

    if (estimatedVdot > vdot) {
      fastSeconds = midpoint;
    } else {
      slowSeconds = midpoint;
    }
  }

  return (fastSeconds + slowSeconds) / 2;
}

function getPaceInputSeconds() {
  const minutes = clampNumber(state.paceMinutes, 0, 30);
  const seconds = clampNumber(state.paceSeconds, 0, 59);
  return Math.max(1, minutes * 60 + seconds);
}

function getEquivalentRaceTimeSeconds() {
  const hours = clampNumber(state.equivalentRaceHours, 0, 9);
  const minutes = clampNumber(state.equivalentRaceMinutes, 0, 59);
  const seconds = clampNumber(state.equivalentRaceSeconds, 0, 59);
  return Math.max(1, hours * 3600 + minutes * 60 + seconds);
}

function getEquivalentRaceLabel() {
  const optionItem =
    equivalentRaceOptions.find(
      (item) => Number(item.meters) === Number(state.equivalentRaceDistanceMeters)
    ) ?? equivalentRaceOptions[0];
  return state.locale === "en" ? optionItem.en : optionItem.zh;
}

function clampNumber(value, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number)) return min;
  return Math.min(max, Math.max(min, number));
}

function formatPaceForUnit(secondsPerKm, unitSystem) {
  const seconds =
    unitSystem === UnitSystem.IMPERIAL ? secondsPerKm * KM_PER_MILE : secondsPerKm;
  const suffix = unitSystem === UnitSystem.IMPERIAL ? "/ mi" : "/ km";
  return `${formatClock(seconds)} ${suffix}`;
}

function formatFinishTime(seconds) {
  const rounded = Math.round(seconds);
  const hours = Math.floor(rounded / 3600);
  const minutes = Math.floor((rounded % 3600) / 60);
  const secs = rounded % 60;
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }
  return `${minutes}:${String(secs).padStart(2, "0")}`;
}

function formatClock(seconds) {
  const rounded = Math.round(seconds);
  const minutes = Math.floor(rounded / 60);
  const secs = String(rounded % 60).padStart(2, "0");
  return `${minutes}:${secs}`;
}

function formatPercent(value) {
  return `${Math.round(value * 10) / 10}%`;
}

function formatGrade(grade) {
  return `${(grade * 100).toFixed(1)}%`;
}

function sampleSeries(items, maxSamples) {
  if (items.length <= maxSamples) return items;
  const stride = (items.length - 1) / (maxSamples - 1);
  return Array.from({ length: maxSamples }, (_, index) => {
    const sourceIndex = Math.round(index * stride);
    return items[Math.min(items.length - 1, sourceIndex)];
  });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

render();
