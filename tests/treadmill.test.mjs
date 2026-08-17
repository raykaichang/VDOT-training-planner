import assert from "node:assert/strict";
import {
  KM_PER_MILE,
  convertTreadmillEffort
} from "../src/treadmill/hillRunner.mjs";

const flatEightMph = convertTreadmillEffort({
  speed: 8,
  speedUnit: "mph",
  inclinePercent: 0
});
assert.equal(flatEightMph.valid, true);
assert.equal(flatEightMph.equivalentPaceSecondsPerMile, 7 * 60 + 49);
assert.equal(flatEightMph.treadmillPaceSecondsPerMile, 7 * 60 + 30);
assert.equal(flatEightMph.interpolationUsed, false);
assert.equal(flatEightMph.withinValidatedIncline, true);
assert.equal(flatEightMph.withinValidatedPace, true);
assert.equal(flatEightMph.withinValidatedRange, true);

const onePercentEightMph = convertTreadmillEffort({
  speed: 8,
  speedUnit: "mph",
  inclinePercent: 1
});
assert.equal(onePercentEightMph.equivalentPaceSecondsPerMile, 7 * 60 + 30);

const steepEightMph = convertTreadmillEffort({
  speed: 8,
  speedUnit: "mph",
  inclinePercent: 10
});
assert.equal(steepEightMph.equivalentPaceSecondsPerMile, 5 * 60 + 44);
assert.equal(steepEightMph.withinValidatedIncline, false);
assert.equal(steepEightMph.withinValidatedRange, false);

const metricEightMph = convertTreadmillEffort({
  speed: 8 * KM_PER_MILE,
  speedUnit: "kph",
  inclinePercent: 4
});
assert.ok(Math.abs(metricEightMph.equivalentPaceSecondsPerMile - (6 * 60 + 45)) < 1e-9);
assert.equal(metricEightMph.withinValidatedRange, true);

const outsideValidatedPace = convertTreadmillEffort({
  speed: 5,
  speedUnit: "mph",
  inclinePercent: 0
});
assert.equal(outsideValidatedPace.withinValidatedIncline, true);
assert.equal(outsideValidatedPace.withinValidatedPace, false);
assert.equal(outsideValidatedPace.withinValidatedRange, false);

const interpolated = convertTreadmillEffort({
  speed: 8,
  speedUnit: "mph",
  inclinePercent: 0.5
});
assert.equal(interpolated.equivalentPaceSecondsPerMile, 459.5);
assert.equal(interpolated.interpolationUsed, true);

assert.equal(
  convertTreadmillEffort({ speed: 4.9, speedUnit: "mph", inclinePercent: 1 }).reason,
  "speed-range"
);
assert.equal(
  convertTreadmillEffort({ speed: 8, speedUnit: "mph", inclinePercent: 10.5 }).reason,
  "incline-range"
);

console.log("treadmill conversion tests passed");
