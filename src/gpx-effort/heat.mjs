import { calculateHeatAdjustment } from "../training-planner/paceCalculator.mjs";

export const RaceType = Object.freeze({
  FIVE_K: "FIVE_K",
  TEN_K: "TEN_K",
  HALF_MARATHON: "HALF_MARATHON",
  MARATHON: "MARATHON",
  LONG_CONTINUOUS: "LONG_CONTINUOUS"
});

export const AcclimationLevel = Object.freeze({
  NONE: "NONE",
  PARTIAL: "PARTIAL",
  FULL: "FULL"
});

export const SunExposure = Object.freeze({
  SHADE: "SHADE",
  NORMAL: "NORMAL",
  FULL_SUN: "FULL_SUN"
});

export const WindCondition = Object.freeze({
  BREEZY: "BREEZY",
  NORMAL: "NORMAL",
  STILL: "STILL"
});

export const RACE_TYPE_FACTORS = Object.freeze({
  [RaceType.FIVE_K]: 0.35,
  [RaceType.TEN_K]: 0.55,
  [RaceType.HALF_MARATHON]: 0.8,
  [RaceType.MARATHON]: 1,
  [RaceType.LONG_CONTINUOUS]: 0.9
});

export const ACCLIMATION_FACTORS = Object.freeze({
  [AcclimationLevel.NONE]: 1.25,
  [AcclimationLevel.PARTIAL]: 1,
  [AcclimationLevel.FULL]: 0.8
});

export const SUN_FACTORS = Object.freeze({
  [SunExposure.SHADE]: 0.9,
  [SunExposure.NORMAL]: 1,
  [SunExposure.FULL_SUN]: 1.15
});

export const WIND_FACTORS = Object.freeze({
  [WindCondition.BREEZY]: 0.9,
  [WindCondition.NORMAL]: 1,
  [WindCondition.STILL]: 1.1
});

export function calculateHeatIndexCelsius(tempC, relativeHumidity) {
  const temperatureF = Number(tempC) * 9 / 5 + 32;
  const humidity = clamp(Number(relativeHumidity), 0, 100);
  const simpleHeatIndexF =
    0.5 *
    (temperatureF +
      61 +
      (temperatureF - 68) * 1.2 +
      humidity * 0.094);

  if (simpleHeatIndexF < 80) return (simpleHeatIndexF - 32) / 1.8;

  let heatIndexF =
    -42.379 +
    2.04901523 * temperatureF +
    10.14333127 * humidity -
    0.22475541 * temperatureF * humidity -
    0.00683783 * temperatureF ** 2 -
    0.05481717 * humidity ** 2 +
    0.00122874 * temperatureF ** 2 * humidity +
    0.00085282 * temperatureF * humidity ** 2 -
    0.00000199 * temperatureF ** 2 * humidity ** 2;

  if (humidity < 13 && temperatureF >= 80 && temperatureF <= 112) {
    heatIndexF -=
      ((13 - humidity) / 4) *
      Math.sqrt((17 - Math.abs(temperatureF - 95)) / 17);
  } else if (humidity > 85 && temperatureF >= 80 && temperatureF <= 87) {
    heatIndexF += ((humidity - 85) / 10) * ((87 - temperatureF) / 5);
  }

  return (heatIndexF - 32) / 1.8;
}

export function estimateHeatSlowdownPercent(settings) {
  if (!settings?.enabled) {
    const heatIndexC = calculateHeatIndexCelsius(
      settings?.temperatureC ?? 20,
      settings?.relativeHumidity ?? 50
    );
    return {
      heatIndexC,
      baseSlowdown: 0,
      finalSlowdown: 0,
      warnings: []
    };
  }

  const temperatureC = clamp(Number(settings.temperatureC), -5, 45);
  const relativeHumidity = clamp(Number(settings.relativeHumidity), 0, 100);
  const heatIndexC = calculateHeatIndexCelsius(temperatureC, relativeHumidity);
  const baseHeatAdjustment = calculateHeatAdjustment(temperatureC, relativeHumidity);
  const baseSlowdown = clamp(1 - 1 / baseHeatAdjustment.multiplier, 0, 0.5);
  const finalSlowdown = clamp(
    baseSlowdown *
      (RACE_TYPE_FACTORS[settings.raceType] ?? RACE_TYPE_FACTORS.HALF_MARATHON) *
      (ACCLIMATION_FACTORS[settings.acclimationLevel] ?? ACCLIMATION_FACTORS.PARTIAL) *
      (SUN_FACTORS[settings.sunExposure] ?? SUN_FACTORS.NORMAL) *
      (WIND_FACTORS[settings.windCondition] ?? WIND_FACTORS.NORMAL),
    0,
    0.25
  );
  const warnings = [];

  if (heatIndexC >= 35) warnings.push("HEAT_INDEX_HIGH");
  if (temperatureC >= 30 && relativeHumidity >= 85) warnings.push("HOT_HUMID");
  if (finalSlowdown >= 0.15) warnings.push("HEAT_SLOWDOWN_HIGH");

  return {
    heatIndexC,
    baseSlowdown,
    finalSlowdown,
    warnings
  };
}

export function applyHeatSlowdownToPace(paceSecondsPerKm, finalSlowdown) {
  const slowdown = clamp(Number(finalSlowdown), 0, 0.99);
  return paceSecondsPerKm / (1 - slowdown);
}

function clamp(value, min, max) {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}
