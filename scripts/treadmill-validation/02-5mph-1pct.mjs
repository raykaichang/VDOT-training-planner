import { validateLiteratureCase } from "./validate-case.mjs";

export const result = validateLiteratureCase({
  id: "HR-02", inputUnit: "kph", speedMph: 5.0, inclinePercent: 1, expectedPace: "11:44"
});
