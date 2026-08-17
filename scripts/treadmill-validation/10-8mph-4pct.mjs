import { validateLiteratureCase } from "./validate-case.mjs";

export const result = validateLiteratureCase({
  id: "HR-10", inputUnit: "kph", speedMph: 8.0, inclinePercent: 4, expectedPace: "6:45"
});
