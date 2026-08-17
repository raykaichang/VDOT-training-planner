import { validateLiteratureCase } from "./validate-case.mjs";

export const result = validateLiteratureCase({
  id: "HR-08", inputUnit: "kph", speedMph: 7.5, inclinePercent: 2, expectedPace: "7:40"
});
