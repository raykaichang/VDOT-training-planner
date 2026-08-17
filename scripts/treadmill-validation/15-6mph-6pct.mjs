import { validateLiteratureCase } from "./validate-case.mjs";

export const result = validateLiteratureCase({
  id: "HR-15", inputUnit: "mph", speedMph: 6.0, inclinePercent: 6, expectedPace: "8:02"
});
