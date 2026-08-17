import assert from "node:assert/strict";

const scenarioFiles = [
  "01-5mph-0pct.mjs",
  "02-5mph-1pct.mjs",
  "03-5_4mph-2pct.mjs",
  "04-6mph-3pct.mjs",
  "05-6_5mph-4pct.mjs",
  "06-6_7mph-0pct.mjs",
  "07-7mph-1pct.mjs",
  "08-7_5mph-2pct.mjs",
  "09-8mph-3pct.mjs",
  "10-8mph-4pct.mjs",
  "11-9mph-0pct.mjs",
  "12-10mph-2pct.mjs",
  "13-10mph-4pct.mjs",
  "14-5mph-5pct.mjs",
  "15-6mph-6pct.mjs",
  "16-7mph-7pct.mjs",
  "17-8mph-8pct.mjs",
  "18-9mph-9pct.mjs",
  "19-10mph-10pct.mjs",
  "20-12mph-10pct.mjs"
];

assert.equal(scenarioFiles.length, 20, "The literature suite must contain exactly 20 scenarios");

const results = [];
for (const file of scenarioFiles) {
  const scenario = await import(new URL(file, import.meta.url));
  results.push(scenario.result);
}

assert.equal(new Set(results.map(({ id }) => id)).size, 20, "Scenario IDs must be unique");
assert.ok(results.every(({ tableMatch }) => tableMatch), "Every scenario must match the HillRunner table");
assert.deepEqual(
  [...new Set(results.map(({ inclinePercent }) => inclinePercent))].sort((a, b) => a - b),
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  "The suite must cover every whole-number incline from 0% through 10%"
);
assert.deepEqual(
  [...new Set(results.map(({ inputUnit }) => inputUnit))].sort(),
  ["kph", "mph"],
  "The suite must exercise both speed units"
);
assert.equal(Math.min(...results.map(({ speedMph }) => speedMph)), 5);
assert.equal(Math.max(...results.map(({ speedMph }) => speedMph)), 12);

const studySupported = results.filter(({ withinValidatedRange }) => withinValidatedRange).length;
const outsideStudyRange = results.length - studySupported;

console.log("");
console.log(`20/20 HillRunner table scenarios passed.`);
console.log(`${studySupported} are inside the full Foreman et al. study-supported range.`);
console.log(`${outsideStudyRange} match the table but are correctly marked outside the study-supported range.`);
