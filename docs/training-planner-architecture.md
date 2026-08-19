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

## Hansons Plans

The planner exposes Hansons as a separate training system rather than mixing Hansons workouts into the Daniels phase engine.

- Hansons mode offers only the half-marathon and marathon 18-week plans that can be checked week by week against the free official Classic schedules.
- Half-marathon and marathon Beginner/Advanced plans reproduce the official Luke Humphrey Running schedule structure, weekly totals, long-run progression, Speed-to-Strength transition, goal-pace tempo progression, taper, and race week.
- After the official introductory weeks, every formal quality week follows the Hansons SOS pattern: Tuesday Speed or Strength intervals, Thursday goal-pace Tempo, Sunday long run, with easy or rest days between them. Beginner half marathon adds Tempo in week 5 and the Tuesday interval in week 6; Beginner marathon adds both in week 6. Advanced half marathon starts both in week 2, while Advanced marathon adds Tuesday Speed in week 2 and Thursday Tempo in week 3.
- Tuesday Speed follows the exact distance-specific Classic sequence instead of cycling one generic five-workout list. Half-marathon 1,000 m and 1,200 m workouts use the longer recoveries shown in its PDFs; Advanced half-marathon and marathon each use their own nine-week Speed progression.
- Tuesday changes at week 11 from 5K-10K Speed to Strength pace: Beginner half marathon uses HMP minus 10 seconds per mile, Advanced half marathon uses 10K pace, and marathon uses MP minus 10 seconds per mile. Thursday remains goal HMP or MP Tempo and grows according to the published table.
- Workout totals include every prescribed recovery jog plus the full published warm-up and cooldown: three miles total around interval/Strength sessions, three miles around half-marathon Tempo, and two miles around marathon Tempo.
- At the published Classic peak, each Monday, Tuesday, Thursday, Friday, Saturday, and Sunday distance follows the official daily table instead of evenly redistributing the weekly remainder. Wednesday remains Rest/Cross-Train, and the planner does not add strides that are absent from the Classic PDFs.
- The mileage input is the athlete's peak weekly mileage. At or above 75% of the published Classic peak, the official week structure is retained with conservative volume handling. Below 75%, the planner switches to a clearly labeled foundation / finish route with Easy running, strides, and a long run capped at 30%; it does not proportionally shrink Speed, Strength, and Tempo and call the result Classic SOS.
- A zero-mile peak produces rest days outside race week; it no longer leaves an artificial minimum long run behind.
- Hansons 5K and performance 10K are not exposed because the available first-party material provides philosophy and paid-plan descriptions rather than a free official week-by-week Classic schedule that this project can reproduce and verify.
- Hansons paces are exposed as session-specific rows, including the 5K-10K Speed anchor used inside the official half/marathon plans, goal HMP/MP, Strength pace, and long-run pace where applicable.

Official source links, checksums, and implementation notes are stored under `docs/research/hansons-official/`. Downloaded PDFs remain local research files and are not redistributed through the repository.

## Norwegian Singles / LetsRun Sub-T

Norwegian Singles is exposed as a third, independent system. Its primary load input is average weekly running time rather than weekly distance.

- Under 4.5 hours is explicitly labeled a Low-volume adaptation and capped at two quality sessions. The 4.5-to-under-6-hour Gateway range allows progression toward a third exposure; six to 8.5 hours is Full Singles eligibility; above 8.5 hours remains at three and is labeled Advanced instead of automatically adding a fourth.
- The weekly Sub-T target is 20% for new use or recently increased volume, 22.5% after 4-6 stable weeks, and 25% for long-term stable use. Thirty percent is a warning ceiling and is never an automatic target.
- The engine calculates weekly Sub-T minutes first. Under 40 budget minutes yields one session, 40-59 yields two, and 60 or more permits a third only when running days and adaptation allow it. New/recently increased volume remains at two; 4-6 stable weeks uses two full sessions plus a 10-15 minute T-lite; long-term stable use may run three full sessions.
- Adding frequency redistributes the same weekly budget. Full sessions normally target 20-30 Sub-T minutes and are capped at 35 automatic minutes, so there is no hard 299-to-300-minute frequency cliff and no forced 40-50-minute session.
- Each full session defaults to medium repetitions (6-8 minutes) and exposes short (3-4 minutes) and long (8-12 minutes) runner-selected alternatives with 60-second jogs. Alternatives keep approximately the same work minutes and preserve the planned session time; they are not automatically tied to target event or phase. The stable transition uses a controlled T-lite exposure without forcing an invalid long-rep option into its 10-15 minute budget.
- Ability determines the starting pace anchors: roughly 15K-10-mile effort for short reps, half-marathon effort for medium reps, and 25K-30K effort for long reps. These are controllers, not a claim that threshold is one fixed pace.
- Vanilla mode contains Sub-T, Easy, and an Easy Long run. After the `2 + 1 T-lite` transition, 5K, 10K, and half-marathon specificity may replace one existing quality session; it never adds an extra quality day. Marathon specificity is intentionally outside the automatic generator.
- Easy running has no mandatory minimum pace. The UI displays conversational effort and `<=70% HRmax` as method-specific guidance instead of reusing a Daniels E pace target.
- Available days and return-to-running state form an explicitly labeled application safety layer. Three days cap quality at one, four or five cap it at two, and six or seven permit three; limited time capacity reduces it further; returning runners are capped at one and cannot enable specificity.

The detailed maintenance contract and source-boundary rules live in `AGENT.md`. The core generator is `src/training-planner/norwegianSinglesPlanner.mjs`.

## Localization

The planner UI model defaults to Traditional Chinese (`zh-TW`) and exposes an English (`en`) option. The planner response includes localized labels and workout names so a UI can render Chinese by default while offering an EN switch.

## Visual Web Mode

The visual planner is available from `index.html` and can be served with:

```bash
npm run dev
```

The page now focuses on runner-facing pace guidance. It accepts VDOT, weekly mileage, temperature, and humidity, then renders ability-based E/M/T/I/R training pace ranges, heat-adjusted pace ranges, I/R split references, and the mileage class derived from the `class` reference folder. The interface defaults to Chinese and includes an EN language selector.
