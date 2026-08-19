import {
  HANSONS_PLAN_LENGTHS,
  HalfMarathonWeek,
  HansonsLevel,
  NorwegianExperience,
  NorwegianHealth,
  NorwegianSpecificity,
  KM_PER_MILE,
  MARATHON_PHASE_WEEKS,
  TargetRace,
  TrainingMethod,
  TrainingCycle,
  UnitSystem,
  calculateAveragePaceSeconds,
  calculatePaceModel,
  calculateVdotFromRaceResult,
  getHansonsDefaultWeek,
  getMarathonSwapCandidates
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
import {
  KM_PER_MILE as TREADMILL_KM_PER_MILE,
  convertTreadmillEffort
} from "../src/treadmill/hillRunner.mjs";
import {
  formatStepValue,
  roundToStepPrecision,
  stepNumericValue
} from "../src/ui/numericStep.mjs";

const copy = {
  "zh-TW": {
    brandEyebrow: "RUNSTRATEGY",
    appTitle: "跑者配速與賽事策略",
    subtitle:
      "設定跑力與當日天氣，查看 E、M、T、I、R 配速及熱環境修正。",
    settingsTitle: "條件設定",
    runnerAbilitySection: "跑者能力",
    runnerAbilityHelp: "設定單位與目前跑力，所有結果會同步更新。",
    conversionSettings: "換算設定",
    conversionSettingsHelp: "選擇換算方式並輸入基準配速或成績。",
    environmentSection: "環境條件",
    environmentHelp: "輸入當日溫度與相對濕度，套用既有熱環境模型。",
    language: "語言",
    inputs: "跑者資料",
    toolMode: "功能模式",
    sidebarPaceLabel: "算我的配速",
    sidebarHeatLabel: "熱天怎麼跑",
    sidebarPlanLabel: "這週怎麼練",
    plannerMode: "VDOT 配速",
    trainingPlanMode: "訓練課表",
    heatEquivalentMode: "熱適應換算",
    toolSection: "跑者的配速與賽事策略工具",
    toolBrand: "runstrategy",
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
    peakWeeklyMileage: "峰值週跑量",
    trainingMethod: "課表系統",
    danielsMethod: "Daniels 丹尼爾斯",
    hansonsMethod: "Hansons 漢森",
    norwegianMethod: "Norwegian Singles · LetsRun Sub‑T",
    hansonsLevel: "漢森課表級別",
    hansonsBeginner: "Beginner 入門",
    hansonsAdvanced: "Advanced 進階",
    hansonsPlanWeek: "漢森計畫週次",
    hansonsPlanWeekOption: "第 {week} / {total} 週",
    hansonsPlanHelp:
      "Hansons 僅提供可逐週對照官方免費 Classic 課表的半馬與馬拉松 18 週進程。選擇週次後會自動切換基礎、速度、專項耐力與比賽週。",
    hansonsGoalTime: "目標完賽時間",
    hansonsGoalTimeHelp:
      "E、Long、Speed 與 T／I／R 仍依目前 VDOT；Tempo、Strength 與比賽日才讀取目標 MP／HMP。",
    hansonsGoalGapWarning:
      "目標配速比目前等效成績快超過每英里 10 秒。本週 Tempo／Strength 已從目前能力往目標配速漸進，不會直接把尚未具備的目標當成目前跑力。",
    hansonsGoalPaceActive:
      "目標配速已啟用：Tempo／Strength 使用目標 MP／HMP；Speed 與 Easy 類課程仍依目前能力。",
    danielsLowVolumeBaseNote:
      "本週尚不足以同時容納至少 20 分鐘 T、熱身收操與週量 10% 上限，因此改排 E＋strides；這不是把過短刺激標成正式 T。",
    norwegianPlanHelp:
      "跑步時間決定每週 Sub‑T 預算，近期 VDOT 只決定每趟速度。預設採時間課表；專項模式只會取代其中一堂，不會在原有品質課之外加課。",
    norwegianWeeklyTime: "過去 4 週平均跑步時間",
    norwegianRunningDays: "每週可跑天數",
    norwegianExperience: "Sub‑T 適應狀態",
    norwegianIntro: "第一次使用／剛增加跑量 · 20%",
    norwegianStable: "已穩定 4–6 週 · 2 完整＋1 T-lite · 22.5%",
    norwegianLongTerm: "長期穩定 · 最多 3 堂完整課 · 25%",
    norwegianHealth: "目前訓練狀態",
    norwegianHealthy: "健康、正常訓練",
    norwegianReturning: "受傷／剛回跑",
    norwegianSpecificity: "本週課表模式",
    norwegianVanilla: "Vanilla · 全部 Sub‑T",
    norwegianSpecific: "專項替換週 · 取代一堂 Q",
    norwegianWeeklySubTBudget: "每週 Sub‑T 預算",
    norwegianPlannedSubT: "本週實際 Sub‑T／預算",
    norwegianQualitySessions: "品質課結構",
    norwegianTimeFirstNote:
      "時間優先：先用近 4 週平均時間算每週 Sub‑T 預算，再由預算、可跑天數與適應狀態決定堂數。增加堂數只重分同一份預算，不會因跨過 300 分鐘突然加量。",
    norwegianLowVolumeNote:
      "低於每週 4.5 小時屬於 Low-volume adaptation，最多安排 2 堂 Sub‑T；4.5–6 小時是進入 Singles 的過渡區，不代表自動升成三堂完整 T。",
    norwegianTransitionNote:
      "目前是 2＋1 T-lite 過渡：兩堂完整 Sub‑T 加一堂 10–15 分鐘輕量 T。先維持相同週預算，長期穩定後才把第三堂補到完整課量。",
    norwegianSpecificityDeferredNote:
      "專項替換暫緩：2＋1 T-lite 過渡期先完成第三次閾值暴露的適應，不用專項課取代輕量 T；回跑狀態也不啟用專項替換。",
    norwegianSafetyNote:
      "可跑天數、回跑狀態或總時間不足，已依網站安全規則減少品質課；這些限制不是 LetsRun 討論串的原始生理定律。",
    norwegianDistanceWarning:
      "輸入的週跑量低於目前 Sub‑T 工作分鐘按跑力換算出的最低距離，時間與距離彼此矛盾；課表以時間與強度安全為先，因此規劃距離可能高於輸入值。",
    norwegianControllerNote:
      "Sub‑T 是可控制的生理狀態，不是必須命中的單一配速。乳酸儀可參考末段約 2.5–3.5 mmol/L；沒有儀器時看配速穩定、心率漂移與 RPE，寧可慢 3–5 秒／km，也不要把課表跑成力竭。Easy 以可交談、可恢復為主，≤70% HRmax 只是此方法的實務參考。",
    switchSubTFormat: "更換分組方式",
    norwegianFormatNote:
      "每堂完整 Sub‑T 預設使用中組。短組可用較高絕對跑速，但更需要克制；長組中斷較少，起跑要更保守。三種格式維持接近的工作分鐘，不依比賽距離或週期自動綁定。",
    unitSystem: "單位",
    metricUnit: "公制 km",
    imperialUnit: "英制 mile",
    targetRace: "目前專項",
    trainingCycle: "訓練週期",
    trainingCycleHelp:
      "四期週期用來決定本週品質課重點。以 24 週備賽為例，各期約 6 週；若只有 16-18 週，常壓縮為各 4-5 週。Phase I 基礎與防傷；Phase II 初始品質；Phase III 專項品質；Phase IV 保留關鍵刺激並降低疲勞。",
    halfMarathonWeek: "半馬兩週循環",
    halfMarathonOddWeek: "單數週 · T＋R",
    halfMarathonEvenWeek: "雙數週 · T＋I",
    halfMarathonWeekHelp: "依 Daniels 第 4 版 Alien Program：單數週安排 T＋R，雙數週安排 T＋I。",
    marathonPhaseWeek: "本期週次",
    marathonPhaseWeekHelp:
      "馬拉松每一期以 6 週呈現。週次會改變當週跑量、混合型 Q 課與 Phase IV 減量；輸入的跑量視為本週期峰值。",
    marathonPhaseWeekOption: "第 {week} 週",
    peakMileageFraction: "峰值跑量比例",
    longRunTimeCap: "長跑時間上限",
    taperTitle: "馬拉松最後六週",
    taperAutomatic: "已自動套用",
    raceWeekAdjustmentTitle: "Phase IV 賽前調整",
    raceWeekOnly: "僅重要比賽週",
    temperature: "溫度",
    humidity: "濕度",
    apparentTemperature: "體感溫度",
    enableAutoWeather: "使用目前位置天氣",
    disableAutoWeather: "改回手動調整",
    retryAutoWeather: "重新偵測位置天氣",
    weatherLocating: "正在取得位置與目前天氣…",
    weatherRefreshing: "正在更新目前天氣…",
    refreshWeather: "更新目前天氣",
    weatherActive: "目前位置天氣已啟用",
    weatherUnsupported: "此瀏覽器不支援位置偵測。",
    weatherPermissionDenied: "未取得位置權限，請允許定位後再試一次。",
    weatherPositionUnavailable: "目前無法取得位置，請稍後再試。",
    weatherTimeout: "取得位置或天氣資料逾時，請再試一次。",
    weatherFetchFailed: "目前無法取得天氣資料，請稍後再試。",
    currentLocationWeather: "目前位置天氣",
    weatherUpdatedAt: "更新於",
    weatherConditions: {
      clear: "晴朗",
      partlyCloudy: "局部多雲",
      cloudy: "多雲",
      fog: "有霧",
      drizzle: "毛毛雨",
      rain: "下雨",
      snow: "降雪",
      showers: "陣雨",
      thunderstorm: "雷雨"
    },
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
    danielsBaseOnly: "E＋strides（尚未開正式 T）",
    hansonsFoundationQuality: "E＋strides＋基礎長跑",
    weeklyPlan: "本週建議安排",
    plannedWeeklyTotal: "本週規劃總量",
    longRunShare: "長跑占比",
    weeklyPlanNote: "依 Daniels 第 4 版賽事分法、四期週期與跑量動態安排；馬拉松另採 2Q 間隔、混合長課與減量規則。",
    weeklyPlanNoteHansons:
      "依 Hansons 官方免費半馬／馬拉松 Classic 課表安排；SOS 不連排，漏課不補課。",
    weeklyPlanNoteNorwegian:
      "先決定週 Sub‑T 分鐘，再拆 sessions 與 reps；Easy 維持低強度，長跑不做固定 fast finish。",
    hansonsVolumeWarning:
      "官方 PDF 以 mile 列示，系統用 1 mile＝1.609344 km 換算。峰值跑量低於官方 Classic 峰值時，品質課維持原配速並採非線性減量；跑量減少主要來自 Easy 與品質課總量，而不是降低目標配速。若無法恢復，應先建立跑量。",
    hansonsLowVolumeWarning:
      "目前峰值低於官方 Classic 約 75%，已切換成基礎／完賽路線：保留 Easy、strides 與不超過 30% 的長跑，不再把 Speed、Strength、Tempo 等比例縮小後稱為 Classic SOS。跑量建立到門檻後才會切回官方骨架。",
    switchWorkout: "換堂課",
    coachPick: "課表建議",
    skipEasyRun: "今天不跑",
    restoreEasyRun: "恢復跑步",
    workoutExamples: "跑量可用課表",
    scheduleDragHint: "左右滑動查看整週；長按卡片後左右拖曳可交換日期。",
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
      "配速推算參考 Jack Daniels《Daniels' Running Formula》第 4 版與官方 VDOT 計算器。E/M/T/I/R 使用已核對的官方配速錨點分段換算，並保留 VDOT 39 以下的官方修正；E 顯示範圍，M/T/I/R 顯示單點。熱天配速調整保留在 E/M/T/I，R 只調整恢復或總量。一般距離課表只有在能同時容納至少 20 分鐘 T、約 2 km 熱身收操與週量 10% T 上限時才開正式品質課，否則使用 E＋strides。馬拉松課量上限：T 為 min(週量 10%, 24 km)、I 為 min(8%, 10 km)、R 為 min(5%, 8 km)、M 在週量超過 64 km 時為 min(20%, 29 km)，較低週量則為 min(30%, 29 km)。長跑採週量上限並與 150 分鐘取較小值。",
    sourceNoteHansons:
      "半馬與馬拉松週期參考 Hansons Running Shop 公開的 Beginner／Advanced Classic 18 週課表。5K 與績效型 10K 沒有可逐週核對的免費官方 Classic 課表，因此不提供自動課表。E、Long、Speed 與網站中的 T／I／R 使用目前 VDOT；Tempo、Strength 與比賽日使用目標 MP／HMP。若目標比目前等效配速快超過每英里 10 秒，前期由目前專項配速漸進到目標配速。峰值低於 Classic 約 75% 時改用基礎／完賽路線，不等比例縮小 SOS。",
    sourceNoteNorwegian:
      "此頁把 LetsRun 討論串後期的 Norwegian Singles 實務整理成演算法：4.5 小時／週作為進入 Singles 的實務門檻，約 5–8.5 小時是主要範圍；Sub‑T 預設占每週跑步時間 20–25%，30% 只作警戒上限。堂數不是單看總時間：先確保每堂約 20–30 分鐘，再依跑天數與適應狀態安排 1、2、2＋1 T-lite 或 3 堂；單堂自動上限 35 分鐘。短／中／長 reps 的初始配速約為 15K–10 mile、半馬、25K–30K effort。",
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
      "5K": "5K",
      "10K": "10K",
      "Cross Country": "越野賽",
      "15K-30K": "15K 到 30K / 半馬",
      "Half Marathon": "半馬",
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
    brandEyebrow: "RUNSTRATEGY",
    appTitle: "Pace & Race Strategy",
    subtitle:
      "Set current ability and conditions to view E, M, T, I, and R paces with heat adjustment.",
    settingsTitle: "Inputs",
    runnerAbilitySection: "Runner ability",
    runnerAbilityHelp: "Set units and current ability. Results update from the same model.",
    conversionSettings: "Conversion settings",
    conversionSettingsHelp: "Choose a conversion and enter a baseline pace or result.",
    environmentSection: "Conditions",
    environmentHelp: "Enter temperature and relative humidity for the existing heat model.",
    language: "Language",
    inputs: "Runner Inputs",
    toolMode: "Tool Mode",
    sidebarPaceLabel: "Find My Pace",
    sidebarHeatLabel: "Run in the Heat",
    sidebarPlanLabel: "Plan My Week",
    plannerMode: "VDOT Paces",
    trainingPlanMode: "Training Plan",
    heatEquivalentMode: "Heat Adaptation Converter",
    toolSection: "Pace and Race Strategy Tools for Runners",
    toolBrand: "runstrategy",
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
    peakWeeklyMileage: "Peak Weekly Mileage",
    trainingMethod: "Plan System",
    danielsMethod: "Daniels",
    hansonsMethod: "Hansons",
    norwegianMethod: "Norwegian Singles · LetsRun Sub-T",
    hansonsLevel: "Hansons Plan Level",
    hansonsBeginner: "Beginner",
    hansonsAdvanced: "Advanced",
    hansonsPlanWeek: "Hansons Plan Week",
    hansonsPlanWeekOption: "Week {week} of {total}",
    hansonsPlanHelp:
      "Hansons is limited to the half-marathon and marathon 18-week progressions that can be checked week by week against the free official Classic schedules.",
    hansonsGoalTime: "Goal Finish Time",
    hansonsGoalTimeHelp:
      "E, Long, Speed, and T/I/R stay tied to current VDOT; Tempo, Strength, and race day use goal MP/HMP.",
    hansonsGoalGapWarning:
      "Goal pace is more than 10 seconds per mile faster than the current equivalent. This week's Tempo/Strength pace now progresses from current ability toward goal pace instead of treating the goal as current fitness.",
    hansonsGoalPaceActive:
      "Goal pace is active for Tempo/Strength; Speed and Easy work still use current ability.",
    danielsLowVolumeBaseNote:
      "This week cannot fit at least 20 minutes at T, warm-up/cooldown, and the 10% weekly cap together, so it uses E plus strides instead of labeling a micro-dose as formal T.",
    norwegianPlanHelp:
      "Weekly running time sets the Sub-T budget; current VDOT only sets rep pace. Time-based sessions are the default, and specificity replaces an existing quality session instead of adding another one.",
    norwegianWeeklyTime: "Average Running Time · Last 4 Weeks",
    norwegianRunningDays: "Available Running Days",
    norwegianExperience: "Sub-T Adaptation Status",
    norwegianIntro: "New / recently increased volume · 20%",
    norwegianStable: "Stable 4–6 weeks · 2 full + 1 T-lite · 22.5%",
    norwegianLongTerm: "Long-term stable · up to 3 full sessions · 25%",
    norwegianHealth: "Current Training Status",
    norwegianHealthy: "Healthy / normal training",
    norwegianReturning: "Injured / returning to running",
    norwegianSpecificity: "This Week's Mode",
    norwegianVanilla: "Vanilla · all Sub-T",
    norwegianSpecific: "Specific replacement · replaces one Q",
    norwegianWeeklySubTBudget: "Weekly Sub-T Budget",
    norwegianPlannedSubT: "Actual Sub-T / Budget",
    norwegianQualitySessions: "Quality Structure",
    norwegianTimeFirstNote:
      "Time first: calculate the weekly Sub-T budget from the last four weeks, then let budget, available days, and adaptation status set frequency. Adding a session redistributes the same budget; crossing 300 minutes does not suddenly add load.",
    norwegianLowVolumeNote:
      "Under 4.5 hours per week is a Low-volume adaptation capped at two Sub-T sessions. The 4.5–6 hour range is a Singles gateway, not an automatic jump to three full threshold sessions.",
    norwegianTransitionNote:
      "This is a 2 + 1 T-lite transition: two full Sub-T sessions plus 10–15 minutes of light T. The weekly budget stays unchanged until long-term stability supports a full third session.",
    norwegianSpecificityDeferredNote:
      "Specific replacement is deferred during the 2 + 1 T-lite transition so the third threshold exposure can be adapted first; it also stays off while returning from injury.",
    norwegianSafetyNote:
      "Quality was reduced because of available days, return-to-running status, or total-time capacity. These are site safety rules, not universal physiological laws from the LetsRun thread.",
    norwegianDistanceWarning:
      "Entered weekly distance is below the minimum implied by the Sub-T work minutes at current ability. Because time and distance conflict, the plan protects time and intensity first and may exceed the entered distance.",
    norwegianControllerNote:
      "Sub-T is a controlled state, not one pace that must be hit. With a lactate meter, trained runners in the thread commonly used about 2.5–3.5 mmol/L late in the session. Otherwise use stable reps, HR drift, and RPE; slow by 3–5 sec/km before turning it into a maximal workout. Easy should stay conversational and recoverable; ≤70% HRmax is this method's practical reference, not a universal threshold.",
    switchSubTFormat: "Change rep format",
    norwegianFormatNote:
      "Each full Sub-T session defaults to medium reps. Short reps allow a higher absolute speed but demand more restraint; long reps have fewer breaks and need a more conservative start. All formats keep similar work minutes and are not automatically tied to race distance or phase.",
    unitSystem: "Units",
    metricUnit: "Metric km",
    imperialUnit: "Imperial mile",
    targetRace: "Target Event",
    trainingCycle: "Training Cycle",
    trainingCycleHelp:
      "The four-phase cycle changes the weekly quality emphasis. In a 24-week build, each phase is roughly 6 weeks; a 16-18 week build often compresses phases to about 4-5 weeks. Phase I builds durability, Phase II adds initial quality, Phase III shifts event-specific, and Phase IV keeps key stimulus while reducing fatigue.",
    halfMarathonWeek: "Half-marathon two-week cycle",
    halfMarathonOddWeek: "Odd week · T + R",
    halfMarathonEvenWeek: "Even week · T + I",
    halfMarathonWeekHelp: "Daniels 4th ed. Alien Program: odd weeks use T + R; even weeks use T + I.",
    marathonPhaseWeek: "Week in phase",
    marathonPhaseWeekHelp:
      "Each marathon phase is shown as six weeks. The selected week changes volume, mixed Q sessions, and the Phase IV taper; entered mileage is treated as peak mileage.",
    marathonPhaseWeekOption: "Week {week}",
    peakMileageFraction: "Fraction of peak",
    longRunTimeCap: "Long-run time cap",
    taperTitle: "Final six marathon weeks",
    taperAutomatic: "Applied automatically",
    raceWeekAdjustmentTitle: "Phase IV race adjustment",
    raceWeekOnly: "Important race week only",
    temperature: "Temperature",
    humidity: "Humidity",
    apparentTemperature: "Feels like",
    enableAutoWeather: "Use weather at my location",
    disableAutoWeather: "Return to manual controls",
    retryAutoWeather: "Retry location weather",
    weatherLocating: "Getting your location and current weather…",
    weatherRefreshing: "Refreshing current weather…",
    refreshWeather: "Refresh current weather",
    weatherActive: "Location weather is active",
    weatherUnsupported: "This browser does not support location detection.",
    weatherPermissionDenied: "Location access was denied. Allow it and try again.",
    weatherPositionUnavailable: "Your location is currently unavailable. Try again shortly.",
    weatherTimeout: "Location or weather lookup timed out. Please try again.",
    weatherFetchFailed: "Current weather is unavailable. Please try again shortly.",
    currentLocationWeather: "Weather at your location",
    weatherUpdatedAt: "Updated",
    weatherConditions: {
      clear: "Clear",
      partlyCloudy: "Partly cloudy",
      cloudy: "Cloudy",
      fog: "Foggy",
      drizzle: "Drizzle",
      rain: "Rain",
      snow: "Snow",
      showers: "Showers",
      thunderstorm: "Thunderstorm"
    },
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
    danielsBaseOnly: "E + strides (formal T not yet open)",
    hansonsFoundationQuality: "E + strides + foundation long run",
    weeklyPlan: "Suggested Week",
    plannedWeeklyTotal: "Planned weekly total",
    longRunShare: "Long-run share",
    weeklyPlanNote: "Built from Daniels 4th ed. event groups, phase logic, and mileage. Marathon plans add 2Q spacing, mixed long sessions, and taper rules.",
    weeklyPlanNoteHansons:
      "Built from the official free Hansons half-marathon and marathon Classic plans. SOS days are not stacked, and missed SOS sessions are not made up.",
    weeklyPlanNoteNorwegian:
      "Set weekly Sub-T minutes first, then split sessions and reps; Easy stays easy and the long run has no fixed fast finish.",
    hansonsVolumeWarning:
      "The official PDFs list miles, converted here at 1 mi = 1.609344 km. Below the published Classic peak, quality sessions keep their prescribed pace and use nonlinear volume reduction; mileage comes out of easy running and quality-session volume rather than target pace. Build mileage first if recovery is inadequate.",
    hansonsLowVolumeWarning:
      "The selected peak is below about 75% of the official Classic plan, so the app has switched to a foundation / finish route: Easy running, strides, and a long run capped at 30%. It no longer proportionally shrinks Speed, Strength, and Tempo and labels them Classic SOS. The official structure returns after mileage reaches the gate.",
    switchWorkout: "Swap Workout",
    coachPick: "Plan recommendation",
    skipEasyRun: "Skip Run",
    restoreEasyRun: "Restore Run",
    workoutExamples: "Mileage-Based Workouts",
    scheduleDragHint: "Swipe sideways to view the week; press and hold a card, then drag to swap days.",
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
      "The pace model references Daniels' Running Formula, 4th ed., and the official VDOT calculator. E/M/T/I/R are interpolated from verified official pace anchors, including the official correction below VDOT 39; E remains a range while M/T/I/R are point targets. Heat adjustment applies to E/M/T/I, while R changes recovery or volume. A non-marathon plan opens formal quality only when it can fit at least 20 minutes at T, about 2 km of warm-up/cooldown, and the 10% weekly T cap together; otherwise it uses E plus strides. Marathon guardrails remain T min(10%, 24 km), I min(8%, 10 km), R min(5%, 8 km), and M min(20%, 29 km) above 64 km or min(30%, 29 km) below it. Long runs use the mileage cap and 150 minutes, whichever is lower.",
    sourceNoteHansons:
      "The half-marathon and marathon progressions reference the free 18-week Beginner and Advanced Classic plans from Hansons Running Shop. No week-by-week free official Classic schedule is available for 5K or performance 10K, so those automatic plans are not offered. E, Long, Speed, and the app's T/I/R use current VDOT, while Tempo, Strength, and race day use goal MP/HMP. If goal pace is more than 10 seconds per mile faster than the current equivalent, specific work progresses from current pace toward goal pace. Below about 75% of the Classic peak, the app uses a foundation / finish route instead of proportionally shrinking SOS sessions.",
    sourceNoteNorwegian:
      "This page turns the late-stage LetsRun Norwegian Singles discussion into an algorithm: 4.5 running hours per week is a practical gateway and roughly 5–8.5 hours is the main range. Sub-T defaults to 20–25% of weekly running time, with 30% only a warning ceiling. Frequency is not selected by time alone: sessions are kept around 20–30 minutes, then budget, available days, and adaptation status choose 1, 2, 2 + 1 T-lite, or 3 sessions; the automatic per-session cap is 35 minutes. Short, medium, and long reps start around 15K–10-mile, half-marathon, and 25K–30K effort.",
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
      "5K": "5K",
      "10K": "10K",
      "Cross Country": "Cross Country",
      "15K-30K": "15K to 30K / Half",
      "Half Marathon": "Half Marathon",
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

const hansonsTargetRaceOptions = [
  TargetRace.HALF_MARATHON,
  TargetRace.MARATHON
];

const norwegianTargetRaceOptions = [
  TargetRace.FIVE_K,
  TargetRace.TEN_K,
  TargetRace.HALF_MARATHON
];

const trainingCycleOptions = [
  TrainingCycle.PHASE_I,
  TrainingCycle.PHASE_II,
  TrainingCycle.PHASE_III,
  TrainingCycle.PHASE_IV
];

const initialLocale = document.documentElement.lang.startsWith("en") ? "en" : "zh-TW";
const isAndroidApp = window.__RUNSTRATEGY_ANDROID__ === true;

const state = {
  locale: initialLocale,
  toolMode: "pace",
  sidebarOpen: window.matchMedia("(min-width: 621px)").matches,
  theme: "light",
  abilityMode: isAndroidApp ? "race" : "vdot",
  converterType: isAndroidApp ? "race" : "pace",
  equivalentDirection: "coolToHot",
  openMenu: null,
  unitSystem: UnitSystem.METRIC,
  trainingMethod: TrainingMethod.DANIELS,
  targetRace: TargetRace.FIVE_TEN_K,
  trainingCycle: TrainingCycle.PHASE_II,
  halfMarathonWeek: HalfMarathonWeek.ODD,
  marathonPhaseWeek: 1,
  hansonsWeek: 1,
  hansonsLevel: HansonsLevel.BEGINNER,
  hansonsGoalHours: 3,
  hansonsGoalMinutes: 45,
  hansonsGoalSeconds: 0,
  norwegianWeeklyHours: 4,
  norwegianWeeklyMinutes: 45,
  norwegianRunningDays: 6,
  norwegianExperience: NorwegianExperience.INTRO,
  norwegianHealthStatus: NorwegianHealth.HEALTHY,
  norwegianSpecificity: NorwegianSpecificity.VANILLA,
  vdot: 50,
  raceDistanceMeters: 5000,
  raceHours: 0,
  raceMinutes: isAndroidApp ? 19 : 20,
  raceSeconds: isAndroidApp ? 55 : 0,
  equivalentRaceDistanceMeters: isAndroidApp ? 21097.5 : 5000,
  equivalentRaceHours: isAndroidApp ? 1 : 0,
  equivalentRaceMinutes: isAndroidApp ? 45 : 20,
  equivalentRaceSeconds: 0,
  treadmillSpeedUnit: initialLocale === "en" ? "mph" : "kph",
  treadmillSpeed: initialLocale === "en" ? 7.5 : 12,
  treadmillIncline: 1,
  paceMinutes: 5,
  paceSeconds: 0,
  weeklyMileage: 58,
  temperatureC: 26,
  humidity: 70,
  weatherAutoEnabled: false,
  weatherStatus: "idle",
  weatherError: "",
  weatherCurrent: null,
  androidSheet: null,
  manualTemperatureC: 26,
  manualHumidity: 70,
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
  planPointerDrag: null,
  planTouchDrag: null,
  exampleOrder: {},
  draggedExample: null,
  planWorkoutOverrides: {},
  skippedEasyDays: {}
};

const app = document.querySelector("#app");
let pacePanelObserver = null;
let pendingToolMode = null;
let pendingToolModeScrollReset = false;
let toolModeTransitionTimer = null;
let hasPlayedAndroidLaunchAnimation = false;

const TOOL_VIEW_EXIT_MS = 120;
const TOOL_VIEW_ENTER_MS = 260;
const ANDROID_LAUNCH_ENTER_MS = 440;

const downhillStrategyOptions = {
  conservative: 0.35,
  standard: 0.65,
  aggressive: 1
};

const popularGpxRoutes = [
  {
    file: "2025台北馬拉松-半馬組.gpx",
    zh: "2025 台北馬拉松 - 半馬組",
    en: "2025 Taipei Marathon - Half Marathon"
  },
  {
    file: "2026_台南古都半程馬拉松-半馬組.gpx",
    zh: "2026 台南古都半程馬拉松 - 半馬組",
    en: "2026 Tainan Historical Capital International Half Marathon"
  },
  {
    file: "2026渣打馬拉松-半馬組.gpx",
    zh: "2026 渣打臺北公益馬拉松 - 半馬組",
    en: "2026 Standard Chartered Taipei Charity Marathon - Half Marathon"
  },
  {
    file: "2026萬金石馬拉松-10k組.gpx",
    zh: "2026 新北市萬金石馬拉松 - 10K組",
    en: "2026 New Taipei City Wan Jin Shi Marathon - 10K"
  }
];

function getGpxCopy() {
  if (state.locale === "en") {
    return {
      sidebarLabel: "Plan This Race",
      inputsTitle: "GPX Route Inputs",
      resultsTitle: "GPX Grade-Adjusted Pace",
      sourceMode: "GPX source",
      uploadSource: "Upload your own GPX",
      presetSource: "Popular race routes",
      presetRoute: "Popular race route",
      uploadLabel: "Upload GPX",
      uploadButton: "Choose GPX file",
      chooseFile: "Choose file",
      noFileSelected: "No file selected",
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
    sidebarLabel: "這場怎麼跑",
    inputsTitle: "GPX 路線設定",
    resultsTitle: "GPX 坡度代謝等效配速",
    sourceMode: "GPX 來源",
    uploadSource: "自行匯入",
    presetSource: "常用比賽路線",
    presetRoute: "常用比賽路線",
    uploadLabel: "匯入 GPX",
    uploadButton: "選擇 GPX 檔",
    chooseFile: "選擇檔案",
    noFileSelected: "未選擇任何檔案",
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

function getTreadmillCopy() {
  if (state.locale === "en") {
    return {
      sidebarLabel: "Treadmill Effort",
      inputsTitle: "Treadmill setup",
      inputSection: "Speed and incline",
      inputHelp: "Enter the speed shown on the treadmill and its incline setting.",
      speedUnit: "Speed unit",
      speed: "Treadmill speed",
      incline: "Incline",
      sourceRange: "HillRunner table range: 5.0-12.0 mph (8.0-19.3 km/h), 0-10% incline.",
      resultsTitle: "Flat-road equivalent effort",
      equivalentPace: "Equivalent outdoor pace",
      equivalentSpeed: "Equivalent outdoor speed",
      treadmillPace: "Belt pace",
      setting: "Current setting",
      difference: "Pace difference",
      faster: "faster than belt pace",
      slower: "slower than belt pace",
      same: "same as belt pace",
      exact: "Direct HillRunner table value",
      interpolated: "Interpolated between adjacent HillRunner table values",
      supported: "Within the study-supported range",
      supportedNote: "Supported for trained runners at submaximal effort, a 6:45-10:00/mi flat-road equivalent pace, and 0-4% incline.",
      caution: "Outside the validated range",
      cautionNote: "The table value still matches HillRunner, but the study only supports trained runners at submaximal effort, a 6:45-10:00/mi equivalent pace, and 0-4% incline. Use effort and heart rate to adjust.",
      methodTitle: "Source and limits",
      method:
        "This tool reproduces the HillRunner speed-incline lookup table and linearly interpolates only between adjacent published cells. It does not extrapolate beyond the table. HillRunner states that the source data do not fit a meaningful formula and recommends treating the chart as a starting point.",
      invalidSpeed: "Enter a speed within the HillRunner table range.",
      invalidIncline: "Enter an incline from 0% to 10%.",
      mph: "mph",
      kph: "km/h"
    };
  }

  return {
    sidebarLabel: "跑步機換算",
    inputsTitle: "跑步機設定",
    inputSection: "速度與坡度",
    inputHelp: "輸入跑步機面板顯示的速度與坡度，換算成戶外平地的同等努力。",
    speedUnit: "速度單位",
    speed: "跑步機速度",
    incline: "坡度",
    sourceRange: "HillRunner 表格範圍：5.0-12.0 mph（約 8.0-19.3 km/h）、0-10% 坡度。",
    resultsTitle: "戶外平地等強結果",
    equivalentPace: "戶外平地等強配速",
    equivalentSpeed: "戶外平地等強速度",
    treadmillPace: "跑步機實際配速",
    setting: "目前設定",
    difference: "配速差",
    faster: "比跑步機實際配速快",
    slower: "比跑步機實際配速慢",
    same: "與跑步機實際配速相同",
    exact: "直接使用 HillRunner 表格值",
    interpolated: "使用相鄰 HillRunner 表格值線性內插",
    supported: "位於研究支持範圍",
    supportedNote: "研究支持受訓跑者在次最大努力、平地等效配速 6:45-10:00/mi（約 4:12-6:13/km）、0-4% 坡度使用。",
    caution: "超出研究驗證範圍",
    cautionNote: "查表數值仍與 HillRunner 一致，但研究只支持受訓跑者在次最大努力、平地等效配速 6:45-10:00/mi、0-4% 坡度使用，請再用體感與心率調整。",
    methodTitle: "來源與限制",
    method:
      "本工具重現 HillRunner 的速度與坡度查表資料，只在相鄰公開表格值之間做線性內插，不會外推超出原始範圍。HillRunner 說明原始資料無法良好套用單一公式，建議把結果當成調整起點。",
    invalidSpeed: "請輸入 HillRunner 表格範圍內的速度。",
    invalidIncline: "請輸入 0-10% 的坡度。",
    mph: "mph",
    kph: "km/h"
  };
}

function render() {
  if (state.toolMode === "gpxCatalog" || (isAndroidApp && state.toolMode === "gpx")) {
    state.toolMode = "pace";
  }

  const t = copy[state.locale];
  const activeVdot = getActiveVdot();
  const model = calculatePaceModel({ ...state, vdot: activeVdot });

  if (isAndroidApp) {
    renderAndroidApp(model, t);
    return;
  }

  const isConverter = state.toolMode === "equivalent";
  const isPlan = state.toolMode === "plan";
  const isGpx = state.toolMode === "gpx";
  const isTreadmill = state.toolMode === "treadmill";

  document.documentElement.lang = state.locale === "en" ? "en" : "zh-Hant";
  document.documentElement.dataset.theme = state.theme;
  app.innerHTML = `
    <div class="app-workspace ${state.sidebarOpen ? "" : "sidebar-collapsed"}">
      ${renderToolSidebar(t)}
      <div class="content-shell">
        <header class="topbar">
          <div>
            <p class="eyebrow">${t.brandEyebrow}</p>
            <h1>${t.appTitle}</h1>
            <p class="subtitle">${t.subtitle}</p>
          </div>
          ${renderCompactToolbar(t)}
        </header>

        <main class="pace-layout" data-tool-view>
          <section class="control-panel" aria-labelledby="inputs-title">
            <div class="section-heading">
              <p class="section-index">01</p>
              <h2 id="inputs-title">${
                isGpx
                  ? getGpxCopy().inputsTitle
                  : isTreadmill
                    ? getTreadmillCopy().inputsTitle
                    : t.settingsTitle
              }</h2>
            </div>
            ${
              isGpx
                ? renderGpxInputs()
                : isTreadmill
                  ? renderTreadmillInputs()
                : `
                  ${renderInputs(t)}
                  ${isPlan ? renderMileageClass(model, t) : ""}
                `
            }
          </section>

          <section class="results-panel" aria-live="polite">
            ${
              isGpx
                ? renderGpxResults()
                : isTreadmill
                  ? renderTreadmillResults()
                : isConverter
                ? `${renderEquivalentResults(model, t)}${renderEnvironmentSummary(model, t)}`
                : isPlan
                  ? `${renderTrainingPlanResults(model, t)}${renderEnvironmentSummary(model, t)}`
                  : `
                  <div class="section-heading">
                    <p class="section-index">02</p>
                    <h2>${t.vdotPaces}</h2>
                    <strong class="section-value">VDOT ${model.vdot}</strong>
                  </div>
                  ${renderPaceZonePanel(model, t, true)}
                  ${renderEnvironmentSummary(model, t)}
                  ${renderVdotEquivalentResults(model, t)}
                `
            }
          </section>
        </main>
      </div>
    </div>
  `;

  bindEvents();
  if (!isConverter && !isGpx && !isTreadmill) fitPaceZonePanel();
}

function renderAndroidApp(model, t) {
  document.documentElement.lang = state.locale === "en" ? "en" : "zh-Hant";
  document.documentElement.dataset.theme = state.theme;

  const content = state.toolMode === "equivalent"
    ? renderAndroidEquivalentPage(model, t)
    : state.toolMode === "treadmill"
      ? renderAndroidTreadmillPage()
    : state.toolMode === "plan"
      ? renderAndroidPlanPage(model, t)
      : renderAndroidPacePage(model, t);

  app.innerHTML = `
    <div class="android-workspace android-direct-layout">
      <header class="android-appbar">
        <strong>RUNSTRATEGY</strong>
        ${renderCompactToolbar(t)}
      </header>
      <main class="android-page" data-tool-view>${content}</main>
      ${renderAndroidBottomNav(t)}
    </div>
  `;

  bindEvents();
  playAndroidLaunchAnimation();
}

function playAndroidLaunchAnimation() {
  if (!isAndroidApp || hasPlayedAndroidLaunchAnimation) return;
  hasPlayedAndroidLaunchAnimation = true;
  if (prefersReducedMotion()) return;

  const workspace = app.querySelector(".android-workspace");
  const bottomNav = workspace?.querySelector(".android-bottom-nav");
  if (!workspace) return;

  workspace.classList.add("android-app-enter");
  const clearLaunchAnimation = () => {
    workspace.classList.remove("android-app-enter");
    bottomNav?.removeEventListener("animationend", clearLaunchAnimation);
  };

  bottomNav?.addEventListener("animationend", clearLaunchAnimation);
  window.setTimeout(clearLaunchAnimation, ANDROID_LAUNCH_ENTER_MS);
}

function renderAndroidBottomNav(t) {
  const items = [
    ["pace", t.sidebarPaceLabel, renderSidebarIcon("pace")],
    ["equivalent", t.sidebarHeatLabel, renderSidebarIcon("heat")],
    ["treadmill", getTreadmillCopy().sidebarLabel, '<span class="tool-icon-glyph">TM</span>'],
    ["plan", t.sidebarPlanLabel, renderSidebarIcon("plan")]
  ];

  return `
    <nav class="android-bottom-nav" aria-label="${t.toolMode}">
      ${items.map(([value, label, icon]) => `
        <button
          type="button"
          class="${state.toolMode === value ? "active" : ""}"
          data-action="select-menu-option"
          data-field="toolMode"
          data-value="${value}"
          aria-current="${state.toolMode === value ? "page" : "false"}"
        >
          <span aria-hidden="true">${icon}</span>
          <b>${label}</b>
        </button>
      `).join("")}
    </nav>
  `;
}

function renderAndroidPageHead(eyebrow, title, value) {
  return `
    <header class="android-page-head">
      <div><p>${eyebrow}</p><h1>${title}</h1></div>
      <strong>${value}</strong>
    </header>
  `;
}

function renderAndroidPacePage(model, t) {
  const estimate = getRaceEstimate();
  const isRace = state.abilityMode === "race";
  const abilityInputs = isRace
    ? `
      <div class="android-best-result">
        ${renderAndroidSelect(
          "raceDistanceMeters",
          state.raceDistanceMeters,
          raceDistanceOptions.map((item) => ({
            value: item.meters,
            label: state.locale === "en" ? item.en : item.zh
          })),
          t.raceDistance
        )}
        ${renderAndroidTimeInputs([
          ["raceHours", state.raceHours, t.hours, 0, 9],
          ["raceMinutes", state.raceMinutes, t.minutes, 0, 59],
          ["raceSeconds", state.raceSeconds, t.seconds, 0, 59]
        ])}
        <span class="android-vdot-result">${estimate.valid ? `→ VDOT ${estimate.vdot}<small class="finish-result-pace">${formatAverageResultPace(getRaceTimeSeconds(), state.raceDistanceMeters)}</small>` : t.invalidRaceTime}</span>
      </div>
    `
    : `
      <label class="android-direct-vdot">
        <span>${t.vdot}</span>
        <input data-field="vdot" type="number" inputmode="numeric" min="30" max="85" step="1" value="${state.vdot}" />
      </label>
    `;

  return `
    ${renderAndroidPageHead("PACE", t.sidebarPaceLabel, `VDOT ${model.vdot}`)}
    <section class="android-control-card">
      <div class="android-setting-line">
        <label><span>${t.vdotSource}</span>${renderAndroidSelect(
          "abilityMode",
          state.abilityMode,
          [
            { value: "race", label: t.raceResult },
            { value: "vdot", label: t.directVdot }
          ],
          t.vdotSource
        )}</label>
        ${renderAndroidSelect(
          "unitSystem",
          state.unitSystem,
          [
            { value: UnitSystem.METRIC, label: t.metricUnit },
            { value: UnitSystem.IMPERIAL, label: t.imperialUnit }
          ],
          t.unitSystem
        )}
      </div>
      ${abilityInputs}
      ${renderAndroidWeatherControl(t)}
    </section>
    <section class="android-pace-list" aria-label="${t.vdotPaces}">
      ${model.zones.map((zone) => `
        <article class="android-pace-row ${zoneTone[zone.id]}">
          <div><b>${zone.id}</b><span>${t.zoneNames[zone.id].replace(`${zone.id} `, "")}</span></div>
          <dl>
            <div><dt>${t.basePace}</dt><dd>${renderPaceValue(zone.base.label)}</dd></div>
            <div><dt>${zone.id === "R" ? t.rTargetPaceShort : t.adjustedPaceShort}</dt><dd>${renderPaceValue(zone.adjusted.label)}</dd></div>
          </dl>
        </article>
      `).join("")}
    </section>
    ${renderAndroidHeatStrip(model, t)}
  `;
}

function renderAndroidEquivalentPage(model, t) {
  const result = state.converterType === "race"
    ? getRaceEquivalent(model.heatAdjustment.multiplier)
    : getPaceEquivalent(model.heatAdjustment.multiplier);
  const isRace = state.converterType === "race";
  const inputFields = isRace
    ? `
      <div class="android-conversion-inputs">
        <label><span>${t.raceDistance}</span>${renderAndroidSelect(
          "equivalentRaceDistanceMeters",
          state.equivalentRaceDistanceMeters,
          equivalentRaceOptions.map((item) => ({
            value: item.meters,
            label: state.locale === "en" ? item.en : item.zh
          })),
          t.raceDistance
        )}</label>
        <label><span>${state.equivalentDirection === "hotToCool" ? t.heatEnvironmentResult : t.equivalentRace}</span>${renderAndroidTimeInputs([
          ["equivalentRaceHours", state.equivalentRaceHours, t.hours, 0, 9],
          ["equivalentRaceMinutes", state.equivalentRaceMinutes, t.minutes, 0, 59],
          ["equivalentRaceSeconds", state.equivalentRaceSeconds, t.seconds, 0, 59]
        ])}</label>
      </div>
    `
    : `
      <div class="android-conversion-inputs">
        <label><span>${state.equivalentDirection === "hotToCool" ? t.heatEnvironmentPace : t.baselinePace}</span>${renderAndroidTimeInputs([
          ["paceMinutes", state.paceMinutes, t.minutes, 0, 30],
          ["paceSeconds", state.paceSeconds, t.seconds, 0, 59]
        ])}</label>
        <label><span>${t.unitSystem}</span>${renderAndroidSelect(
          "unitSystem",
          state.unitSystem,
          [
            { value: UnitSystem.METRIC, label: t.metricUnit },
            { value: UnitSystem.IMPERIAL, label: t.imperialUnit }
          ],
          t.unitSystem
        )}</label>
      </div>
    `;

  return `
    ${renderAndroidPageHead("HEAT", t.sidebarHeatLabel, state.locale === "en" ? "Equal effort" : "同等努力")}
    <section class="android-control-card">
      <div class="android-segmented" role="group" aria-label="${t.converterType}">
        <button type="button" class="${isRace ? "" : "active"}" data-action="select-menu-option" data-field="converterType" data-value="pace">${t.paceConverter}</button>
        <button type="button" class="${isRace ? "active" : ""}" data-action="select-menu-option" data-field="converterType" data-value="race">${t.raceConverter}</button>
      </div>
      <label class="android-direction"><span>${t.converterDirection}</span>${renderAndroidSelect(
        "equivalentDirection",
        state.equivalentDirection,
        [
          { value: "coolToHot", label: t.coolToHot },
          { value: "hotToCool", label: t.hotToCool }
        ],
        t.converterDirection
      )}</label>
      ${inputFields}
      ${renderAndroidWeatherControl(t)}
    </section>
    <section class="android-result-card">
      <p>${t.equivalentResult}</p>
      <h2>${isRace
        ? (state.locale === "en" ? "Equal-effort finish time" : "同等努力的完賽時間")
        : (state.locale === "en" ? "Equal-effort pace" : "同等努力的配速差異")}</h2>
      <span>${state.locale === "en" ? "Estimated from the current temperature and humidity." : "依目前溫濕度估算，作為今天策略參考。"}</span>
      <div class="android-result-grid">
        ${result.cards.slice(0, 2).map((card) => `
          <div class="${card.highlight ? "active" : ""}">
            <span>${card.label}</span>
            <strong>${card.finishSeconds
              ? renderFinishTimeWithPace(card.finishSeconds, card.distanceMeters)
              : renderPaceValue(card.value)}</strong>
            <small>${card.meta ?? ""}</small>
          </div>
        `).join("")}
      </div>
      <div class="android-decision"><span>${state.locale === "en" ? "Today" : "今天建議"}</span><strong>${renderAndroidConversionDecision(model, isRace)}</strong></div>
    </section>
    ${renderAndroidHeatStrip(model, t)}
    <aside class="android-heat-advice"><b>!</b><span>${state.locale === "en" ? "Check effort and heart rate first; slow down or stop if you feel unwell." : "先看體感與心率；若持續不適，降低總量或改到較涼時段。"}</span></aside>
  `;
}

function renderAndroidPlanPage(model, t) {
  const schedule = applyEasyRunRedistribution(model.weeklySchedule);
  const orderedSchedule = getOrderedSchedule(schedule);
  const plannedTotalKm = schedule.reduce((total, day) => total + Number(day.plannedDistanceKm ?? 0), 0);
  const longRunKm = Number(schedule.find((day) => day.isLongRun)?.plannedDistanceKm ?? 0);
  const longRunShare = plannedTotalKm > 0 ? Math.round((longRunKm / plannedTotalKm) * 1000) / 10 : 0;
  const totalLabel = formatPlanDistanceRange({ min: plannedTotalKm, max: plannedTotalKm });
  const isHansons = state.trainingMethod === TrainingMethod.HANSONS;
  const isNorwegian = state.trainingMethod === TrainingMethod.NORWEGIAN_SINGLES;
  const planTargetOptions = isHansons
    ? hansonsTargetRaceOptions
    : isNorwegian
      ? norwegianTargetRaceOptions
      : targetRaceOptions;
  const hansonsTotalWeeks = HANSONS_PLAN_LENGTHS[state.targetRace] ?? 18;
  const planHeading = isHansons
    ? `PLAN · HANSONS · ${model.hansonsPlan?.phaseEn ?? ""}`
    : isNorwegian
      ? `PLAN · SUB-T · ${model.norwegianPlan?.levelEn ?? ""}`
      : `PLAN · ${t.cycleNames[state.trainingCycle].split(" ").slice(0, 2).join(" ")}`;

  return `
    ${renderAndroidPageHead(planHeading, t.sidebarPlanLabel, totalLabel)}
    <section class="android-plan-summary">
      <label><span>${t.trainingMethod}</span>${renderAndroidSelect("trainingMethod", state.trainingMethod, [
        { value: TrainingMethod.DANIELS, label: t.danielsMethod },
        { value: TrainingMethod.HANSONS, label: t.hansonsMethod },
        { value: TrainingMethod.NORWEGIAN_SINGLES, label: t.norwegianMethod }
      ], t.trainingMethod)}</label>
      <label><span>${t.targetRace}</span>${renderAndroidSelect(
        "targetRace",
        state.targetRace,
        planTargetOptions.map((value) => ({ value, label: t.targetRaceNames[value] })),
        t.targetRace
      )}</label>
      <div><span>${t.vdot}</span><strong>${model.vdot}</strong></div>
      ${isNorwegian
        ? `<div><span>${t.norwegianWeeklySubTBudget}</span><strong>${model.norwegianPlan?.weeklySubTTargetMinutes ?? 0} min</strong></div>
           <div><span>${t.norwegianQualitySessions}</span><strong>${getNorwegianQualityCountLabel(model.norwegianPlan)}</strong></div>`
        : `<div><span>${t.longRunShare}</span><strong>${longRunShare}%</strong></div>`}
    </section>
    <section class="android-plan-settings">
      ${isHansons
        ? `
          <label><span>${t.hansonsLevel}</span>${renderAndroidSelect("hansonsLevel", state.hansonsLevel, [
            { value: HansonsLevel.BEGINNER, label: t.hansonsBeginner },
            { value: HansonsLevel.ADVANCED, label: t.hansonsAdvanced }
          ], t.hansonsLevel)}</label>
          <label><span>${t.hansonsPlanWeek}</span>${renderAndroidSelect("hansonsWeek", state.hansonsWeek, Array.from({ length: hansonsTotalWeeks }, (_, index) => ({
            value: index + 1,
            label: t.hansonsPlanWeekOption.replace("{week}", index + 1).replace("{total}", hansonsTotalWeeks)
          })), t.hansonsPlanWeek)}</label>
          ${isHansonsClassicTarget() ? `<label><span>${t.hansonsGoalTime}</span>${renderAndroidTimeInputs([
            ["hansonsGoalHours", state.hansonsGoalHours, t.hours, 0, 9],
            ["hansonsGoalMinutes", state.hansonsGoalMinutes, t.minutes, 0, 59],
            ["hansonsGoalSeconds", state.hansonsGoalSeconds, t.seconds, 0, 59]
          ])}</label>` : ""}
        `
        : isNorwegian
          ? `
            <label><span>${t.norwegianWeeklyTime}</span>${renderAndroidTimeInputs([
              ["norwegianWeeklyHours", state.norwegianWeeklyHours, t.hours, 0, 15],
              ["norwegianWeeklyMinutes", state.norwegianWeeklyMinutes, t.minutes, 0, 59]
            ])}</label>
            <label><span>${t.norwegianRunningDays}</span>${renderAndroidSelect("norwegianRunningDays", state.norwegianRunningDays, Array.from({ length: 5 }, (_, index) => ({ value: index + 3, label: `${index + 3}` })), t.norwegianRunningDays)}</label>
            <label><span>${t.norwegianExperience}</span>${renderAndroidSelect("norwegianExperience", state.norwegianExperience, [
              { value: NorwegianExperience.INTRO, label: t.norwegianIntro },
              { value: NorwegianExperience.STABLE, label: t.norwegianStable },
              { value: NorwegianExperience.LONG_TERM, label: t.norwegianLongTerm }
            ], t.norwegianExperience)}</label>
            <label><span>${t.norwegianHealth}</span>${renderAndroidSelect("norwegianHealthStatus", state.norwegianHealthStatus, [
              { value: NorwegianHealth.HEALTHY, label: t.norwegianHealthy },
              { value: NorwegianHealth.RETURNING, label: t.norwegianReturning }
            ], t.norwegianHealth)}</label>
            <label><span>${t.norwegianSpecificity}</span>${renderAndroidSelect("norwegianSpecificity", state.norwegianSpecificity, [
              { value: NorwegianSpecificity.VANILLA, label: t.norwegianVanilla },
              { value: NorwegianSpecificity.SPECIFIC, label: t.norwegianSpecific }
            ], t.norwegianSpecificity)}</label>
          `
          : `<label><span>${t.trainingCycle}</span>${renderAndroidSelect(
            "trainingCycle",
            state.trainingCycle,
            trainingCycleOptions.map((value) => ({ value, label: t.cycleNames[value] })),
            t.trainingCycle
          )}</label>`}
      <label><span>${isHansons ? t.peakWeeklyMileage : t.weeklyMileage}</span><input data-field="weeklyMileage" type="number" inputmode="numeric" min="0" max="${state.unitSystem === UnitSystem.IMPERIAL ? 112 : 180}" step="1" value="${state.weeklyMileage}" /><b>${state.unitSystem === UnitSystem.IMPERIAL ? "mi" : "km"}</b></label>
    </section>
    ${model.hansonsPlan?.qualityNoteZh ? `<p class="android-heat-advice">${state.locale === "en" ? model.hansonsPlan.qualityNoteEn : model.hansonsPlan.qualityNoteZh}</p>` : ""}
    ${model.hansonsPlan?.belowRecommendedVolume ? `<p class="android-heat-advice">${model.hansonsPlan.foundationFinishRoute ? t.hansonsLowVolumeWarning : t.hansonsVolumeWarning}</p>` : ""}
    ${model.hansonsPlan?.goalGapTooLarge && !model.hansonsPlan?.foundationFinishRoute ? `<p class="android-heat-advice">${t.hansonsGoalGapWarning}</p>` : ""}
    ${isNorwegian && model.norwegianPlan?.levelId === "A" ? `<p class="android-heat-advice">${t.norwegianLowVolumeNote}</p>` : ""}
    ${isNorwegian && model.norwegianPlan?.transitionThirdSession ? `<p class="android-heat-advice">${t.norwegianTransitionNote}</p>` : ""}
    ${isNorwegian && model.norwegianPlan?.specificityRequested && !model.norwegianPlan?.specificityEnabled ? `<p class="android-heat-advice">${t.norwegianSpecificityDeferredNote}</p>` : ""}
    ${isNorwegian && model.norwegianPlan?.safetyReasons?.length ? `<p class="android-heat-advice">${t.norwegianSafetyNote}</p>` : ""}
    ${isNorwegian && model.norwegianPlan?.distanceCanMatchInput === false ? `<p class="android-heat-advice">${t.norwegianDistanceWarning}</p>` : ""}
    ${isNorwegian ? `<p class="android-heat-advice">${t.norwegianTimeFirstNote}</p>` : ""}
    ${isNorwegian ? `<p class="android-heat-advice">${t.norwegianFormatNote}</p>` : ""}
    ${state.trainingMethod === TrainingMethod.DANIELS && model.danielsQualityEligibility?.fallback ? `<p class="android-heat-advice">${t.danielsLowVolumeBaseNote}</p>` : ""}
    ${renderAndroidWeatherControl(t)}
    <p class="android-drag-hint">${state.locale === "en" ? "Press and hold, then drag up or down to swap days." : "長按卡片後上下拖曳，可交換訓練日期"}</p>
    <section class="android-week-list" data-plan-grid aria-label="${t.weeklyPlan}">
      ${orderedSchedule.map(({ day, index }) => renderAndroidPlanDay(day, index, model, t)).join("")}
    </section>
  `;
}

function renderAndroidPlanDay(day, index, model, t) {
  const candidates = getPlanWorkoutCandidates(day, model);
  const selectedWorkout = getSelectedPlanWorkout(index, candidates);
  const displayDay = selectedWorkout
    ? {
        ...day,
        zone: selectedWorkout.zone ?? day.zone,
        paceZoneIds: selectedWorkout.paceZoneIds ?? day.paceZoneIds,
        customPaceRows: selectedWorkout.customPaceRows ?? day.customPaceRows,
        workoutType: selectedWorkout.type ?? day.workoutType,
        subTMinutes: selectedWorkout.subTMinutes ?? day.subTMinutes,
        zhDistanceLabel: selectedWorkout.zhDistanceLabel ?? day.zhDistanceLabel,
        enDistanceLabel: selectedWorkout.enDistanceLabel ?? day.enDistanceLabel
      }
    : day;
  const title = selectedWorkout
    ? (state.locale === "en" ? selectedWorkout.en : selectedWorkout.zh)
    : (state.locale === "en" ? day.en : day.zh);
  const distance = state.locale === "en" ? displayDay.enDistanceLabel : displayDay.zhDistanceLabel;
  const zoneIds = Array.isArray(displayDay.paceZoneIds) && displayDay.paceZoneIds.length
    ? displayDay.paceZoneIds
    : displayDay.pace ? [displayDay.zone] : [];
  const paceZone = model.zones.find((zone) => zone.id === zoneIds[0]);
  const customPace = displayDay.customPaceRows?.[0];
  const pace = customPace
    ? renderPaceValue(customPace.adjusted)
    : paceZone
      ? renderPaceValue(paceZone.adjusted.label)
      : "—";
  const paceLabel = customPace
    ? (state.locale === "en" ? customPace.en : customPace.zh)
    : displayDay.zone === "R"
      ? t.rTargetPaceShort
      : t.adjustedPaceShort;

  return `
    <article class="android-plan-day ${zoneTone[displayDay.zone] ?? "rest"} ${day.isSkippedEasyRun ? "rest" : ""}" data-plan-card data-plan-index="${index}" aria-label="${state.locale === "en" ? "Drag to move" : "長按拖曳交換日期"}：${title}">
      <span class="android-drag-handle" aria-hidden="true">⋮⋮</span>
      <div class="android-day-zone"><span>${state.locale === "en" ? day.enDay : day.zhDay}</span><b>${day.isSkippedEasyRun ? "—" : displayDay.zone}</b></div>
      <div><strong>${title}</strong>${distance ? `<span>${distance}</span>` : ""}</div>
      <div class="android-day-pace"><small>${paceLabel}</small><strong>${pace}</strong></div>
      ${renderPlanWorkoutSwitcher(index, candidates, selectedWorkout, t, day, model)}
      ${day.easyDistributionEligible ? `<button type="button" data-action="toggle-easy-rest" data-plan-index="${index}" aria-label="${day.isSkippedEasyRun ? t.restoreEasyRun : t.skipEasyRun}">${day.isSkippedEasyRun ? "+" : "×"}</button>` : ""}
    </article>
  `;
}

function renderAndroidSettingsSheet(model, t) {
  if (!state.androidSheet) return "";

  const titles = {
    pace: state.locale === "en" ? "Pace settings" : "配速設定",
    equivalent: state.locale === "en" ? "Heat conversion settings" : "熱環境換算設定",
    plan: state.locale === "en" ? "Weekly plan settings" : "本週課表設定"
  };
  const body = state.androidSheet === "equivalent"
    ? renderAndroidEquivalentSheet(t)
    : state.androidSheet === "plan"
      ? renderAndroidPlanSheet(model, t)
      : renderAndroidPaceSheet(t);

  return `
    <div class="android-sheet-layer">
      <button type="button" class="android-sheet-scrim" data-action="close-android-sheet" aria-label="${state.locale === "en" ? "Close settings" : "關閉設定"}"></button>
      <section class="android-settings-sheet" role="dialog" aria-modal="true" aria-labelledby="android-sheet-title">
        <div class="android-sheet-handle" aria-hidden="true"></div>
        <header class="android-sheet-header">
          <div><p>RUNSTRATEGY</p><h2 id="android-sheet-title">${titles[state.androidSheet] ?? titles.pace}</h2></div>
          <button type="button" data-action="close-android-sheet" aria-label="${state.locale === "en" ? "Close" : "關閉"}">×</button>
        </header>
        <div class="android-sheet-content">${body}</div>
        <button type="button" class="android-sheet-apply" data-action="close-android-sheet">${state.locale === "en" ? "Apply and view results" : "套用並查看結果"}</button>
      </section>
    </div>
  `;
}

function renderAndroidPaceSheet(t) {
  const estimate = getRaceEstimate();
  const isRace = state.abilityMode === "race";

  return `
    <div class="android-sheet-segmented" role="group" aria-label="${t.vdotSource}">
      <button type="button" class="${isRace ? "active" : ""}" data-action="select-menu-option" data-field="abilityMode" data-value="race">${t.raceResult}</button>
      <button type="button" class="${isRace ? "" : "active"}" data-action="select-menu-option" data-field="abilityMode" data-value="vdot">${t.directVdot}</button>
    </div>
    <div class="android-sheet-grid">
      <label><span>${t.unitSystem}</span>${renderAndroidSelect("unitSystem", state.unitSystem, [
        { value: UnitSystem.METRIC, label: t.metricUnit },
        { value: UnitSystem.IMPERIAL, label: t.imperialUnit }
      ], t.unitSystem)}</label>
      ${isRace
        ? `<label><span>${t.raceDistance}</span>${renderAndroidSelect("raceDistanceMeters", state.raceDistanceMeters, raceDistanceOptions.map((item) => ({
            value: item.meters,
            label: state.locale === "en" ? item.en : item.zh
          })), t.raceDistance)}</label>`
        : `<label><span>${t.vdot}</span><input data-field="vdot" type="number" inputmode="numeric" min="30" max="85" step="1" value="${state.vdot}" /></label>`}
    </div>
    ${isRace ? `
      <div class="android-sheet-field">
        <span>${t.raceTime}</span>
        ${renderAndroidTimeInputs([
          ["raceHours", state.raceHours, t.hours, 0, 9],
          ["raceMinutes", state.raceMinutes, t.minutes, 0, 59],
          ["raceSeconds", state.raceSeconds, t.seconds, 0, 59]
        ])}
        <p class="android-sheet-result">${estimate.valid ? `${t.estimatedVdot} · VDOT ${estimate.vdot}<small class="finish-result-pace">${formatAverageResultPace(getRaceTimeSeconds(), state.raceDistanceMeters)}</small>` : t.invalidRaceTime}</p>
      </div>
    ` : ""}
    ${renderAndroidSheetWeather(t)}
  `;
}

function renderAndroidEquivalentSheet(t) {
  const isRace = state.converterType === "race";
  const paceUnit = state.unitSystem === UnitSystem.IMPERIAL ? "/ mi" : "/ km";

  return `
    <div class="android-sheet-segmented" role="group" aria-label="${t.converterType}">
      <button type="button" class="${isRace ? "" : "active"}" data-action="select-menu-option" data-field="converterType" data-value="pace">${t.paceConverter}</button>
      <button type="button" class="${isRace ? "active" : ""}" data-action="select-menu-option" data-field="converterType" data-value="race">${t.raceConverter}</button>
    </div>
    <div class="android-sheet-grid">
      <label><span>${t.converterDirection}</span>${renderAndroidSelect("equivalentDirection", state.equivalentDirection, [
        { value: "coolToHot", label: t.coolToHot },
        { value: "hotToCool", label: t.hotToCool }
      ], t.converterDirection)}</label>
      <label><span>${t.unitSystem}</span>${renderAndroidSelect("unitSystem", state.unitSystem, [
        { value: UnitSystem.METRIC, label: t.metricUnit },
        { value: UnitSystem.IMPERIAL, label: t.imperialUnit }
      ], t.unitSystem)}</label>
      ${isRace ? `<label><span>${t.raceDistance}</span>${renderAndroidSelect("equivalentRaceDistanceMeters", state.equivalentRaceDistanceMeters, equivalentRaceOptions.map((item) => ({
        value: item.meters,
        label: state.locale === "en" ? item.en : item.zh
      })), t.raceDistance)}</label>` : ""}
    </div>
    <div class="android-sheet-field">
      <span>${isRace ? t.raceTime : `${state.equivalentDirection === "hotToCool" ? t.heatEnvironmentPace : t.baselinePace} ${paceUnit}`}</span>
      ${isRace
        ? renderAndroidTimeInputs([
            ["equivalentRaceHours", state.equivalentRaceHours, t.hours, 0, 9],
            ["equivalentRaceMinutes", state.equivalentRaceMinutes, t.minutes, 0, 59],
            ["equivalentRaceSeconds", state.equivalentRaceSeconds, t.seconds, 0, 59]
          ])
        : renderAndroidTimeInputs([
            ["paceMinutes", state.paceMinutes, t.minutes, 0, 30],
            ["paceSeconds", state.paceSeconds, t.seconds, 0, 59]
          ])}
    </div>
    ${renderAndroidSheetWeather(t)}
  `;
}

function renderAndroidPlanSheet(model, t) {
  const mileageMax = state.unitSystem === UnitSystem.IMPERIAL ? 112 : 180;
  const isHansons = state.trainingMethod === TrainingMethod.HANSONS;
  const isNorwegian = state.trainingMethod === TrainingMethod.NORWEGIAN_SINGLES;
  const planTargetOptions = isHansons
    ? hansonsTargetRaceOptions
    : isNorwegian
      ? norwegianTargetRaceOptions
      : targetRaceOptions;
  const hansonsTotalWeeks = HANSONS_PLAN_LENGTHS[state.targetRace] ?? 18;
  const showHalfMarathonWeek =
    !isHansons && !isNorwegian && state.targetRace === TargetRace.ROAD_15K_30K &&
    state.trainingCycle !== TrainingCycle.PHASE_I;
  const showMarathonPhaseWeek = !isHansons && !isNorwegian && state.targetRace === TargetRace.MARATHON;

  return `
    <div class="android-sheet-grid">
      <label><span>${t.targetRace}</span>${renderAndroidSelect("targetRace", state.targetRace, planTargetOptions.map((value) => ({
        value,
        label: t.targetRaceNames[value]
      })), t.targetRace)}</label>
      ${isHansons ? `
        <label><span>${t.hansonsLevel}</span>${renderAndroidSelect("hansonsLevel", state.hansonsLevel, [
          { value: HansonsLevel.BEGINNER, label: t.hansonsBeginner },
          { value: HansonsLevel.ADVANCED, label: t.hansonsAdvanced }
        ], t.hansonsLevel)}</label>
        <label><span>${t.hansonsPlanWeek}</span>${renderAndroidSelect("hansonsWeek", state.hansonsWeek, Array.from({ length: hansonsTotalWeeks }, (_, index) => ({
          value: index + 1,
          label: t.hansonsPlanWeekOption.replace("{week}", index + 1).replace("{total}", hansonsTotalWeeks)
        })), t.hansonsPlanWeek)}</label>
        ${isHansonsClassicTarget() ? `<label><span>${t.hansonsGoalTime}</span>${renderAndroidTimeInputs([
          ["hansonsGoalHours", state.hansonsGoalHours, t.hours, 0, 9],
          ["hansonsGoalMinutes", state.hansonsGoalMinutes, t.minutes, 0, 59],
          ["hansonsGoalSeconds", state.hansonsGoalSeconds, t.seconds, 0, 59]
        ])}</label>` : ""}
      ` : isNorwegian ? `
        <label><span>${t.norwegianWeeklyTime}</span>${renderAndroidTimeInputs([
          ["norwegianWeeklyHours", state.norwegianWeeklyHours, t.hours, 0, 15],
          ["norwegianWeeklyMinutes", state.norwegianWeeklyMinutes, t.minutes, 0, 59]
        ])}</label>
        <label><span>${t.norwegianRunningDays}</span>${renderAndroidSelect("norwegianRunningDays", state.norwegianRunningDays, Array.from({ length: 5 }, (_, index) => ({ value: index + 3, label: `${index + 3}` })), t.norwegianRunningDays)}</label>
        <label><span>${t.norwegianExperience}</span>${renderAndroidSelect("norwegianExperience", state.norwegianExperience, [
          { value: NorwegianExperience.INTRO, label: t.norwegianIntro },
          { value: NorwegianExperience.STABLE, label: t.norwegianStable },
          { value: NorwegianExperience.LONG_TERM, label: t.norwegianLongTerm }
        ], t.norwegianExperience)}</label>
        <label><span>${t.norwegianHealth}</span>${renderAndroidSelect("norwegianHealthStatus", state.norwegianHealthStatus, [
          { value: NorwegianHealth.HEALTHY, label: t.norwegianHealthy },
          { value: NorwegianHealth.RETURNING, label: t.norwegianReturning }
        ], t.norwegianHealth)}</label>
        <label><span>${t.norwegianSpecificity}</span>${renderAndroidSelect("norwegianSpecificity", state.norwegianSpecificity, [
          { value: NorwegianSpecificity.VANILLA, label: t.norwegianVanilla },
          { value: NorwegianSpecificity.SPECIFIC, label: t.norwegianSpecific }
        ], t.norwegianSpecificity)}</label>
      ` : `<label><span>${t.trainingCycle}</span>${renderAndroidSelect("trainingCycle", state.trainingCycle, trainingCycleOptions.map((value) => ({
          value,
          label: t.cycleNames[value]
        })), t.trainingCycle)}</label>`}
      <label><span>${t.unitSystem}</span>${renderAndroidSelect("unitSystem", state.unitSystem, [
        { value: UnitSystem.METRIC, label: t.metricUnit },
        { value: UnitSystem.IMPERIAL, label: t.imperialUnit }
      ], t.unitSystem)}</label>
      <label><span>${isHansons || showMarathonPhaseWeek ? t.peakWeeklyMileage : t.weeklyMileage}</span><input data-field="weeklyMileage" type="number" inputmode="numeric" min="0" max="${mileageMax}" step="1" value="${state.weeklyMileage}" /></label>
      ${showMarathonPhaseWeek ? `<label><span>${t.marathonPhaseWeek}</span>${renderAndroidSelect("marathonPhaseWeek", state.marathonPhaseWeek, Array.from({ length: MARATHON_PHASE_WEEKS }, (_, index) => ({
        value: index + 1,
        label: t.marathonPhaseWeekOption.replace("{week}", index + 1)
      })), t.marathonPhaseWeek)}</label>` : ""}
    </div>
    <p class="android-sheet-result">VDOT ${model.vdot} · ${state.locale === "en" ? "Change ability on the Pace screen." : "跑力請至「算我的配速」調整"}</p>
    ${showHalfMarathonWeek ? `
      <div class="android-sheet-field">
        <span>${t.halfMarathonWeek}</span>
        <div class="android-sheet-segmented" role="group" aria-label="${t.halfMarathonWeek}">
          <button type="button" class="${state.halfMarathonWeek === HalfMarathonWeek.ODD ? "active" : ""}" data-action="set-half-marathon-week" data-value="${HalfMarathonWeek.ODD}">${t.halfMarathonOddWeek}</button>
          <button type="button" class="${state.halfMarathonWeek === HalfMarathonWeek.EVEN ? "active" : ""}" data-action="set-half-marathon-week" data-value="${HalfMarathonWeek.EVEN}">${t.halfMarathonEvenWeek}</button>
        </div>
      </div>
    ` : ""}
    ${renderAndroidSheetWeather(t)}
  `;
}

function renderAndroidSheetWeather(t) {
  return `
    <section class="android-sheet-weather">
      <div><p>${t.environmentSection}</p><strong>${state.locale === "en" ? "Use the same weather for every result" : "每項結果都套用同一組天氣"}</strong></div>
      ${renderAndroidWeatherControl(t)}
    </section>
  `;
}

function renderAndroidWeatherSummary(t) {
  return `<small class="android-summary-weather">${renderAndroidWeatherSummaryText(t)}</small>`;
}

function renderAndroidWeatherSummaryText(t) {
  if (state.weatherAutoEnabled && state.weatherCurrent) {
    const location = formatWeatherLocation(state.weatherCurrent.location);
    const place = [location?.region, location?.place].filter(Boolean).join(" · ");
    return `${place || (state.locale === "en" ? "Current location" : "目前位置")} · ${state.weatherCurrent.temperatureC}${t.celsius} · ${state.weatherCurrent.humidity}${t.percent}`;
  }

  return `${state.locale === "en" ? "Manual" : "手動"} · ${state.temperatureC}${t.celsius} · ${state.humidity}${t.percent}`;
}

function renderAndroidSelect(field, value, items, label) {
  return `
    <select data-field="${field}" aria-label="${label}">
      ${items.map((item) => `<option value="${item.value}" ${String(item.value) === String(value) ? "selected" : ""}>${item.label}</option>`).join("")}
    </select>
  `;
}

function renderAndroidTimeInputs(fields) {
  return `
    <span class="android-time-inputs">
      ${fields.map(([field, value, label, min, max]) => `
        <label><input data-field="${field}" type="number" inputmode="numeric" min="${min}" max="${max}" step="1" value="${value}" aria-label="${label}" /><small>${label}</small></label>
      `).join("")}
    </span>
  `;
}

function renderAndroidWeatherControl(t) {
  const isBusy = state.weatherStatus === "loading" || state.weatherStatus === "refreshing";
  const isError = state.weatherStatus === "error" || state.weatherStatus === "refresh-error";
  const location = state.weatherCurrent ? formatWeatherLocation(state.weatherCurrent.location) : null;
  const place = location ? [location.region, location.place].filter(Boolean).join(" · ") : "";

  if (state.weatherAutoEnabled && state.weatherCurrent) {
    return `
      <div class="android-weather active">
        <button type="button" data-action="toggle-auto-weather" aria-label="${t.disableAutoWeather}">${renderLocationIcon()}</button>
        <div><span>${t.currentLocationWeather}</span><strong>${place || (state.locale === "en" ? "Current location" : "目前位置")} · ${state.weatherCurrent.temperatureC}${t.celsius} · ${state.weatherCurrent.humidity}${t.percent}</strong></div>
        <button type="button" data-action="refresh-auto-weather" ${isBusy ? "disabled" : ""}>${isBusy ? "…" : (state.locale === "en" ? "Update" : "更新")}</button>
      </div>
    `;
  }

  const label = isError ? t.retryAutoWeather : (isBusy ? t.weatherLocating : t.enableAutoWeather);
  return `
    <div class="android-weather">
      <button type="button" data-action="toggle-auto-weather" ${isBusy ? "disabled" : ""}>${renderLocationIcon()}<span>${label}</span></button>
      <label><input data-field="temperatureC" type="number" inputmode="numeric" min="-5" max="45" step="1" value="${state.temperatureC}" /><small>${t.celsius}</small></label>
      <label><input data-field="humidity" type="number" inputmode="numeric" min="0" max="100" step="1" value="${state.humidity}" /><small>${t.percent}</small></label>
    </div>
  `;
}

function renderAndroidHeatStrip(model, t) {
  return `
    <section class="android-heat-strip" aria-label="${t.heatAdjustment}">
      <div><span>${t.heatIndex}</span><strong>${model.heatAdjustment.heatIndex}${t.celsius}</strong></div>
      <div><span>${t.speedLoss}</span><strong>${model.heatAdjustment.speedLossPercentage}%</strong></div>
      <div><span>${t.slowerBy}</span><strong>${model.heatAdjustment.percentage}%</strong></div>
      <div><span>${t.recoveryHot}</span><strong>+${model.heatAdjustment.recoveryPercentage}%</strong></div>
    </section>
  `;
}

function renderAndroidConversionDecision(model, isRace) {
  const multiplier = Number(model.heatAdjustment.multiplier);
  const reverse = state.equivalentDirection === "hotToCool";
  const direction = state.locale === "en"
    ? (reverse ? "faster by about" : "slower by about")
    : (reverse ? "約可縮短" : "約增加");
  const inputSeconds = isRace ? getEquivalentRaceTimeSeconds() : getPaceInputSeconds();
  const adjustedSeconds = reverse ? inputSeconds / multiplier : inputSeconds * multiplier;
  const difference = Math.max(0, Math.round(Math.abs(adjustedSeconds - inputSeconds)));

  if (isRace) {
    return state.locale === "en"
      ? `Finish time ${direction} ${formatAndroidDuration(difference)}`
      : `完賽時間${direction} ${formatAndroidDuration(difference)}`;
  }

  return state.locale === "en"
    ? `Pace ${direction} ${difference} sec per ${state.unitSystem === UnitSystem.IMPERIAL ? "mile" : "km"}`
    : `每${state.unitSystem === UnitSystem.IMPERIAL ? "英里" : "公里"}${direction} ${difference} 秒`;
}

function formatAndroidDuration(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;
  if (state.locale === "en") return minutes ? `${minutes}m ${remaining}s` : `${remaining}s`;
  return minutes ? `${minutes} 分 ${remaining} 秒` : `${remaining} 秒`;
}

function renderAndroidTreadmillPage() {
  const copy = getTreadmillCopy();
  const conversion = getTreadmillConversion();
  const bounds = getTreadmillSpeedBounds();
  const result = conversion.valid
    ? `
      <section class="android-treadmill-result">
        <span>${copy.equivalentPace}</span>
        <strong>${formatTreadmillPace(conversion)}</strong>
        <small>${formatTreadmillSpeed(conversion.equivalentSpeedMph, conversion.equivalentSpeedKph)}</small>
      </section>
      <dl class="android-treadmill-metrics">
        <div><dt>${copy.treadmillPace}</dt><dd>${formatTreadmillPace(conversion, "treadmill")}</dd></div>
        <div><dt>${copy.setting}</dt><dd>${formatTreadmillSetting()}</dd></div>
      </dl>
      <p class="android-heat-advice ${conversion.withinValidatedRange ? "" : "treadmill-caution"}">
        ${conversion.withinValidatedRange ? copy.supportedNote : copy.cautionNote}
      </p>
    `
    : `<p class="android-heat-advice treadmill-caution">${getTreadmillError(copy, conversion)}</p>`;

  return `
    ${renderAndroidPageHead("TREADMILL", copy.sidebarLabel, formatTreadmillSetting())}
    <section class="android-treadmill-controls">
      <label><span>${copy.speedUnit}</span>${renderAndroidSelect("treadmillSpeedUnit", state.treadmillSpeedUnit, [
        { value: "kph", label: copy.kph },
        { value: "mph", label: copy.mph }
      ], copy.speedUnit)}</label>
      <label><span>${copy.speed}</span><input data-field="treadmillSpeed" type="number" inputmode="decimal" min="${bounds.min}" max="${bounds.max}" step="0.1" value="${state.treadmillSpeed}" /><b>${state.treadmillSpeedUnit === "mph" ? copy.mph : copy.kph}</b></label>
      <label><span>${copy.incline}</span><input data-field="treadmillIncline" type="number" inputmode="decimal" min="0" max="10" step="0.5" value="${state.treadmillIncline}" /><b>%</b></label>
    </section>
    ${result}
  `;
}

function renderInputs(t) {
  const mileageMax = state.unitSystem === UnitSystem.IMPERIAL ? 112 : 180;
  const mileageUnit =
    state.unitSystem === UnitSystem.IMPERIAL ? t.miPerWeek : t.kmPerWeek;
  const isConverter = state.toolMode === "equivalent";
  const isPlan = state.toolMode === "plan";
  const isHansons = isPlan && state.trainingMethod === TrainingMethod.HANSONS;
  const isNorwegian = isPlan && state.trainingMethod === TrainingMethod.NORWEGIAN_SINGLES;
  const planTargetOptions = isHansons
    ? hansonsTargetRaceOptions
    : isNorwegian
      ? norwegianTargetRaceOptions
      : targetRaceOptions;
  const hansonsTotalWeeks = HANSONS_PLAN_LENGTHS[state.targetRace] ?? 18;
  const showHalfMarathonWeek =
    isPlan &&
    !isHansons &&
    !isNorwegian &&
    state.targetRace === TargetRace.ROAD_15K_30K &&
    state.trainingCycle !== TrainingCycle.PHASE_I;
  const showMarathonPhaseWeek =
    isPlan && !isHansons && !isNorwegian && state.targetRace === TargetRace.MARATHON;

  const sectionTitle = isConverter ? t.conversionSettings : t.runnerAbilitySection;
  const sectionHelp = isConverter ? t.conversionSettingsHelp : t.runnerAbilityHelp;

  return `
    <section class="input-section runner-input-section" aria-labelledby="runner-input-title">
      <div class="input-section-head">
        <h3 id="runner-input-title">${sectionTitle}</h3>
        <p>${sectionHelp}</p>
      </div>
      <div class="field-grid runner-input-grid">
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
                    ${renderMenuField(t.trainingMethod, "trainingMethod", state.trainingMethod, [
                      { value: TrainingMethod.DANIELS, label: t.danielsMethod },
                      { value: TrainingMethod.HANSONS, label: t.hansonsMethod },
                      { value: TrainingMethod.NORWEGIAN_SINGLES, label: t.norwegianMethod }
                    ])}
                    ${renderMenuField(
                      t.targetRace,
                      "targetRace",
                      state.targetRace,
                      planTargetOptions.map((value) => ({
                        value,
                        label: t.targetRaceNames[value]
                      }))
                    )}
                    ${isNorwegian
                      ? renderNorwegianInputs(t)
                      : isHansons
                      ? `
                        ${renderMenuField(t.hansonsLevel, "hansonsLevel", state.hansonsLevel, [
                          { value: HansonsLevel.BEGINNER, label: t.hansonsBeginner },
                          { value: HansonsLevel.ADVANCED, label: t.hansonsAdvanced }
                        ])}
                        ${renderMenuField(
                          t.hansonsPlanWeek,
                          "hansonsWeek",
                          state.hansonsWeek,
                          Array.from({ length: hansonsTotalWeeks }, (_, index) => ({
                            value: index + 1,
                            label: t.hansonsPlanWeekOption
                              .replace("{week}", index + 1)
                              .replace("{total}", hansonsTotalWeeks)
                          }))
                        )}
                        ${isHansonsClassicTarget()
                          ? renderHansonsGoalTimeInput(t)
                          : ""}
                        <p class="field-note">${t.hansonsPlanHelp}</p>
                      `
                      : `
                        ${renderMenuField(
                          t.trainingCycle,
                          "trainingCycle",
                          state.trainingCycle,
                          trainingCycleOptions.map((value) => ({
                            value,
                            label: t.cycleNames[value]
                          }))
                        )}
                        ${showHalfMarathonWeek ? renderHalfMarathonWeekToggle(t) : ""}
                        ${showMarathonPhaseWeek
                          ? `${renderMenuField(
                              t.marathonPhaseWeek,
                              "marathonPhaseWeek",
                              state.marathonPhaseWeek,
                              Array.from({ length: MARATHON_PHASE_WEEKS }, (_, index) => ({
                                value: index + 1,
                                label: t.marathonPhaseWeekOption.replace("{week}", index + 1)
                              }))
                            )}<p class="field-note">${t.marathonPhaseWeekHelp}</p>`
                          : ""}
                        <p class="field-note">${t.trainingCycleHelp}</p>
                      `}
                    ${renderRangeField(
                      isHansons || showMarathonPhaseWeek ? t.peakWeeklyMileage : t.weeklyMileage,
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
      </div>
    </section>
    <section class="input-section environment-input-section" aria-labelledby="environment-input-title">
      <div class="input-section-head">
        <h3 id="environment-input-title">${t.environmentSection}</h3>
        <p>${t.environmentHelp}</p>
      </div>
      <div class="environment-input-grid">
        ${renderRangeField(
          t.temperature,
          "temperatureC",
          state.temperatureC,
          -5,
          45,
          1,
          t.celsius,
          state.weatherAutoEnabled
        )}
        ${renderRangeField(
          t.humidity,
          "humidity",
          state.humidity,
          0,
          100,
          1,
          t.percent,
          state.weatherAutoEnabled
        )}
      </div>
      ${renderAutoWeatherControl(t)}
    </section>
  `;
}

function renderHalfMarathonWeekToggle(t) {
  const isOdd = state.halfMarathonWeek === HalfMarathonWeek.ODD;
  return `
    <fieldset class="field half-week-field">
      <legend>${t.halfMarathonWeek}</legend>
      <div class="half-week-toggle" role="group" aria-label="${t.halfMarathonWeek}">
        <button
          type="button"
          class="${isOdd ? "active" : ""}"
          data-action="set-half-marathon-week"
          data-value="${HalfMarathonWeek.ODD}"
          aria-pressed="${isOdd}"
        >${t.halfMarathonOddWeek}</button>
        <button
          type="button"
          class="${isOdd ? "" : "active"}"
          data-action="set-half-marathon-week"
          data-value="${HalfMarathonWeek.EVEN}"
          aria-pressed="${!isOdd}"
        >${t.halfMarathonEvenWeek}</button>
      </div>
      <p>${t.halfMarathonWeekHelp}</p>
    </fieldset>
  `;
}

function renderCompactToolbar(t) {
  const nextTheme = state.theme === "dark" ? "light" : "dark";
  const themeLabel = nextTheme === "dark" ? t.darkTheme : t.lightTheme;
  return `
    <div class="topbar-controls compact-toolbar" aria-label="${state.locale === "en" ? "Page tools" : "頁面工具"}">
      <label class="toolbar-language">
        <span class="visually-hidden">${t.language}</span>
        <select data-field="locale" aria-label="${t.language}">
          <option value="zh-TW" ${state.locale === "zh-TW" ? "selected" : ""}>中文</option>
          <option value="en" ${state.locale === "en" ? "selected" : ""}>EN</option>
        </select>
      </label>
      <button
        type="button"
        class="toolbar-icon-button"
        data-action="set-theme"
        data-theme="${nextTheme}"
        aria-label="${themeLabel}"
        title="${themeLabel}"
      >
        <span aria-hidden="true">${state.theme === "dark" ? "☼" : "☾"}</span>
      </button>
      ${renderFeedbackLink()}
    </div>
  `;
}

function renderToolSidebar(t) {
  const items = [
    {
      value: "pace",
      label: t.sidebarPaceLabel,
      icon: renderSidebarIcon("pace")
    },
    {
      value: "equivalent",
      label: t.sidebarHeatLabel,
      icon: renderSidebarIcon("heat")
    },
    {
      value: "treadmill",
      label: getTreadmillCopy().sidebarLabel,
      icon: '<span class="tool-icon-glyph">TM</span>'
    },
    {
      value: "plan",
      label: t.sidebarPlanLabel,
      icon: renderSidebarIcon("plan")
    }
  ];

  if (!isAndroidApp) {
    items.push({
      value: "gpx",
      label: getGpxCopy().sidebarLabel,
      icon: renderSidebarIcon("gpx")
    });
  }

  return `
    <aside class="tool-sidebar" aria-label="${t.toolMode}">
      <div class="tool-sidebar-head">
        <div>
          <span>${t.toolSection}</span>
          <strong>${t.toolBrand}</strong>
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

function renderFeedbackLink() {
  const isEnglish = state.locale === "en";
  const label = isEnglish ? "Feedback" : "意見回饋";
  const href = isEnglish
    ? "https://forms.gle/8bDPiFySHkMdXfrw8"
    : "https://forms.gle/g9of21FT8VwgfoYF8";
  return `
    <a
      class="feedback-link"
      href="${href}"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="${label}"
      title="${label}"
    >
      <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
        <path d="M4 6h16v12H4z" />
        <path d="m4 7 8 6 8-6" />
      </svg>
      <span>${label}</span>
    </a>
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
      ${estimate.valid ? `<small class="finish-result-pace">${formatAverageResultPace(getRaceTimeSeconds(), state.raceDistanceMeters)}</small>` : ""}
    </div>
  `;
}

function renderTreadmillInputs() {
  const copy = getTreadmillCopy();
  const bounds = getTreadmillSpeedBounds();
  const speedUnit = state.treadmillSpeedUnit === "mph" ? copy.mph : copy.kph;

  return `
    <section class="input-section treadmill-input-section" aria-labelledby="treadmill-input-title">
      <div class="input-section-head">
        <h3 id="treadmill-input-title">${copy.inputSection}</h3>
        <p>${copy.inputHelp}</p>
      </div>
      <div class="field-grid treadmill-input-grid">
        ${renderMenuField(copy.speedUnit, "treadmillSpeedUnit", state.treadmillSpeedUnit, [
          { value: "kph", label: copy.kph },
          { value: "mph", label: copy.mph }
        ])}
        ${renderRangeField(
          copy.speed,
          "treadmillSpeed",
          state.treadmillSpeed,
          bounds.min,
          bounds.max,
          0.1,
          speedUnit
        )}
        ${renderRangeField(copy.incline, "treadmillIncline", state.treadmillIncline, 0, 10, 0.5, "%")}
      </div>
      <p class="field-note">${copy.sourceRange}</p>
    </section>
  `;
}

function renderTreadmillResults() {
  const copy = getTreadmillCopy();
  const conversion = getTreadmillConversion();

  if (!conversion.valid) {
    return `
      <div class="section-heading">
        <p class="section-index">02</p>
        <h2>${copy.resultsTitle}</h2>
      </div>
      <section class="treadmill-empty surface-card" role="alert">
        <h3>${getTreadmillError(copy, conversion)}</h3>
        <p>${copy.sourceRange}</p>
      </section>
      ${renderTreadmillMethod(copy)}
    `;
  }

  const difference = formatTreadmillDifference(copy, conversion);
  return `
    <div class="section-heading">
      <p class="section-index">02</p>
      <h2>${copy.resultsTitle}</h2>
      <strong class="section-value">${formatTreadmillSetting()}</strong>
    </div>
    <section class="treadmill-result-hero" aria-label="${copy.equivalentPace}">
      <span>${copy.equivalentPace}</span>
      <strong>${formatTreadmillPace(conversion)}</strong>
      <p>${copy.equivalentSpeed} ${formatTreadmillSpeed(conversion.equivalentSpeedMph, conversion.equivalentSpeedKph)}</p>
    </section>
    <dl class="treadmill-result-metrics">
      <div>
        <dt>${copy.treadmillPace}</dt>
        <dd>${formatTreadmillPace(conversion, "treadmill")}</dd>
      </div>
      <div>
        <dt>${copy.difference}</dt>
        <dd>${difference.value}</dd>
        <small>${difference.label}</small>
      </div>
      <div>
        <dt>${copy.setting}</dt>
        <dd>${formatTreadmillSetting()}</dd>
      </div>
    </dl>
    <aside class="treadmill-validation ${conversion.withinValidatedRange ? "supported" : "caution"}">
      <strong>${conversion.withinValidatedRange ? copy.supported : copy.caution}</strong>
      <p>${conversion.withinValidatedRange ? copy.supportedNote : copy.cautionNote}</p>
      <small>${conversion.interpolationUsed ? copy.interpolated : copy.exact}</small>
    </aside>
    ${renderTreadmillMethod(copy)}
  `;
}

function renderTreadmillMethod(copy) {
  return `
    <details class="method-details treadmill-method">
      <summary>${copy.methodTitle}</summary>
      <div class="heat-formula">
        <p>${copy.method}</p>
        <ul>
          <li><a href="https://www.hillrunner.com/calculators/treadmill-pace-conversions/" target="_blank" rel="noreferrer">HillRunner.com Treadmill Pace Conversions</a></li>
          <li><a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC10707652/" target="_blank" rel="noreferrer">Foreman et al. 2022 validation study</a></li>
        </ul>
      </div>
    </details>
  `;
}

function getTreadmillConversion() {
  return convertTreadmillEffort({
    speed: state.treadmillSpeed,
    speedUnit: state.treadmillSpeedUnit,
    inclinePercent: state.treadmillIncline
  });
}

function getTreadmillSpeedBounds() {
  return state.treadmillSpeedUnit === "mph"
    ? { min: 5, max: 12 }
    : { min: 8.1, max: 19.3 };
}

function getTreadmillError(copy, conversion) {
  return conversion.reason === "incline-range" || conversion.reason === "invalid-incline"
    ? copy.invalidIncline
    : copy.invalidSpeed;
}

function formatTreadmillSetting() {
  const copy = getTreadmillCopy();
  const unit = state.treadmillSpeedUnit === "mph" ? copy.mph : copy.kph;
  return `${Number(state.treadmillSpeed).toFixed(1)} ${unit} · ${Number(state.treadmillIncline).toFixed(1)}%`;
}

function formatTreadmillPace(conversion, type = "equivalent") {
  const useMiles = state.treadmillSpeedUnit === "mph";
  const seconds = type === "treadmill"
    ? (useMiles ? conversion.treadmillPaceSecondsPerMile : conversion.treadmillPaceSecondsPerKm)
    : (useMiles ? conversion.equivalentPaceSecondsPerMile : conversion.equivalentPaceSecondsPerKm);
  return `${formatClock(seconds)} / ${useMiles ? "mi" : "km"}`;
}

function formatTreadmillSpeed(speedMph, speedKph) {
  return state.treadmillSpeedUnit === "mph"
    ? `${speedMph.toFixed(1)} mph`
    : `${speedKph.toFixed(1)} km/h`;
}

function formatTreadmillDifference(copy, conversion) {
  const useMiles = state.treadmillSpeedUnit === "mph";
  const difference = useMiles
    ? conversion.differenceSecondsPerMile
    : conversion.differenceSecondsPerKm;
  const rounded = Math.round(Math.abs(difference));
  return {
    value: `${rounded} ${state.locale === "en" ? "sec" : "秒"} / ${useMiles ? "mi" : "km"}`,
    label: Math.abs(difference) < 0.5 ? copy.same : difference < 0 ? copy.faster : copy.slower
  };
}

function isHansonsClassicTarget() {
  return state.targetRace === TargetRace.HALF_MARATHON
    || state.targetRace === TargetRace.MARATHON;
}

function renderHansonsGoalTimeInput(t) {
  return `
    <fieldset class="time-fieldset hansons-goal-time">
      <legend>${t.hansonsGoalTime}</legend>
      <label>
        <span>${t.hours}</span>
        <input data-field="hansonsGoalHours" aria-label="${t.hansonsGoalTime} ${t.hours}" type="number" inputmode="numeric" pattern="[0-9]*" min="0" max="9" step="1" value="${state.hansonsGoalHours}" />
      </label>
      <label>
        <span>${t.minutes}</span>
        <input data-field="hansonsGoalMinutes" aria-label="${t.hansonsGoalTime} ${t.minutes}" type="number" inputmode="numeric" pattern="[0-9]*" min="0" max="59" step="1" value="${state.hansonsGoalMinutes}" />
      </label>
      <label>
        <span>${t.seconds}</span>
        <input data-field="hansonsGoalSeconds" aria-label="${t.hansonsGoalTime} ${t.seconds}" type="number" inputmode="numeric" pattern="[0-9]*" min="0" max="59" step="1" value="${state.hansonsGoalSeconds}" />
      </label>
      <small>${t.hansonsGoalTimeHelp}</small>
    </fieldset>
  `;
}

function renderNorwegianInputs(t) {
  return `
    <fieldset class="time-fieldset norwegian-weekly-time">
      <legend>${t.norwegianWeeklyTime}</legend>
      <label>
        <span>${t.hours}</span>
        <input data-field="norwegianWeeklyHours" aria-label="${t.norwegianWeeklyTime} ${t.hours}" type="number" inputmode="numeric" pattern="[0-9]*" min="0" max="15" step="1" value="${state.norwegianWeeklyHours}" />
      </label>
      <label>
        <span>${t.minutes}</span>
        <input data-field="norwegianWeeklyMinutes" aria-label="${t.norwegianWeeklyTime} ${t.minutes}" type="number" inputmode="numeric" pattern="[0-9]*" min="0" max="59" step="1" value="${state.norwegianWeeklyMinutes}" />
      </label>
    </fieldset>
    ${renderMenuField(t.norwegianRunningDays, "norwegianRunningDays", state.norwegianRunningDays, Array.from({ length: 5 }, (_, index) => ({
      value: index + 3,
      label: `${index + 3} ${state.locale === "en" ? "days" : "天"}`
    })))}
    ${renderMenuField(t.norwegianExperience, "norwegianExperience", state.norwegianExperience, [
      { value: NorwegianExperience.INTRO, label: t.norwegianIntro },
      { value: NorwegianExperience.STABLE, label: t.norwegianStable },
      { value: NorwegianExperience.LONG_TERM, label: t.norwegianLongTerm }
    ])}
    ${renderMenuField(t.norwegianHealth, "norwegianHealthStatus", state.norwegianHealthStatus, [
      { value: NorwegianHealth.HEALTHY, label: t.norwegianHealthy },
      { value: NorwegianHealth.RETURNING, label: t.norwegianReturning }
    ])}
    ${renderMenuField(t.norwegianSpecificity, "norwegianSpecificity", state.norwegianSpecificity, [
      { value: NorwegianSpecificity.VANILLA, label: t.norwegianVanilla },
      { value: NorwegianSpecificity.SPECIFIC, label: t.norwegianSpecific }
    ])}
    <p class="field-note">${t.norwegianPlanHelp}</p>
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

function renderRangeField(label, field, value, min, max, step, unit, disabled = false) {
  const disabledAttribute = disabled ? "disabled" : "";
  const midpoint = min + (max - min) / 2;
  const formatTick = (tick) => Number.isInteger(tick) ? String(tick) : tick.toFixed(1);
  const numberId = `${field}-number`;
  const displayValue = formatStepValue(value, step);
  return `
    <div class="field range-field precision-field ${disabled ? "disabled" : ""}">
      <label for="${numberId}">${label}</label>
      <div class="precision-number-row">
        <button
          type="button"
          class="number-stepper"
          data-action="step-number"
          data-field="${field}"
          data-delta="-${step}"
          data-min="${min}"
          data-max="${max}"
          aria-label="${label} -${step}"
          ${disabledAttribute}
        >−</button>
        <input
          id="${numberId}"
          data-field="${field}"
          type="number"
          inputmode="decimal"
          min="${min}"
          max="${max}"
          step="${step}"
          value="${displayValue}"
          aria-label="${label}"
          ${disabledAttribute}
        />
        <button
          type="button"
          class="number-stepper"
          data-action="step-number"
          data-field="${field}"
          data-delta="${step}"
          data-min="${min}"
          data-max="${max}"
          aria-label="${label} +${step}"
          ${disabledAttribute}
        >+</button>
        ${unit ? `<b>${unit}</b>` : ""}
      </div>
      <div class="range-track-wrap">
        <input
          data-field="${field}"
          type="range"
          min="${min}"
          max="${max}"
          step="${step}"
          value="${displayValue}"
          aria-label="${label}"
          ${disabledAttribute}
        />
        <div class="range-ticks" aria-hidden="true">
          <span>${formatTick(min)}</span>
          <span>${formatTick(midpoint)}</span>
          <span>${formatTick(max)}</span>
        </div>
      </div>
    </div>
  `;
}

function renderAutoWeatherControl(t) {
  const isLoading = state.weatherStatus === "loading";
  const isRefreshing = state.weatherStatus === "refreshing";
  const isBusy = isLoading || isRefreshing;
  const isError = state.weatherStatus === "error" || state.weatherStatus === "refresh-error";
  const label = state.weatherAutoEnabled
    ? t.disableAutoWeather
    : isError
      ? t.retryAutoWeather
      : t.enableAutoWeather;
  const status = isLoading
    ? t.weatherLocating
    : isRefreshing
      ? t.weatherRefreshing
      : isError
        ? getWeatherErrorMessage({ weatherType: state.weatherError })
        : state.weatherAutoEnabled
          ? t.weatherActive
          : "";

  return `
    <div class="auto-weather-block">
      <div class="auto-weather-control">
        <button
          type="button"
          class="weather-toggle-button ${state.weatherAutoEnabled ? "active" : ""}"
          data-action="toggle-auto-weather"
          aria-pressed="${state.weatherAutoEnabled}"
          ${isBusy ? "disabled" : ""}
        >
          ${renderLocationIcon()}
          <span>${label}</span>
        </button>
        ${
          status
            ? `<p class="weather-status ${isError ? "error" : ""}" ${isError ? 'role="alert"' : 'role="status"'}>${status}</p>`
            : ""
        }
      </div>
      ${renderCurrentWeather(t)}
    </div>
  `;
}

function renderLocationIcon() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 21s6-5.1 6-11a6 6 0 1 0-12 0c0 5.9 6 11 6 11Z" />
      <circle cx="12" cy="10" r="2" />
    </svg>
  `;
}

function renderGpxInputs() {
  const gpx = getGpxCopy();
  return `
    <div class="field-grid gpx-control-grid">
      ${
        state.locale === "en"
          ? `<div class="field">
              <span>${gpx.sourceMode}</span>
              <div class="gpx-static-value">${gpx.uploadSource}</div>
            </div>`
          : renderNativeSelect(
              gpx.sourceMode,
              "gpxSourceMode",
              state.gpxSourceMode,
              [
                { value: "upload", label: gpx.uploadSource },
                { value: "preset", label: gpx.presetSource }
              ]
            )
      }
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
  if (state.locale !== "en" && state.gpxSourceMode === "preset") {
    const loadedName = getGpxDisplayName();
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
      <p class="field-note">${loadedName ? `${gpx.fileReady}: ${escapeHtml(loadedName)}` : gpx.noFile}</p>
    `;
  }

  return `
    <label class="field gpx-upload-field">
      <span>${gpx.uploadLabel}</span>
      <span class="gpx-file-picker">
        <span class="gpx-file-button">${gpx.chooseFile}</span>
        <span class="gpx-file-name">${state.gpxFileName ? escapeHtml(state.gpxFileName) : gpx.noFileSelected}</span>
        <input data-gpx-file type="file" accept=".gpx,application/gpx+xml" />
      </span>
      <small>${state.gpxFileName ? `${gpx.fileReady}: ${escapeHtml(state.gpxFileName)}` : gpx.noFile}</small>
    </label>
  `;
}

function getGpxDisplayName() {
  if (!state.gpxFileName) return "";
  if (state.gpxSourceMode === "preset") {
    const route = popularGpxRoutes.find((item) => item.file === state.gpxPresetRoute || item.file === state.gpxFileName);
    if (route) return state.locale === "en" ? route.en : route.zh;
  }
  return state.gpxFileName;
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
  const displayName = getGpxDisplayName();
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
                <h3>${displayName ? escapeHtml(displayName) : gpx.resultsTitle}</h3>
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
          <strong>${renderFinishTimeWithPace(summary.targetTotalTimeSec, summary.totalDistanceKm * 1000, formatGpxDuration)}</strong>
        </div>
        <div>
          <span>${gpx.gradeTotalTime}</span>
          <strong>${renderFinishTimeWithPace(summary.gradeAdjustedTotalTimeSec, summary.totalDistanceKm * 1000, formatGpxDuration)}</strong>
        </div>
        ${
          summary.heatAdjustment?.finalSlowdown > 0
            ? `
              <div>
                <span>${gpx.finalTotalTime}</span>
                <strong>${renderFinishTimeWithPace(summary.finalTotalTimeSec, summary.totalDistanceKm * 1000, formatGpxDuration)}</strong>
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
              <article class="equivalent-card data-tile ${card.highlight ? "highlight" : ""}">
                <span>${card.label}</span>
                <strong>${card.finishSeconds
                  ? renderFinishTimeWithPace(card.finishSeconds, card.distanceMeters)
                  : renderPaceValue(card.value)}</strong>
                ${card.meta ? `<small class="equivalent-meta">${card.meta}</small>` : ""}
              </article>
            `
          )
          .join("")}
      </div>
      <div class="conversion-context" aria-label="${t.heatAdjustment}">
        <span>${t.heatAdjustment}</span>
        <strong>${t.slowerBy}: ${model.heatAdjustment.percentage}%</strong>
        <small>${state.converterType === "pace" ? t.paceConverter : t.raceConverter} · ${state.equivalentDirection === "hotToCool" ? t.hotToCool : t.coolToHot}</small>
      </div>
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
    <section class="summary-card surface-card heat-card">
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
      </div>
      <details class="method-details" open>
        <summary>${t.heatFormulaTitle} · ${t.heatReferencesTitle}</summary>
        <div class="heat-formula">
          <h3>${t.heatFormulaTitle}</h3>
          <p>${t.heatFormula}</p>
          <h3>${t.heatReferencesTitle}</h3>
          <ul>
            ${t.heatReferences.map((reference) => `<li>${reference}</li>`).join("")}
          </ul>
        </div>
      </details>
    </section>
  `;
}

function renderCurrentWeather(t) {
  if (!state.weatherAutoEnabled || !state.weatherCurrent) return "";

  const weather = state.weatherCurrent;
  const condition = getWeatherCondition(weather.code);
  const updatedTime = formatWeatherTime(weather.time);
  const location = formatWeatherLocation(weather.location);
  const isRefreshing = state.weatherStatus === "refreshing";

  return `
    <div class="current-weather" aria-label="${t.currentLocationWeather}">
      <div class="current-weather-icon">
        ${renderWeatherIcon(condition)}
      </div>
      <div class="current-weather-copy">
        <div class="current-weather-meta">
          <span>${t.currentLocationWeather}${updatedTime ? ` · ${t.weatherUpdatedAt} ${updatedTime}` : ""}</span>
          <button
            type="button"
            class="weather-refresh-button ${isRefreshing ? "refreshing" : ""}"
            data-action="refresh-auto-weather"
            aria-label="${t.refreshWeather}"
            title="${t.refreshWeather}"
            ${isRefreshing ? "disabled" : ""}
          >
            ${renderRefreshIcon()}
          </button>
        </div>
        ${location.region ? `<span class="current-weather-region">${location.region}</span>` : ""}
        ${location.place ? `<strong class="current-weather-place">${location.place}</strong>` : ""}
        <span class="current-weather-condition">${t.weatherConditions[condition]}</span>
      </div>
      <div class="current-weather-readings">
        <div class="current-weather-reading">
          <span>${t.temperature}</span>
          <strong>${weather.temperatureC}${t.celsius}</strong>
        </div>
        <div class="current-weather-reading">
          <span>${t.humidity}</span>
          <strong>${weather.humidity}${t.percent}</strong>
        </div>
        <div class="current-weather-reading">
          <span>${t.apparentTemperature}</span>
          <strong>${weather.apparentTemperatureC}${t.celsius}</strong>
        </div>
      </div>
    </div>
  `;
}

function renderRefreshIcon() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20 11a8 8 0 1 0-2.3 5.7" />
      <path d="M20 5v6h-6" />
    </svg>
  `;
}

function formatWeatherLocation(location) {
  if (!location) return { region: "", place: "" };

  const placeParts = [location.countyCity, location.district]
    .map((value) => String(value ?? "").trim())
    .filter(Boolean)
    .filter((value, index, items) => {
      const normalized = value.toLocaleLowerCase();
      return items.findIndex((item) => item.toLocaleLowerCase() === normalized) === index;
    });

  return {
    region: escapeHtml(String(location.region ?? "").trim()),
    place: placeParts.map(escapeHtml).join(" ")
  };
}

function getWeatherCondition(code) {
  if (code === 0) return "clear";
  if (code === 1 || code === 2) return "partlyCloudy";
  if (code === 3) return "cloudy";
  if (code === 45 || code === 48) return "fog";
  if ([51, 53, 55, 56, 57].includes(code)) return "drizzle";
  if ([61, 63, 65, 66, 67].includes(code)) return "rain";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "snow";
  if ([80, 81, 82].includes(code)) return "showers";
  if ([95, 96, 99].includes(code)) return "thunderstorm";
  return "cloudy";
}

function formatWeatherTime(value) {
  if (typeof value !== "string" || !value.includes("T")) return "";
  return value.split("T")[1]?.slice(0, 5) ?? "";
}

function renderWeatherIcon(condition) {
  const cloud = '<path d="M7.2 17.5h9.2a4 4 0 0 0 .5-8 5.3 5.3 0 0 0-10.1 1.4A3.3 3.3 0 0 0 7.2 17.5Z" />';

  if (condition === "clear") {
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>';
  }

  if (condition === "partlyCloudy") {
    return `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="8" cy="8" r="3" /><path d="M8 2v2M2 8h2M3.8 3.8l1.4 1.4" />${cloud}</svg>`;
  }

  if (condition === "fog") {
    return `<svg viewBox="0 0 24 24" aria-hidden="true">${cloud}<path d="M5 20h14M7 23h10" /></svg>`;
  }

  if (["drizzle", "rain", "showers"].includes(condition)) {
    return `<svg viewBox="0 0 24 24" aria-hidden="true">${cloud}<path d="m8 20-1 2M13 20l-1 2M18 20l-1 2" /></svg>`;
  }

  if (condition === "snow") {
    return `<svg viewBox="0 0 24 24" aria-hidden="true">${cloud}<path d="M8 20h.01M12 22h.01M16 20h.01" /></svg>`;
  }

  if (condition === "thunderstorm") {
    return `<svg viewBox="0 0 24 24" aria-hidden="true">${cloud}<path d="m13 18-2 4h3l-2 4" /></svg>`;
  }

  return `<svg viewBox="0 0 24 24" aria-hidden="true">${cloud}</svg>`;
}

function renderVdotEquivalentResults(model, t) {
  const results = getVdotEquivalentRaceResults(model.vdot);

  return `
    <section class="summary-card surface-card vdot-equivalent-card">
      <p class="eyebrow">${t.vdotEquivalentTitle}</p>
      <div class="vdot-equivalent-grid">
        ${results
          .map((result) => {
            const heatAdjustedSeconds = result.seconds * model.heatAdjustment.multiplier;

            return `
              <article>
                <span>${state.locale === "en" ? result.en : result.zh}</span>
                <strong>${renderFinishTimeWithPace(result.seconds, result.meters)}</strong>
                <div class="vdot-heat-equivalent">
                  <small>${t.heatAdjustedEquivalentResult}</small>
                  <strong>${renderFinishTimeWithPace(heatAdjustedSeconds, result.meters)}</strong>
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

function getNorwegianQualityCountLabel(plan) {
  if (!plan) return "0";
  return state.locale === "en"
    ? plan.qualityCountLabelEn ?? String(plan.qualityCount ?? 0)
    : plan.qualityCountLabelZh ?? String(plan.qualityCount ?? 0);
}

function renderMileageClass(model, t) {
  if (model.trainingMethod === TrainingMethod.NORWEGIAN_SINGLES && model.norwegianPlan) {
    const plan = model.norwegianPlan;
    return `
      <section class="summary-card surface-card mileage-card">
        <p class="eyebrow">${t.norwegianWeeklyTime}</p>
        <h2>${state.locale === "en" ? plan.levelEn : plan.levelZh}</h2>
        <p>${Math.floor(plan.weeklyRunningMinutes / 60)}h ${plan.weeklyRunningMinutes % 60}m · ${plan.runningDays} ${state.locale === "en" ? "days" : "天"}</p>
        <dl class="simple-list">
          <div><dt>${t.norwegianWeeklySubTBudget}</dt><dd>${plan.weeklySubTTargetMinutes} min</dd></div>
          <div><dt>${t.norwegianQualitySessions}</dt><dd>${getNorwegianQualityCountLabel(plan)}</dd></div>
        </dl>
      </section>
    `;
  }

  const qualityLabels = model.hansonsPlan?.foundationFinishRoute
    ? t.hansonsFoundationQuality
    : model.trainingMethod === TrainingMethod.DANIELS
      && model.danielsQualityEligibility?.fallback
      ? t.danielsBaseOnly
      : model.mileageClass.qualityTypes
        .map((type) => t.zoneNames[type])
        .join(" / ");

  return `
    <section class="summary-card surface-card mileage-card">
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
  const isHansons = model.trainingMethod === TrainingMethod.HANSONS;
  const isNorwegian = model.trainingMethod === TrainingMethod.NORWEGIAN_SINGLES;
  return `
    <div class="section-heading">
      <p class="eyebrow">VDOT ${model.vdot}</p>
      <h2>${t.trainingPlanMode}</h2>
    </div>
    ${renderWeeklySchedule(model, t)}
    ${isHansons || isNorwegian || model.danielsQualityEligibility?.fallback ? "" : renderWorkoutExamples(model, t)}
    <aside class="note-panel surface-card info-card">
      <h2>${t.noteTitle}</h2>
      <p>${isHansons ? t.hansonsPlanHelp : isNorwegian ? t.norwegianControllerNote : t.note}</p>
      <h3>${t.sourceTitle}</h3>
      <p>${isHansons ? t.sourceNoteHansons : isNorwegian ? t.sourceNoteNorwegian : t.sourceNote}</p>
    </aside>
  `;
}

function renderPaceZonePanel(model, t, embedded = false, options = {}) {
  const showAdjusted = options.showAdjusted ?? true;
  return `
    <section class="${embedded ? "" : "summary-card"} pace-zone-panel ${embedded ? "embedded" : ""} ${state.locale === "en" ? "english" : ""}">
      ${embedded ? "" : `<p class="eyebrow">${t.paceZones}</p>`}
      <div class="pace-data-list">
        ${model.zones.map((zone) => renderPaceZone(zone, t, { showAdjusted })).join("")}
      </div>
    </section>
  `;
}

function renderWeeklySchedule(model, t) {
  const isHansons = model.trainingMethod === TrainingMethod.HANSONS;
  const isNorwegian = model.trainingMethod === TrainingMethod.NORWEGIAN_SINGLES;
  const schedule = applyEasyRunRedistribution(model.weeklySchedule);
  const orderedSchedule = getOrderedSchedule(schedule);
  const plannedTotalKm = schedule.reduce(
    (total, day) => total + Number(day.plannedDistanceKm ?? 0),
    0
  );
  const longRunDay = schedule.find((day) => day.isLongRun);
  const longRunKm = Number(longRunDay?.plannedDistanceKm ?? 0);
  const longRunShare = plannedTotalKm > 0
    ? Math.round((longRunKm / plannedTotalKm) * 1000) / 10
    : 0;
  const plannedTotal = formatPlanDistanceRange({
    min: plannedTotalKm,
    max: plannedTotalKm
  });
  const fixedDayLabels = schedule.map((day) =>
    state.locale === "en" ? day.enDay : day.zhDay
  );
  const hasOpenSwapMenu = typeof state.openMenu === "string" &&
    state.openMenu.startsWith("plan-workout-");
  const halfWeekLabel =
    !isHansons &&
    model.targetRace === TargetRace.ROAD_15K_30K &&
    model.trainingCycle !== TrainingCycle.PHASE_I
      ? ` · ${model.halfMarathonWeek === HalfMarathonWeek.EVEN
        ? t.halfMarathonEvenWeek
        : t.halfMarathonOddWeek}`
      : "";
  const marathonWeekLabel = !isHansons && model.targetRace === TargetRace.MARATHON
    ? ` · ${t.marathonPhaseWeekOption.replace("{week}", model.marathonPhaseWeek)}`
    : "";
  const hansonsWeekLabel = isHansons && model.hansonsPlan
    ? ` · ${t.hansonsPlanWeekOption
        .replace("{week}", model.hansonsPlan.week)
        .replace("{total}", model.hansonsPlan.totalWeeks)}`
    : "";
  const longRunLimit = Number(longRunDay?.longRunLimitPercentage ?? 30);
  const longRunTimeSummary = !isHansons && model.targetRace === TargetRace.MARATHON
    ? `<span>${t.longRunTimeCap}<strong>${Math.round(Number(longRunDay?.estimatedMaxMinutes ?? 0))} / ${Number(longRunDay?.longRunTimeLimitMinutes ?? 150)} min</strong></span>`
    : "";
  const peakPlan = model.marathonPlan ?? model.hansonsPlan;
  const peakFractionSummary = peakPlan
    ? `<span>${t.peakMileageFraction}<strong>${Math.round(peakPlan.fraction * 100)}%</strong></span>`
    : "";
  const phaseLabel = isHansons
    ? (state.locale === "en" ? model.hansonsPlan?.phaseEn : model.hansonsPlan?.phaseZh)
    : isNorwegian
      ? (state.locale === "en" ? model.norwegianPlan?.phaseEn : model.norwegianPlan?.phaseZh)
      : t.cycleNames[model.trainingCycle];
  const methodLabel = isHansons ? t.hansonsMethod : isNorwegian ? t.norwegianMethod : t.danielsMethod;

  return `
    <section class="weekly-plan ${hasOpenSwapMenu ? "swap-open" : ""}">
      <div class="weekly-plan-head">
        <div>
          <p class="eyebrow">${methodLabel} · ${t.targetRaceNames[model.targetRace]} · ${phaseLabel ?? ""}${halfWeekLabel}${marathonWeekLabel}${hansonsWeekLabel}</p>
          <h3>${t.weeklyPlan}</h3>
        </div>
        <p>${isHansons ? t.weeklyPlanNoteHansons : isNorwegian ? t.weeklyPlanNoteNorwegian : t.weeklyPlanNote}</p>
      </div>
      <div class="week-volume-summary">
        <span>${t.plannedWeeklyTotal}<strong>${plannedTotal}</strong></span>
        ${peakFractionSummary}
        <span>${t.longRunShare}<strong>${isHansons || isNorwegian ? `${longRunShare}%` : `${longRunShare}% ≤ ${longRunLimit}%`}</strong></span>
        ${isNorwegian ? `<span>${t.norwegianWeeklySubTBudget}<strong>${model.norwegianPlan?.weeklySubTTargetMinutes ?? 0} min</strong></span>` : ""}
        ${isNorwegian ? `<span>${t.norwegianPlannedSubT}<strong>${model.norwegianPlan?.plannedSubTMinutes ?? 0} / ${model.norwegianPlan?.weeklySubTTargetMinutes ?? 0} min</strong></span>` : ""}
        ${isNorwegian ? `<span>${t.norwegianQualitySessions}<strong>${getNorwegianQualityCountLabel(model.norwegianPlan)}</strong></span>` : ""}
        ${longRunTimeSummary}
      </div>
      ${model.hansonsPlan?.qualityNoteZh ? `<aside class="taper-recommendation surface-card"><p>${state.locale === "en" ? model.hansonsPlan.qualityNoteEn : model.hansonsPlan.qualityNoteZh}</p></aside>` : ""}
      ${model.hansonsPlan?.belowRecommendedVolume ? `<aside class="taper-recommendation surface-card"><p>${model.hansonsPlan.foundationFinishRoute ? t.hansonsLowVolumeWarning : t.hansonsVolumeWarning}</p></aside>` : ""}
      ${model.hansonsPlan?.goalGapTooLarge && !model.hansonsPlan?.foundationFinishRoute ? `<aside class="taper-recommendation surface-card"><p>${t.hansonsGoalGapWarning}</p></aside>` : ""}
      ${isHansons && model.hansonsPlan?.hasExplicitGoalTime && !model.hansonsPlan?.goalGapTooLarge && !model.hansonsPlan?.foundationFinishRoute ? `<aside class="taper-recommendation surface-card"><p>${t.hansonsGoalPaceActive}</p></aside>` : ""}
      ${isNorwegian ? `<aside class="taper-recommendation surface-card"><p>${t.norwegianTimeFirstNote}</p></aside>` : ""}
      ${isNorwegian ? `<aside class="subt-format-note surface-card"><p>${t.norwegianFormatNote}</p></aside>` : ""}
      ${isNorwegian && model.norwegianPlan?.levelId === "A" ? `<aside class="taper-recommendation surface-card"><p>${t.norwegianLowVolumeNote}</p></aside>` : ""}
      ${isNorwegian && model.norwegianPlan?.transitionThirdSession ? `<aside class="taper-recommendation surface-card"><p>${t.norwegianTransitionNote}</p></aside>` : ""}
      ${isNorwegian && model.norwegianPlan?.specificityRequested && !model.norwegianPlan?.specificityEnabled ? `<aside class="taper-recommendation surface-card"><p>${t.norwegianSpecificityDeferredNote}</p></aside>` : ""}
      ${isNorwegian && model.norwegianPlan?.safetyReasons?.length ? `<aside class="taper-recommendation surface-card"><p>${t.norwegianSafetyNote}</p></aside>` : ""}
      ${isNorwegian && model.norwegianPlan?.distanceCanMatchInput === false ? `<aside class="taper-recommendation surface-card"><p>${t.norwegianDistanceWarning}</p></aside>` : ""}
      ${model.trainingMethod === TrainingMethod.DANIELS && model.danielsQualityEligibility?.fallback ? `<aside class="taper-recommendation surface-card"><p>${t.danielsLowVolumeBaseNote}</p></aside>` : ""}
      ${renderTaperRecommendation(model, t)}
      <p class="drag-hint schedule-drag-hint">${t.scheduleDragHint}</p>
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

function renderTaperRecommendation(model, t) {
  if (!model.taperRecommendation) return "";
  const recommendation = state.locale === "en"
    ? model.taperRecommendation.en
    : model.taperRecommendation.zh;
  const status = model.taperRecommendation.automatic
    ? t.taperAutomatic
    : t.raceWeekOnly;
  const title = model.taperRecommendation.automatic
    ? t.taperTitle
    : t.raceWeekAdjustmentTitle;

  return `
    <aside class="taper-recommendation surface-card">
      <div>
        <strong>${title}</strong>
        <span>${status}</span>
      </div>
      <p>${recommendation}</p>
    </aside>
  `;
}

function renderPlanDay(day, t, index, model) {
  const candidates = getPlanWorkoutCandidates(day, model);
  const selectedWorkout = getSelectedPlanWorkout(index, candidates);
  const displayDay = selectedWorkout
    ? {
        ...day,
        zone: selectedWorkout.zone ?? day.zone,
        paceZoneIds: selectedWorkout.paceZoneIds ?? day.paceZoneIds,
        customPaceRows: selectedWorkout.customPaceRows ?? day.customPaceRows,
        workoutType: selectedWorkout.type ?? day.workoutType,
        subTMinutes: selectedWorkout.subTMinutes ?? day.subTMinutes,
        zhDistanceLabel: selectedWorkout.zhDistanceLabel ?? day.zhDistanceLabel,
        enDistanceLabel: selectedWorkout.enDistanceLabel ?? day.enDistanceLabel
      }
    : day;
  const title = selectedWorkout
    ? state.locale === "en"
      ? selectedWorkout.en
      : selectedWorkout.zh
    : state.locale === "en"
      ? day.en
      : day.zh;
  const paceBlock = renderPlanPaceBlock(displayDay, model, t);
  const easyRestControl = renderEasyRestControl(day, index, t);
  const plannedDistanceLabel = state.locale === "en"
    ? displayDay.enDistanceLabel
    : displayDay.zhDistanceLabel;

  return `
    <article
      class="plan-day ${zoneTone[displayDay.zone]} ${day.isSkippedEasyRun ? "is-rest" : ""}"
      draggable="false"
      data-plan-card
      data-plan-index="${index}"
      aria-label="${title}"
    >
      <span class="plan-day-label">${state.locale === "en" ? day.enDay : day.zhDay}</span>
      ${renderPlanWorkoutSwitcher(index, candidates, selectedWorkout, t, day, model)}
      ${easyRestControl}
      <div>
        <b>${displayDay.zone}</b>
        <p>${title}</p>
        ${plannedDistanceLabel ? `<span class="plan-distance-label">${plannedDistanceLabel}</span>` : ""}
        ${paceBlock}
      </div>
    </article>
  `;
}

function renderPlanPaceBlock(day, model, t) {
  if (Array.isArray(day.customPaceRows) && day.customPaceRows.length > 0) {
    const customRows = day.customPaceRows.map((row) => `
      <div class="plan-pace-row plan-pace-row-custom">
        <span class="plan-zone-tag">${row.id}</span>
        <small class="pace-tag plan-effort-tag">${state.locale === "en" ? row.en : row.zh}</small>
        <small class="plan-pace-label">${t.adjustedPaceShort}</small>
        <strong>${renderPaceValue(row.adjusted)}</strong>
        <small class="plan-pace-label plan-base-label">${t.basePaceShort}</small>
        <em>${renderPaceValue(row.base)}</em>
      </div>
    `).join("");
    return `<div class="plan-pace">${customRows}</div>`;
  }

  const zoneIds = Array.isArray(day.paceZoneIds) && day.paceZoneIds.length > 0
    ? day.paceZoneIds
    : day.pace
      ? [day.zone]
      : [];
  const rows = zoneIds
    .map((zoneId) => model.zones.find((zone) => zone.id === zoneId))
    .filter(Boolean)
    .map((zone) => `
      <div class="plan-pace-row">
        <span class="plan-zone-tag">${zone.id}</span>
        <strong><small class="pace-tag">${zone.id === "R" ? t.rTargetPaceShort : t.adjustedPaceShort}</small>${renderPaceValue(zone.adjusted.label)}</strong>
        <em><small class="pace-tag">${t.basePaceShort}</small>${renderPaceValue(zone.base.label)}</em>
      </div>
    `)
    .join("");

  return rows ? `<div class="plan-pace">${rows}</div>` : "";
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

function renderPlanWorkoutSwitcher(index, candidates, selectedWorkout, t, day = null, model = null) {
  if (candidates.length === 0) return "";

  const menuId = `plan-workout-${index}`;
  const isOpen = state.openMenu === menuId;
  const isNorwegian = model?.trainingMethod === TrainingMethod.NORWEGIAN_SINGLES;
  const defaultLabel = isNorwegian && day?.defaultFormat
    ? (state.locale === "en" ? day.defaultFormat.labelEn : day.defaultFormat.labelZh)
    : t.coachPick;
  const defaultHelp = isNorwegian && day?.defaultFormat
    ? (state.locale === "en" ? day.defaultFormat.helpEn : day.defaultFormat.helpZh)
    : "";
  const selectedLabel = selectedWorkout
    ? (state.locale === "en" ? selectedWorkout.formatLabelEn : selectedWorkout.formatLabelZh)
    : defaultLabel;

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
        <span>${isNorwegian ? t.switchSubTFormat : t.switchWorkout}${isNorwegian ? ` · ${selectedLabel}` : ""}</span>
      </button>
      <div class="plan-swap-menu">
        <button
          type="button"
          class="plan-swap-option ${isNorwegian ? "subt-format-option" : ""} ${selectedWorkout ? "" : "active"}"
          data-action="select-plan-workout"
          data-plan-index="${index}"
          data-workout-id=""
          draggable="false"
        >
          ${isNorwegian
            ? `<strong>${defaultLabel}</strong><small>${defaultHelp}</small>`
            : t.coachPick}
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
  const formatLabel = state.locale === "en" ? workout.formatLabelEn : workout.formatLabelZh;
  const formatHelp = state.locale === "en" ? workout.formatHelpEn : workout.formatHelpZh;
  return `
    <button
      type="button"
      class="plan-swap-option ${formatLabel ? "subt-format-option" : ""} ${active ? "active" : ""}"
      data-action="select-plan-workout"
      data-plan-index="${index}"
      data-workout-id="${workout.id}"
      draggable="false"
    >
      ${formatLabel
        ? `<strong>${formatLabel}</strong><small>${formatHelp}</small><span>${label}</span>`
        : label}
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
            <strong><small class="pace-tag">${primaryPaceLabel}</small>${renderPaceValue(adjustedPace)}</strong>
            <em><small class="pace-tag">${t.basePaceShort}</small>${renderPaceValue(basePace)}</em>
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
    <article class="pace-data-row ${zoneTone[zone.id]}">
      <div class="pace-zone-label">
        <span>${zone.id}</span>
        <h3>${t.zoneNames[zone.id]}</h3>
      </div>
      <dl class="${paceValuesClass}">
        <div>
          <dt>${t.basePace}</dt>
          <dd>${renderPaceValue(zone.base.label)}</dd>
        </div>
        ${
          zone.id === "R" || !showAdjusted
              ? ""
            : `<div class="adjusted">
                <dt>${adjustedLabel}</dt>
                <dd>${renderPaceValue(zone.adjusted.label)}</dd>
              </div>`
        }
      </dl>
      <div class="pace-row-detail">
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
      </div>
    </article>
  `;
}

function renderPaceValue(label) {
  const value = String(label);
  const match = value.match(/^(.*?)(\s*\/\s*(?:km|mi))$/i);
  if (!match) return escapeHtml(value);
  return `${escapeHtml(match[1])}<small class="pace-unit">${escapeHtml(match[2])}</small>`;
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

  app.querySelectorAll("[data-plan-card]").forEach((card) => {
    card.addEventListener("pointerdown", handlePlanPointerDown);
    card.addEventListener("pointermove", handlePlanPointerMove);
    card.addEventListener("pointerup", handlePlanPointerEnd);
    card.addEventListener("pointercancel", handlePlanPointerEnd);
    card.addEventListener("touchstart", handlePlanTouchStart, { passive: true });
    card.addEventListener("touchmove", handlePlanTouchMove, { passive: false });
    card.addEventListener("touchend", handlePlanTouchEnd);
    card.addEventListener("touchcancel", handlePlanTouchEnd);
  });

  app.querySelectorAll(".week-scroll").forEach((scroller) => {
    scroller.addEventListener("scroll", positionOpenPlanSwapMenu, { passive: true });
  });

  window.removeEventListener("scroll", positionOpenPlanSwapMenu);
  window.removeEventListener("resize", positionOpenPlanSwapMenu);
  window.addEventListener("scroll", positionOpenPlanSwapMenu, { passive: true });
  window.addEventListener("resize", positionOpenPlanSwapMenu);

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
  const input = event.currentTarget;
  const value = input.value;

  if (input.type === "range" && event.type === "input") {
    const normalizedValue = normalizeNumericInput(input, value, state[field]);
    syncRangeNumber(field, normalizedValue);
    return;
  }

  if (input.type === "number" && event.type === "input") {
    if (value === "" || !Number.isFinite(Number(value))) return;
    const normalizedValue = normalizeNumericInput(input, value);
    updateFieldValue(field, normalizedValue);
    syncRangeSlider(field, normalizedValue);
    return;
  }

  if (input.type === "number") {
    const fallbackValue = state[field];
    const normalizedValue = normalizeNumericInput(input, value, fallbackValue);
    input.value = normalizedValue;
    updateFieldValue(field, normalizedValue);
    syncRangeSlider(field, normalizedValue);
    render();
    return;
  }

  updateFieldValue(field, value);
  render();
}

function normalizeNumericInput(input, value, fallbackValue = 0) {
  const parsed = Number(value);
  const fallback = Number.isFinite(Number(fallbackValue)) ? Number(fallbackValue) : 0;
  let normalized = Number.isFinite(parsed) && value !== "" ? parsed : fallback;
  const min = Number(input.min);
  const max = Number(input.max);

  if (input.min !== "" && Number.isFinite(min)) normalized = Math.max(min, normalized);
  if (input.max !== "" && Number.isFinite(max)) normalized = Math.min(max, normalized);

  const step = Number(input.step);
  if (input.step !== "" && input.step !== "any" && Number.isFinite(step) && step > 0) {
    normalized = roundToStepPrecision(normalized, step);
  }

  return normalized;
}

function syncRangeNumber(field, value) {
  app.querySelectorAll(`input[data-field="${field}"]`).forEach((input) => {
    if (input.type === "number") input.value = formatStepValue(value, input.step);
  });
}

function syncRangeSlider(field, value) {
  app.querySelectorAll(`input[data-field="${field}"]`).forEach((input) => {
    if (input.type === "range") input.value = formatStepValue(value, input.step);
  });
}

function updateFieldValue(field, value) {
  state.openMenu = null;

  if (field === "toolMode") {
    state.androidSheet = null;
  }

  if (field === "locale") {
    const nextLocale = value === "en" ? "en" : "zh-TW";
    const nextPath = isAndroidApp
      ? new URL(nextLocale === "en" ? "./en/index.html" : "../index.html", window.location.href).href
      : nextLocale === "en"
        ? "/en"
        : "/";
    if (state.locale !== nextLocale) window.location.assign(nextPath);
    return;
  }

  if ([
    "trainingMethod",
    "targetRace",
    "trainingCycle",
    "marathonPhaseWeek",
    "hansonsWeek",
    "hansonsLevel",
    "hansonsGoalHours",
    "hansonsGoalMinutes",
    "hansonsGoalSeconds",
    "norwegianWeeklyHours",
    "norwegianWeeklyMinutes",
    "norwegianRunningDays",
    "norwegianExperience",
    "norwegianHealthStatus",
    "norwegianSpecificity"
  ].includes(field)) {
    state.planWorkoutOverrides = {};
    state.planOrder = [];
    state.skippedEasyDays = {};
  }

  if (field === "treadmillSpeedUnit") {
    const nextUnit = value === "mph" ? "mph" : "kph";
    if (nextUnit !== state.treadmillSpeedUnit) {
      const convertedSpeed = nextUnit === "mph"
        ? Math.round((state.treadmillSpeed / TREADMILL_KM_PER_MILE) * 10) / 10
        : Math.round((state.treadmillSpeed * TREADMILL_KM_PER_MILE) * 10) / 10;
      state.treadmillSpeedUnit = nextUnit;
      const bounds = getTreadmillSpeedBounds();
      state.treadmillSpeed = Math.min(bounds.max, Math.max(bounds.min, convertedSpeed));
    }
    return;
  }

  if (field === "unitSystem") {
    updateUnitSystem(value);
    return;
  }

  if (field === "trainingMethod") {
    state.trainingMethod = value;
    if (value === TrainingMethod.HANSONS) {
      if (state.targetRace !== TargetRace.MARATHON) {
        state.targetRace = TargetRace.HALF_MARATHON;
      }
      state.hansonsWeek = getHansonsDefaultWeek(state.targetRace, state.hansonsLevel);
      setHansonsGoalDefault(state.targetRace);
    }
    if (value === TrainingMethod.DANIELS) {
      if (state.targetRace === TargetRace.FIVE_K || state.targetRace === TargetRace.TEN_K) {
        state.targetRace = TargetRace.FIVE_TEN_K;
      } else if (state.targetRace === TargetRace.HALF_MARATHON) {
        state.targetRace = TargetRace.ROAD_15K_30K;
      }
    }
    if (value === TrainingMethod.NORWEGIAN_SINGLES) {
      if (state.targetRace === TargetRace.FIVE_TEN_K) {
        state.targetRace = TargetRace.TEN_K;
      } else if (state.targetRace === TargetRace.ROAD_15K_30K) {
        state.targetRace = TargetRace.HALF_MARATHON;
      } else if (!norwegianTargetRaceOptions.includes(state.targetRace)) {
        state.targetRace = TargetRace.TEN_K;
      }
    }
    return;
  }

  if (field === "targetRace" && state.trainingMethod === TrainingMethod.HANSONS) {
    state.targetRace = hansonsTargetRaceOptions.includes(value)
      ? value
      : TargetRace.HALF_MARATHON;
    state.hansonsWeek = getHansonsDefaultWeek(state.targetRace, state.hansonsLevel);
    setHansonsGoalDefault(state.targetRace);
    return;
  }

  if (field === "targetRace" && state.trainingMethod === TrainingMethod.NORWEGIAN_SINGLES) {
    state.targetRace = norwegianTargetRaceOptions.includes(value) ? value : TargetRace.TEN_K;
    return;
  }

  if (field === "hansonsLevel" && state.trainingMethod === TrainingMethod.HANSONS) {
    state.hansonsLevel = value;
    state.hansonsWeek = getHansonsDefaultWeek(state.targetRace, value);
    return;
  }

  if (
    field === "toolMode" ||
    field === "converterType" ||
    field === "equivalentDirection" ||
    field === "abilityMode" ||
    field === "hansonsLevel" ||
    field === "norwegianExperience" ||
    field === "norwegianHealthStatus" ||
    field === "norwegianSpecificity" ||
    field === "targetRace" ||
    field === "trainingCycle"
  ) {
    state[field] = value;
  } else {
    state[field] = Number(value);
  }
}

function setHansonsGoalDefault(targetRace) {
  if (targetRace === TargetRace.HALF_MARATHON) {
    state.hansonsGoalHours = 1;
    state.hansonsGoalMinutes = 45;
    state.hansonsGoalSeconds = 0;
  } else if (targetRace === TargetRace.MARATHON) {
    state.hansonsGoalHours = 3;
    state.hansonsGoalMinutes = 45;
    state.hansonsGoalSeconds = 0;
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

function prefersReducedMotion() {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}

function commitToolModeChange(nextMode, shouldResetAndroidScroll, animateEntrance) {
  updateFieldValue("toolMode", nextMode);
  render();

  if (shouldResetAndroidScroll) window.scrollTo(0, 0);
  if (!animateEntrance) return;

  const nextView = app.querySelector("[data-tool-view]");
  const nextBottomNav = app.querySelector(".android-bottom-nav");
  if (!nextView && !nextBottomNav) return;

  nextView?.classList.add("tool-view-enter");
  nextBottomNav?.classList.add("bottom-nav-enter");
  const clearEntrance = (event) => {
    if (event && event.target !== nextView) return;
    nextView?.classList.remove("tool-view-enter");
    nextBottomNav?.classList.remove("bottom-nav-enter");
    nextView?.removeEventListener("animationend", clearEntrance);
  };
  nextView?.addEventListener("animationend", clearEntrance);
  window.setTimeout(() => clearEntrance(), TOOL_VIEW_ENTER_MS + 40);
}

function transitionToolMode(nextMode, shouldResetAndroidScroll = false) {
  if (!nextMode || nextMode === state.toolMode) return;

  pendingToolMode = nextMode;
  pendingToolModeScrollReset ||= shouldResetAndroidScroll;

  if (toolModeTransitionTimer !== null) return;

  const activeView = app.querySelector("[data-tool-view]");
  if (!activeView || prefersReducedMotion()) {
    const targetMode = pendingToolMode;
    const resetScroll = pendingToolModeScrollReset;
    pendingToolMode = null;
    pendingToolModeScrollReset = false;
    commitToolModeChange(targetMode, resetScroll, false);
    return;
  }

  activeView.classList.remove("tool-view-enter");
  activeView.classList.add("tool-view-exit");
  app.querySelector(".android-bottom-nav")?.classList.add("bottom-nav-exit");

  toolModeTransitionTimer = window.setTimeout(() => {
    const targetMode = pendingToolMode;
    const resetScroll = pendingToolModeScrollReset;
    pendingToolMode = null;
    pendingToolModeScrollReset = false;
    toolModeTransitionTimer = null;
    commitToolModeChange(targetMode, resetScroll, true);
  }, TOOL_VIEW_EXIT_MS);
}

function handleAction(event) {
  const action = event.currentTarget.dataset.action;
  const actionField = event.currentTarget.dataset.field;
  const actionValue = event.currentTarget.dataset.value;
  const shouldResetAndroidScroll =
    isAndroidApp &&
    action === "select-menu-option" &&
    actionField === "toolMode" &&
    actionValue !== state.toolMode;

  if (action === "select-menu-option" && actionField === "toolMode" && actionValue !== state.toolMode) {
    transitionToolMode(actionValue, shouldResetAndroidScroll);
    return;
  }

  if (action === "open-android-sheet") {
    state.androidSheet = event.currentTarget.dataset.sheet ?? state.toolMode;
    render();
    return;
  }

  if (action === "close-android-sheet") {
    state.androidSheet = null;
    render();
    return;
  }

  if (action === "step-number") {
    const control = event.currentTarget;
    const field = control.dataset.field;
    const delta = Number(control.dataset.delta);
    const min = Number(control.dataset.min);
    const max = Number(control.dataset.max);
    const current = Number(state[field]);
    const next = stepNumericValue({ current, delta, min, max });
    updateFieldValue(field, next);
    render();
    return;
  }

  if (action === "toggle-auto-weather") {
    toggleAutoWeather();
    return;
  }

  if (action === "refresh-auto-weather") {
    refreshAutoWeather();
    return;
  }

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

  if (action === "set-half-marathon-week") {
    const nextWeek = event.currentTarget.dataset.value;
    if (Object.values(HalfMarathonWeek).includes(nextWeek)) {
      state.halfMarathonWeek = nextWeek;
      state.planWorkoutOverrides = {};
      state.openMenu = null;
    }
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
  if (shouldResetAndroidScroll) window.scrollTo(0, 0);
}

async function refreshAutoWeather() {
  if (!state.weatherAutoEnabled || state.weatherStatus === "refreshing") return;

  state.weatherStatus = "refreshing";
  state.weatherError = "";
  render();

  try {
    applyAutoWeatherSnapshot(await loadAutoWeatherSnapshot());
    state.weatherStatus = "active";
  } catch (error) {
    state.weatherStatus = "refresh-error";
    state.weatherError = error?.weatherType ?? "fetch";
  }

  render();
}

async function toggleAutoWeather() {
  if (state.weatherAutoEnabled) {
    state.weatherAutoEnabled = false;
    state.weatherStatus = "idle";
    state.weatherError = "";
    state.weatherCurrent = null;
    state.temperatureC = state.manualTemperatureC;
    state.humidity = state.manualHumidity;
    render();
    return;
  }

  state.manualTemperatureC = state.temperatureC;
  state.manualHumidity = state.humidity;
  state.weatherStatus = "loading";
  state.weatherError = "";
  render();

  try {
    applyAutoWeatherSnapshot(await loadAutoWeatherSnapshot());
    state.weatherAutoEnabled = true;
    state.weatherStatus = "active";
  } catch (error) {
    state.weatherAutoEnabled = false;
    state.weatherCurrent = null;
    state.weatherStatus = "error";
    state.weatherError = error?.weatherType ?? "fetch";
  }

  render();
}

async function loadAutoWeatherSnapshot() {
  const coordinates = await getCurrentCoordinates();
  const [weather, location] = await Promise.all([
    fetchCurrentWeather(coordinates.latitude, coordinates.longitude),
    fetchCurrentLocation(coordinates.latitude, coordinates.longitude).catch(() => null)
  ]);
  return { ...weather, location };
}

function applyAutoWeatherSnapshot(weather) {
  state.weatherCurrent = weather;
  state.temperatureC = weather.temperatureC;
  state.humidity = weather.humidity;
}

function getCurrentCoordinates() {
  if (!("geolocation" in navigator)) {
    return Promise.reject(createWeatherError("unsupported"));
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position.coords),
      (error) => {
        const type = error.code === 1 ? "permission" : error.code === 3 ? "timeout" : "position";
        reject(createWeatherError(type));
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
    );
  });
}

async function fetchCurrentWeather(latitude, longitude) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 12000);
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.search = new URLSearchParams({
    latitude: latitude.toFixed(4),
    longitude: longitude.toFixed(4),
    current: "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code",
    timezone: "auto",
    forecast_days: "1"
  });

  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) throw createWeatherError("fetch");
    const data = await response.json();
    const temperatureC = Number(data.current?.temperature_2m);
    const humidity = Number(data.current?.relative_humidity_2m);
    const apparentTemperatureC = Number(data.current?.apparent_temperature);
    const code = Number(data.current?.weather_code);

    if (
      !Number.isFinite(temperatureC) ||
      !Number.isFinite(humidity) ||
      !Number.isFinite(apparentTemperatureC) ||
      !Number.isFinite(code)
    ) {
      throw createWeatherError("fetch");
    }

    return {
      temperatureC: Math.round(temperatureC),
      humidity: Math.round(humidity),
      apparentTemperatureC: Math.round(apparentTemperatureC),
      code,
      time: data.current?.time ?? ""
    };
  } catch (error) {
    if (error?.name === "AbortError") throw createWeatherError("timeout");
    if (error?.weatherType) throw error;
    throw createWeatherError("fetch");
  } finally {
    window.clearTimeout(timeout);
  }
}

async function fetchCurrentLocation(latitude, longitude) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 8000);
  const url = new URL("https://api.bigdatacloud.net/data/reverse-geocode-client");
  url.search = new URLSearchParams({
    latitude: latitude.toFixed(5),
    longitude: longitude.toFixed(5),
    localityLanguage: state.locale === "en" ? "en" : "zh"
  });

  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) throw new Error("location-fetch-failed");
    const data = await response.json();

    return normalizeWeatherLocation(data);
  } finally {
    window.clearTimeout(timeout);
  }
}

function normalizeWeatherLocation(data) {
  const country = String(data?.countryName ?? "").trim();
  const countryCode = String(data?.countryCode ?? "").trim().toUpperCase();
  const isTaiwan =
    countryCode === "TW" || /^(台灣|臺灣|中華民國|taiwan)/i.test(country);
  const region = isTaiwan ? (state.locale === "en" ? "Taiwan" : "台灣") : country;
  const countyCity = String(data?.principalSubdivision || data?.city || "").trim();
  const districtCandidates = [data?.locality, data?.city]
    .map((value) => String(value ?? "").trim())
    .filter(Boolean);
  const district =
    districtCandidates.find(
      (value) => value.toLocaleLowerCase() !== countyCity.toLocaleLowerCase()
    ) ?? "";

  if (!region && !countyCity && !district) return null;
  return { region, countyCity, district };
}

function createWeatherError(weatherType) {
  const error = new Error(weatherType);
  error.weatherType = weatherType;
  return error;
}

function getWeatherErrorMessage(error) {
  const t = copy[state.locale];
  const messages = {
    unsupported: t.weatherUnsupported,
    permission: t.weatherPermissionDenied,
    position: t.weatherPositionUnavailable,
    timeout: t.weatherTimeout,
    fetch: t.weatherFetchFailed
  };
  return messages[error?.weatherType] ?? t.weatherFetchFailed;
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
  const input = event.currentTarget;
  const field = event.currentTarget.dataset.gpxField;
  let value =
    input.type === "checkbox"
      ? input.checked
      : input.value;

  if (input.type === "number") {
    value = normalizeNumericInput(input, value, state[field]);
    input.value = value;
  }

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
  return seconds ? formatPaceForUnit(seconds, state.unitSystem) : "";
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

function handlePlanPointerDown(event) {
  if (event.pointerType === "touch" || event.button !== 0) return;
  if (event.target.closest("button, input, textarea, select, a")) return;

  const card = event.currentTarget;
  clearPlanPointerDragState();
  state.planPointerDrag = {
    pointerId: event.pointerId,
    index: Number(card.dataset.planIndex),
    startX: event.clientX,
    startY: event.clientY,
    startOrderPosition: state.planOrder.indexOf(Number(card.dataset.planIndex)),
    startScrollLeft: card.closest(".week-scroll")?.scrollLeft ?? 0,
    cardWidth: card.getBoundingClientRect().width,
    cardHeight: card.getBoundingClientRect().height,
    active: false
  };
  card.setPointerCapture?.(event.pointerId);
}

function handlePlanPointerMove(event) {
  const drag = state.planPointerDrag;
  if (!drag || drag.pointerId !== event.pointerId) return;

  const distance = Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY);
  if (!drag.active) {
    if (distance < 8) return;
    drag.active = true;
    state.draggedPlanIndex = drag.index;
    event.currentTarget.classList.add("is-dragging");
  }

  event.preventDefault();
  autoScrollHorizontalContainer(
    event.currentTarget.closest(".week-scroll"),
    event.clientX
  );

  const target = findPlanCardAtPoint(
    event.currentTarget.closest("[data-plan-grid]"),
    event.clientX,
    event.clientY,
    event.currentTarget
  );
  if (!target || target === event.currentTarget) return;

  swapPlanWithTarget(target, event.clientX, event.clientY);
}

function handlePlanPointerEnd(event) {
  const drag = state.planPointerDrag;
  if (!drag || drag.pointerId !== event.pointerId) return;

  finishPlanDrag(drag, event.clientX, event.clientY, event.currentTarget);
  event.currentTarget.releasePointerCapture?.(event.pointerId);
  clearPlanPointerDragState();
}

function finishPlanDrag(drag, endClientX, endClientY, card) {
  if (!drag.active) return;

  const currentPosition = state.planOrder.indexOf(drag.index);
  if (currentPosition < 0 || currentPosition !== drag.startOrderPosition) return;

  const grid = card.closest("[data-plan-grid]");
  const scroller = card.closest(".week-scroll");
  if (!grid || (!isAndroidApp && !scroller)) return;

  if (isAndroidApp) {
    const travelY = endClientY - drag.startY;
    const cardHeight = Math.max(1, drag.cardHeight);
    if (Math.abs(travelY) < cardHeight * 0.35) return;

    const direction = Math.sign(travelY);
    const slots = Math.max(1, Math.floor(Math.abs(travelY) / cardHeight));
    const targetPosition = Math.max(
      0,
      Math.min(state.planOrder.length - 1, currentPosition + direction * slots)
    );
    if (targetPosition === currentPosition) return;

    animatePlanReorder(grid, () => {
      const [movedIndex] = state.planOrder.splice(currentPosition, 1);
      state.planOrder.splice(targetPosition, 0, movedIndex);
      reorderPlanCards(grid);
    });
    return;
  }

  const travelX =
    endClientX - drag.startX + (scroller.scrollLeft - drag.startScrollLeft);
  const cardWidth = Math.max(1, drag.cardWidth);
  if (Math.abs(travelX) < cardWidth * 0.35) return;

  const direction = Math.sign(travelX);
  const slots = Math.max(1, Math.floor(Math.abs(travelX) / cardWidth));
  const targetPosition = Math.max(
    0,
    Math.min(state.planOrder.length - 1, currentPosition + direction * slots)
  );
  if (targetPosition === currentPosition) return;

  animatePlanReorder(grid, () => {
    const [movedIndex] = state.planOrder.splice(currentPosition, 1);
    state.planOrder.splice(targetPosition, 0, movedIndex);
    reorderPlanCards(grid);
  });
}

function clearPlanPointerDragState() {
  app.querySelectorAll("[data-plan-card]").forEach((card) => {
    card.classList.remove("is-dragging");
  });
  state.draggedPlanIndex = null;
  state.planPointerDrag = null;
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
  event.dataTransfer.dropEffect = "move";
  autoScrollHorizontalContainer(event.currentTarget.closest(".week-scroll"), event.clientX);
  swapPlanWithTarget(event.currentTarget, event.clientX, event.clientY);
}

function swapPlanWithTarget(target, clientX, clientY) {
  const grid = target.closest("[data-plan-grid]");
  const draggedIndex = state.draggedPlanIndex;
  const targetIndex = Number(target.dataset.planIndex);

  if (!grid || draggedIndex === null || draggedIndex === targetIndex) return;

  const from = state.planOrder.indexOf(draggedIndex);
  const to = state.planOrder.indexOf(targetIndex);
  if (from < 0 || to < 0 || from === to) return;

  const targetRect = target.getBoundingClientRect();
  const pointerRatio = isAndroidApp
    ? (clientY - targetRect.top) / targetRect.height
    : (clientX - targetRect.left) / targetRect.width;
  const movingForward = from < to;
  const crossedThreshold = movingForward ? pointerRatio > 0.5 : pointerRatio < 0.5;
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
    startOrderPosition: state.planOrder.indexOf(Number(card.dataset.planIndex)),
    startScrollLeft: card.closest(".week-scroll")?.scrollLeft ?? 0,
    cardWidth: card.getBoundingClientRect().width,
    cardHeight: card.getBoundingClientRect().height,
    active: false,
    timerId: window.setTimeout(() => {
      touchDrag.active = true;
      state.draggedPlanIndex = touchDrag.index;
      card.classList.add("is-dragging");
      navigator.vibrate?.(18);
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

  autoScrollHorizontalContainer(
    event.currentTarget.closest(".week-scroll"),
    touch.clientX
  );

  const target = findPlanCardAtPoint(
    event.currentTarget.closest("[data-plan-grid]"),
    touch.clientX,
    touch.clientY,
    event.currentTarget
  );
  if (!target || target === event.currentTarget) return;

  swapPlanWithTarget(target, touch.clientX, touch.clientY);
}

function findPlanCardAtPoint(grid, clientX, clientY, excludedCard) {
  if (!grid) return null;

  return (
    [...grid.querySelectorAll("[data-plan-card]")].find((card) => {
      if (card === excludedCard) return false;
      const rect = card.getBoundingClientRect();
      return (
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom
      );
    }) ?? null
  );
}

function autoScrollHorizontalContainer(container, clientX) {
  if (!container) return;

  const rect = container.getBoundingClientRect();
  const edgeWidth = Math.min(64, rect.width * 0.2);
  const maxStep = 18;
  let delta = 0;

  if (clientX < rect.left + edgeWidth) {
    delta = -maxStep * (1 - Math.max(0, clientX - rect.left) / edgeWidth);
  } else if (clientX > rect.right - edgeWidth) {
    delta = maxStep * (1 - Math.max(0, rect.right - clientX) / edgeWidth);
  }

  if (delta !== 0) container.scrollLeft += delta;
}

function handlePlanTouchEnd(event) {
  const touchDrag = state.planTouchDrag;
  if (!touchDrag) return;

  const touchFinished = [...event.changedTouches].some(
    (item) => item.identifier === touchDrag.touchId
  );
  if (!touchFinished) return;

  const finishedTouch = [...event.changedTouches].find(
    (item) => item.identifier === touchDrag.touchId
  );
  if (finishedTouch) {
    finishPlanDrag(touchDrag, finishedTouch.clientX, finishedTouch.clientY, event.currentTarget);
  }
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
        plannedDistanceKm: 0,
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
      plannedDistanceKm:
        Math.abs(nextRangeKm.max - nextRangeKm.min) < 0.05
          ? nextRangeKm.min
          : day.plannedDistanceKm,
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
  if (Math.abs(max - min) < 0.05) {
    return `${formatPlanDistance(min)} ${suffix}`;
  }
  return `${formatPlanDistance(min)}-${formatPlanDistance(max)} ${suffix}`;
}

function formatPlanDistance(value) {
  const rounded = value >= 10 ? Math.round(value) : Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : String(rounded.toFixed(1));
}

function getPlanWorkoutCandidates(day, model) {
  if (model.trainingMethod === TrainingMethod.HANSONS) return [];
  if (model.trainingMethod === TrainingMethod.NORWEGIAN_SINGLES) {
    return Array.isArray(day.workoutAlternatives) ? day.workoutAlternatives : [];
  }
  if (model.targetRace === TargetRace.MARATHON) {
    return getMarathonSwapCandidates(day, model.unitSystem);
  }
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
          finishSeconds: inputSeconds,
          distanceMeters: distanceKm * 1000,
          meta: getEquivalentRaceLabel()
        },
        {
          label: t.baselineTime,
          value: formatFinishTime(baselineSeconds),
          finishSeconds: baselineSeconds,
          distanceMeters: distanceKm * 1000,
          meta: `-${formatPercent((1 - 1 / heatMultiplier) * 100)}`,
          highlight: true
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
        finishSeconds: inputSeconds,
        distanceMeters: distanceKm * 1000,
        meta: getEquivalentRaceLabel()
      },
      {
        label: t.heatEquivalentTime,
        value: formatFinishTime(hotSeconds),
        finishSeconds: hotSeconds,
        distanceMeters: distanceKm * 1000,
        meta: `+${formatPercent((heatMultiplier - 1) * 100)}`,
        highlight: true
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
  if (!Number.isFinite(secondsPerKm) || secondsPerKm <= 0) return "-";
  const seconds =
    unitSystem === UnitSystem.IMPERIAL ? secondsPerKm * KM_PER_MILE : secondsPerKm;
  const suffix = unitSystem === UnitSystem.IMPERIAL ? "/ mi" : "/ km";
  return `${formatClock(seconds)} ${suffix}`;
}

function formatAverageResultPace(
  totalSeconds,
  distanceMeters,
  unitSystem = state.unitSystem
) {
  const paceSeconds = calculateAveragePaceSeconds(
    totalSeconds,
    distanceMeters,
    unitSystem
  );
  if (paceSeconds === null) return "-";
  const suffix = unitSystem === UnitSystem.IMPERIAL ? "/ mi" : "/ km";
  return `${formatClock(paceSeconds)} ${suffix}`;
}

function renderFinishTimeWithPace(
  totalSeconds,
  distanceMeters,
  timeFormatter = formatFinishTime
) {
  return `<span class="finish-time-with-pace"><span>${timeFormatter(totalSeconds)}</span><small class="finish-result-pace">${formatAverageResultPace(totalSeconds, distanceMeters)}</small></span>`;
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
