import { validateLiteratureCase } from "./validate-case.mjs";

export const result = validateLiteratureCase({
  id: "HR-18", inputUnit: "kph", speedMph: 9.0, inclinePercent: 9, expectedPace: "5:21"
});
