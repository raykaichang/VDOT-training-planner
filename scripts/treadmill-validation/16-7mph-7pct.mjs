import { validateLiteratureCase } from "./validate-case.mjs";

export const result = validateLiteratureCase({
  id: "HR-16", inputUnit: "kph", speedMph: 7.0, inclinePercent: 7, expectedPace: "6:53"
});
