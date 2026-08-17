import { validateLiteratureCase } from "./validate-case.mjs";

export const result = validateLiteratureCase({
  id: "HR-05", inputUnit: "mph", speedMph: 6.5, inclinePercent: 4, expectedPace: "8:04"
});
