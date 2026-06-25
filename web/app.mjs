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
    appTitle: "VDOT 配速區間工具",
    subtitle:
      "輸入 VDOT、週跑量、溫度與濕度，取得能力對應的訓練配速區間與熱環境調整。",
    language: "語言",
    inputs: "跑者資料",
    vdot: "VDOT",
    vdotSource: "能力來源",
    directVdot: "直接輸入 VDOT",
    raceResult: "近期成績換算",
    raceDistance: "比賽距離",
    raceTime: "最佳成績",
    hours: "時",
    minutes: "分",
    seconds: "秒",
    estimatedVdot: "換算 VDOT",
    invalidRaceTime: "請輸入有效的時分秒。",
    weeklyMileage: "週跑量",
    unitSystem: "單位",
    metricUnit: "公制 km",
    imperialUnit: "英制 mile",
    targetRace: "目前專項",
    trainingCycle: "訓練週期",
    temperature: "溫度",
    humidity: "濕度",
    kmPerWeek: "km / 週",
    miPerWeek: "mi / 週",
    celsius: "°C",
    percent: "%",
    paceZones: "能力配速區間",
    basePace: "原始配速",
    adjustedPace: "調整後配速",
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
      "露點 Td 以 Magnus 公式估算。降速比例 = min(16%, max(0, T-15)×0.25% + max(0, Td-12)×0.35% + max(0, T-30)×0.40%)；調整後配速 = 原始配速 × (1 + 降速比例)。熱天恢復延長 = min(25%, 降速比例 × 1.5)。R 不套用降速，只調整恢復或總量。",
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
      "Daniels 書中有 VDOT、E/M/T/I/R 訓練強度與週期安排的概念，但沒有直接列出「每個 VDOT 對應一段配速範圍」。因此，本工具以公式推估區間，並依台灣常見的高溫高濕環境做調整。",
    sourceTitle: "資料來源與計算方式",
    sourceNote:
      "配速推算參考 Jack Daniels《Daniels' Running Formula》第 4 版的 VDOT 架構與 E/M/T/I/R 訓練強度概念。計算時，先把各強度設定為 VDOT 的比例區間（E 59-74%、M 75-84%、T 83-88%、I 95-100%、R 105-110%），再用跑步氧耗方程 VO2 = -4.60 + 0.182258v + 0.000104v² 反解速度，換算成配速。熱天配速調整只套用在 E/M/T/I；R 的處理方式請見下方 R 反覆跑卡片。課量上限以 Daniels 原則估算：T 以週跑量 10% 與 24 km（15 mi）相比，取較低值為上限；I 以週跑量 8% 與 10 km 相比，取較低值為上限；R 以週跑量 5% 與 8 km（5 mi）相比，取較低值為上限。",
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
      "Enter VDOT, mileage, temperature, and humidity to estimate training pace ranges with heat adjustment.",
    language: "Language",
    inputs: "Runner Inputs",
    vdot: "VDOT",
    vdotSource: "Ability Source",
    directVdot: "Enter VDOT",
    raceResult: "Convert Race Result",
    raceDistance: "Race Distance",
    raceTime: "Best Time",
    hours: "Hr",
    minutes: "Min",
    seconds: "Sec",
    estimatedVdot: "Estimated VDOT",
    invalidRaceTime: "Enter a valid race time.",
    weeklyMileage: "Weekly Mileage",
    unitSystem: "Units",
    metricUnit: "Metric km",
    imperialUnit: "Imperial mile",
    targetRace: "Target Event",
    trainingCycle: "Training Cycle",
    temperature: "Temperature",
    humidity: "Humidity",
    kmPerWeek: "km / week",
    miPerWeek: "mi / week",
    celsius: "°C",
    percent: "%",
    paceZones: "Ability-Based Pace Zones",
    basePace: "Base Pace",
    adjustedPace: "Adjusted Pace",
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
      "Dew point Td is estimated with the Magnus formula. Slowdown = min(16%, max(0, T-15)×0.25% + max(0, Td-12)×0.35% + max(0, T-30)×0.40%); adjusted pace = base pace × (1 + slowdown). Hot recovery extension = min(25%, slowdown × 1.5). R pace is not slowed; adjust recovery or volume instead.",
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
      "Daniels defines the VDOT framework, E/M/T/I/R training intensities, and phase planning concepts, but does not directly provide a pace range for every VDOT. This tool estimates ranges from formulas and adjusts E/M/T/I for hot, humid conditions.",
    sourceTitle: "Source & Calculation",
    sourceNote:
      "The pace model references Jack Daniels' Daniels' Running Formula, 4th ed., for the VDOT framework and E/M/T/I/R intensity concepts. It assigns each intensity to a VDOT percentage band (E 59-74%, M 75-84%, T 83-88%, I 95-100%, R 105-110%), solves the running oxygen-cost equation VO2 = -4.60 + 0.182258v + 0.000104v² for velocity, then converts that velocity to pace. Heat/humidity pace adjustment is applied to E/M/T/I only; R guidance is shown on the R Repetition card below. Daniels-style volume guardrails: T is capped at the lower value between 10% weekly mileage and 24 km (15 mi); I is capped at the lower value between 8% weekly mileage and 10 km; R is capped at the lower value between 5% weekly mileage and 8 km (5 mi).",
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
  abilityMode: "vdot",
  openMenu: null,
  unitSystem: UnitSystem.METRIC,
  targetRace: TargetRace.FIVE_TEN_K,
  trainingCycle: TrainingCycle.PHASE_II,
  vdot: 50,
  raceDistanceMeters: 5000,
  raceHours: 0,
  raceMinutes: 20,
  raceSeconds: 0,
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

  document.documentElement.lang = state.locale === "en" ? "en" : "zh-Hant";
  app.innerHTML = `
    <header class="topbar">
      <div>
        <p class="eyebrow">VDOT Pace Lab</p>
        <h1>${t.appTitle}</h1>
        <p class="subtitle">${t.subtitle}</p>
      </div>
      ${renderMenuField(t.language, "locale", state.locale, [
        { value: "zh-TW", label: "中文" },
        { value: "en", label: "EN" }
      ], "language-toggle")}
    </header>

    <main class="pace-layout">
      <section class="control-panel" aria-labelledby="inputs-title">
        <div class="section-heading">
          <p class="eyebrow">Runner</p>
          <h2 id="inputs-title">${t.inputs}</h2>
        </div>
        ${renderInputs(t)}
        ${renderEnvironmentSummary(model, t)}
        ${renderMileageClass(model, t)}
      </section>

      <section class="results-panel" aria-live="polite">
        <div class="section-heading">
          <p class="eyebrow">VDOT ${model.vdot}</p>
          <h2>${t.workoutExamples}</h2>
        </div>
        ${renderWeeklySchedule(model, t)}
        ${renderWorkoutExamples(model, t)}
        <aside class="note-panel">
          <h2>${t.noteTitle}</h2>
          <p>${t.note}</p>
          <h3>${t.sourceTitle}</h3>
          <p>${t.sourceNote}</p>
        </aside>
      </section>
    </main>

    ${renderPaceZonePanel(model, t)}
  `;

  bindEvents();
  fitPaceZonePanel();
}

function renderInputs(t) {
  const mileageMax = state.unitSystem === UnitSystem.IMPERIAL ? 112 : 180;
  const mileageUnit =
    state.unitSystem === UnitSystem.IMPERIAL ? t.miPerWeek : t.kmPerWeek;

  return `
    <div class="field-grid">
      ${renderAbilityInput(t)}
      ${renderMenuField(t.unitSystem, "unitSystem", state.unitSystem, [
        { value: UnitSystem.METRIC, label: t.metricUnit },
        { value: UnitSystem.IMPERIAL, label: t.imperialUnit }
      ])}
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
      ${renderRangeField(
        t.weeklyMileage,
        "weeklyMileage",
        state.weeklyMileage,
        0,
        mileageMax,
        1,
        mileageUnit
      )}
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

function renderMenuField(label, field, value, items, className = "field") {
  const selected = items.find((item) => String(item.value) === String(value)) ?? items[0];
  const isOpen = state.openMenu === field;

  return `
    <div class="${className}">
      <span>${label}</span>
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

function renderPaceZonePanel(model, t) {
  return `
    <section class="summary-card pace-zone-panel ${state.locale === "en" ? "english" : ""}">
      <p class="eyebrow">${t.paceZones}</p>
      <div class="pace-zone-grid">
        ${model.zones.map((zone) => renderPaceZone(zone, t)).join("")}
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

function renderPaceZone(zone, t) {
  const adjustedLabel = zone.id === "R" ? t.rTargetPace : t.adjustedPace;
  const paceValuesClass = zone.id === "R" ? "pace-values single" : "pace-values";

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
          zone.id === "R"
            ? ""
            : `<div class="adjusted">
                <dt>${adjustedLabel}</dt>
                <dd>${zone.adjusted.label}</dd>
              </div>`
        }
      </div>
      ${
        zone.id === "I"
          ? `<div class="split-row">
              ${renderSplitComparison(t.split400, zone.adjustedSplit400m, zone.baseSplit400m, t, zone.id)}
              ${renderSplitComparison(t.split200, zone.adjustedSplit200m, zone.baseSplit200m, t, zone.id)}
            </div>`
          : ""
      }
      ${zone.id === "R" ? renderRepetitionHeatNote(t) : ""}
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

  state.unitSystem = nextUnitSystem;
  const convertedMileage =
    nextUnitSystem === UnitSystem.IMPERIAL
      ? Math.round(weeklyMileageKm / KM_PER_MILE)
      : Math.round(weeklyMileageKm);
  const nextMax = nextUnitSystem === UnitSystem.IMPERIAL ? 112 : 180;
  state.weeklyMileage = Math.min(nextMax, Math.max(0, convertedMileage));
}

function handleAction(event) {
  const action = event.currentTarget.dataset.action;

  if (action === "toggle-menu") {
    const menu = event.currentTarget.dataset.menu;
    state.openMenu = state.openMenu === menu ? null : menu;
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

render();
