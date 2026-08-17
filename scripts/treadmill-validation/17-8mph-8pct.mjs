import { validateLiteratureCase } from "./validate-case.mjs";

export const result = validateLiteratureCase({
  id: "HR-17", inputUnit: "mph", speedMph: 8.0, inclinePercent: 8, expectedPace: "6:01"
});
