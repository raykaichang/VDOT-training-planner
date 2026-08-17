import { validateLiteratureCase } from "./validate-case.mjs";

export const result = validateLiteratureCase({
  id: "HR-11", inputUnit: "mph", speedMph: 9.0, inclinePercent: 0, expectedPace: "6:57"
});
