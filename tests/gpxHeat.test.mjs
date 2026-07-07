import assert from "node:assert/strict";
import {
  applyHeatSlowdownToPace,
  calculateHeatIndexCelsius,
  estimateHeatSlowdownPercent,
  RaceType
} from "../src/gpx-effort/heat.mjs";
import { createSegments } from "../src/gpx-effort/segmentation.mjs";

const heatIndex = calculateHeatIndexCelsius(30, 85);
assert.ok(heatIndex > 35);
assert.ok(heatIndex < 40);

const cool = estimateHeatSlowdownPercent({
  enabled: false,
  temperatureC: 30,
  relativeHumidity: 85,
  raceType: RaceType.MARATHON
});
assert.equal(cool.finalSlowdown, 0);

assert.equal(Math.round(applyHeatSlowdownToPace(330, 0.08) * 10) / 10, 358.7);

const flatRoute = [
  { distanceM: 0, smoothedElevationM: 0 },
  { distanceM: 1000, smoothedElevationM: 0 },
  { distanceM: 2000, smoothedElevationM: 0 }
];

const noHeatSegments = createSegments(flatRoute, 1, 300, 0.65, {
  enabled: false
});
assert.equal(
  Math.round(noHeatSegments[0].heatAdjustedPaceSecPerKm),
  Math.round(noHeatSegments[0].recommendedActualPaceSecPerKm)
);
assert.equal(noHeatSegments[0].heatDeltaSecPerKm, 0);
assert.equal(
  Math.round(noHeatSegments[0].finalSegmentTimeSec),
  Math.round(noHeatSegments[0].gradeAdjustedSegmentTimeSec)
);

const hotSegments = createSegments(flatRoute, 1, 330, 0.65, {
  enabled: true,
  temperatureC: 32,
  relativeHumidity: 90,
  raceType: RaceType.MARATHON
});
assert.ok(hotSegments[0].heatAdjustedPaceSecPerKm > hotSegments[0].recommendedActualPaceSecPerKm);
assert.ok(hotSegments[0].finalSegmentTimeSec > hotSegments[0].gradeAdjustedSegmentTimeSec);

console.log("gpxHeat tests passed");
