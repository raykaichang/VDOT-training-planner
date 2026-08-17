export const KM_PER_MILE = 1.609344;

// HillRunner.com treadmill chart. Each row contains the treadmill MPH setting
// followed by flat-road equivalent paces for inclines from 0% through 10%.
const RAW_HILLRUNNER_ROWS = `
5.0|12:31|11:44|11:05|10:32|10:03|9:38|9:16|8:56|8:38|8:22|8:07
5.2|12:02|11:18|10:42|10:11|9:44|9:20|8:59|8:40|8:23|8:08|7:54
5.4|11:35|10:55|10:20|9:51|9:26|9:03|8:43|8:25|8:09|7:55|7:41
5.6|11:10|10:32|10:00|9:33|9:09|8:48|8:29|8:12|7:56|7:42|7:29
5.8|10:47|10:12|9:42|9:16|8:53|8:33|8:15|7:58|7:44|7:30|7:18
6.0|10:26|9:52|9:24|9:00|8:38|8:19|8:02|7:46|7:32|7:19|7:07
6.1|10:15|9:43|9:16|8:52|8:31|8:12|7:55|7:40|7:26|7:14|7:02
6.2|10:05|9:34|9:08|8:44|8:24|8:06|7:49|7:34|7:21|7:08|6:57
6.3|9:56|9:26|9:00|8:37|8:17|7:59|7:43|7:29|7:15|7:03|6:52
6.4|9:46|9:17|8:52|8:30|8:10|7:53|7:37|7:23|7:10|6:58|6:47
6.5|9:37|9:09|8:45|8:23|8:04|7:47|7:32|7:18|7:05|6:53|6:43
6.6|9:29|9:01|8:37|8:16|7:58|7:41|7:26|7:13|7:00|6:49|6:38
6.7|9:20|8:53|8:30|8:10|7:52|7:35|7:21|7:07|6:55|6:44|6:34
6.8|9:12|8:45|8:23|8:03|7:46|7:30|7:15|7:02|6:50|6:40|6:29
6.9|9:04|8:39|8:17|7:57|7:40|7:24|7:10|6:58|6:46|6:35|6:25
7.0|8:56|8:32|8:10|7:51|7:34|7:19|7:05|6:53|6:41|6:31|6:21
7.1|8:49|8:25|8:04|7:45|7:29|7:14|7:00|6:48|6:37|6:27|6:17
7.2|8:41|8:18|7:58|7:40|7:23|7:09|6:56|6:44|6:33|6:22|6:13
7.3|8:34|8:12|7:52|7:34|7:18|7:04|6:51|6:39|6:28|6:18|6:09
7.4|8:27|8:05|7:46|7:28|7:13|6:59|6:46|6:35|6:24|6:14|6:05
7.5|8:20|7:59|7:40|7:23|7:08|6:54|6:42|6:31|6:20|6:11|6:02
7.6|8:14|7:53|7:34|7:18|7:03|6:50|6:38|6:26|6:16|6:07|5:58
7.7|8:07|7:47|7:29|7:13|6:58|6:45|6:33|6:22|6:12|6:03|5:55
7.8|8:01|7:41|7:24|7:08|6:54|6:41|6:29|6:18|6:09|5:59|5:51
7.9|7:55|7:36|7:18|7:03|6:49|6:37|6:25|6:15|6:05|5:56|5:48
8.0|7:49|7:30|7:13|6:58|6:45|6:32|6:21|6:11|6:01|5:52|5:44
8.1|7:43|7:25|7:08|6:54|6:40|6:28|6:17|6:07|5:58|5:49|5:41
8.2|7:38|7:20|7:04|6:49|6:36|6:24|6:13|6:03|5:54|5:46|5:38
8.3|7:32|7:15|6:59|6:45|6:32|6:20|6:10|6:00|5:51|5:42|5:35
8.4|7:27|7:10|6:54|6:40|6:28|6:16|6:06|5:56|5:47|5:39|5:32
8.5|7:22|7:05|6:50|6:36|6:24|6:13|6:02|5:53|5:44|5:36|5:29
8.6|7:16|7:00|6:45|6:32|6:20|6:09|5:59|5:49|5:41|5:33|5:26
8.7|7:11|6:55|6:41|6:28|6:16|6:05|5:55|5:46|5:38|5:30|5:23
8.8|7:07|6:51|6:37|6:24|6:12|6:02|5:52|5:43|5:35|5:27|5:20
8.9|7:02|6:46|6:32|6:20|6:09|5:58|5:49|5:40|5:32|5:24|5:17
9.0|6:57|6:42|6:28|6:16|6:05|5:55|5:45|5:37|5:29|5:21|5:14
9.1|6:52|6:38|6:24|6:12|6:01|5:51|5:42|5:34|5:26|5:18|5:11
9.2|6:48|6:34|6:20|6:09|5:58|5:48|5:39|5:31|5:23|5:16|5:09
9.3|6:44|6:29|6:17|6:05|5:55|5:45|5:36|5:28|5:20|5:13|5:06
9.4|6:39|6:25|6:13|6:02|5:51|5:42|5:33|5:25|5:17|5:10|5:04
9.5|6:35|6:22|6:09|5:58|5:48|5:39|5:30|5:22|5:14|5:08|5:01
9.6|6:31|6:18|6:06|5:55|5:45|5:35|5:27|5:19|5:12|5:05|4:59
9.7|6:27|6:14|6:02|5:51|5:42|5:32|5:24|5:16|5:09|5:02|4:56
9.8|6:23|6:10|5:59|5:48|5:38|5:30|5:21|5:14|5:07|5:00|4:54
9.9|6:19|6:07|5:55|5:45|5:35|5:27|5:19|5:11|5:04|4:58|4:51
10.0|6:15|6:03|5:52|5:42|5:32|5:24|5:16|5:08|5:02|4:55|4:49
10.1|6:12|6:00|5:49|5:39|5:29|5:21|5:13|5:06|4:59|4:53|4:47
10.2|6:08|5:56|5:45|5:36|5:27|5:18|5:11|5:03|4:57|4:50|4:45
10.3|6:04|5:53|5:42|5:33|5:24|5:16|5:08|5:01|4:54|4:48|4:42
10.4|6:01|5:50|5:39|5:30|5:21|5:13|5:05|4:58|4:52|4:46|4:40
10.5|5:57|5:46|5:36|5:27|5:18|5:10|5:03|4:56|4:50|4:44|4:38
10.6|5:54|5:43|5:33|5:24|5:15|5:08|5:00|4:54|4:47|4:41|4:36
10.7|5:51|5:40|5:30|5:21|5:13|5:05|4:58|4:51|4:45|4:39|4:34
10.8|5:48|5:37|5:27|5:18|5:10|5:03|4:56|4:49|4:43|4:37|4:32
10.9|5:44|5:34|5:24|5:16|5:08|5:00|4:53|4:47|4:41|4:35|4:30
11.0|5:41|5:31|5:22|5:13|5:05|4:58|4:51|4:45|4:39|4:33|4:28
11.2|5:35|5:25|5:16|5:08|5:00|4:53|4:46|4:40|4:34|4:29|4:24
11.4|5:29|5:20|5:11|5:03|4:55|4:49|4:42|4:36|4:30|4:25|4:20
11.6|5:24|5:14|5:06|4:58|4:51|4:44|4:38|4:32|4:27|4:21|4:17
11.8|5:18|5:09|5:01|4:53|4:46|4:40|4:34|4:28|4:23|4:18|4:13
12.0|5:13|5:04|4:56|4:49|4:42|4:36|4:30|4:24|4:19|4:14|4:10
`;

export const HILLRUNNER_SPEED_RANGE_MPH = Object.freeze({ min: 5, max: 12 });
export const HILLRUNNER_INCLINE_RANGE = Object.freeze({ min: 0, max: 10 });
export const HILLRUNNER_VALIDATED_EQUIVALENT_PACE_RANGE_SECONDS_PER_MILE = Object.freeze({
  min: 6 * 60 + 45,
  max: 10 * 60
});

const HILLRUNNER_ROWS = Object.freeze(
  RAW_HILLRUNNER_ROWS.trim().split("\n").map((line) => {
    const [speed, ...paces] = line.split("|");
    if (paces.length !== 11) throw new Error(`Invalid HillRunner row: ${line}`);
    return Object.freeze({
      speedMph: Number(speed),
      equivalentPaceSecondsPerMile: Object.freeze(paces.map(parseClock))
    });
  })
);

export function convertTreadmillEffort({ speed, speedUnit = "kph", inclinePercent }) {
  const numericSpeed = Number(speed);
  const incline = Number(inclinePercent);
  const speedMph = speedUnit === "kph" ? numericSpeed / KM_PER_MILE : numericSpeed;

  if (!Number.isFinite(numericSpeed) || numericSpeed <= 0) {
    return invalidResult("invalid-speed", speedMph, incline);
  }
  if (!Number.isFinite(incline)) {
    return invalidResult("invalid-incline", speedMph, incline);
  }
  if (speedMph < HILLRUNNER_SPEED_RANGE_MPH.min || speedMph > HILLRUNNER_SPEED_RANGE_MPH.max) {
    return invalidResult("speed-range", speedMph, incline);
  }
  if (incline < HILLRUNNER_INCLINE_RANGE.min || incline > HILLRUNNER_INCLINE_RANGE.max) {
    return invalidResult("incline-range", speedMph, incline);
  }

  const [lowerRow, upperRow] = findSpeedRows(speedMph);
  const lowerPace = interpolateIncline(lowerRow, incline);
  const upperPace = interpolateIncline(upperRow, incline);
  const speedRatio = lowerRow === upperRow
    ? 0
    : (speedMph - lowerRow.speedMph) / (upperRow.speedMph - lowerRow.speedMph);
  const equivalentPaceSecondsPerMile = interpolate(lowerPace, upperPace, speedRatio);
  const treadmillPaceSecondsPerMile = 3600 / speedMph;
  const equivalentSpeedMph = 3600 / equivalentPaceSecondsPerMile;
  const exactSpeed = Math.abs(lowerRow.speedMph - speedMph) < 1e-9;
  const exactIncline = Number.isInteger(incline);
  const withinValidatedIncline = incline <= 4;
  const withinValidatedPace =
    equivalentPaceSecondsPerMile >=
      HILLRUNNER_VALIDATED_EQUIVALENT_PACE_RANGE_SECONDS_PER_MILE.min &&
    equivalentPaceSecondsPerMile <=
      HILLRUNNER_VALIDATED_EQUIVALENT_PACE_RANGE_SECONDS_PER_MILE.max;

  return Object.freeze({
    valid: true,
    speedMph,
    speedKph: speedMph * KM_PER_MILE,
    inclinePercent: incline,
    treadmillPaceSecondsPerMile,
    treadmillPaceSecondsPerKm: treadmillPaceSecondsPerMile / KM_PER_MILE,
    equivalentPaceSecondsPerMile,
    equivalentPaceSecondsPerKm: equivalentPaceSecondsPerMile / KM_PER_MILE,
    equivalentSpeedMph,
    equivalentSpeedKph: equivalentSpeedMph * KM_PER_MILE,
    differenceSecondsPerMile: equivalentPaceSecondsPerMile - treadmillPaceSecondsPerMile,
    differenceSecondsPerKm:
      (equivalentPaceSecondsPerMile - treadmillPaceSecondsPerMile) / KM_PER_MILE,
    interpolationUsed: !(exactSpeed && exactIncline),
    withinValidatedIncline,
    withinValidatedPace,
    withinValidatedRange: withinValidatedIncline && withinValidatedPace
  });
}

function findSpeedRows(speedMph) {
  const upperIndex = HILLRUNNER_ROWS.findIndex((row) => row.speedMph >= speedMph);
  const upperRow = HILLRUNNER_ROWS[Math.max(0, upperIndex)];
  if (Math.abs(upperRow.speedMph - speedMph) < 1e-9 || upperIndex === 0) {
    return [upperRow, upperRow];
  }
  return [HILLRUNNER_ROWS[upperIndex - 1], upperRow];
}

function interpolateIncline(row, incline) {
  const lower = Math.floor(incline);
  const upper = Math.ceil(incline);
  if (lower === upper) return row.equivalentPaceSecondsPerMile[lower];
  return interpolate(
    row.equivalentPaceSecondsPerMile[lower],
    row.equivalentPaceSecondsPerMile[upper],
    incline - lower
  );
}

function interpolate(start, end, ratio) {
  return start + (end - start) * ratio;
}

function parseClock(value) {
  const [minutes, seconds] = value.split(":").map(Number);
  return minutes * 60 + seconds;
}

function invalidResult(reason, speedMph, inclinePercent) {
  return Object.freeze({
    valid: false,
    reason,
    speedMph,
    inclinePercent
  });
}
