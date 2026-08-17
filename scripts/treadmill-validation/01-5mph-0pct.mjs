import { validateLiteratureCase } from "./validate-case.mjs";

export const result = validateLiteratureCase({
  id: "HR-01", inputUnit: "mph", speedMph: 5.0, inclinePercent: 0, expectedPace: "12:31"
});
