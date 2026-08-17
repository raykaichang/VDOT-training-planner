import { validateLiteratureCase } from "./validate-case.mjs";

export const result = validateLiteratureCase({
  id: "HR-14", inputUnit: "kph", speedMph: 5.0, inclinePercent: 5, expectedPace: "9:38"
});
