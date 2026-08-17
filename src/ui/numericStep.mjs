export function roundToStepPrecision(value, step) {
  const numericValue = Number(value);
  const numericStep = Math.abs(Number(step));
  if (!Number.isFinite(numericValue)) return numericValue;
  if (!Number.isFinite(numericStep) || numericStep === 0) return numericValue;

  const scale = 10 ** decimalPlaces(numericStep);
  const rounded = Math.round(numericValue * scale) / scale;
  return Object.is(rounded, -0) ? 0 : rounded;
}

export function stepNumericValue({ current, delta, min = -Infinity, max = Infinity }) {
  const numericCurrent = Number(current);
  const numericDelta = Number(delta);
  const numericMin = Number(min);
  const numericMax = Number(max);

  if (!Number.isFinite(numericCurrent) || !Number.isFinite(numericDelta)) {
    throw new TypeError("current and delta must be finite numbers");
  }

  const stepped = roundToStepPrecision(numericCurrent + numericDelta, numericDelta);
  return Math.min(numericMax, Math.max(numericMin, stepped));
}

export function formatStepValue(value, step) {
  return String(roundToStepPrecision(value, step));
}

function decimalPlaces(value) {
  const text = String(value).toLowerCase();
  if (text.includes("e-")) {
    const [coefficient, exponent] = text.split("e-");
    const coefficientDecimals = coefficient.split(".")[1]?.length ?? 0;
    return Number(exponent) + coefficientDecimals;
  }
  return text.split(".")[1]?.length ?? 0;
}
