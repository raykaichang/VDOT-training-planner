import { validateLiteratureCase } from "./validate-case.mjs";

export const result = validateLiteratureCase({
  id: "HR-13", inputUnit: "mph", speedMph: 10.0, inclinePercent: 4, expectedPace: "5:32"
});
