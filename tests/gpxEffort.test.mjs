import assert from "node:assert/strict";
import { haversineDistance } from "../src/gpx-effort/distance.mjs";
import {
  FLAT_RUNNING_COST,
  actualPaceFromEquivalent,
  minettiRunningCost
} from "../src/gpx-effort/minetti.mjs";
import {
  formatDuration,
  formatPace,
  formatPaceDelta,
  parsePaceToSeconds
} from "../src/gpx-effort/pace.mjs";
import {
  createSegments,
  prepareRoutePoints,
  summarizeRoute
} from "../src/gpx-effort/segmentation.mjs";

assert.equal(parsePaceToSeconds("4:30"), 270);
assert.equal(parsePaceToSeconds("1:04:30"), 3870);
assert.equal(formatPace(270), "4:30 / km");
assert.equal(formatPaceDelta(18), "+0:18 / km");
assert.equal(formatDuration(3670), "1:01:10");

assert.equal(Math.round(minettiRunningCost(0) * 10) / 10, FLAT_RUNNING_COST);
assert.ok(minettiRunningCost(0.05) > FLAT_RUNNING_COST);
assert.ok(actualPaceFromEquivalent(270, 0.05) > 270);
assert.ok(actualPaceFromEquivalent(270, -0.05, 0.5) < 270);

const distanceOneDegreeLonAtEquator = haversineDistance(
  { lat: 0, lon: 0 },
  { lat: 0, lon: 1 }
);
assert.ok(distanceOneDegreeLonAtEquator > 111000);
assert.ok(distanceOneDegreeLonAtEquator < 112000);

const route = Array.from({ length: 11 }, (_, index) => ({
  lat: 25,
  lon: 121 + index * 0.001,
  elevation: index * 2
}));
const points = prepareRoutePoints(route, 100);
const segments = createSegments(points, 0.5, 270, 0.65);
const summary = summarizeRoute(points, segments);

assert.ok(points.length === route.length);
assert.ok(segments.length >= 2);
assert.ok(summary.totalDistanceKm > 1);
assert.ok(summary.totalGainM > 0);

console.log("gpxEffort tests passed");
