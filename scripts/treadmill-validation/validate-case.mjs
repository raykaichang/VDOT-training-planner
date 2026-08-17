import assert from "node:assert/strict";
import {
  HILLRUNNER_VALIDATED_EQUIVALENT_PACE_RANGE_SECONDS_PER_MILE,
  KM_PER_MILE,
  convertTreadmillEffort
} from "../../src/treadmill/hillRunner.mjs";

export const LITERATURE_SOURCES = Object.freeze({
  chart: "https://www.hillrunner.com/calculators/treadmill-pace-conversions/",
  validationStudy: "https://pmc.ncbi.nlm.nih.gov/articles/PMC10707652/",
  doi: "https://doi.org/10.1123/ijspp.2021-0021"
});

export function validateLiteratureCase(testCase) {
  const {
    id,
    inputUnit,
    speedMph,
    inclinePercent,
    expectedPace
  } = testCase;
  const inputSpeed = inputUnit === "kph" ? speedMph * KM_PER_MILE : speedMph;
  const expectedPaceSecondsPerMile = paceToSeconds(expectedPace);
  const result = convertTreadmillEffort({
    speed: inputSpeed,
    speedUnit: inputUnit,
    inclinePercent
  });

  assert.equal(result.valid, true, `${id}: conversion should be valid`);
  assert.ok(
    Math.abs(result.speedMph - speedMph) < 1e-9,
    `${id}: ${inputUnit} input should normalize to ${speedMph} mph`
  );
  assert.ok(
    Math.abs(result.equivalentPaceSecondsPerMile - expectedPaceSecondsPerMile) < 1e-9,
    `${id}: expected HillRunner pace ${expectedPace}`
  );
  assert.equal(result.interpolationUsed, false, `${id}: should use an exact published cell`);

  const expectedWithinValidatedIncline = inclinePercent <= 4;
  const expectedWithinValidatedPace =
    expectedPaceSecondsPerMile >=
      HILLRUNNER_VALIDATED_EQUIVALENT_PACE_RANGE_SECONDS_PER_MILE.min &&
    expectedPaceSecondsPerMile <=
      HILLRUNNER_VALIDATED_EQUIVALENT_PACE_RANGE_SECONDS_PER_MILE.max;
  const expectedWithinValidatedRange =
    expectedWithinValidatedIncline && expectedWithinValidatedPace;

  assert.equal(
    result.withinValidatedIncline,
    expectedWithinValidatedIncline,
    `${id}: incline validation status should match Foreman et al.`
  );
  assert.equal(
    result.withinValidatedPace,
    expectedWithinValidatedPace,
    `${id}: pace validation status should match Foreman et al.`
  );
  assert.equal(
    result.withinValidatedRange,
    expectedWithinValidatedRange,
    `${id}: overall validation status should match Foreman et al.`
  );

  const validationStatus = result.withinValidatedRange
    ? "study-supported"
    : "table-match-outside-study-range";
  console.log(
    `[PASS] ${id} | ${speedMph.toFixed(1)} mph | ${inclinePercent}% | ${expectedPace}/mi | ${validationStatus}`
  );

  return Object.freeze({
    id,
    inputUnit,
    inputSpeed,
    speedMph,
    inclinePercent,
    expectedPace,
    tableMatch: true,
    withinValidatedIncline: result.withinValidatedIncline,
    withinValidatedPace: result.withinValidatedPace,
    withinValidatedRange: result.withinValidatedRange,
    validationStatus
  });
}

function paceToSeconds(pace) {
  const match = /^(\d+):(\d{2})$/.exec(pace);
  assert.ok(match, `Invalid pace: ${pace}`);
  const minutes = Number(match[1]);
  const seconds = Number(match[2]);
  assert.ok(seconds < 60, `Invalid pace: ${pace}`);
  return minutes * 60 + seconds;
}
