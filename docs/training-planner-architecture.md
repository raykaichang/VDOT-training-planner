# Training Planner Rotation Architecture

The planner now treats workout composition as a coaching decision instead of a fixed pace bundle attached to each race distance.

## Core Principles

- Threshold remains the protected primary quality session for every goal race.
- Race-specific phases do not hard-code combinations such as `5K = I + R` or `Marathon = M only`.
- Workout selection considers phase, goal race, weekly mileage, previous workouts, and the selected rotation strategy.
- Every workout template carries metadata for phase, target race, priority, compatible rotation strategies, mileage bounds, recovery rules, and physiological purpose.
- Repetition is avoided by scoring recent workout history and lowering the score of repeated quality types and exact template repeats.

## Rotation Strategies

### Classic Daniels Progression

Uses phase as the main steering signal:

- Base: Threshold plus speed economy.
- Build: Threshold plus intervals.
- Race-specific: event-weighted selection that still rotates away from recent repetition.
- Peak: Threshold plus a lighter event-relevant sharpening stimulus.

### Alternating T+I / T+R

- Odd weeks: Threshold + Interval.
- Even weeks: Threshold + Repetition.

Race distance still influences which exact template is selected, and weekly mileage can limit the number of quality exposures.

### Mileage Adaptive

- Under 40 km/week: Threshold is primary; a secondary I/R stimulus appears only when mileage supports it.
- 40-70 km/week: Threshold plus one secondary quality stimulus, rotating I/R and allowing optional M for longer races.
- Over 70 km/week: two or three quality exposures may be selected, always including Threshold.

## Race Emphasis

- 5K: Threshold, Interval, Repetition.
- 10K: Threshold, Interval, Repetition.
- Half Marathon: Threshold, Interval or Repetition, optional Marathon Pace.
- Marathon: Marathon Pace, Threshold, optional Interval or Repetition.

These are weights, not rigid templates. The scoring engine may rotate the secondary workout when the same stimulus has appeared too often recently.

## Localization

The planner UI model defaults to Traditional Chinese (`zh-TW`) and exposes an English (`en`) option. The planner response includes localized labels and workout names so a UI can render Chinese by default while offering an EN switch.

## Visual Web Mode

The visual planner is available from `index.html` and can be served with:

```bash
npm run dev
```

The page now focuses on runner-facing pace guidance. It accepts VDOT, weekly mileage, temperature, and humidity, then renders ability-based E/M/T/I/R training pace ranges, heat-adjusted pace ranges, I/R split references, and the mileage class derived from the `class` reference folder. The interface defaults to Chinese and includes an EN language selector.
