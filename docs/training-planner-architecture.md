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

- For 15K-30K / half-marathon plans from Phase II onward, odd weeks use Threshold + Repetition.
- Even weeks use Threshold + Interval.
- The UI exposes an explicit odd/even week toggle and hides it in Phase I.

This follows the two-week Alien Program ordering in Daniels' Running Formula, 4th ed. Weekly mileage can still limit the number of quality exposures.

### Marathon-specific planner

Marathon plans use a dedicated progression instead of the generic Tuesday/Thursday quality template. Phase I is the six-week running prerequisite before the Daniels 18-week 2Q program; phases II-IV map to its first, middle, and final six-week blocks:

- Phase I: E running, one capped E long run, and strides from the third week onward. No formal T or R session is inserted.
- Phase II: the six-week rotation follows the early 2Q pattern from the marathon chapter: E/M/T mixed long sessions, T medium-long sessions, steady E long runs, T work, and occasional I+R or I sessions. It is not limited to an E long run plus R.
- Phase III: the middle six weeks rotate E/M/T mixed long sessions, T medium-long work, steady E long runs, M sessions, T sessions, and occasional I+R or I work.
- Phase IV: the final six weeks rotate M long sessions, T medium-long work, E long runs, T, I+R, I+T, and M+T. Race week changes Q1 to a maximum of 90 minutes E and Q2 to a short T stimulus.
- Q1 is Sunday and Q2 is Wednesday, leaving two E days before Q2 and three E days before the next Q1.
- The mileage input is treated as peak mileage. The 2Q fractions are `80/80/90/90/90/90%` in Phase II, `100/90/100/100/90/90%` in Phase III, and `100/100/90/90/90/75%` in Phase IV; the final 75% is a conservative race-week adaptation because the table does not publish a single race-week fraction.
- Long runs use the lesser of 30% of weekly mileage below or at 64 km, 25% above 64 km, and the distance covered at the slow end of adjusted E pace in 150 minutes. Race-week Q1 uses a 90-minute time cap.
- Per-session intensity caps are enforced: T `min(10%, 24 km)`, I `min(8%, 10 km)`, R `min(5%, 8 km)`, and M `min(20%, 29 km)` above 64 km or `min(30%, 29 km)` at lower mileage.
- Marathon Q cards use workout-type-specific swap candidates rather than the generic single-zone catalog. Alternatives preserve the planned session total and expose each E/M/T/I/R segment plus its recovery; the fixed race-week Q1 deliberately has no swap option.

Non-marathon Phase IV guidance is event-specific rather than a generic percentage taper. The regular weekly structure remains in place until an important race week, when the guidance switches to the reduced Daniels race-week pattern for that event. The 15K-to-30K / half-marathon Alien Program, for example, keeps its odd/even cycle until race week, then uses two-thirds of the normal long run, `3 x 1T` three days before the race, and E running or rest on the remaining days.

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
