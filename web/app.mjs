import {
  KM_PER_MILE,
  TargetRace,
  TrainingCycle,
  UnitSystem,
  calculatePaceModel,
  calculateVdotFromRaceResult
} from "../src/training-planner/paceCalculator.mjs";

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
    baselinePace: "基準配速",
    equivalentRace: "理想成績",
    equivalentResult: "等效換算結果",
    equivalentPace: "熱環境等強配速",
    heatEquivalentTime: "熱環境等效成績",
    baselineTime: "基準成績",
    averagePace: "平均配速",
    converterAssumption:
      "假設輸入值是在涼爽或基準條件下的目標；下方用目前溫濕度估算相同主觀強度在熱環境下的大約配速或成績。每個人對熱的生理反應與熱適應程度不同，結果僅供參考。",
    hours: "時",
    minutes: "分",
    seconds: "秒",
    estimatedVdot: "換算 VDOT",
    vdotEquivalentTitle: "該 VDOT 等效成績",
    vdotEquivalentNote: "以同一套 Daniels VDOT 比賽成績公式反推，作為能力對照參考。",
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
    rHeatGuidance:
      "R 是短距離、以順暢快速與技術品質為主，熱天不降目標配速，改延長恢復、降低組數或改到較涼時段。",
    rReferences: [
      "Daniels 第 4 版：R 訓練原則",
      "Racinais et al. 2015, BJSM, DOI: 10.1136/bjsports-2015-094915",
      "Nybo, Rasmussen & Sawka 2014, Performance in the Heat-Physiological Factors of Importance for Hyperthermia-Induced Fatigue, Comprehensive Physiology, DOI: 10.1002/cphy.c130012"
    ],
    heatAdjustment: "溫濕度調整",
    slowerBy: "建議放慢",
    dewPoint: "露點",
    heatFormulaTitle: "熱環境估算式",
    heatFormula:
      "露點 Td 以 Magnus 公式估算。降速比例 = min(16%, max(0, T-15)×0.25% + max(0, Td-12)×0.35% + max(0, T-30)×0.40%)；調整後配速 = 原始配速 × (1 + 降速比例)。熱天恢復延長 = min(25%, 降速比例 × 1.5)。R 不套用降速，只調整恢復或總量。每個人對熱的生理反應與熱適應程度不同，結果僅供參考。",
    heatReferencesTitle: "熱環境參考文獻",
    heatReferences: [
      "Racinais et al. 2015, Consensus recommendations on training and competing in the heat, BJSM, DOI: 10.1136/bjsports-2015-094915",
      "Nybo, Rasmussen & Sawka 2014, Performance in the Heat-Physiological Factors of Importance for Hyperthermia-Induced Fatigue, Comprehensive Physiology, DOI: 10.1002/cphy.c130012",
      "Lawrence 2005, The relationship between relative humidity and the dewpoint temperature in moist air, Bulletin of the American Meteorological Society, DOI: 10.1175/BAMS-86-2-225"
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
    baselinePace: "Baseline Pace",
    equivalentRace: "Goal Result",
    equivalentResult: "Equivalent Result",
    equivalentPace: "Heat-Equivalent Pace",
    heatEquivalentTime: "Heat-Equivalent Result",
    baselineTime: "Baseline Result",
    averagePace: "Average Pace",
    converterAssumption:
      "Assumption: the input is a cool-condition or baseline target. The result estimates the pace or finish time for roughly the same effort under the selected temperature and humidity. Heat response and heat adaptation vary by runner, so use the estimate as a reference only.",
    hours: "Hr",
    minutes: "Min",
    seconds: "Sec",
    estimatedVdot: "Estimated VDOT",
    vdotEquivalentTitle: "Equivalent Race Results",
    vdotEquivalentNote: "Estimated from the same Daniels VDOT race-performance equation for ability reference.",
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
    rHeatGuidance:
      "R is short, smooth-fast mechanics work. Hot days do not slow the R target pace; extend recovery, reduce reps, or move the session cooler instead.",
    rReferences: [
      "Daniels 4th ed.: R-training principles",
      "Racinais et al. 2015, BJSM, DOI: 10.1136/bjsports-2015-094915",
      "Nybo, Rasmussen & Sawka 2014, Performance in the Heat-Physiological Factors of Importance for Hyperthermia-Induced Fatigue, Comprehensive Physiology, DOI: 10.1002/cphy.c130012"
    ],
    heatAdjustment: "Heat/Humidity Adjustment",
    slowerBy: "Slow by",
    dewPoint: "Dew Point",
    heatFormulaTitle: "Heat Adjustment Formula",
    heatFormula:
      "Dew point Td is estimated with the Magnus formula. Slowdown = min(16%, max(0, T-15)×0.25% + max(0, Td-12)×0.35% + max(0, T-30)×0.40%); adjusted pace = base pace × (1 + slowdown). Hot recovery extension = min(25%, slowdown × 1.5). R pace is not slowed; adjust recovery or volume instead. Heat response and heat adaptation vary by runner, so use the estimate as a reference only.",
    heatReferencesTitle: "Heat References",
    heatReferences: [
      "Racinais et al. 2015, Consensus recommendations on training and competing in the heat, BJSM, DOI: 10.1136/bjsports-2015-094915",
      "Nybo, Rasmussen & Sawka 2014, Performance in the Heat-Physiological Factors of Importance for Hyperthermia-Induced Fatigue, Comprehensive Physiology, DOI: 10.1002/cphy.c130012",
      "Lawrence 2005, The relationship between relative humidity and the dewpoint temperature in moist air, Bulletin of the American Meteorological Society, DOI: 10.1175/BAMS-86-2-225"
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
  planOrder: null,
  draggedPlanIndex: null,
  exampleOrder: {},
  draggedExample: null,
  planWorkoutOverrides: {},
  skippedEasyDays: {}
};

const app = document.querySelector("#app");
let pacePanelObserver = null;

function render() {
  const t = copy[state.locale];
  const activeVdot = getActiveVdot();
  const model = calculatePaceModel({ ...state, vdot: activeVdot });
  const isConverter = state.toolMode === "equivalent";
  const isPlan = state.toolMode === "plan";

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
              <h2 id="inputs-title">${t.inputs}</h2>
            </div>
            ${renderInputs(t)}
            ${renderEnvironmentSummary(model, t)}
            ${isPlan ? renderMileageClass(model, t) : ""}
          </section>

          <section class="results-panel" aria-live="polite">
            ${
              isConverter
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
  if (!isConverter) fitPaceZonePanel();
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
    ${
      state.converterType === "pace"
        ? renderPaceEquivalentInput(t)
        : renderRaceEquivalentInput(t)
    }
    <p class="field-note">${t.converterAssumption}</p>
  `;
}

function renderPaceEquivalentInput(t) {
  const unit = state.unitSystem === UnitSystem.IMPERIAL ? "/ mi" : "/ km";
  return `
    <fieldset class="time-fieldset pace-time-fieldset">
      <legend>${t.baselinePace} ${unit}</legend>
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
      <legend>${t.equivalentRace}</legend>
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
      <p class="equivalent-lead">${t.converterAssumption}</p>
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
        <p>${state.converterType === "pace" ? t.paceConverter : t.raceConverter}</p>
      </aside>
    </section>
  `;
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
          .map(
            (result) => `
              <article>
                <span>${state.locale === "en" ? result.en : result.zh}</span>
                <strong>${formatFinishTime(result.seconds)}</strong>
                <small>${t.estimatedPace} ${formatPaceForUnit(
                  result.seconds / (result.meters / 1000),
                  state.unitSystem
                )}</small>
              </article>
            `
          )
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
      ${zone.id === "R" && showAdjusted ? renderRepetitionHeatNote(t) : ""}
    </article>
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

  app.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", handleAction);
  });

  app.querySelectorAll("[data-plan-card]").forEach((card) => {
    card.addEventListener("dragstart", handlePlanDragStart);
    card.addEventListener("dragover", handlePlanDragOver);
    card.addEventListener("dragend", handlePlanDragEnd);
    card.addEventListener("drop", handlePlanDrop);
  });

  app.querySelectorAll("[data-example-card]").forEach((card) => {
    card.addEventListener("pointerdown", handleExamplePointerDown);
    card.addEventListener("pointermove", handleExamplePointerMove);
    card.addEventListener("pointerup", handleExamplePointerEnd);
    card.addEventListener("pointercancel", handleExamplePointerEnd);
    card.addEventListener("lostpointercapture", handleExamplePointerEnd);
    card.addEventListener("mousedown", handleExampleMouseDown);
    card.addEventListener("dragstart", handleExampleDragStart);
    card.addEventListener("dragover", handleExampleDragOver);
    card.addEventListener("dragend", handleExampleDragEnd);
    card.addEventListener("drop", handleExampleDrop);
  });

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

  render();
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

  const target = event.currentTarget;
  const grid = target.closest("[data-plan-grid]");
  const draggedIndex = state.draggedPlanIndex;
  const targetIndex = Number(target.dataset.planIndex);

  if (!grid || draggedIndex === null || draggedIndex === targetIndex) return;

  const from = state.planOrder.indexOf(draggedIndex);
  const to = state.planOrder.indexOf(targetIndex);
  if (from < 0 || to < 0 || from === to) return;

  const targetRect = target.getBoundingClientRect();
  const pointerRatio = (event.clientX - targetRect.left) / targetRect.width;
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
  const hotSecondsPerKm = secondsPerKm * heatMultiplier;
  const t = copy[state.locale];

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
  const hotSeconds = inputSeconds * heatMultiplier;
  const distanceKm = Number(state.equivalentRaceDistanceMeters) / 1000;
  const t = copy[state.locale];

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

render();
