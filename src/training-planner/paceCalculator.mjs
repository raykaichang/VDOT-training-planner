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
    intensityRange: [0.75, 0.84],
    displayUnit: "pace"
  },
  {
    id: PaceZone.THRESHOLD,
    zhName: "乳酸閾值",
    enName: "Threshold",
    intensityRange: [0.83, 0.88],
    displayUnit: "pace"
  },
  {
    id: PaceZone.INTERVAL,
    zhName: "間歇",
    enName: "Interval",
    intensityRange: [0.95, 1],
    displayUnit: "pace"
  },
  {
    id: PaceZone.REPETITION,
    zhName: "反覆跑",
    enName: "Repetition",
    intensityRange: [1.05, 1.1],
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

  i("I-A1", 0, 48, "5-6 x（2 分鐘 H + 1 分鐘慢跑）", "5-6 x (2 min H + 1 min jog)", "15-18 分鐘"),
  i("I-A2", 0, 48, "4 x（3 分鐘 H + 2 分鐘慢跑）", "4 x (3 min H + 2 min jog)", "20 分鐘"),
  i("I-A3", 0, 48, "3 x（4 分鐘 H + 3 分鐘慢跑）", "3 x (4 min H + 3 min jog)", "21 分鐘"),
  i("I-A4", 0, 48, "4-5 x（800 公尺 I 配速 + 2 分鐘慢跑）", "4-5 x (800 m I + 2 min jog)", "20-25 分鐘"),
  i("I-B1", 48, 64, "7-8 x（2 分鐘 H + 1 分鐘慢跑）", "7-8 x (2 min H + 1 min jog)", "21-24 分鐘"),
  i("I-B2", 48, 64, "5 x（3 分鐘 H + 2 分鐘慢跑）", "5 x (3 min H + 2 min jog)", "25 分鐘"),
  i("I-B3", 48, 64, "4 x（4 分鐘 H + 3 分鐘慢跑）", "4 x (4 min H + 3 min jog)", "28 分鐘"),
  i("I-B4", 48, 64, "5-6 x（800 公尺 I 配速 + 2 分鐘慢跑）", "5-6 x (800 m I + 2 min jog)", "25-30 分鐘"),
  i("I-B5", 48, 64, "4-5 x（1,000 公尺 I 配速 + 3 分鐘慢跑）", "4-5 x (1,000 m I + 3 min jog)", "26-33 分鐘"),
  i("I-C1", 64, 74, "6 x（800 公尺 I 配速 + 2 分鐘慢跑）", "6 x (800 m I + 2 min jog)", "27 分鐘"),
  i("I-C2", 64, 74, "6 x（3 分鐘 H + 2 分鐘慢跑）", "6 x (3 min H + 2 min jog)", "30 分鐘"),
  i("I-C3", 64, 74, "5 x（1,000 公尺 I 配速 + 3 分鐘慢跑）", "5 x (1,000 m I + 3 min jog)", "33 分鐘"),
  i("I-C4", 64, 74, "4-5 x（1,200 公尺 I 配速 + 3 分鐘慢跑）", "4-5 x (1,200 m I + 3 min jog)", "28-35 分鐘"),
  i("I-C5", 64, 74, "3-4 x（5 分鐘 H + 4 分鐘慢跑）", "3-4 x (5 min H + 4 min jog)", "27-36 分鐘"),
  i("I-D1", 74, 90, "5-6 x（1,000 公尺 I 配速 + 3 分鐘慢跑）", "5-6 x (1,000 m I + 3 min jog)", "33-39 分鐘"),
  i("I-D2", 74, 90, "4-5 x（1,200 公尺 I 配速 + 3 分鐘慢跑）；或 5 x（4 分鐘 H + 3 分鐘慢跑）", "4-5 x (1,200 m I + 3 min jog); or 5 x (4 min H + 3 min jog)", "28-35 分鐘"),
  i("I-D3", 74, 90, "4 x（1,600 公尺 I 配速 + 4 分鐘慢跑）；或 4 x（5 分鐘 H + 4 分鐘慢跑）", "4 x (1,600 m I + 4 min jog); or 4 x (5 min H + 4 min jog)", "36 分鐘"),
  i("I-D4", 74, 90, "5 x（4 分鐘 H + 3 分鐘慢跑）", "5 x (4 min H + 3 min jog)", "35 分鐘"),
  i("I-D5", 74, 90, "7 x（3 分鐘 H + 2 分鐘慢跑）", "7 x (3 min H + 2 min jog)", "35 分鐘"),
  i("I-D6", 74, 90, "10 x（2 分鐘 H + 1 分鐘慢跑）", "10 x (2 min H + 1 min jog)", "30 分鐘"),
  i("I-E1", 90, 114, "6-8 x（1,000 公尺 I 配速 + 3 分鐘慢跑）", "6-8 x (1,000 m I + 3 min jog)", "39-52 分鐘"),
  i("I-E2", 90, 114, "5-6 x（1,200 公尺 I 配速 + 3 分鐘慢跑）", "5-6 x (1,200 m I + 3 min jog)", "35-42 分鐘"),
  i("I-E3", 90, 114, "5 x（5 分鐘 H + 4 分鐘慢跑）", "5 x (5 min H + 4 min jog)", "45 分鐘"),
  i("I-E4", 90, 114, "4 x（3 分鐘 H + 2 分鐘慢跑）+ 4 x（2 分鐘 H + 1 分鐘慢跑）", "4 x (3 min H + 2 min jog) + 4 x (2 min H + 1 min jog)", "32 分鐘"),
  i("I-E5", 90, 114, "3 x（3 分鐘 H + 2 分鐘慢跑）+ 4 x（2 分鐘 H + 1 分鐘慢跑）+ 5 x（1 分鐘 H + 30 秒慢跑）", "3 x (3 min H + 2 min jog) + 4 x (2 min H + 1 min jog) + 5 x (1 min H + 30 sec jog)", "35 分鐘"),
  i("I-F1", 114, null, "7-10 x（1,000 公尺 I 配速 + 3 分鐘慢跑）", "7-10 x (1,000 m I + 3 min jog)", "45-65 分鐘"),
  i("I-F2", 114, null, "3 x（5 分鐘 H + 4 分鐘慢跑）+ 4 x（1,000 公尺 I 配速 + 3 分鐘慢跑）", "3 x (5 min H + 4 min jog) + 4 x (1,000 m I + 3 min jog)", "54 分鐘"),
  i("I-F3", 114, null, "6-8 x（4 分鐘 H + 3 分鐘慢跑）；或 6-8 x（1,200 公尺 I 配速 + 3 分鐘慢跑）", "6-8 x (4 min H + 3 min jog); or 6-8 x (1,200 m I + 3 min jog)", "42-56 分鐘"),
  i("I-F4", 114, null, "5-6 x（5 分鐘 H + 4 分鐘慢跑）；或 5-6 x（1,600 公尺 I 配速 + 4 分鐘慢跑）", "5-6 x (5 min H + 4 min jog); or 5-6 x (1,600 m I + 4 min jog)", "45-54 分鐘"),
  i("I-F5", 114, null, "2 x（5 分鐘 H + 4 分鐘慢跑）+ 3 x（3 分鐘 H + 3 分鐘慢跑）+ 4 x（2 分鐘 H + 1 分鐘慢跑）", "2 x (5 min H + 4 min jog) + 3 x (3 min H + 3 min jog) + 4 x (2 min H + 1 min jog)", "48 分鐘"),
  i("I-F6", 114, null, "5 x（2 分鐘 H + 1 分鐘慢跑）+ 8 x（1 分鐘 H + 30 秒慢跑）+ 12 x（30 秒 H + 30 秒慢跑）", "5 x (2 min H + 1 min jog) + 8 x (1 min H + 30 sec jog) + 12 x (30 sec H + 30 sec jog)", "39 分鐘"),

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
  const temperatureC = clamp(Number(input.temperatureC ?? 22), -5, 45);
  const humidity = clamp(Number(input.humidity ?? 60), 0, 100);
  const heatAdjustment = calculateHeatAdjustment(temperatureC, humidity);
  const mileageClass = getMileageClass(weeklyMileageKm);
  const zones = zoneDefinitions.map((zone) =>
    buildZonePace(zone, vdot, heatAdjustment.multiplier, unitSystem)
  );

  return {
    vdot,
    weeklyMileage,
    weeklyMileageKm,
    unitSystem,
    targetRace,
    trainingCycle,
    temperatureC,
    humidity,
    heatAdjustment,
    mileageClass,
    workoutExamples: getWorkoutExamplesForMileage(
      weeklyMileageKm,
      heatAdjustment,
      vdot
    ),
    weeklySchedule: generateWeeklySchedule({
      targetRace,
      trainingCycle,
      weeklyMileageKm,
      unitSystem,
      zones
    }),
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

export function calculateHeatAdjustment(temperatureC, humidity) {
  const dewPoint = calculateDewPoint(temperatureC, humidity);
  const temperatureLoad = Math.max(0, temperatureC - 15) * 0.0025;
  const dewPointLoad = Math.max(0, dewPoint - 12) * 0.0035;
  const severeHeatLoad = Math.max(0, temperatureC - 30) * 0.004;
  const percentage = clamp(
    temperatureLoad + dewPointLoad + severeHeatLoad,
    0,
    0.16
  );
  const recoveryPercentage = clamp(percentage * 1.5, 0, 0.25);

  return {
    dewPoint: roundTo(dewPoint, 1),
    percentage: roundTo(percentage * 100, 1),
    multiplier: 1 + percentage,
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
  weeklyMileageKm = 55,
  unitSystem = UnitSystem.METRIC,
  zones = []
} = {}) {
  const race = normalizeTargetRace(targetRace);
  const cycle = normalizeTrainingCycle(trainingCycle);
  const mileage = Number(weeklyMileageKm);
  const qualitySlots = mileage >= 48 ? 3 : mileage >= 32 ? 2 : 1;
  const zoneById = Object.fromEntries(zones.map((zone) => [zone.id, zone]));
  const longRun = formatDistanceRange(
    Math.max(8, mileage * 0.2),
    Math.max(10, mileage * 0.28),
    unitSystem
  );
  const easyRun = formatDistanceRange(
    Math.max(5, mileage * 0.08),
    Math.max(7, mileage * 0.12),
    unitSystem
  );
  const recoveryRun = formatDistanceRange(
    Math.max(4, mileage * 0.06),
    Math.max(6, mileage * 0.09),
    unitSystem
  );

  const week = buildDanielsWeek({
    race,
    cycle,
    qualitySlots,
    zoneById,
    longRun,
    easyRun,
    recoveryRun
  }).map((day) => addZonePace(day, zoneById));

  if (!week.some((day) => day.zone === PaceZone.THRESHOLD)) {
    week[1] = addZonePace(
      buildQualityDay("Tue", "二", thresholdQuality(cycle), zoneById),
      zoneById
    );
  }

  return week;
}

function buildDanielsWeek({
  race,
  cycle,
  qualitySlots,
  zoneById,
  longRun,
  easyRun,
  recoveryRun
}) {
  const q = getDanielsQualitySequence(race, cycle, qualitySlots);
  const q1 = q[0] ?? thresholdQuality(cycle);
  const q2 = q[1];
  const q3 = q[2];

  return [
    buildQualityDay("Sun", "日", q1, zoneById),
    scheduleDay("Mon", "一", PaceZone.EASY, `E ${recoveryRun} + 6-8 次加速跑`, `E ${recoveryRun} + 6-8 strides`),
    q2
      ? buildQualityDay("Tue", "二", q2, zoneById)
      : scheduleDay("Tue", "二", PaceZone.EASY, `E ${easyRun}`, `E ${easyRun}`),
    scheduleDay("Wed", "三", PaceZone.EASY, `E ${easyRun}`, `E ${easyRun}`),
    q3
      ? buildQualityDay("Thu", "四", q3, zoneById)
      : scheduleDay("Thu", "四", PaceZone.EASY, `E ${easyRun} + 4-6 次加速跑`, `E ${easyRun} + 4-6 strides`),
    scheduleDay("Fri", "五", PaceZone.EASY, "休息或 30-40 分鐘 E", "Rest or 30-40 min E"),
    scheduleDay(
      "Sat",
      "六",
      PaceZone.EASY,
      `恢復跑 ${recoveryRun} 或休息`,
      `Recovery ${recoveryRun} or rest`
    )
  ];
}

function getDanielsQualitySequence(race, cycle, qualitySlots) {
  const sequence = getBaseDanielsSequence(race, cycle);
  const protectedSequence = ensureThresholdQuality(sequence, cycle);
  const selected = protectedSequence.slice(0, qualitySlots);
  if (!selected.some((workout) => workout.zone === PaceZone.THRESHOLD)) {
    const threshold = protectedSequence.find(
      (workout) => workout.zone === PaceZone.THRESHOLD
    ) ?? thresholdQuality(cycle);
    selected.splice(Math.max(0, selected.length - 1), 1, threshold);
  }
  return selected;
}

function ensureThresholdQuality(sequence, cycle) {
  if (sequence.some((workout) => workout.zone === PaceZone.THRESHOLD)) {
    return sequence;
  }
  return [thresholdQuality(cycle), ...sequence.slice(0, 2)];
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
    [TrainingCycle.PHASE_II]: ["H/I：5-6 x 800 公尺，慢跑 2 分鐘", "H/I: 5-6 x 800 m, 2 min jog"],
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
      "Q1：正常長跑的 2/3，以 E 配速完成",
      "Q1: 2/3 normal long run at E pace"
    ]);
  }
  return quality(PaceZone.EASY, [
    "Q1 長跑：週跑量 25-30%，以 E 配速完成",
    "Q1 long run: 25-30% of weekly mileage at E pace"
  ]);
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
    [TrainingCycle.PHASE_II]: ["H：6-8 x 1-2 分鐘，上坡或草地，慢跑恢復", "H: 6-8 x 1-2 min uphill/grass, jog recovery"],
    [TrainingCycle.PHASE_III]: ["H/I：5-7 x 3 分鐘，慢跑 2 分鐘", "H/I: 5-7 x 3 min, 2 min jog"],
    [TrainingCycle.PHASE_IV]: ["越野銳化：短 H + T，保持節奏感", "XC sharpening: short H + T, keep rhythm"]
  };
  return quality(PaceZone.INTERVAL, contentByCycle[cycle]);
}

function raceOrSharpenQuality(cycle) {
  return quality(PaceZone.REPETITION, [
    "Q3：比賽或短量 R/I 銳化，避免堆疲勞",
    "Q3: race or low-volume R/I sharpening"
  ]);
}

function quality(zone, content) {
  return { zone, zh: content[0], en: content[1] };
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

function scheduleDay(enDay, zhDay, zone, zh, en) {
  return { enDay, zhDay, zone, zh, en, pace: "", base: "" };
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
  const fasterPace = secondsPerKmForIntensity(vdot, zone.intensityRange[1]);
  const slowerPace = secondsPerKmForIntensity(vdot, zone.intensityRange[0]);
  const adjustedFaster = fasterPace * heatMultiplier;
  const adjustedSlower = slowerPace * heatMultiplier;

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

function calculateDewPoint(temperatureC, humidity) {
  if (humidity <= 0) return -40;
  const a = 17.27;
  const b = 237.7;
  const alpha =
    (a * temperatureC) / (b + temperatureC) + Math.log(humidity / 100);
  return (b * alpha) / (a - alpha);
}

function formatPaceRange(fasterSeconds, slowerSeconds, unitSystem = UnitSystem.METRIC) {
  const multiplier =
    normalizeUnitSystem(unitSystem) === UnitSystem.IMPERIAL ? KM_PER_MILE : 1;
  const suffix =
    normalizeUnitSystem(unitSystem) === UnitSystem.IMPERIAL ? "/ mi" : "/ km";
  return `${formatPace(fasterSeconds * multiplier)} - ${formatPace(
    slowerSeconds * multiplier
  )} ${suffix}`;
}

function formatSplitRange(fasterSecondsPerKm, slowerSecondsPerKm, meters) {
  return `${formatDuration((fasterSecondsPerKm * meters) / 1000)} - ${formatDuration(
    (slowerSecondsPerKm * meters) / 1000
  )}`;
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

function clamp(value, min, max) {
  if (Number.isNaN(value)) return min;
  return Math.min(max, Math.max(min, value));
}

function roundTo(value, digits) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}
