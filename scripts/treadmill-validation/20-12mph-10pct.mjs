import { validateLiteratureCase } from "./validate-case.mjs";

export const result = validateLiteratureCase({
  id: "HR-20", inputUnit: "kph", speedMph: 12.0, inclinePercent: 10, expectedPace: "4:10"
});
