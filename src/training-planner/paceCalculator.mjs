export const PaceZone = Object.freeze({
  EASY: "E",
  MARATHON: "M",
  THRESHOLD: "T",
  INTERVAL: "I",
  REPETITION: "R"
});

export const UnitSystem = Object.freeze({
  METRIC: "metric",
  IMPERIAL: "imperial"
});

export const TargetRace = Object.freeze({
  EIGHT_HUNDRED: "800m",
  MILE_TO_TWO_MILE: "1500m-2mi",
  FIVE_TEN_K: "5K-10K",
  CROSS_COUNTRY: "Cross Country",
  ROAD_15K_30K: "15K-30K",
  MARATHON: "Marathon"
});

export const HalfMarathonWeek = Object.freeze({
  ODD: "odd",
  EVEN: "even"
});

export const MARATHON_PHASE_WEEKS = 6;

export const TrainingCycle = Object.freeze({
  PHASE_I: "phaseI",
  PHASE_II: "phaseII",
  PHASE_III: "phaseIII",
  PHASE_IV: "phaseIV"
});

export const KM_PER_MILE = 1.609344;

const zoneDefinitions = Object.freeze([
  {
    id: PaceZone.EASY,
    zhName: "輕鬆跑",
    enName: "Easy",
    intensityRange: [0.59, 0.74],
    displayUnit: "pace"
  },
  {
    id: PaceZone.MARATHON,
    zhName: "馬拉松配速",
    enName: "Marathon",
    targetIntensity: 0.84,
    displayUnit: "pace"
  },
  {
    id: PaceZone.THRESHOLD,
    zhName: "乳酸閾值",
    enName: "Threshold",
    targetIntensity: 0.88,
    displayUnit: "pace"
  },
  {
    id: PaceZone.INTERVAL,
    zhName: "間歇",
    enName: "Interval",
    targetIntensity: 1,
    displayUnit: "pace"
  },
  {
    id: PaceZone.REPETITION,
    zhName: "反覆跑",
    enName: "Repetition",
    targetIntensity: 1.1,
    displayUnit: "split"
  }
]);

const mileageClasses = Object.freeze([
  {
    id: "A",
    min: 0,
    max: 48,
    zh: "A 課表級距",
    en: "Class A",
    qualityTypes: [PaceZone.THRESHOLD, PaceZone.INTERVAL, PaceZone.REPETITION]
  },
  {
    id: "B",
    min: 48,
    max: 64,
    zh: "B 課表級距",
    en: "Class B",
    qualityTypes: [PaceZone.THRESHOLD, PaceZone.INTERVAL, PaceZone.REPETITION]
  },
  {
    id: "C",
    min: 64,
    max: 82,
    zh: "C 課表級距",
    en: "Class C",
    qualityTypes: [PaceZone.THRESHOLD, PaceZone.INTERVAL, PaceZone.REPETITION]
  },
  {
    id: "D",
    min: 82,
    max: 98,
    zh: "D 課表級距",
    en: "Class D",
    qualityTypes: [PaceZone.THRESHOLD, PaceZone.INTERVAL, PaceZone.REPETITION]
  },
  {
    id: "E",
    min: 98,
    max: null,
    zh: "E 課表級距",
    en: "Class E",
    qualityTypes: [
      PaceZone.THRESHOLD,
      PaceZone.INTERVAL,
      PaceZone.REPETITION,
      PaceZone.MARATHON
    ]
  }
]);

// Coarse v2025-09-04 table from John Davis / Running Writings heat-adjusted pace model.
// Source and MIT license notice: https://github.com/johnjdavisiv/heat-adjusted-pace
const runningWritingsHeatHumidityModel = Object.freeze({
  airTempC: [
    0, 5, 10, 15, 20, 25, 30, 35, 40, 45,
    0, 5, 10, 15, 20, 25, 30, 35, 40, 45,
    0, 5, 10, 15, 20, 25, 30, 35, 40, 45,
    0, 5, 10, 15, 20, 25, 30, 35, 40, 45,
    0, 5, 10, 15, 20, 25, 30, 35, 40, 45,
    0, 5, 10, 15, 20, 25, 30, 35, 40, 45,
    0, 5, 10, 15, 20, 25, 30, 35, 40, 45,
    0, 5, 10, 15, 20, 25, 30, 35, 40, 45,
    0, 5, 10, 15, 20, 25, 30, 35, 40, 45,
    0, 5, 10, 15, 20, 25, 30, 35, 40, 45,
    0, 5, 10, 15, 20, 25, 30, 35, 40, 45
  ],
  humidityPct: [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    10, 10, 10, 10, 10, 10, 10, 10, 10, 10,
    20, 20, 20, 20, 20, 20, 20, 20, 20, 20,
    30, 30, 30, 30, 30, 30, 30, 30, 30, 30,
    40, 40, 40, 40, 40, 40, 40, 40, 40, 40,
    50, 50, 50, 50, 50, 50, 50, 50, 50, 50,
    60, 60, 60, 60, 60, 60, 60, 60, 60, 60,
    70, 70, 70, 70, 70, 70, 70, 70, 70, 70,
    80, 80, 80, 80, 80, 80, 80, 80, 80, 80,
    90, 90, 90, 90, 90, 90, 90, 90, 90, 90,
    100, 100, 100, 100, 100, 100, 100, 100, 100, 100
  ],
  logSpeedAdjust: [
    -0.0057, -0.0017, 0, -0.0001, -0.0019, -0.0032, -0.004, -0.0047, -0.0053, -0.006,
    -0.0057, -0.0017, 0, -0.0001, -0.0042, -0.0073, -0.0097, -0.012, -0.0143, -0.0166,
    -0.0057, -0.0017, 0, -0.0001, -0.0059, -0.0111, -0.0156, -0.02, -0.0243, -0.0287,
    -0.0057, -0.0017, 0, -0.0001, -0.0069, -0.0145, -0.0218, -0.0289, -0.0361, -0.0433,
    -0.0057, -0.0017, 0, -0.0001, -0.0082, -0.0181, -0.0284, -0.0386, -0.0489, -0.0591,
    -0.0057, -0.0017, 0, -0.0003, -0.0104, -0.0225, -0.0356, -0.0488, -0.062, -0.0752,
    -0.0057, -0.0017, 0, -0.0015, -0.0123, -0.027, -0.0437, -0.0608, -0.0778, -0.0948,
    -0.0057, -0.0017, 0, -0.0017, -0.0129, -0.031, -0.053, -0.0756, -0.0982, -0.1208,
    -0.0057, -0.0017, 0, -0.0017, -0.0129, -0.0346, -0.0629, -0.0921, -0.1214, -0.1507,
    -0.006, -0.0018, 0, -0.0017, -0.0129, -0.0382, -0.0729, -0.1089, -0.145, -0.1811,
    -0.008, -0.0036, -0.0001, -0.0017, -0.0129, -0.0418, -0.0828, -0.1258, -0.1687, -0.2116
  ]
});

const workoutCatalog = Object.freeze([
  t("T-A1", 0, 66, "20 分鐘 T 配速", "20 min at T pace", "20 分鐘"),
  t("T-A2", 48, 66, "4 x（5 分鐘 T + 1 分鐘休息）", "4 x (5 min T + 1 min rest)", "20 分鐘"),
  t("T-A3", 48, 66, "3 x（6 分鐘 T + 1 分鐘休息）", "3 x (6 min T + 1 min rest)", "18 分鐘"),
  t("T-A4", 48, 66, "2 x（10 分鐘 T + 2 分鐘休息）", "2 x (10 min T + 2 min rest)", "20 分鐘"),
  t("T-A5", 48, 66, "12 分鐘 T + 2 分鐘休息 + 8 分鐘 T", "12 min T + 2 min rest + 8 min T", "20 分鐘"),
  t("T-B1", 66, 114, "5-6 x（6 分鐘 T + 1 分鐘休息）", "5-6 x (6 min T + 1 min rest)", "30-36 分鐘"),
  t("T-B2", 66, 114, "2 x（12 分鐘 T + 2 分鐘休息）+ 2 x（5 分鐘 T + 1 分鐘休息）", "2 x (12 min T + 2 min rest) + 2 x (5 min T + 1 min rest)", "34 分鐘"),
  t("T-B3", 66, 114, "3 x（12 分鐘 T + 2 分鐘休息）", "3 x (12 min T + 2 min rest)", "36 分鐘"),
  t("T-B4", 66, 114, "2 x（15 分鐘 T + 3 分鐘休息）", "2 x (15 min T + 3 min rest)", "30 分鐘"),
  t("T-B5", 66, 114, "15 分鐘 T + 3 分鐘休息 + 10 分鐘 T + 2 分鐘休息 + 5 分鐘 T", "15 min T + 3 min rest + 10 min T + 2 min rest + 5 min T", "30 分鐘"),
  t("T-B6", 66, 114, "20 分鐘 T + 4 分鐘休息 + 10 分鐘 T；或 20 分鐘 T + 4 分鐘休息 + 2 x（5 分鐘 T + 1 分鐘休息）", "20 min T + 4 min rest + 10 min T; or 20 min T + 4 min rest + 2 x (5 min T + 1 min rest)", "30 分鐘"),
  t("T-C1", 114, 138, "8 x（5 分鐘 T + 1 分鐘休息）", "8 x (5 min T + 1 min rest)", "40 分鐘"),
  t("T-C2", 114, 138, "5 x（8 分鐘 T + 1.5 分鐘休息）", "5 x (8 min T + 1.5 min rest)", "40 分鐘"),
  t("T-C3", 114, 138, "4 x（10 分鐘 T + 2 分鐘休息）", "4 x (10 min T + 2 min rest)", "40 分鐘"),
  t("T-C4", 114, 138, "20 分鐘 T + 3 分鐘休息 + 2 x（10 分鐘 T + 2 分鐘休息）+ 5 分鐘 T", "20 min T + 3 min rest + 2 x (10 min T + 2 min rest) + 5 min T", "45 分鐘"),
  t("T-D1", 138, 163, "8 x（6 分鐘 T + 1 分鐘休息）", "8 x (6 min T + 1 min rest)", "48 分鐘"),
  t("T-D2", 138, 163, "4 x（12 分鐘 T + 2 分鐘休息）", "4 x (12 min T + 2 min rest)", "48 分鐘"),
  t("T-D3", 138, 163, "2 x（12 分鐘 T + 3 分鐘休息）+ 3 x（8 分鐘 T + 2 分鐘休息）", "2 x (12 min T + 3 min rest) + 3 x (8 min T + 2 min rest)", "48 分鐘"),
  t("T-D4", 138, 163, "20 分鐘 T + 3 分鐘休息 + 2 x（12 分鐘 T + 2 分鐘休息）+ 6 分鐘 T", "20 min T + 3 min rest + 2 x (12 min T + 2 min rest) + 6 min T", "50 分鐘"),
  t("T-E1", 163, null, "5 x（12 分鐘 T + 2 分鐘休息）", "5 x (12 min T + 2 min rest)", "60 分鐘"),
  t("T-E2", 163, null, "4 x（15 分鐘 T + 3 分鐘休息）", "4 x (15 min T + 3 min rest)", "60 分鐘"),
  t("T-E3", 163, null, "2 x（15 分鐘 T + 3 分鐘休息）+ 2 x（12 分鐘 T + 2 分鐘休息）+ 6 分鐘 T", "2 x (15 min T + 3 min rest) + 2 x (12 min T + 2 min rest) + 6 min T", "60 分鐘"),
  t("T-E4", 163, null, "3 x（20 分鐘 T + 4 分鐘休息）", "3 x (20 min T + 4 min rest)", "60 分鐘"),

  i("I-A1", 0, 48, "5-6 x（2 分鐘 I + 1 分鐘慢跑）", "5-6 x (2 min I + 1 min jog)", "15-18 分鐘"),
  i("I-A2", 0, 48, "4 x（3 分鐘 I + 2 分鐘慢跑）", "4 x (3 min I + 2 min jog)", "20 分鐘"),
  i("I-A3", 0, 48, "3 x（4 分鐘 I + 3 分鐘慢跑）", "3 x (4 min I + 3 min jog)", "21 分鐘"),
  i("I-A4", 0, 48, "4-5 x（800 公尺 I 配速 + 2 分鐘慢跑）", "4-5 x (800 m I + 2 min jog)", "20-25 分鐘"),
  i("I-B1", 48, 64, "7-8 x（2 分鐘 I + 1 分鐘慢跑）", "7-8 x (2 min I + 1 min jog)", "21-24 分鐘"),
  i("I-B2", 48, 64, "5 x（3 分鐘 I + 2 分鐘慢跑）", "5 x (3 min I + 2 min jog)", "25 分鐘"),
  i("I-B3", 48, 64, "4 x（4 分鐘 I + 3 分鐘慢跑）", "4 x (4 min I + 3 min jog)", "28 分鐘"),
  i("I-B4", 48, 64, "5-6 x（800 公尺 I 配速 + 2 分鐘慢跑）", "5-6 x (800 m I + 2 min jog)", "25-30 分鐘"),
  i("I-B5", 48, 64, "4-5 x（1,000 公尺 I 配速 + 3 分鐘慢跑）", "4-5 x (1,000 m I + 3 min jog)", "26-33 分鐘"),
  i("I-C1", 64, 74, "6 x（800 公尺 I 配速 + 2 分鐘慢跑）", "6 x (800 m I + 2 min jog)", "27 分鐘"),
  i("I-C2", 64, 74, "6 x（3 分鐘 I + 2 分鐘慢跑）", "6 x (3 min I + 2 min jog)", "30 分鐘"),
  i("I-C3", 64, 74, "5 x（1,000 公尺 I 配速 + 3 分鐘慢跑）", "5 x (1,000 m I + 3 min jog)", "33 分鐘"),
  i("I-C4", 64, 74, "4-5 x（1,200 公尺 I 配速 + 3 分鐘慢跑）", "4-5 x (1,200 m I + 3 min jog)", "28-35 分鐘"),
  i("I-C5", 64, 74, "3-4 x（5 分鐘 I + 4 分鐘慢跑）", "3-4 x (5 min I + 4 min jog)", "27-36 分鐘"),
  i("I-D1", 74, 90, "5-6 x（1,000 公尺 I 配速 + 3 分鐘慢跑）", "5-6 x (1,000 m I + 3 min jog)", "33-39 分鐘"),
  i("I-D2", 74, 90, "4-5 x（1,200 公尺 I 配速 + 3 分鐘慢跑）；或 5 x（4 分鐘 I + 3 分鐘慢跑）", "4-5 x (1,200 m I + 3 min jog); or 5 x (4 min I + 3 min jog)", "28-35 分鐘"),
  i("I-D3", 74, 90, "4 x（1,600 公尺 I 配速 + 4 分鐘慢跑）；或 4 x（5 分鐘 I + 4 分鐘慢跑）", "4 x (1,600 m I + 4 min jog); or 4 x (5 min I + 4 min jog)", "36 分鐘"),
  i("I-D4", 74, 90, "5 x（4 分鐘 I + 3 分鐘慢跑）", "5 x (4 min I + 3 min jog)", "35 分鐘"),
  i("I-D5", 74, 90, "7 x（3 分鐘 I + 2 分鐘慢跑）", "7 x (3 min I + 2 min jog)", "35 分鐘"),
  i("I-D6", 74, 90, "10 x（2 分鐘 I + 1 分鐘慢跑）", "10 x (2 min I + 1 min jog)", "30 分鐘"),
  i("I-E1", 90, 114, "6-8 x（1,000 公尺 I 配速 + 3 分鐘慢跑）", "6-8 x (1,000 m I + 3 min jog)", "39-52 分鐘"),
  i("I-E2", 90, 114, "5-6 x（1,200 公尺 I 配速 + 3 分鐘慢跑）", "5-6 x (1,200 m I + 3 min jog)", "35-42 分鐘"),
  i("I-E3", 90, 114, "5 x（5 分鐘 I + 4 分鐘慢跑）", "5 x (5 min I + 4 min jog)", "45 分鐘"),
  i("I-E4", 90, 114, "4 x（3 分鐘 I + 2 分鐘慢跑）+ 4 x（2 分鐘 I + 1 分鐘慢跑）", "4 x (3 min I + 2 min jog) + 4 x (2 min I + 1 min jog)", "32 分鐘"),
  i("I-E5", 90, 114, "3 x（3 分鐘 I + 2 分鐘慢跑）+ 4 x（2 分鐘 I + 1 分鐘慢跑）+ 5 x（1 分鐘 I + 30 秒慢跑）", "3 x (3 min I + 2 min jog) + 4 x (2 min I + 1 min jog) + 5 x (1 min I + 30 sec jog)", "35 分鐘"),
  i("I-F1", 114, null, "7-10 x（1,000 公尺 I 配速 + 3 分鐘慢跑）", "7-10 x (1,000 m I + 3 min jog)", "45-65 分鐘"),
  i("I-F2", 114, null, "3 x（5 分鐘 I + 4 分鐘慢跑）+ 4 x（1,000 公尺 I 配速 + 3 分鐘慢跑）", "3 x (5 min I + 4 min jog) + 4 x (1,000 m I + 3 min jog)", "54 分鐘"),
  i("I-F3", 114, null, "6-8 x（4 分鐘 I + 3 分鐘慢跑）；或 6-8 x（1,200 公尺 I 配速 + 3 分鐘慢跑）", "6-8 x (4 min I + 3 min jog); or 6-8 x (1,200 m I + 3 min jog)", "42-56 分鐘"),
  i("I-F4", 114, null, "5-6 x（5 分鐘 I + 4 分鐘慢跑）；或 5-6 x（1,600 公尺 I 配速 + 4 分鐘慢跑）", "5-6 x (5 min I + 4 min jog); or 5-6 x (1,600 m I + 4 min jog)", "45-54 分鐘"),
  i("I-F5", 114, null, "2 x（5 分鐘 I + 4 分鐘慢跑）+ 3 x（3 分鐘 I + 3 分鐘慢跑）+ 4 x（2 分鐘 I + 1 分鐘慢跑）", "2 x (5 min I + 4 min jog) + 3 x (3 min I + 3 min jog) + 4 x (2 min I + 1 min jog)", "48 分鐘"),
  i("I-F6", 114, null, "5 x（2 分鐘 I + 1 分鐘慢跑）+ 8 x（1 分鐘 I + 30 秒慢跑）+ 12 x（30 秒 I + 30 秒慢跑）", "5 x (2 min I + 1 min jog) + 8 x (1 min I + 30 sec jog) + 12 x (30 sec I + 30 sec jog)", "39 分鐘"),

  r("R-A1", 0, 50, "8 x（200 公尺 R + 200 公尺慢跑）", "8 x (200 m R + 200 m jog)", "16 分鐘"),
  r("R-A2", 0, 50, "2 x（200 公尺 R + 200 公尺慢跑 + 200 公尺 R + 400 公尺慢跑 + 400 公尺 R + 200 公尺慢跑）", "2 x (200 m R + 200 m jog + 200 m R + 400 m jog + 400 m R + 200 m jog)", "16 分鐘"),
  r("R-A3", 0, 50, "2 x（200 公尺 R + 200 公尺慢跑）+ 2 x（400 公尺 R + 400 公尺慢跑）+ 2 x（200 公尺 R + 200 公尺慢跑）", "2 x (200 m R + 200 m jog) + 2 x (400 m R + 400 m jog) + 2 x (200 m R + 200 m jog)", "16 分鐘"),
  r("R-A4", 0, 50, "4 x（300 公尺 R + 300 公尺慢跑）+ 1 x 400 公尺 R", "4 x (300 m R + 300 m jog) + 1 x 400 m R", "13 分鐘"),
  r("R-A5", 0, 50, "4 x（400 公尺 R + 400 公尺慢跑）", "4 x (400 m R + 400 m jog)", "16 分鐘"),
  r("R-B1", 50, 66, "2 x {6 x（200 公尺 R + 200 公尺慢跑）+ 400 公尺慢跑}", "2 x {6 x (200 m R + 200 m jog) + 400 m jog}", "27 分鐘"),
  r("R-B2", 50, 66, "3 x（200 公尺 R + 200 公尺慢跑 + 200 公尺 R + 400 公尺慢跑 + 400 公尺 R + 200 公尺慢跑）", "3 x (200 m R + 200 m jog + 200 m R + 400 m jog + 400 m R + 200 m jog)", "24 分鐘"),
  r("R-B3", 50, 66, "4 x（200 公尺 R + 200 公尺慢跑）+ 2 x（400 公尺 R + 400 公尺慢跑）+ 4 x（200 公尺 R + 200 公尺慢跑）", "4 x (200 m R + 200 m jog) + 2 x (400 m R + 400 m jog) + 4 x (200 m R + 200 m jog)", "24 分鐘"),
  r("R-B4", 50, 66, "6 x（400 公尺 R + 400 公尺慢跑）", "6 x (400 m R + 400 m jog)", "24 分鐘"),
  r("R-B5", 50, 66, "2 x（200 公尺 R + 200 公尺慢跑）+ 2 x（600 公尺 R + 600 公尺慢跑）+ 2 x（400 公尺 R + 400 公尺慢跑）", "2 x (200 m R + 200 m jog) + 2 x (600 m R + 600 m jog) + 2 x (400 m R + 400 m jog)", "24 分鐘"),
  r("R-C1", 66, 82, "2 x {8 x（200 公尺 R + 200 公尺慢跑）+ 800 公尺慢跑}", "2 x {8 x (200 m R + 200 m jog) + 800 m jog}", "37 分鐘"),
  r("R-C2", 66, 82, "4 x（200 公尺 R + 200 公尺慢跑 + 200 公尺 R + 400 公尺慢跑 + 400 公尺 R + 200 公尺慢跑）", "4 x (200 m R + 200 m jog + 200 m R + 400 m jog + 400 m R + 200 m jog)", "32 分鐘"),
  r("R-C3", 66, 82, "4 x（200 公尺 R + 200 公尺慢跑）+ 4 x（400 公尺 R + 400 公尺慢跑）+ 4 x（200 公尺 R + 200 公尺慢跑）", "4 x (200 m R + 200 m jog) + 4 x (400 m R + 400 m jog) + 4 x (200 m R + 200 m jog)", "32 分鐘"),
  r("R-C4", 66, 82, "4 x（400 公尺 R + 400 公尺慢跑）+ 8 x（200 公尺 R + 200 公尺慢跑）", "4 x (400 m R + 400 m jog) + 8 x (200 m R + 200 m jog)", "32 分鐘"),
  r("R-C5", 66, 82, "8 x（400 公尺 R + 400 公尺慢跑）", "8 x (400 m R + 400 m jog)", "32 分鐘"),
  r("R-C6", 66, 82, "2 x（200 公尺 R + 200 公尺慢跑）+ 2 x（600 公尺 R + 600 公尺慢跑）+ 4 x（400 公尺 R + 400 公尺慢跑）", "2 x (200 m R + 200 m jog) + 2 x (600 m R + 600 m jog) + 4 x (400 m R + 400 m jog)", "32 分鐘"),
  r("R-D1", 82, 98, "2 x {10 x（200 公尺 R + 200 公尺慢跑）+ 800 公尺慢跑}", "2 x {10 x (200 m R + 200 m jog) + 800 m jog}", "45 分鐘"),
  r("R-D2", 82, 98, "5 x（200 公尺 R + 200 公尺慢跑 + 200 公尺 R + 400 公尺慢跑 + 400 公尺 R + 200 公尺慢跑）", "5 x (200 m R + 200 m jog + 200 m R + 400 m jog + 400 m R + 200 m jog)", "40 分鐘"),
  r("R-D3", 82, 98, "6 x（200 公尺 R + 200 公尺慢跑）+ 6 x（400 公尺 R + 400 公尺慢跑）+ 2 x（200 公尺 R + 200 公尺慢跑）", "6 x (200 m R + 200 m jog) + 6 x (400 m R + 400 m jog) + 2 x (200 m R + 200 m jog)", "40 分鐘"),
  r("R-D4", 82, 98, "6 x（400 公尺 R + 400 公尺慢跑）+ 8 x（200 公尺 R + 200 公尺慢跑）", "6 x (400 m R + 400 m jog) + 8 x (200 m R + 200 m jog)", "40 分鐘"),
  r("R-D5", 82, 98, "2 x（200 公尺 R + 200 公尺慢跑）+ 8 x（400 公尺 R + 400 公尺慢跑）+ 2 x（200 公尺 R + 200 公尺慢跑）", "2 x (200 m R + 200 m jog) + 8 x (400 m R + 400 m jog) + 2 x (200 m R + 200 m jog)", "40 分鐘"),
  r("R-D6", 82, 98, "10 x（400 公尺 R + 400 公尺慢跑）", "10 x (400 m R + 400 m jog)", "40 分鐘"),
  r("R-D7", 82, 98, "2 x（200 公尺 R + 200 公尺慢跑）+ 4 x（600 公尺 R + 600 公尺慢跑）+ 3 x（400 公尺 R + 400 公尺慢跑）", "2 x (200 m R + 200 m jog) + 4 x (600 m R + 600 m jog) + 3 x (400 m R + 400 m jog)", "40 分鐘"),
  r("R-D8", 82, 98, "3 x（200 公尺 R + 200 公尺慢跑）+ 5 x（600 公尺 R + 600 公尺慢跑）+ 2 x（200 公尺 R + 200 公尺慢跑）", "3 x (200 m R + 200 m jog) + 5 x (600 m R + 600 m jog) + 2 x (200 m R + 200 m jog)", "40 分鐘"),
  r("R-D9", 82, 98, "2 x（200 公尺 R + 400 公尺慢跑）+ 3 x {800 公尺 R + 400 公尺慢跑 + 2 x（200 公尺 R + 400 公尺慢跑）}", "2 x (200 m R + 400 m jog) + 3 x {800 m R + 400 m jog + 2 x (200 m R + 400 m jog)}", "40 分鐘"),
  r("R-D10", 82, 98, "2 x（200 公尺 R + 200 公尺慢跑）+ 2 x（800 公尺 R + 800 公尺慢跑）+ 2 x（600 公尺 R + 600 公尺慢跑）+ 2 x（400 公尺 R + 400 公尺慢跑）", "2 x (200 m R + 200 m jog) + 2 x (800 m R + 800 m jog) + 2 x (600 m R + 600 m jog) + 2 x (400 m R + 400 m jog)", "42 分鐘"),
  r("R-D11", 82, 98, "2 x（200 公尺 R + 400 公尺慢跑）+ 3 x（800 公尺 R + 800 公尺慢跑）+ 3 x（400 公尺 R + 400 公尺慢跑）", "2 x (200 m R + 400 m jog) + 3 x (800 m R + 800 m jog) + 3 x (400 m R + 400 m jog)", "43 分鐘"),
  r("R-D12", 82, 98, "5 x（800 公尺 R + 800 公尺慢跑）", "5 x (800 m R + 800 m jog)", "40 分鐘"),
  r("R-E1", 98, 122, "3 x {8 x（200 公尺 R + 200 公尺慢跑）+ 400-800 公尺慢跑}", "3 x {8 x (200 m R + 200 m jog) + 400-800 m jog}", "49 分鐘"),
  r("R-E2", 98, 122, "6 x（200 公尺 R + 200 公尺慢跑 + 200 公尺 R + 400 公尺慢跑 + 400 公尺 R + 200 公尺慢跑）", "6 x (200 m R + 200 m jog + 200 m R + 400 m jog + 400 m R + 200 m jog)", "48 分鐘"),
  r("R-E3", 98, 122, "4 x（200 公尺 R + 200 公尺慢跑）+ 8 x（400 公尺 R + 400 公尺慢跑）+ 4 x（200 公尺 R + 200 公尺慢跑）", "4 x (200 m R + 200 m jog) + 8 x (400 m R + 400 m jog) + 4 x (200 m R + 200 m jog)", "48 分鐘"),
  r("R-E4", 98, 122, "8 x（400 公尺 R + 400 公尺慢跑）+ 8 x（200 公尺 R + 200 公尺慢跑）", "8 x (400 m R + 400 m jog) + 8 x (200 m R + 200 m jog)", "48 分鐘"),
  r("R-E5", 98, 122, "4 x（600 公尺 R + 600 公尺慢跑）+ 4 x（400 公尺 R + 400 公尺慢跑）+ 4 x（200 公尺 R + 200 公尺慢跑）", "4 x (600 m R + 600 m jog) + 4 x (400 m R + 400 m jog) + 4 x (200 m R + 200 m jog)", "52 分鐘"),
  r("R-E6", 98, 122, "3 x（600 公尺 R + 600 公尺慢跑）+ 3 x（800 公尺 R + 800 公尺慢跑）+ 3 x（200 公尺 R + 200 公尺慢跑）", "3 x (600 m R + 600 m jog) + 3 x (800 m R + 800 m jog) + 3 x (200 m R + 200 m jog)", "51 分鐘"),
  r("R-E7", 98, 122, "2 x（800 公尺 R + 800 公尺慢跑）+ 3 x（600 公尺 R + 600 公尺慢跑）+ 2 x（400 公尺 R + 400 公尺慢跑）+ 3 x（200 公尺 R + 200 公尺慢跑）", "2 x (800 m R + 800 m jog) + 3 x (600 m R + 600 m jog) + 2 x (400 m R + 400 m jog) + 3 x (200 m R + 200 m jog)", "51 分鐘"),
  r("R-E8", 98, 122, "4 x（200 公尺 R + 200 公尺慢跑）+ 5 x（800 公尺 R + 800 公尺慢跑）", "4 x (200 m R + 200 m jog) + 5 x (800 m R + 800 m jog)", "48 分鐘"),
  r("R-E9", 98, 122, "2 x（800 公尺 R + 800 公尺慢跑）+ 4 x（400 公尺 R + 400 公尺慢跑）+ 8 x（200 公尺 R + 200 公尺慢跑）", "2 x (800 m R + 800 m jog) + 4 x (400 m R + 400 m jog) + 8 x (200 m R + 200 m jog)", "48 分鐘"),
  r("R-F1", 122, null, "4 x（200 公尺 R + 200 公尺慢跑）+ 4 x（400 公尺 R + 400 公尺慢跑）+ 4 x（800 公尺 R + 800 公尺慢跑）+ 4 x（200 公尺 R + 200 公尺慢跑）", "4 x (200 m R + 200 m jog) + 4 x (400 m R + 400 m jog) + 4 x (800 m R + 800 m jog) + 4 x (200 m R + 200 m jog)", "62 分鐘"),
  r("R-F2", 122, null, "2 x（200 公尺 R + 200 公尺慢跑）+ 2 x（800 公尺 R + 800 公尺慢跑）+ 2 x（200 公尺 R + 200 公尺慢跑）+ 4 x（400 公尺 R + 400 公尺慢跑）+ 2 x（200 公尺 R + 200 公尺慢跑）+ 2 x（800 公尺 R + 800 公尺慢跑）+ 2 x（200 公尺 R + 200 公尺慢跑）", "2 x (200 m R + 200 m jog) + 2 x (800 m R + 800 m jog) + 2 x (200 m R + 200 m jog) + 4 x (400 m R + 400 m jog) + 2 x (200 m R + 200 m jog) + 2 x (800 m R + 800 m jog) + 2 x (200 m R + 200 m jog)", "64 分鐘"),
  r("R-F3", 122, null, "2 x（200 公尺 R + 200 公尺慢跑）+ 3 x（800 公尺 R + 800 公尺慢跑）+ 4 x（600 公尺 R + 600 公尺慢跑）+ 2 x（400 公尺 R + 400 公尺慢跑）", "2 x (200 m R + 200 m jog) + 3 x (800 m R + 800 m jog) + 4 x (600 m R + 600 m jog) + 2 x (400 m R + 400 m jog)", "64 分鐘"),
  r("R-F4", 122, null, "2 x（800 公尺 R + 800 公尺慢跑）+ 3 x（600 公尺 R + 600 公尺慢跑）+ 4 x（400 公尺 R + 400 公尺慢跑）+ 5 x（200 公尺 R + 200 公尺慢跑）", "2 x (800 m R + 800 m jog) + 3 x (600 m R + 600 m jog) + 4 x (400 m R + 400 m jog) + 5 x (200 m R + 200 m jog)", "63 分鐘"),
  r("R-F5", 122, null, "4 x {4 x（400 公尺 R + 400 公尺慢跑）+ 800 公尺慢跑}", "4 x {4 x (400 m R + 400 m jog) + 800 m jog}", "79 分鐘"),
  r("R-F6", 122, null, "4 x {8 x（200 公尺 R + 200 公尺慢跑）+ 400 公尺慢跑}", "4 x {8 x (200 m R + 200 m jog) + 400 m jog}", "74 分鐘")
]);

export function calculatePaceModel(input = {}) {
  const vdot = clamp(Number(input.vdot ?? 45), 30, 85);
  const unitSystem = normalizeUnitSystem(input.unitSystem);
  const weeklyMileageMax = unitSystem === UnitSystem.IMPERIAL ? 112 : 180;
  const weeklyMileage = clamp(Number(input.weeklyMileage ?? 55), 0, weeklyMileageMax);
  const weeklyMileageKm = roundTo(clamp(toKilometers(weeklyMileage, unitSystem), 0, 180), 1);
  const targetRace = normalizeTargetRace(input.targetRace);
  const trainingCycle = normalizeTrainingCycle(input.trainingCycle);
  const halfMarathonWeek = normalizeHalfMarathonWeek(input.halfMarathonWeek);
  const marathonPhaseWeek = normalizeMarathonPhaseWeek(input.marathonPhaseWeek);
  const temperatureC = clamp(Number(input.temperatureC ?? 22), -5, 45);
  const humidity = clamp(Number(input.humidity ?? 60), 0, 100);
  const heatAdjustment = calculateHeatAdjustment(temperatureC, humidity, vdot);
  const mileageClass = getMileageClass(weeklyMileageKm);
  const zones = zoneDefinitions.map((zone) => {
    const heatMultiplier =
      zone.id === PaceZone.REPETITION ? 1 : heatAdjustment.multiplier;
    return buildZonePace(zone, vdot, heatMultiplier, unitSystem);
  });

  const weeklySchedule = generateWeeklySchedule({
    targetRace,
    trainingCycle,
    halfMarathonWeek,
    marathonPhaseWeek,
    weeklyMileageKm,
    unitSystem,
    zones
  });
  const marathonPlan = targetRace === TargetRace.MARATHON
    ? getMarathonWeekPlan(trainingCycle, marathonPhaseWeek, weeklyMileageKm)
    : null;
  const taperRecommendation = getTaperRecommendation(
    targetRace,
    trainingCycle,
    marathonPlan
  );

  return {
    vdot,
    weeklyMileage,
    weeklyMileageKm,
    unitSystem,
    targetRace,
    trainingCycle,
    halfMarathonWeek,
    marathonPhaseWeek,
    temperatureC,
    humidity,
    heatAdjustment,
    mileageClass,
    workoutExamples: getWorkoutExamplesForMileage(
      weeklyMileageKm,
      heatAdjustment,
      vdot
    ),
    weeklySchedule,
    marathonPlan,
    taperRecommendation,
    zones
  };
}

export function toKilometers(distance, unitSystem = UnitSystem.METRIC) {
  return normalizeUnitSystem(unitSystem) === UnitSystem.IMPERIAL
    ? Number(distance) * KM_PER_MILE
    : Number(distance);
}

export function fromKilometers(distanceKm, unitSystem = UnitSystem.METRIC) {
  return normalizeUnitSystem(unitSystem) === UnitSystem.IMPERIAL
    ? Number(distanceKm) / KM_PER_MILE
    : Number(distanceKm);
}

export function getMileageClass(weeklyMileage) {
  const mileage = Number(weeklyMileage);
  return (
    mileageClasses.find(
      (item) => mileage >= item.min && (item.max === null || mileage < item.max)
    ) ?? mileageClasses[0]
  );
}

export function calculateHeatAdjustment(temperatureC, humidity, vdot = 45) {
  const temperature = clamp(Number(temperatureC), -5, 45);
  const relativeHumidity = clamp(Number(humidity), 0, 100);
  const heatIndex = calculateHeatIndex(temperature, relativeHumidity);
  const logSpeedAdjust = interpolateRunningWritingsLogSpeedAdjust(
    temperature,
    relativeHumidity
  );
  const speedRatio = Math.exp(logSpeedAdjust);
  const speedLoss = clamp(1 - speedRatio, 0, 0.5);
  const multiplier = 1 / speedRatio;
  const percentage = multiplier - 1;
  const recoveryPercentage = getHeatRecoveryPercentage(heatIndex);

  return {
    heatIndex: roundTo(heatIndex, 1),
    logSpeedAdjust: roundTo(logSpeedAdjust, 4),
    speedLossPercentage: roundTo(speedLoss * 100, 1),
    percentage: roundTo(percentage * 100, 1),
    multiplier,
    recoveryPercentage: roundTo(recoveryPercentage * 100, 1),
    recoveryMultiplier: 1 + recoveryPercentage
  };
}

export function calculateVdotFromRaceResult(distanceMeters, timeSeconds) {
  const distance = Number(distanceMeters);
  const seconds = Number(timeSeconds);

  if (!Number.isFinite(distance) || !Number.isFinite(seconds) || distance <= 0 || seconds <= 0) {
    return null;
  }

  const minutes = seconds / 60;
  const metersPerMinute = distance / minutes;
  const oxygenCost =
    -4.6 + 0.182258 * metersPerMinute + 0.000104 * metersPerMinute ** 2;
  const effortFraction =
    0.8 +
    0.1894393 * Math.exp(-0.012778 * minutes) +
    0.2989558 * Math.exp(-0.1932605 * minutes);

  return roundTo(oxygenCost / effortFraction, 1);
}

function calculateHeatIndex(temperatureC, humidity) {
  const temperatureF = temperatureC * 1.8 + 32;
  const relativeHumidity = clamp(Number(humidity), 0, 100);
  const simpleHeatIndexF =
    0.5 *
    (temperatureF +
      61 +
      (temperatureF - 68) * 1.2 +
      relativeHumidity * 0.094);

  if (simpleHeatIndexF < 80) {
    return (simpleHeatIndexF - 32) / 1.8;
  }

  let heatIndexF =
    -42.379 +
    2.04901523 * temperatureF +
    10.14333127 * relativeHumidity -
    0.22475541 * temperatureF * relativeHumidity -
    0.00683783 * temperatureF ** 2 -
    0.05481717 * relativeHumidity ** 2 +
    0.00122874 * temperatureF ** 2 * relativeHumidity +
    0.00085282 * temperatureF * relativeHumidity ** 2 -
    0.00000199 * temperatureF ** 2 * relativeHumidity ** 2;

  if (relativeHumidity < 13 && temperatureF >= 80 && temperatureF <= 112) {
    heatIndexF -=
      ((13 - relativeHumidity) / 4) *
      Math.sqrt((17 - Math.abs(temperatureF - 95)) / 17);
  } else if (
    relativeHumidity > 85 &&
    temperatureF >= 80 &&
    temperatureF <= 87
  ) {
    heatIndexF += ((relativeHumidity - 85) / 10) * ((87 - temperatureF) / 5);
  }

  return (heatIndexF - 32) / 1.8;
}

function interpolateRunningWritingsLogSpeedAdjust(temperatureC, humidityPct) {
  const { airTempC, humidityPct: modelHumidity, logSpeedAdjust } =
    runningWritingsHeatHumidityModel;
  const temperatures = [...new Set(airTempC)].sort((a, b) => a - b);
  const humidities = [...new Set(modelHumidity)].sort((a, b) => a - b);
  const [x0, x1, tx] = bracketForInterpolation(temperatures, temperatureC);
  const [y0, y1, ty] = bracketForInterpolation(humidities, humidityPct);
  const z00 = getRunningWritingsGridValue(x0, y0);
  const z10 = getRunningWritingsGridValue(x1, y0);
  const z01 = getRunningWritingsGridValue(x0, y1);
  const z11 = getRunningWritingsGridValue(x1, y1);
  const lower = z00 * (1 - tx) + z10 * tx;
  const upper = z01 * (1 - tx) + z11 * tx;
  return upper * ty + lower * (1 - ty);
}

function bracketForInterpolation(values, rawValue) {
  const value = clamp(Number(rawValue), values[0], values[values.length - 1]);

  if (value <= values[0]) return [values[0], values[1], 0];
  if (value >= values[values.length - 1]) {
    return [values[values.length - 2], values[values.length - 1], 1];
  }

  for (let index = 1; index < values.length; index += 1) {
    if (value <= values[index]) {
      const lower = values[index - 1];
      const upper = values[index];
      return [lower, upper, (value - lower) / (upper - lower)];
    }
  }

  return [values[values.length - 2], values[values.length - 1], 1];
}

function getRunningWritingsGridValue(temperatureC, humidityPct) {
  const { airTempC, humidityPct: modelHumidity, logSpeedAdjust } =
    runningWritingsHeatHumidityModel;
  const index = airTempC.findIndex(
    (temperature, itemIndex) =>
      temperature === temperatureC && modelHumidity[itemIndex] === humidityPct
  );

  if (index === -1) {
    throw new Error(
      `Missing Running Writings heat model point ${temperatureC}C/${humidityPct}%`
    );
  }

  return logSpeedAdjust[index];
}

function getHeatRecoveryPercentage(heatIndexC) {
  if (heatIndexC < 24) return 0;
  if (heatIndexC < 29) return 0.1;
  if (heatIndexC < 35) return 0.15 + ((heatIndexC - 29) / 6) * 0.1;
  return 0.25;
}

export function getWorkoutExamplesForMileage(
  weeklyMileage,
  heatAdjustment = 1,
  vdot = 45
) {
  const mileage = Number(weeklyMileage);
  const recoveryMultiplier =
    typeof heatAdjustment === "object"
      ? heatAdjustment.recoveryMultiplier
      : 1 + clamp((Number(heatAdjustment) - 1) * 1.5, 0, 0.25);
  const recoveryPercentage = roundTo((recoveryMultiplier - 1) * 100, 1);

  return workoutCatalog
    .filter((example) => isMileageEligible(example, mileage))
    .map((example) => ({
      ...example,
      recoveryLabel: example.recoveryLabel,
      heatRecoveryLabel: extendRecoveryLabel(
        example.recoveryLabel,
        recoveryMultiplier,
        "zh"
      ),
      enHeatRecoveryLabel: extendRecoveryLabel(
        example.enRecoveryLabel,
        recoveryMultiplier,
        "en"
      ),
      recoveryExtensionPercentage: recoveryPercentage,
      zhZone: zoneDefinitions.find((zone) => zone.id === example.zone)?.zhName,
      enZone: zoneDefinitions.find((zone) => zone.id === example.zone)?.enName
    }));
}

export function generateWeeklySchedule({
  targetRace = TargetRace.FIVE_TEN_K,
  trainingCycle = TrainingCycle.PHASE_II,
  halfMarathonWeek = HalfMarathonWeek.ODD,
  marathonPhaseWeek = 1,
  weeklyMileageKm = 55,
  unitSystem = UnitSystem.METRIC,
  zones = []
} = {}) {
  const race = normalizeTargetRace(targetRace);
  const cycle = normalizeTrainingCycle(trainingCycle);
  const weekParity = normalizeHalfMarathonWeek(halfMarathonWeek);
  const phaseWeek = normalizeMarathonPhaseWeek(marathonPhaseWeek);
  const mileage = roundTo(clamp(Number(weeklyMileageKm), 0, 180), 1);
  const zoneById = Object.fromEntries(zones.map((zone) => [zone.id, zone]));

  if (race === TargetRace.MARATHON) {
    return generateMarathonWeeklySchedule({
      cycle,
      phaseWeek,
      peakMileageKm: mileage,
      unitSystem,
      zoneById
    }).map((day) => addZonePace(day, zoneById));
  }

  const mileageClass = getMileageClass(mileage);
  const qualityCount = mileage >= 32 ? 2 : mileage > 0 ? 1 : 0;
  const longRunDistanceKm = Math.min(
    roundTo(mileage * 0.28, 1),
    Math.floor(mileage * 0.3 * 10) / 10
  );
  const qualityWorkouts = selectWeeklyQualityWorkouts(
    race,
    cycle,
    qualityCount,
    mileage,
    weekParity
  );
  const qualityDistancesKm = allocateQualityMileage(
    mileage,
    mileageClass.id,
    qualityWorkouts.length
  );
  const easyMileageKm = roundTo(
    Math.max(0, mileage - longRunDistanceKm - sum(qualityDistancesKm)),
    1
  );
  const easyDayKeys = qualityWorkouts.length >= 2
    ? ["mon", "wed", "fri", "sat"]
    : ["mon", "wed", "thu", "fri", "sat"];
  const easyWeights = qualityWorkouts.length >= 2
    ? [0.85, 1, 0.8, 0.85]
    : [0.85, 1, 1, 0.8, 0.85];
  const allocatedEasyDistances = allocateDistanceByWeight(easyMileageKm, easyWeights);
  const easyDistances = Object.fromEntries(
    easyDayKeys.map((key, index) => [
      key,
      allocatedEasyDistances[index]
    ])
  );

  return buildMileageBalancedWeek({
    race,
    cycle,
    zoneById,
    unitSystem,
    weeklyMileageKm: mileage,
    longRunDistanceKm,
    qualityWorkouts,
    qualityDistancesKm,
    easyDistances
  }).map((day) => addZonePace(day, zoneById));
}

const marathonMileageFractions = Object.freeze({
  [TrainingCycle.PHASE_I]: [0.8, 0.8, 0.85, 0.85, 0.9, 0.9],
  [TrainingCycle.PHASE_II]: [0.8, 0.8, 0.9, 0.9, 0.9, 0.9],
  [TrainingCycle.PHASE_III]: [1, 0.9, 1, 1, 0.9, 0.9],
  [TrainingCycle.PHASE_IV]: [1, 1, 0.9, 0.9, 0.9, 0.75]
});

export function getMarathonTrainingLimits(weeklyMileageKm) {
  const mileage = Math.max(0, Number(weeklyMileageKm) || 0);
  return {
    T: roundTo(Math.min(mileage * 0.1, 24), 1),
    I: roundTo(Math.min(mileage * 0.08, 10), 1),
    R: roundTo(Math.min(mileage * 0.05, 8), 1),
    M: roundTo(Math.min(mileage * (mileage > 64 ? 0.2 : 0.3), 29), 1)
  };
}

function getMarathonWeekPlan(cycle, phaseWeek, peakMileageKm) {
  const normalizedCycle = normalizeTrainingCycle(cycle);
  const normalizedWeek = normalizeMarathonPhaseWeek(phaseWeek);
  const fraction = marathonMileageFractions[normalizedCycle][normalizedWeek - 1];
  const plannedWeeklyMileageKm = roundTo(
    Math.max(0, Number(peakMileageKm) || 0) * fraction,
    1
  );

  return {
    phaseWeek: normalizedWeek,
    fraction,
    plannedWeeklyMileageKm,
    peakWeeklyMileageKm: roundTo(Math.max(0, Number(peakMileageKm) || 0), 1),
    reductionPercentage: Math.round((1 - fraction) * 100),
    isTaper: normalizedCycle === TrainingCycle.PHASE_IV
  };
}

function getTaperRecommendation(targetRace, cycle, marathonPlan) {
  if (cycle !== TrainingCycle.PHASE_IV) return null;

  if (targetRace === TargetRace.MARATHON && marathonPlan) {
    const isRaceWeek = marathonPlan.phaseWeek === MARATHON_PHASE_WEEKS;
    return {
      automatic: true,
      zh: isRaceWeek
        ? `本週是馬拉松比賽週。書中未列單一峰值比例，網站依表內日量保守換算為峰值的 ${Math.round(marathonPlan.fraction * 100)}%。Q1 改為不超過 90 分鐘 E，Q2 保留短量 T，其餘以 E 或休息完成。`
        : `本週依 Daniels 2Q 最後六週採峰值跑量的 ${Math.round(marathonPlan.fraction * 100)}%（減少 ${marathonPlan.reductionPercentage}%），並保留該週的兩堂 Q；主要賽前調整集中在第 6 週。`,
      en: isRaceWeek
        ? `This is marathon race week. The table gives no single peak-mileage fraction, so the planner conservatively estimates ${Math.round(marathonPlan.fraction * 100)}% from its daily volumes. Q1 becomes no more than 90 minutes E, Q2 retains a brief T stimulus, and the remaining days are E running or rest.`
        : `This week follows the final six weeks of the Daniels 2Q plan at ${Math.round(marathonPlan.fraction * 100)}% of peak mileage (${marathonPlan.reductionPercentage}% reduction) while retaining both scheduled Q sessions. The main prerace adjustment is concentrated in week 6.`
    };
  }

  const raceWeekGuidance = {
    [TargetRace.EIGHT_HUNDRED]: {
      zh: "Phase IV 並非整期減量。遇到重要比賽週，只保留一堂時間受限的 T＋短 R，排在賽前 3–4 天；其餘日改為 E 或休息，比賽取代下一堂 Q。",
      en: "Phase IV is not a full-phase taper. For an important race week, keep one time-limited T session with short R work 3-4 days before the race; use E running or rest otherwise, and let the race replace the next Q session."
    },
    [TargetRace.MILE_TO_TWO_MILE]: {
      zh: "Phase IV 並非整期減量。遇到重要比賽週，刪除會妨礙恢復的 Q 課，只保留賽前 3–4 天的一堂短量 T＋R；其餘日以 E 為主，比賽本身視為 Q。",
      en: "Phase IV is not a full-phase taper. For an important race week, remove Q sessions that would impair recovery and keep one short T + R session 3-4 days before the race; run E otherwise, with the race itself counting as Q."
    },
    [TargetRace.FIVE_TEN_K]: {
      zh: "Phase IV 並非整期減量。無比賽週維持原課表；重要週末賽前，長跑縮至最多 90 分鐘，週二做 3×1T（組間 2 分鐘），之後以 E 為主並取消原本的 I 課，比賽取代 Q3。",
      en: "Phase IV is not a full-phase taper. Keep the normal plan in a non-race week; before an important weekend race, shorten the long run to no more than 90 minutes, run 3 x 1T with 2-minute recoveries on Tuesday, then use E running and remove the usual I session, with the race replacing Q3."
    },
    [TargetRace.CROSS_COUNTRY]: {
      zh: "Phase IV 並非整期減量。重要週末賽前，長跑縮至 50–60 分鐘，週二做 3×1T（組間 2 分鐘）再加 4×200R，其餘日以 E 為主，比賽取代下一堂 Q。",
      en: "Phase IV is not a full-phase taper. Before an important weekend race, shorten the long run to 50-60 minutes, run 3 x 1T with 2-minute recoveries plus 4 x 200R on Tuesday, use E running otherwise, and let the race replace the next Q session."
    },
    [TargetRace.ROAD_15K_30K]: {
      zh: "Phase IV 並非整期減量；正常單雙週循環照舊，只有進入比賽前一週才切換。賽前 6 天跑正常 L 的 2/3，賽前 3 天做 3×1T（組間 2 分鐘），其餘日跑 E 或休息，比賽為 Q3。半馬賽後安排 7 個 E 日再恢復循環。",
      en: "Phase IV is not a full-phase taper; keep the normal odd/even cycle until race week. Six days before the race, run two-thirds of the normal L; three days before, run 3 x 1T with 2-minute recoveries; use E running or rest otherwise, with the race as Q3. After a half marathon, use 7 E days before resuming the cycle."
    }
  };

  return {
    automatic: false,
    ...(raceWeekGuidance[targetRace] ?? raceWeekGuidance[TargetRace.FIVE_TEN_K])
  };
}

function generateMarathonWeeklySchedule({
  cycle,
  phaseWeek,
  peakMileageKm,
  unitSystem,
  zoneById
}) {
  const plan = getMarathonWeekPlan(cycle, phaseWeek, peakMileageKm);
  const mileage = plan.plannedWeeklyMileageKm;
  const longRunShareLimit = mileage > 64 ? 0.25 : 0.3;
  const longRunTimeLimitMinutes =
    cycle === TrainingCycle.PHASE_IV && phaseWeek === MARATHON_PHASE_WEEKS
      ? 90
      : 150;
  const easySecondsPerKm = Number(zoneById[PaceZone.EASY]?.adjusted?.slower);
  const timeCapDistanceKm = easySecondsPerKm > 0
    ? (longRunTimeLimitMinutes * 60) / easySecondsPerKm
    : Number.POSITIVE_INFINITY;
  const longRunDistanceKm =
    Math.floor(Math.min(mileage * longRunShareLimit, timeCapDistanceKm) * 10) / 10;
  const q1 = buildMarathonQ1({
    cycle,
    phaseWeek,
    weeklyMileageKm: mileage,
    distanceKm: longRunDistanceKm,
    longRunShareLimit,
    longRunTimeLimitMinutes,
    easySecondsPerKm,
    unitSystem
  });
  const hasMarathonQ2 =
    mileage >= 32 || (cycle === TrainingCycle.PHASE_IV && mileage >= 20);
  const q2 = hasMarathonQ2 && cycle !== TrainingCycle.PHASE_I
    ? buildMarathonQ2({ cycle, phaseWeek, weeklyMileageKm: mileage, unitSystem })
    : null;
  const qualityMileageKm = Number(q2?.plannedDistanceKm ?? 0);
  const easyMileageKm = roundTo(
    Math.max(0, mileage - longRunDistanceKm - qualityMileageKm),
    1
  );
  const easyDayKeys = q2
    ? ["mon", "tue", "thu", "fri", "sat"]
    : ["mon", "tue", "wed", "thu", "fri", "sat"];
  const easyDistances = Object.fromEntries(
    easyDayKeys.map((key, index) => [
      key,
      allocateDistanceByWeight(easyMileageKm, easyDayKeys.map(() => 1))[index]
    ])
  );
  const phaseIStrides = cycle === TrainingCycle.PHASE_I && phaseWeek >= 3;

  return [
    q1,
    buildEasyDistanceDay("Mon", "一", easyDistances.mon ?? 0, unitSystem, {
      recovery: true,
      strides: phaseIStrides || cycle !== TrainingCycle.PHASE_I
    }),
    buildEasyDistanceDay("Tue", "二", easyDistances.tue ?? 0, unitSystem),
    q2 ?? buildEasyDistanceDay("Wed", "三", easyDistances.wed ?? 0, unitSystem, {
      strides: phaseIStrides
    }),
    buildEasyDistanceDay("Thu", "四", easyDistances.thu ?? 0, unitSystem),
    buildEasyDistanceDay("Fri", "五", easyDistances.fri ?? 0, unitSystem, {
      strides: phaseIStrides || cycle !== TrainingCycle.PHASE_I
    }),
    buildEasyDistanceDay("Sat", "六", easyDistances.sat ?? 0, unitSystem, {
      recovery: true
    })
  ];
}

function buildMarathonQ1({
  cycle,
  phaseWeek,
  weeklyMileageKm,
  distanceKm,
  longRunShareLimit,
  longRunTimeLimitMinutes,
  easySecondsPerKm,
  unitSystem
}) {
  const caps = getMarathonTrainingLimits(weeklyMileageKm);
  const mode = getMarathonQ1Mode(cycle, phaseWeek);
  const isMixed = mode === "mixed" || mode === "marathon";
  const includeThreshold = mode === "mixed";
  const isThresholdSession = mode === "threshold";
  const availableQualityKm = Math.max(0, distanceKm - Math.min(4, distanceKm * 0.35));
  const marathonFraction = mode === "marathon"
    ? 0.72
    : 0.48 + Math.min(phaseWeek, 4) * 0.025;
  const thresholdKm = isThresholdSession
    ? roundTo(Math.min(caps.T, distanceKm * 0.3, availableQualityKm * 0.55), 1)
    : isMixed && includeThreshold
      ? roundTo(Math.min(caps.T, distanceKm * 0.08, availableQualityKm * 0.16), 1)
      : 0;
  const marathonKm = isMixed
    ? roundTo(
        Math.min(caps.M, distanceKm * marathonFraction, availableQualityKm - thresholdKm),
        1
      )
    : 0;
  const easyKm = roundTo(Math.max(0, distanceKm - marathonKm - thresholdKm), 1);
  const warmupKm = roundTo(easyKm / 2, 1);
  const cooldownKm = roundTo(Math.max(0, easyKm - warmupKm), 1);
  const distance = formatDistanceValue(distanceKm, unitSystem);
  const predictedMinutes = easySecondsPerKm > 0
    ? roundTo((distanceKm * easySecondsPerKm) / 60, 0)
    : null;
  let zh;
  let en;
  let zone = PaceZone.EASY;
  let paceZoneIds = [PaceZone.EASY];

  if (isThresholdSession && thresholdKm > 0) {
    zone = PaceZone.THRESHOLD;
    paceZoneIds = [PaceZone.EASY, PaceZone.THRESHOLD];
    const bridgeKm = roundTo(Math.min(3, easyKm * 0.3), 1);
    const outerEasyKm = roundTo(Math.max(0, easyKm - bridgeKm), 1);
    const thresholdFirstKm = roundTo(thresholdKm / 2, 1);
    const thresholdSecondKm = roundTo(Math.max(0, thresholdKm - thresholdFirstKm), 1);
    const thresholdWarmupKm = roundTo(outerEasyKm / 2, 1);
    const thresholdCooldownKm = roundTo(
      Math.max(0, outerEasyKm - thresholdWarmupKm),
      1
    );
    zh = `Q1 T 中長課：${formatDistanceValue(thresholdWarmupKm, unitSystem)} E + ${formatDistanceValue(thresholdFirstKm, unitSystem)} T（2 分鐘慢跑）+ ${formatDistanceValue(bridgeKm, unitSystem)} E + ${formatDistanceValue(thresholdSecondKm, unitSystem)} T（1 分鐘慢跑）+ ${formatDistanceValue(thresholdCooldownKm, unitSystem)} E`;
    en = `Q1 T medium-long session: ${formatDistanceValue(thresholdWarmupKm, unitSystem)} E + ${formatDistanceValue(thresholdFirstKm, unitSystem)} T (2 min jog) + ${formatDistanceValue(bridgeKm, unitSystem)} E + ${formatDistanceValue(thresholdSecondKm, unitSystem)} T (1 min jog) + ${formatDistanceValue(thresholdCooldownKm, unitSystem)} E`;
  } else if (isMixed && marathonKm > 0) {
    zone = PaceZone.MARATHON;
    paceZoneIds = includeThreshold && thresholdKm > 0
      ? [PaceZone.EASY, PaceZone.MARATHON, PaceZone.THRESHOLD]
      : [PaceZone.EASY, PaceZone.MARATHON];
    const thresholdZh = thresholdKm > 0
      ? ` + ${formatDistanceValue(thresholdKm, unitSystem)} T（M 後不停下）`
      : "";
    const thresholdEn = thresholdKm > 0
      ? ` + ${formatDistanceValue(thresholdKm, unitSystem)} T without stopping after M`
      : "";
    const sessionNameZh = mode === "marathon" ? "Q1 M 長課" : "Q1 混合長課";
    const sessionNameEn = mode === "marathon" ? "Q1 M long session" : "Q1 mixed long session";
    zh = `${sessionNameZh}：${formatDistanceValue(warmupKm, unitSystem)} E + ${formatDistanceValue(marathonKm, unitSystem)} M${thresholdZh} + ${formatDistanceValue(cooldownKm, unitSystem)} E`;
    en = `${sessionNameEn}: ${formatDistanceValue(warmupKm, unitSystem)} E + ${formatDistanceValue(marathonKm, unitSystem)} M${thresholdEn} + ${formatDistanceValue(cooldownKm, unitSystem)} E`;
  } else {
    const strideNote = cycle === TrainingCycle.PHASE_I && phaseWeek >= 3
      ? "，結尾可加 6–8 次 15–20 秒加速跑，每次恢復 45–60 秒"
      : "";
    const raceWeekLabelZh = mode === "race" ? "Q1 賽前 E 跑" : "Q1 E 長跑";
    const raceWeekLabelEn = mode === "race" ? "Q1 prerace E run" : "Q1 E long run";
    zh = `${raceWeekLabelZh} ${distance}${strideNote}`;
    en = `${raceWeekLabelEn} ${distance}${strideNote ? "; optionally finish with 6-8 × 15-20 sec strides with 45-60 sec recovery" : ""}`;
  }

  return scheduleDay("Sun", "日", zone, zh, en, {
    ...plannedDistanceMetadata(distanceKm, "long"),
    isPrimaryWorkout: true,
    workoutType: `marathon-q1-${mode}`,
    paceZoneIds,
    intensityKm: {
      [PaceZone.MARATHON]: marathonKm,
      [PaceZone.THRESHOLD]: thresholdKm,
      [PaceZone.INTERVAL]: 0,
      [PaceZone.REPETITION]: 0
    },
    longRunLimitPercentage: Math.round(longRunShareLimit * 100),
    longRunTimeLimitMinutes,
    estimatedMaxMinutes: predictedMinutes,
    zhDistanceLabel: `本課總量 ${distance}；不超過週跑量 ${Math.round(longRunShareLimit * 100)}% 與 ${longRunTimeLimitMinutes} 分鐘上限`,
    enDistanceLabel: `Session total ${distance}; capped by ${Math.round(longRunShareLimit * 100)}% of weekly mileage and ${longRunTimeLimitMinutes} minutes`
  });
}

function getMarathonQ1Mode(cycle, phaseWeek) {
  const modes = {
    [TrainingCycle.PHASE_I]: ["easy", "easy", "easy", "easy", "easy", "easy"],
    [TrainingCycle.PHASE_II]: ["mixed", "threshold", "easy", "mixed", "threshold", "easy"],
    [TrainingCycle.PHASE_III]: ["mixed", "threshold", "easy", "mixed", "marathon", "easy"],
    [TrainingCycle.PHASE_IV]: ["marathon", "threshold", "easy", "marathon", "threshold", "race"]
  };
  return modes[cycle]?.[phaseWeek - 1] ?? "easy";
}

function buildMarathonQ2({ cycle, phaseWeek, weeklyMileageKm, unitSystem }) {
  const caps = getMarathonTrainingLimits(weeklyMileageKm);
  const sessionTargetKm = roundTo(Math.min(weeklyMileageKm * 0.18, 18), 1);
  const mode = getMarathonQ2Mode(cycle, phaseWeek);
  let zone;
  let zh;
  let en;
  let intensityKm;
  let paceZoneIds;

  if (mode === "intervalRepetition") {
    zone = PaceZone.INTERVAL;
    const intervalKm = roundTo(Math.min(caps.I, weeklyMileageKm * 0.05), 1);
    const repetitionKm = roundTo(Math.min(caps.R, weeklyMileageKm * 0.02), 1);
    zh = "Q2 I＋R 轉換：6 x 2 分鐘 I，每趟 2 分鐘慢跑；再做 4 x 1 分鐘 R，每趟 2 分鐘慢跑";
    en = "Q2 I + R transition: 6 x 2 min I with 2 min jogs; then 4 x 1 min R with 2 min jogs";
    intensityKm = { M: 0, T: 0, I: intervalKm, R: repetitionKm };
    paceZoneIds = [PaceZone.INTERVAL, PaceZone.REPETITION];
  } else if (mode === "interval") {
    zone = PaceZone.INTERVAL;
    const intervalKm = roundTo(Math.min(caps.I, weeklyMileageKm * 0.06), 1);
    zh = "Q2 I 有氧能力：5 x 3 分鐘 I，每趟 2 分鐘慢跑恢復";
    en = "Q2 aerobic power: 5 x 3 min I with 2 min jog recoveries";
    intensityKm = { M: 0, T: 0, I: intervalKm, R: 0 };
    paceZoneIds = [PaceZone.INTERVAL];
  } else if (mode === "marathon") {
    zone = PaceZone.MARATHON;
    const marathonKm = roundTo(Math.min(caps.M, weeklyMileageKm * 0.15), 1);
    zh = `Q2 M 穩定跑：${formatDistanceValue(marathonKm, unitSystem)} M，前後以 E 熱身與收操`;
    en = `Q2 steady M run: ${formatDistanceValue(marathonKm, unitSystem)} M with E warm-up and cool-down`;
    intensityKm = { M: marathonKm, T: 0, I: 0, R: 0 };
    paceZoneIds = [PaceZone.EASY, PaceZone.MARATHON];
  } else if (mode === "marathonThreshold") {
    zone = PaceZone.MARATHON;
    const thresholdKm = roundTo(Math.min(caps.T, weeklyMileageKm * 0.04), 1);
    const marathonKm = roundTo(Math.min(caps.M, weeklyMileageKm * 0.1), 1);
    zh = `Q2 M＋T 混合：${formatDistanceValue(thresholdKm, unitSystem)} T（2 分鐘慢跑）+ ${formatDistanceValue(marathonKm, unitSystem)} M，前後以 E 完成`;
    en = `Q2 M + T mix: ${formatDistanceValue(thresholdKm, unitSystem)} T (2 min jog) + ${formatDistanceValue(marathonKm, unitSystem)} M, with E running before and after`;
    intensityKm = { M: marathonKm, T: thresholdKm, I: 0, R: 0 };
    paceZoneIds = [PaceZone.EASY, PaceZone.THRESHOLD, PaceZone.MARATHON];
  } else if (mode === "intervalThreshold") {
    zone = PaceZone.INTERVAL;
    const intervalKm = roundTo(Math.min(caps.I, weeklyMileageKm * 0.05), 1);
    const thresholdKm = roundTo(Math.min(caps.T, weeklyMileageKm * 0.02), 1);
    zh = `Q2 I＋T：5 x 3 分鐘 I，每趟 3 分鐘慢跑；最後 ${formatDistanceValue(thresholdKm, unitSystem)} T`;
    en = `Q2 I + T: 5 x 3 min I with 3 min jogs; finish with ${formatDistanceValue(thresholdKm, unitSystem)} T`;
    intensityKm = { M: 0, T: thresholdKm, I: intervalKm, R: 0 };
    paceZoneIds = [PaceZone.INTERVAL, PaceZone.THRESHOLD];
  } else if (mode === "raceThreshold") {
    zone = PaceZone.THRESHOLD;
    const repetitions = Math.max(3, Math.min(5, Math.floor(caps.T / 0.8)));
    const thresholdKm = roundTo(Math.min(caps.T, repetitions * 0.8), 1);
    zh = `Q2 賽前刺激：${repetitions} x 800 公尺 T，每趟 2 分鐘 E 慢跑恢復`;
    en = `Q2 prerace stimulus: ${repetitions} x 800 m T with 2 min E jog recoveries`;
    intensityKm = { M: 0, T: thresholdKm, I: 0, R: 0 };
    paceZoneIds = [PaceZone.THRESHOLD];
  } else {
    zone = PaceZone.THRESHOLD;
    const thresholdKm = roundTo(
      Math.min(caps.T, weeklyMileageKm * 0.07),
      1
    );
    const thresholdRepetitions = Math.max(2, Math.floor(thresholdKm));
    const actualThresholdKm = roundTo(
      Math.min(caps.T, thresholdRepetitions),
      1
    );
    zh = `Q2 T 主課：${thresholdRepetitions} x 1 km T，每趟 1 分鐘慢跑恢復`;
    en = `Q2 threshold session: ${thresholdRepetitions} x 1 km T with 1 min jog recoveries`;
    intensityKm = { M: 0, T: actualThresholdKm, I: 0, R: 0 };
    paceZoneIds = [PaceZone.THRESHOLD];
  }

  const intensityTotalKm = sum(Object.values(intensityKm));
  const distanceKm = roundTo(
    Math.max(intensityTotalKm, Math.min(sessionTargetKm, intensityTotalKm + 5)),
    1
  );
  const distance = formatDistanceValue(distanceKm, unitSystem);

  return scheduleDay("Wed", "三", zone, zh, en, {
    ...plannedDistanceMetadata(distanceKm, "quality"),
    workoutType: `marathon-q2-${mode}`,
    paceZoneIds,
    intensityKm,
    zhDistanceLabel: `本課總量 ${distance}（含 E 熱身、恢復與收操）`,
    enDistanceLabel: `Session total ${distance}, including E warm-up, recovery, and cool-down`
  });
}

function getMarathonQ2Mode(cycle, phaseWeek) {
  const modes = {
    [TrainingCycle.PHASE_II]: [
      "threshold",
      "intervalRepetition",
      "threshold",
      "threshold",
      "interval",
      "threshold"
    ],
    [TrainingCycle.PHASE_III]: [
      "threshold",
      "intervalRepetition",
      "marathon",
      "threshold",
      "interval",
      "marathonThreshold"
    ],
    [TrainingCycle.PHASE_IV]: [
      "threshold",
      "intervalRepetition",
      "intervalThreshold",
      "threshold",
      "marathonThreshold",
      "raceThreshold"
    ]
  };
  return modes[cycle]?.[phaseWeek - 1] ?? "threshold";
}

export function getMarathonSwapCandidates(
  day,
  unitSystem = UnitSystem.METRIC
) {
  const type = day?.workoutType;
  if (typeof type !== "string" || !type.startsWith("marathon-")) return [];
  if (type === "marathon-q1-race") return [];

  const totalKm = roundTo(Math.max(0, Number(day.plannedDistanceKm) || 0), 1);
  const intensity = day.intensityKm ?? {};
  const marathonKm = roundTo(Math.max(0, Number(intensity.M) || 0), 1);
  const thresholdKm = roundTo(Math.max(0, Number(intensity.T) || 0), 1);
  const intervalKm = roundTo(Math.max(0, Number(intensity.I) || 0), 1);
  const repetitionKm = roundTo(Math.max(0, Number(intensity.R) || 0), 1);
  const easyKm = roundTo(
    Math.max(0, totalKm - marathonKm - thresholdKm - intervalKm - repetitionKm),
    1
  );
  const distanceLabel = formatDistanceValue(totalKm, unitSystem);
  const candidate = (suffix, zone, paceZoneIds, zh, en) => ({
    id: `${type}-${suffix}`,
    zone,
    paceZoneIds,
    zh,
    en,
    zhDistanceLabel: `本課總量 ${distanceLabel}；各段距離與恢復如上`,
    enDistanceLabel: `Session total ${distanceLabel}; segment distances and recoveries are listed above`
  });
  const split = (value) => {
    const first = roundTo(value / 2, 1);
    return [first, roundTo(Math.max(0, value - first), 1)];
  };
  const [easyFirstKm, easySecondKm] = split(easyKm);
  const [marathonFirstKm, marathonSecondKm] = split(marathonKm);
  const [thresholdFirstKm, thresholdSecondKm] = split(thresholdKm);
  const d = (value) => formatDistanceValue(value, unitSystem);

  if (type === "marathon-q1-easy") {
    const [firstHalfKm, secondHalfKm] = split(totalKm);
    return [
      candidate(
        "progression",
        PaceZone.EASY,
        [PaceZone.EASY],
        `漸進 E 長跑：${d(firstHalfKm)} 舒適 E + ${d(secondHalfKm)} 較快 E，中間不停`,
        `Progression E long run: ${d(firstHalfKm)} comfortable E + ${d(secondHalfKm)} quicker E, nonstop`
      ),
      candidate(
        "strides",
        PaceZone.EASY,
        [PaceZone.EASY],
        `E 長跑 ${distanceLabel}；結束加 6 x 20 秒加速跑，每趟慢跑或步行 60 秒`,
        `E long run ${distanceLabel}; finish with 6 x 20 sec strides with 60 sec jog or walk recovery`
      )
    ];
  }

  if (type === "marathon-q1-mixed") {
    return [
      candidate(
        "split-m",
        PaceZone.MARATHON,
        [PaceZone.EASY, PaceZone.MARATHON, PaceZone.THRESHOLD],
        `Q1 分段混合：${d(easyFirstKm)} E + ${d(marathonFirstKm)} M + ${d(thresholdKm)} T（2 分鐘慢跑）+ ${d(marathonSecondKm)} M + ${d(easySecondKm)} E`,
        `Q1 split mix: ${d(easyFirstKm)} E + ${d(marathonFirstKm)} M + ${d(thresholdKm)} T (2 min jog) + ${d(marathonSecondKm)} M + ${d(easySecondKm)} E`
      ),
      candidate(
        "t-first",
        PaceZone.MARATHON,
        [PaceZone.EASY, PaceZone.THRESHOLD, PaceZone.MARATHON],
        `Q1 T 後接 M：${d(easyFirstKm)} E + ${d(thresholdKm)} T（2 分鐘慢跑）+ ${d(marathonKm)} M + ${d(easySecondKm)} E`,
        `Q1 T into M: ${d(easyFirstKm)} E + ${d(thresholdKm)} T (2 min jog) + ${d(marathonKm)} M + ${d(easySecondKm)} E`
      )
    ];
  }

  if (type === "marathon-q1-threshold") {
    return [
      candidate(
        "two-blocks",
        PaceZone.THRESHOLD,
        [PaceZone.EASY, PaceZone.THRESHOLD],
        `Q1 雙段 T：${d(easyFirstKm)} E + ${d(thresholdFirstKm)} T（2 分鐘慢跑）+ ${d(thresholdSecondKm)} T + ${d(easySecondKm)} E`,
        `Q1 two-block T: ${d(easyFirstKm)} E + ${d(thresholdFirstKm)} T (2 min jog) + ${d(thresholdSecondKm)} T + ${d(easySecondKm)} E`
      ),
      candidate(
        "continuous",
        PaceZone.THRESHOLD,
        [PaceZone.EASY, PaceZone.THRESHOLD],
        `Q1 連續 T：${d(easyFirstKm)} E + ${d(thresholdKm)} T（不停）+ ${d(easySecondKm)} E`,
        `Q1 continuous T: ${d(easyFirstKm)} E + ${d(thresholdKm)} T nonstop + ${d(easySecondKm)} E`
      )
    ];
  }

  if (type === "marathon-q1-marathon") {
    return [
      candidate(
        "two-blocks",
        PaceZone.MARATHON,
        [PaceZone.EASY, PaceZone.MARATHON],
        `Q1 雙段 M：${d(easyFirstKm)} E + ${d(marathonFirstKm)} M + 2 分鐘 E 慢跑 + ${d(marathonSecondKm)} M + ${d(easySecondKm)} E`,
        `Q1 two-block M: ${d(easyFirstKm)} E + ${d(marathonFirstKm)} M + 2 min E jog + ${d(marathonSecondKm)} M + ${d(easySecondKm)} E`
      ),
      candidate(
        "continuous",
        PaceZone.MARATHON,
        [PaceZone.EASY, PaceZone.MARATHON],
        `Q1 連續 M：${d(easyFirstKm)} E + ${d(marathonKm)} M（不停）+ ${d(easySecondKm)} E`,
        `Q1 continuous M: ${d(easyFirstKm)} E + ${d(marathonKm)} M nonstop + ${d(easySecondKm)} E`
      )
    ];
  }

  if (type === "marathon-q2-threshold") {
    const repetitions = Math.max(2, Math.round(thresholdKm));
    return [
      candidate(
        "one-k",
        PaceZone.THRESHOLD,
        [PaceZone.THRESHOLD],
        `T 間歇：${repetitions} x 1 km T，每趟 1 分鐘慢跑恢復`,
        `T intervals: ${repetitions} x 1 km T with 1 min jog recoveries`
      ),
      candidate(
        "two-blocks",
        PaceZone.THRESHOLD,
        [PaceZone.THRESHOLD],
        `T 長間歇：${d(thresholdFirstKm)} T + 2 分鐘慢跑 + ${d(thresholdSecondKm)} T`,
        `Long T intervals: ${d(thresholdFirstKm)} T + 2 min jog + ${d(thresholdSecondKm)} T`
      ),
      candidate(
        "continuous",
        PaceZone.THRESHOLD,
        [PaceZone.THRESHOLD],
        `連續 T：${d(thresholdKm)} T，不安排中途恢復`,
        `Continuous T: ${d(thresholdKm)} T with no mid-session recovery`
      )
    ];
  }

  if (type === "marathon-q2-intervalRepetition") {
    const intervalRepetitions = Math.max(3, Math.floor(intervalKm / 0.8));
    const repetitionRepetitions = Math.max(4, Math.floor(repetitionKm / 0.2));
    return [
      candidate(
        "distance",
        PaceZone.INTERVAL,
        [PaceZone.INTERVAL, PaceZone.REPETITION],
        `I＋R 距離版：${intervalRepetitions} x 800 公尺 I（2 分鐘慢跑）+ ${repetitionRepetitions} x 200 公尺 R（200 公尺慢跑）`,
        `I + R distance version: ${intervalRepetitions} x 800 m I (2 min jog) + ${repetitionRepetitions} x 200 m R (200 m jog)`
      ),
      candidate(
        "r-first",
        PaceZone.INTERVAL,
        [PaceZone.REPETITION, PaceZone.INTERVAL],
        `R 後接 I：${repetitionRepetitions} x 200 公尺 R（200 公尺慢跑）+ ${intervalRepetitions} x 800 公尺 I（3 分鐘慢跑）`,
        `R into I: ${repetitionRepetitions} x 200 m R (200 m jog) + ${intervalRepetitions} x 800 m I (3 min jog)`
      )
    ];
  }

  if (type === "marathon-q2-interval") {
    const reps800 = Math.max(3, Math.floor(intervalKm / 0.8));
    const reps1k = Math.max(3, Math.floor(intervalKm));
    return [
      candidate(
        "800m",
        PaceZone.INTERVAL,
        [PaceZone.INTERVAL],
        `I 距離課：${reps800} x 800 公尺 I，每趟 2 分鐘慢跑恢復`,
        `I distance session: ${reps800} x 800 m I with 2 min jog recoveries`
      ),
      candidate(
        "1k",
        PaceZone.INTERVAL,
        [PaceZone.INTERVAL],
        `I 長間歇：${reps1k} x 1 km I，每趟 3 分鐘慢跑恢復`,
        `Long I intervals: ${reps1k} x 1 km I with 3 min jog recoveries`
      )
    ];
  }

  if (type === "marathon-q2-marathon") {
    return [
      candidate(
        "continuous",
        PaceZone.MARATHON,
        [PaceZone.EASY, PaceZone.MARATHON],
        `M 穩定跑：${d(easyFirstKm)} E + ${d(marathonKm)} M（不停）+ ${d(easySecondKm)} E`,
        `Steady M run: ${d(easyFirstKm)} E + ${d(marathonKm)} M nonstop + ${d(easySecondKm)} E`
      ),
      candidate(
        "two-blocks",
        PaceZone.MARATHON,
        [PaceZone.EASY, PaceZone.MARATHON],
        `M 分段跑：${d(easyFirstKm)} E + ${d(marathonFirstKm)} M + 1 km E + ${d(marathonSecondKm)} M + ${d(Math.max(0, easySecondKm - 1))} E`,
        `Split M run: ${d(easyFirstKm)} E + ${d(marathonFirstKm)} M + 1 km E + ${d(marathonSecondKm)} M + ${d(Math.max(0, easySecondKm - 1))} E`
      )
    ];
  }

  if (type === "marathon-q2-marathonThreshold") {
    return [
      candidate(
        "m-first",
        PaceZone.MARATHON,
        [PaceZone.EASY, PaceZone.MARATHON, PaceZone.THRESHOLD],
        `M 後接 T：${d(easyFirstKm)} E + ${d(marathonKm)} M + ${d(thresholdKm)} T（不停）+ ${d(easySecondKm)} E`,
        `M into T: ${d(easyFirstKm)} E + ${d(marathonKm)} M + ${d(thresholdKm)} T nonstop + ${d(easySecondKm)} E`
      ),
      candidate(
        "split-m",
        PaceZone.MARATHON,
        [PaceZone.EASY, PaceZone.MARATHON, PaceZone.THRESHOLD],
        `雙段 M＋T：${d(easyFirstKm)} E + ${d(marathonFirstKm)} M + ${d(thresholdKm)} T（2 分鐘慢跑）+ ${d(marathonSecondKm)} M + ${d(easySecondKm)} E`,
        `Two-block M + T: ${d(easyFirstKm)} E + ${d(marathonFirstKm)} M + ${d(thresholdKm)} T (2 min jog) + ${d(marathonSecondKm)} M + ${d(easySecondKm)} E`
      )
    ];
  }

  if (type === "marathon-q2-intervalThreshold") {
    return [
      candidate(
        "t-first",
        PaceZone.INTERVAL,
        [PaceZone.THRESHOLD, PaceZone.INTERVAL],
        `T 後接 I：${d(thresholdKm)} T（3 分鐘慢跑）+ 5 x 3 分鐘 I，每趟 3 分鐘慢跑`,
        `T into I: ${d(thresholdKm)} T (3 min jog) + 5 x 3 min I with 3 min jogs`
      ),
      candidate(
        "split-i",
        PaceZone.INTERVAL,
        [PaceZone.INTERVAL, PaceZone.THRESHOLD],
        `I 分段＋T：3 x 4 分鐘 I（3 分鐘慢跑）+ ${d(thresholdKm)} T（2 分鐘慢跑）+ 3 x 2 分鐘 I（2 分鐘慢跑）`,
        `Split I + T: 3 x 4 min I (3 min jog) + ${d(thresholdKm)} T (2 min jog) + 3 x 2 min I (2 min jog)`
      )
    ];
  }

  if (type === "marathon-q2-raceThreshold") {
    return [3, 4]
      .filter((repetitions) => repetitions * 0.8 <= thresholdKm + 0.01)
      .map((repetitions) =>
        candidate(
          `${repetitions}x800`,
          PaceZone.THRESHOLD,
          [PaceZone.THRESHOLD],
          `賽前短 T：${repetitions} x 800 公尺 T，每趟 2 分鐘 E 慢跑恢復`,
          `Short prerace T: ${repetitions} x 800 m T with 2 min E jog recoveries`
        )
      );
  }

  return [];
}

function selectWeeklyQualityWorkouts(race, cycle, qualityCount, mileage, weekParity) {
  if (qualityCount <= 0) return [];

  const baseSequence =
    race === TargetRace.ROAD_15K_30K && cycle !== TrainingCycle.PHASE_I
      ? halfMarathonAlternatingSequence(cycle, weekParity)
      : getBaseDanielsSequence(race, cycle);
  const candidates = baseSequence.filter(
    (workout) =>
      workout.distanceRole !== "longRun" &&
      workout.distanceRole !== "reducedLongRun" &&
      workout.zone !== PaceZone.EASY
  );
  const threshold =
    candidates.find((workout) => workout.zone === PaceZone.THRESHOLD) ??
    thresholdQuality(cycle);
  const secondary = candidates.find((workout) => workout !== threshold);

  return [threshold, secondary]
    .filter(Boolean)
    .slice(0, qualityCount)
    .map((workout) => adaptWorkoutToMileage(workout, mileage));
}

function halfMarathonAlternatingSequence(cycle, weekParity) {
  const secondary = weekParity === HalfMarathonWeek.EVEN
    ? intervalQuality(cycle)
    : repetitionQuality(cycle);
  return [longRunQuality(cycle), thresholdQuality(cycle), secondary];
}

function adaptWorkoutToMileage(workout, mileage) {
  const matchingExamples = workoutCatalog.filter(
    (example) => example.zone === workout.zone && isMileageEligible(example, mileage)
  );
  if (matchingExamples.length === 0) return workout;

  const selected = matchingExamples[Math.floor(matchingExamples.length / 2)];
  return {
    ...workout,
    zh: selected.zh,
    en: selected.en,
    defaultWorkoutId: selected.id
  };
}

function allocateQualityMileage(mileage, mileageClassId, qualityCount) {
  if (qualityCount <= 0 || mileage <= 0) return [];

  if (qualityCount === 1) return [roundTo(mileage * 0.18, 1)];

  const ratiosByClass = {
    A: [0.16, 0.14],
    B: [0.16, 0.14],
    C: [0.15, 0.14],
    D: [0.14, 0.13],
    E: [0.13, 0.12]
  };
  return (ratiosByClass[mileageClassId] ?? ratiosByClass.A)
    .slice(0, qualityCount)
    .map((ratio) => roundTo(mileage * ratio, 1));
}

function allocateDistanceByWeight(totalDistanceKm, weights) {
  if (weights.length === 0) return [];

  const totalTenths = Math.max(0, Math.round(totalDistanceKm * 10));
  const weightTotal = sum(weights);
  if (totalTenths === 0 || weightTotal <= 0) return weights.map(() => 0);

  const rawShares = weights.map((weight) => (totalTenths * weight) / weightTotal);
  const allocatedTenths = rawShares.map(Math.floor);
  let remainder = totalTenths - sum(allocatedTenths);
  const remainderOrder = rawShares
    .map((raw, index) => ({ index, fraction: raw - allocatedTenths[index] }))
    .sort((a, b) => b.fraction - a.fraction || a.index - b.index);

  for (let index = 0; index < remainder; index += 1) {
    allocatedTenths[remainderOrder[index % remainderOrder.length].index] += 1;
  }

  return allocatedTenths.map((value) => value / 10);
}

function buildMileageBalancedWeek({
  cycle,
  zoneById,
  unitSystem,
  weeklyMileageKm,
  longRunDistanceKm,
  qualityWorkouts,
  qualityDistancesKm,
  easyDistances
}) {
  const longRunDistance = formatDistanceValue(longRunDistanceKm, unitSystem);
  const longRunPercentage = weeklyMileageKm > 0
    ? roundTo((longRunDistanceKm / weeklyMileageKm) * 100, 1)
    : 0;
  const longRun = scheduleDay(
    "Sun",
    "日",
    PaceZone.EASY,
    `Q1 長跑 ${longRunDistance}：週跑量 ${longRunPercentage}%，以 E 配速完成`,
    `Q1 long run ${longRunDistance}: ${longRunPercentage}% of weekly mileage at E pace`,
    plannedDistanceMetadata(longRunDistanceKm, "long")
  );
  const primaryQuality = qualityWorkouts[0]
    ? buildPlannedQualityDay(
        "Tue",
        "二",
        qualityWorkouts[0],
        qualityDistancesKm[0],
        unitSystem,
        zoneById
      )
    : buildEasyDistanceDay("Tue", "二", 0, unitSystem);
  const secondaryQuality = qualityWorkouts[1]
    ? buildPlannedQualityDay(
        "Thu",
        "四",
        qualityWorkouts[1],
        qualityDistancesKm[1],
        unitSystem,
        zoneById
      )
    : buildEasyDistanceDay(
        "Thu",
        "四",
        easyDistances.thu ?? 0,
        unitSystem,
        { strides: true }
      );

  return [
    longRun,
    buildEasyDistanceDay("Mon", "一", easyDistances.mon ?? 0, unitSystem, {
      recovery: true,
      strides: true
    }),
    primaryQuality,
    buildEasyDistanceDay("Wed", "三", easyDistances.wed ?? 0, unitSystem),
    secondaryQuality,
    buildEasyDistanceDay("Fri", "五", easyDistances.fri ?? 0, unitSystem),
    buildEasyDistanceDay("Sat", "六", easyDistances.sat ?? 0, unitSystem, {
      recovery: true
    })
  ];
}

function buildPlannedQualityDay(
  enDay,
  zhDay,
  workout,
  distanceKm,
  unitSystem,
  zoneById
) {
  return {
    ...buildQualityDay(enDay, zhDay, workout, zoneById),
    ...plannedDistanceMetadata(distanceKm, "quality"),
    zhDistanceLabel: `課表總量 ${formatDistanceValue(distanceKm, unitSystem)}（含熱身與收操）`,
    enDistanceLabel: `Session total ${formatDistanceValue(distanceKm, unitSystem)} including warm-up and cool-down`
  };
}

function buildEasyDistanceDay(
  enDay,
  zhDay,
  distanceKm,
  unitSystem,
  { recovery = false, strides = false } = {}
) {
  const distance = formatDistanceValue(distanceKm, unitSystem);
  const zhPrefix = recovery ? "恢復跑" : "E";
  const enPrefix = recovery ? "Recovery run" : "E";
  const zh = distanceKm <= 0
    ? "休息（0 km）"
    : `${zhPrefix} ${distance}${strides ? " + 6-8 次加速跑" : ""}`;
  const en = distanceKm <= 0
    ? "Rest (0 km)"
    : `${enPrefix} ${distance}${strides ? " + 6-8 strides" : ""}`;

  return scheduleDay(enDay, zhDay, PaceZone.EASY, zh, en, {
    ...plannedDistanceMetadata(distanceKm, "easy"),
    easyDistributionEligible: distanceKm > 0
  });
}

function plannedDistanceMetadata(distanceKm, scheduleRole) {
  return {
    plannedDistanceKm: roundTo(distanceKm, 1),
    distanceRangeKm: {
      min: roundTo(distanceKm, 1),
      max: roundTo(distanceKm, 1)
    },
    scheduleRole,
    isLongRun: scheduleRole === "long",
    isPrimaryWorkout: scheduleRole === "quality"
  };
}

function formatDistanceValue(distanceKm, unitSystem) {
  const distance = fromKilometers(distanceKm, unitSystem);
  const suffix = normalizeUnitSystem(unitSystem) === UnitSystem.IMPERIAL ? "mi" : "km";
  const rounded = roundTo(distance, 1);
  return `${Number.isInteger(rounded) ? rounded : rounded.toFixed(1)} ${suffix}`;
}

function sum(values) {
  return values.reduce((total, value) => total + Number(value || 0), 0);
}

function getBaseDanielsSequence(race, cycle) {
  if (race === TargetRace.ROAD_15K_30K) {
    return road15K30KSequence(cycle);
  }

  if (race === TargetRace.MARATHON) {
    return marathonSequence(cycle);
  }

  if (race === TargetRace.EIGHT_HUNDRED) {
    return middleDistanceSequence(cycle, "800");
  }

  if (race === TargetRace.MILE_TO_TWO_MILE) {
    return middleDistanceSequence(cycle, "mile");
  }

  if (race === TargetRace.CROSS_COUNTRY) {
    return crossCountrySequence(cycle);
  }

  return fiveTenKSequence(cycle);
}

function middleDistanceSequence(cycle, eventFlavor) {
  if (cycle === TrainingCycle.PHASE_I) {
    return [longRunQuality(cycle), thresholdQuality(cycle), repetitionQuality(cycle)];
  }

  if (cycle === TrainingCycle.PHASE_II) {
    return [repetitionQuality(cycle), thresholdRepetitionQuality(cycle), thresholdQuality(cycle)];
  }

  if (cycle === TrainingCycle.PHASE_III) {
    return eventFlavor === "800"
      ? [repetitionQuality(cycle), intervalQuality(cycle), thresholdRepetitionQuality(cycle)]
      : [intervalQuality(cycle), thresholdRepetitionQuality(cycle), repetitionQuality(cycle)];
  }

  return [thresholdRepetitionQuality(cycle), repetitionQuality(cycle), raceOrSharpenQuality(cycle)];
}

function fiveTenKSequence(cycle) {
  if (cycle === TrainingCycle.PHASE_I) {
    return [longRunQuality(cycle), thresholdQuality(cycle), repetitionQuality(cycle)];
  }

  if (cycle === TrainingCycle.PHASE_II) {
    return [longRunQuality(cycle), repetitionQuality(cycle), thresholdRepetitionQuality(cycle)];
  }

  if (cycle === TrainingCycle.PHASE_III) {
    return [intervalQuality(cycle), thresholdRepetitionQuality(cycle), intervalQuality(cycle, "long")];
  }

  return [thresholdQuality(cycle), intervalQuality(cycle), raceOrSharpenQuality(cycle)];
}

function crossCountrySequence(cycle) {
  if (cycle === TrainingCycle.PHASE_I) {
    return [longRunQuality(cycle), thresholdQuality(cycle), repetitionQuality(cycle)];
  }

  if (cycle === TrainingCycle.PHASE_II) {
    return [repetitionQuality(cycle), hillQuality(cycle), thresholdRepetitionQuality(cycle)];
  }

  if (cycle === TrainingCycle.PHASE_III) {
    return [hillQuality(cycle), thresholdQuality(cycle), intervalQuality(cycle)];
  }

  return [thresholdRepetitionQuality(cycle), hillQuality(cycle), raceOrSharpenQuality(cycle)];
}

function road15K30KSequence(cycle) {
  if (cycle === TrainingCycle.PHASE_IV) {
    return [longRunQuality(cycle, "reduced"), thresholdQuality(cycle, "preRace"), raceOrSharpenQuality(cycle)];
  }

  if (cycle === TrainingCycle.PHASE_III) {
    return [marathonQuality(cycle), thresholdQuality(cycle), intervalQuality(cycle)];
  }

  if (cycle === TrainingCycle.PHASE_II) {
    return [longRunQuality(cycle), thresholdQuality(cycle), repetitionQuality(cycle)];
  }

  return [longRunQuality(cycle), thresholdQuality(cycle), marathonQuality(cycle)];
}

function marathonSequence(cycle) {
  if (cycle === TrainingCycle.PHASE_I) {
    return [longRunQuality(cycle), thresholdQuality(cycle), repetitionQuality(cycle)];
  }

  if (cycle === TrainingCycle.PHASE_II) {
    return [marathonQuality(cycle), thresholdQuality(cycle), repetitionQuality(cycle)];
  }

  if (cycle === TrainingCycle.PHASE_III) {
    return [longRunQuality(cycle), thresholdQuality(cycle), intervalQuality(cycle)];
  }

  return [marathonQuality(cycle), thresholdQuality(cycle), thresholdRepetitionQuality(cycle)];
}

function thresholdQuality(cycle, variant = "default") {
  const contentByCycle = {
    [TrainingCycle.PHASE_I]: ["輕量 T：3-4 x 5 分鐘，休 1 分鐘", "Light T: 3-4 x 5 min, 1 min rest"],
    [TrainingCycle.PHASE_II]: ["T 主課：20 分鐘連續或 4 x 5 分鐘", "T main set: 20 min steady or 4 x 5 min"],
    [TrainingCycle.PHASE_III]: ["T 銜接：4-5 x 1K 或 15-20 分鐘連續", "T bridge: 4-5 x 1K or 15-20 min steady"],
    [TrainingCycle.PHASE_IV]: ["比賽週 T：3 x 1K，休 2 分鐘；或 2 x 10 分鐘", "Race-week T: 3 x 1K, 2 min rest; or 2 x 10 min"]
  };
  if (variant === "preRace") {
    return quality(PaceZone.THRESHOLD, [
      "賽前 T：3 x 1K，休 2 分鐘",
      "Pre-race T: 3 x 1K, 2 min rest"
    ]);
  }
  return quality(PaceZone.THRESHOLD, contentByCycle[cycle]);
}

function intervalQuality(cycle, variant = "default") {
  const contentByCycle = {
    [TrainingCycle.PHASE_I]: ["短丘或 6-8 x 1 分鐘快跑，充分恢復", "Short hills or 6-8 x 1 min fast, full recovery"],
    [TrainingCycle.PHASE_II]: ["I/I：5-6 x 800 公尺，慢跑 2 分鐘", "I/I: 5-6 x 800 m, 2 min jog"],
    [TrainingCycle.PHASE_III]: ["I：4-6 x 1000-1200 公尺，慢跑 3 分鐘", "I: 4-6 x 1000-1200 m, 3 min jog"],
    [TrainingCycle.PHASE_IV]: ["維持 I：3-5 x 3-5 分鐘，量少不硬撐", "Maintenance I: 3-5 x 3-5 min, low volume"]
  };
  if (variant === "long") {
    return quality(PaceZone.INTERVAL, [
      "I：4-6 x 1200 公尺，慢跑 3 分鐘",
      "I: 4-6 x 1200 m, 3 min jog"
    ]);
  }
  return quality(PaceZone.INTERVAL, contentByCycle[cycle]);
}

function repetitionQuality(cycle) {
  const contentByCycle = {
    [TrainingCycle.PHASE_I]: ["R 技術：6-8 x 200 公尺，完全恢復", "R mechanics: 6-8 x 200 m, full recovery"],
    [TrainingCycle.PHASE_II]: ["R：8-10 x 200 公尺或 6 x 400 公尺", "R: 8-10 x 200 m or 6 x 400 m"],
    [TrainingCycle.PHASE_III]: ["R 維持：6-8 x 200 公尺，跑姿放鬆", "R maintenance: 6-8 x 200 m, relaxed mechanics"],
    [TrainingCycle.PHASE_IV]: ["銳化 R：4-6 x 200 公尺，量少質精", "Sharpening R: 4-6 x 200 m, low volume high quality"]
  };
  return quality(PaceZone.REPETITION, contentByCycle[cycle]);
}

function marathonQuality(cycle) {
  const contentByCycle = {
    [TrainingCycle.PHASE_I]: ["M 感覺跑：30-45 分鐘穩定有氧", "M feel: 30-45 min steady aerobic"],
    [TrainingCycle.PHASE_II]: ["M：40-60 分鐘，結尾可加 10 分鐘 T", "M: 40-60 min, optional 10 min T finish"],
    [TrainingCycle.PHASE_III]: ["M + T：中長跑內含 30-50 分鐘 M", "M + T: medium-long run with 30-50 min M"],
    [TrainingCycle.PHASE_IV]: ["馬拉松專項：40-70 分鐘 M，前後 E 熱身收操", "Marathon specific: 40-70 min M with E before/after"]
  };
  return quality(PaceZone.MARATHON, contentByCycle[cycle]);
}

function longRunQuality(cycle, variant = "default") {
  if (variant === "reduced") {
    return quality(PaceZone.EASY, [
      "Q1：賽前長跑 {distance}，約正常長跑 2/3，以 E 配速完成",
      "Q1: pre-race long run {distance}, about 2/3 normal long run at E pace"
    ], { distanceRole: "reducedLongRun" });
  }
  return quality(PaceZone.EASY, [
    "Q1 長跑 {distance}：週跑量 25-30%，以 E 配速完成",
    "Q1 long run {distance}: 25-30% of weekly mileage at E pace"
  ], { distanceRole: "longRun" });
}

function thresholdRepetitionQuality(cycle) {
  const contentByCycle = {
    [TrainingCycle.PHASE_I]: ["T + R：短 T 後接 4 x 200 公尺 R", "T + R: short T then 4 x 200 m R"],
    [TrainingCycle.PHASE_II]: ["T + R：2-4 x 1K T 後接 4-6 x 200 公尺 R", "T + R: 2-4 x 1K T then 4-6 x 200 m R"],
    [TrainingCycle.PHASE_III]: ["T + R：穩定 T 後接 4 x 200 公尺 R", "T + R: steady T then 4 x 200 m R"],
    [TrainingCycle.PHASE_IV]: ["T + R：賽前 T 後接 4-6 x 200 公尺 R", "T + R: race-week T then 4-6 x 200 m R"]
  };
  return quality(PaceZone.THRESHOLD, contentByCycle[cycle]);
}

function hillQuality(cycle) {
  const contentByCycle = {
    [TrainingCycle.PHASE_I]: ["丘陵加速：6-8 x 20 秒，上坡輕快", "Hill strides: 6-8 x 20 sec, quick uphill"],
    [TrainingCycle.PHASE_II]: ["I：6-8 x 1-2 分鐘，上坡或草地，慢跑恢復", "I: 6-8 x 1-2 min uphill/grass, jog recovery"],
    [TrainingCycle.PHASE_III]: ["I/I：5-7 x 3 分鐘，慢跑 2 分鐘", "I/I: 5-7 x 3 min, 2 min jog"],
    [TrainingCycle.PHASE_IV]: ["越野銳化：短 I + T，保持節奏感", "XC sharpening: short I + T, keep rhythm"]
  };
  return quality(PaceZone.INTERVAL, contentByCycle[cycle]);
}

function raceOrSharpenQuality(cycle) {
  return quality(PaceZone.REPETITION, [
    "Q3：比賽或短量 R/I 銳化，避免堆疲勞",
    "Q3: race or low-volume R/I sharpening"
  ]);
}

function quality(zone, content, metadata = {}) {
  return { zone, zh: content[0], en: content[1], ...metadata };
}

function buildQualityDay(enDay, zhDay, workout, zoneById) {
  const selected = workout ?? thresholdQuality(TrainingCycle.PHASE_II);
  const zone = zoneById[selected.zone];
  const pace = zone?.adjusted.label ?? "";
  const base = zone?.base.label ?? "";

  return {
    enDay,
    zhDay,
    zone: selected.zone,
    zh: selected.zh,
    en: selected.en,
    pace,
    base
  };
}

function scheduleDay(enDay, zhDay, zone, zh, en, metadata = {}) {
  return { enDay, zhDay, zone, zh, en, pace: "", base: "", ...metadata };
}

function addZonePace(day, zoneById) {
  if (day.pace) return day;
  const zone = zoneById[day.zone];
  return {
    ...day,
    pace: zone?.adjusted.label ?? "",
    base: zone?.base.label ?? ""
  };
}

function formatDistanceRange(minKm, maxKm, unitSystem) {
  const min = fromKilometers(minKm, unitSystem);
  const max = fromKilometers(maxKm, unitSystem);
  const suffix = normalizeUnitSystem(unitSystem) === UnitSystem.IMPERIAL ? "mi" : "km";
  return `${roundDistance(min)}-${roundDistance(max)} ${suffix}`;
}

function roundDistance(value) {
  return value >= 10 ? Math.round(value) : roundTo(value, 1);
}

function buildZonePace(zone, vdot, heatMultiplier, unitSystem) {
  const isRange = Array.isArray(zone.intensityRange);
  const fasterPace = secondsPerKmForIntensity(
    vdot,
    isRange ? zone.intensityRange[1] : zone.targetIntensity
  );
  const slowerPace = secondsPerKmForIntensity(
    vdot,
    isRange ? zone.intensityRange[0] : zone.targetIntensity
  );
  const adjustedFaster = fasterPace * heatMultiplier;
  const adjustedSlower = slowerPace * heatMultiplier;
  const heatAdjusted = heatMultiplier > 1.001;

  return {
    id: zone.id,
    zhName: zone.zhName,
    enName: zone.enName,
    base: {
      faster: Math.round(fasterPace),
      slower: Math.round(slowerPace),
      label: formatPaceRange(fasterPace, slowerPace, unitSystem)
    },
    adjusted: {
      faster: Math.round(adjustedFaster),
      slower: Math.round(adjustedSlower),
      label: formatPaceRange(adjustedFaster, adjustedSlower, unitSystem)
    },
    baseSplit400m: formatSplitRange(fasterPace, slowerPace, 400),
    baseSplit200m: formatSplitRange(fasterPace, slowerPace, 200),
    adjustedSplit400m: formatSplitRange(adjustedFaster, adjustedSlower, 400),
    adjustedSplit200m: formatSplitRange(adjustedFaster, adjustedSlower, 200),
    split400m: formatSplitRange(adjustedFaster, adjustedSlower, 400),
    split200m: formatSplitRange(adjustedFaster, adjustedSlower, 200),
    heatAdjusted,
    displayUnit: zone.displayUnit
  };
}

function secondsPerKmForIntensity(vdot, intensity) {
  const targetVo2 = vdot * intensity;
  const a = 0.000104;
  const b = 0.182258;
  const c = -4.6 - targetVo2;
  const metersPerMinute = (-b + Math.sqrt(b * b - 4 * a * c)) / (2 * a);
  return 60000 / metersPerMinute;
}

function formatPaceRange(fasterSeconds, slowerSeconds, unitSystem = UnitSystem.METRIC) {
  const multiplier =
    normalizeUnitSystem(unitSystem) === UnitSystem.IMPERIAL ? KM_PER_MILE : 1;
  const suffix =
    normalizeUnitSystem(unitSystem) === UnitSystem.IMPERIAL ? "/ mi" : "/ km";
  const faster = formatPace(fasterSeconds * multiplier);
  const slower = formatPace(slowerSeconds * multiplier);
  return faster === slower ? `${faster} ${suffix}` : `${faster} - ${slower} ${suffix}`;
}

function formatSplitRange(fasterSecondsPerKm, slowerSecondsPerKm, meters) {
  const faster = formatDuration((fasterSecondsPerKm * meters) / 1000);
  const slower = formatDuration((slowerSecondsPerKm * meters) / 1000);
  return faster === slower ? faster : `${faster} - ${slower}`;
}

function formatPace(seconds) {
  const rounded = Math.round(seconds);
  const minutes = Math.floor(rounded / 60);
  const secs = String(rounded % 60).padStart(2, "0");
  return `${minutes}:${secs}`;
}

function formatDuration(seconds) {
  const rounded = Math.round(seconds);
  const minutes = Math.floor(rounded / 60);
  const secs = String(rounded % 60).padStart(2, "0");
  return minutes > 0 ? `${minutes}:${secs}` : `${secs}s`;
}

function isMileageEligible(example, mileage) {
  return (
    mileage >= example.minMileage &&
    (example.maxMileage === null || mileage < example.maxMileage)
  );
}

function t(id, minMileage, maxMileage, zh, en, totalTime) {
  return workout(id, PaceZone.THRESHOLD, minMileage, maxMileage, zh, en, totalTime);
}

function i(id, minMileage, maxMileage, zh, en, totalTime) {
  return workout(id, PaceZone.INTERVAL, minMileage, maxMileage, zh, en, totalTime);
}

function r(id, minMileage, maxMileage, zh, en, totalTime) {
  return workout(id, PaceZone.REPETITION, minMileage, maxMileage, zh, en, totalTime);
}

function workout(id, zone, minMileage, maxMileage, zh, en, totalTime) {
  return {
    id,
    zone,
    minMileage,
    maxMileage,
    zh,
    en,
    totalTime,
    recoveryLabel: inferRecoveryLabel(zh, "zh"),
    enRecoveryLabel: inferRecoveryLabel(en, "en")
  };
}

function inferRecoveryLabel(text, locale = "zh") {
  const recoveries = [
    ...text.matchAll(/(\d+(?:\.\d+)?)\s*分鐘(?:慢跑|休息)/g),
    ...text.matchAll(/(\d+)\s*秒(?:慢跑|休息)/g),
    ...text.matchAll(/(\d+(?:-\d+)?)\s*公尺慢跑/g),
    ...text.matchAll(/(\d+(?:\.\d+)?)\s*min\s+(?:jog|rest)/g),
    ...text.matchAll(/(\d+)\s*sec\s+(?:jog|rest)/g),
    ...text.matchAll(/(\d+(?:-\d+)?)\s*m\s+jog/g)
  ].map((match) => match[0]);

  if (recoveries.length > 0) return [...new Set(recoveries)].join(" / ");

  return locale === "en" ? "As prescribed" : "依課表內容";
}

function extendRecoveryLabel(label, recoveryMultiplier, locale) {
  if (!label || recoveryMultiplier <= 1.01) return label;

  const withMinutes = label.replace(
    /(\d+(?:\.\d+)?)\s*(分鐘|分|min)/gi,
    (_, value, unit) => formatExtendedRecovery(Number(value) * 60 * recoveryMultiplier, unit, locale)
  );
  const withSeconds = withMinutes.replace(
    /(\d+)\s*(秒|sec|s)/gi,
    (_, value, unit) => formatExtendedRecovery(Number(value) * recoveryMultiplier, unit, locale)
  );

  if (withSeconds !== label) return withSeconds;

  return locale === "en"
    ? `${translateRecoveryFallback(label)} + extend by feel in heat`
    : `${label} + 熱天依體感延長`;
}

function translateRecoveryFallback(label) {
  return label === "依課表內容" ? "As prescribed" : label;
}

function formatExtendedRecovery(seconds, unit, locale) {
  if (/min|分鐘|分/i.test(unit)) {
    return locale === "en"
      ? `${formatDuration(seconds)}`
      : `${formatDuration(seconds)} `;
  }

  return locale === "en" ? formatDuration(seconds) : `${formatDuration(seconds)} `;
}

function normalizeUnitSystem(unitSystem) {
  return Object.values(UnitSystem).includes(unitSystem)
    ? unitSystem
    : UnitSystem.METRIC;
}

function normalizeTargetRace(targetRace) {
  return Object.values(TargetRace).includes(targetRace)
    ? targetRace
    : TargetRace.FIVE_TEN_K;
}

function normalizeTrainingCycle(trainingCycle) {
  return Object.values(TrainingCycle).includes(trainingCycle)
    ? trainingCycle
    : TrainingCycle.PHASE_II;
}

function normalizeHalfMarathonWeek(value) {
  return Object.values(HalfMarathonWeek).includes(value)
    ? value
    : HalfMarathonWeek.ODD;
}

function normalizeMarathonPhaseWeek(value) {
  return Math.round(clamp(Number(value) || 1, 1, MARATHON_PHASE_WEEKS));
}

function clamp(value, min, max) {
  if (Number.isNaN(value)) return min;
  return Math.min(max, Math.max(min, value));
}

function roundTo(value, digits) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}
