import { validateLiteratureCase } from "./validate-case.mjs";

export const result = validateLiteratureCase({
  id: "HR-03", inputUnit: "mph", speedMph: 5.4, inclinePercent: 2, expectedPace: "10:20"
});
