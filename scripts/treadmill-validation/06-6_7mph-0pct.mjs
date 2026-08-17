import { validateLiteratureCase } from "./validate-case.mjs";

export const result = validateLiteratureCase({
  id: "HR-06", inputUnit: "kph", speedMph: 6.7, inclinePercent: 0, expectedPace: "9:20"
});
