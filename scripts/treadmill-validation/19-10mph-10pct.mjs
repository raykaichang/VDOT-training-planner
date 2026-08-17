import { validateLiteratureCase } from "./validate-case.mjs";

export const result = validateLiteratureCase({
  id: "HR-19", inputUnit: "mph", speedMph: 10.0, inclinePercent: 10, expectedPace: "4:49"
});
