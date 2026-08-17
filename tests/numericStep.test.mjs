import assert from "node:assert/strict";
import {
  formatStepValue,
  roundToStepPrecision,
  stepNumericValue
} from "../src/ui/numericStep.mjs";

assert.equal(roundToStepPrecision(12.299999999999999, 0.1), 12.3);
assert.equal(formatStepValue(12.299999999999999, 0.1), "12.3");
assert.equal(formatStepValue(10.000000000000007, 0.1), "10");
assert.equal(roundToStepPrecision(-0.000000000000001, 0.1), 0);

let treadmillSpeed = 8.1;
for (let index = 0; index < 112; index += 1) {
  treadmillSpeed = stepNumericValue({
    current: treadmillSpeed,
    delta: 0.1,
    min: 8.1,
    max: 19.3
  });
  assert.equal(formatStepValue(treadmillSpeed, 0.1).includes("9999"), false);
}
assert.equal(treadmillSpeed, 19.3);

for (let index = 0; index < 112; index += 1) {
  treadmillSpeed = stepNumericValue({
    current: treadmillSpeed,
    delta: -0.1,
    min: 8.1,
    max: 19.3
  });
  assert.equal(formatStepValue(treadmillSpeed, 0.1).includes("0000"), false);
}
assert.equal(treadmillSpeed, 8.1);

assert.equal(
  stepNumericValue({ current: 19.3, delta: 0.1, min: 8.1, max: 19.3 }),
  19.3
);
assert.equal(
  stepNumericValue({ current: 8.1, delta: -0.1, min: 8.1, max: 19.3 }),
  8.1
);
assert.equal(
  stepNumericValue({ current: 4.5, delta: 0.5, min: 0, max: 10 }),
  5
);

console.log("numeric step tests passed");
