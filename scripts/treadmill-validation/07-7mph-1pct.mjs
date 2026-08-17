import { validateLiteratureCase } from "./validate-case.mjs";

export const result = validateLiteratureCase({
  id: "HR-07", inputUnit: "mph", speedMph: 7.0, inclinePercent: 1, expectedPace: "8:32"
});
