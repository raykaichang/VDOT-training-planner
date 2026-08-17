import { validateLiteratureCase } from "./validate-case.mjs";

export const result = validateLiteratureCase({
  id: "HR-12", inputUnit: "kph", speedMph: 10.0, inclinePercent: 2, expectedPace: "5:52"
});
