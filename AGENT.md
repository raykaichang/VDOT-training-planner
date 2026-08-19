# Workout Rotation Strategy

The application must NOT assume each race distance uses a fixed pace combination.

Training should develop multiple physiological systems throughout the season.

The emphasis changes by phase, but Threshold training remains the foundation.

---

## User Selectable Workout Strategy

Allow users to choose their preferred quality session rotation.

### Strategy 1

Classic Daniels Progression

Follow traditional phase progression.

Example:

Base

↓

T + Strides

↓

T + R

↓

T + I

↓

Race Specific

↓

Peak

---

### Strategy 2

Alternating T+I / T+R

Odd Weeks:

* Threshold
* Repetition

Even Weeks:

* Threshold
* Interval

Purpose:

Maintain VO₂max and running economy simultaneously while keeping Threshold work as the primary stimulus.

---

### Strategy 3

Mileage Adaptive

Automatically determine workout composition based on weekly mileage.

Example:

<40 km/week

Primary:

T

Secondary:

Alternating I/R

40–70 km/week

Primary:

T

Secondary:

T+I and T+R rotation

> 70 km/week

Two quality sessions may be scheduled.

One Threshold session.

One Interval or Repetition session.

---

# Race Specific Philosophy

Race-specific development should emphasize the physiological systems required by the target event instead of assigning rigid pace combinations.

Threshold training remains the foundation for every race distance.

The application should prioritize physiological adaptation rather than fixed templates.

---

## 5K

Primary

* Threshold
* Interval
* Repetition

Threshold should never be removed.

Training emphasis may rotate between T+I and T+R.

---

## 10K

Primary

* Threshold
* Interval
* Repetition

Threshold remains the dominant quality stimulus.

Alternate between T+I and T+R according to selected strategy.

---

## Half Marathon

Primary

* Threshold
* Long Run

Secondary

* Interval

Maintenance

* Repetition

Optional

* Marathon Pace

Marathon Pace should not be mandatory.

Threshold development is considered more important than Marathon Pace for most runners.

Long Run is a core workout and should appear throughout the race-specific phase.

---

## Marathon

Primary

* Long Run
* Marathon Pace
* Threshold

Secondary

* Interval during early race-specific phase

Maintenance

* Repetition

Long Run progression is the highest priority.

Use the marathon-specific weekly generator rather than the generic fixed-day quality template. Phase I must remain E/L/strides only; Phase II introduces R; Phase III combines M/T long work with I; Phase IV retains M/T while automatically reducing peak mileage. Keep Q1 on Sunday and Q2 on Wednesday, enforce 2-3 E days between Q sessions, cap long runs by both weekly share and 150 minutes, and validate actual M/T/I/R work against Daniels volume limits.

---

# Hansons Official Source Boundary

- Only expose the Hansons half-marathon and marathon options backed by the free official 18-week Beginner / Advanced Classic schedules.
- Do not generate or expose Hansons 5K or performance 10K plans from training-philosophy articles or paid-plan catalog descriptions alone.
- The free Couch Potato to 10K schedule is a separate walk/jog completion route. It must not be used as evidence for a performance 10K generator and may only be added as its own clearly labeled product.
- A 5K-10K pace may still appear as the Speed workout anchor inside an official Hansons half-marathon or marathon plan. This does not make the target event a Hansons 5K or 10K plan.

---

# Norwegian Singles / LetsRun Sub-T Planner

This is a third plan system. It must remain separate from both Daniels and Hansons.

The runner-facing name is:

`Norwegian Singles · LetsRun Sub-T`

Do not label every generated plan as a generic "Norwegian lactate-threshold plan." The implementation contains distinct Vanilla, Low-volume adaptation, and Specific replacement modes.

## Canonical Rule

The rule engine must preserve this order:

1. Weekly running time determines how much Sub-T work is available.
2. Current race ability / VDOT determines how fast each repetition should be.
3. Target event only determines whether one existing quality session is replaced by specificity.

Never choose a fixed workout first and then ask whether the runner has enough volume. Calculate the weekly Sub-T minute budget first, split it into sessions, and only then choose rep duration and count.

## Required Inputs

- Average running time over the last four weeks.
- Average weekly distance over the last four weeks.
- Available running days per week.
- Current ability from a recent race or VDOT.
- Healthy versus injured / returning-to-running status.
- Sub-T adaptation status: new or recently increased volume, stable for 4-6 weeks, or long-term stable.
- Optional 5K, 10K, or half-marathon specificity.

Running time is the primary classification input. Weekly distance is a secondary tolerance and display input.

## Time-Based Levels

- Under 270 minutes per week: Level A, Low-volume adaptation, capped at two Sub-T sessions.
- 270 to under 360 minutes: Level B, Gateway Singles. This range permits progression toward a third exposure but does not automatically prescribe three full sessions.
- 360 to 510 minutes: Level C, Full Singles eligibility. Actual frequency still depends on budget, running days, health, and adaptation status.
- Over 510 minutes: Level D, Advanced / outside automatic prescription. Keep three sessions and never add a fourth automatically.

Plans under 4.5 hours per week must be labeled as an adaptation. A level is a display and eligibility boundary, not the sole frequency selector.

## Weekly Sub-T Budget

Use:

`weekly_subT_target = weekly_running_minutes × ratio`

Ratios:

- New method or recently increased volume: 20%.
- Stable for 4-6 weeks: 22.5%.
- Long-term stable: 25%.
- 30% is a warning ceiling only and must never be the default automatic recommendation.

The generated repetition combination should stay at or slightly below the target budget. Do not exceed the target merely to make a template look cleaner.

## Frequency and Per-Session Allocation

Select frequency only after calculating the weekly Sub-T budget:

- Under 40 Sub-T minutes: one full session.
- 40 to under 60 Sub-T minutes: two full sessions.
- 60 minutes or more: eligible for a third exposure, subject to the limits below.
- Three available running days cap quality at one; four or five days cap it at two; six or seven days permit three.
- New use or recently increased volume is capped at two sessions.
- Stable for 4-6 weeks uses `2 + 1 T-lite`: two full sessions plus one 10-15 minute light threshold exposure.
- Long-term stable use may distribute the budget across three full sessions.
- Injured or returning runners are capped at one quality session and cannot enable specificity.

A full automatic Sub-T session should normally contain about 20-30 work minutes. The automatic per-session target must not exceed 35 minutes. If a runner cannot support another full session, do not force 40-50 minutes into an existing session merely to spend the entire weekly budget.

Increasing frequency must redistribute the same weekly budget. It must not increase the budget in the same step. In particular, 299 and 300 weekly running minutes must not create a two-to-three-session cliff.

## Time-Based Session Templates

Time is the default prescription. Distance-based equivalents may be displayed secondarily, but runners of different ability must not be forced into the same rep distance.

- Short Sub-T: 3-4 minute reps, 60-second jog, starting around 15K to 10-mile effort.
- Medium Sub-T: 6-8 minute reps, 60-second jog, starting around half-marathon effort.
- Long Sub-T: 8-12 minute reps, 60-second jog, starting around 25K to 30K effort.
- Transition T-lite: 10-15 total work minutes at controlled long-rep effort; it is an adaptation exposure, not a third full session.

Each full Sub-T session must default to the medium template and expose short and long formats as runner-selected alternatives with approximately the same work minutes. Changing format must update the repetition count, repetition duration, pace row, and explanatory text together while preserving the planned session time. Do not automatically bind a format to target event or training phase; that relationship is not an established LetsRun rule. T-lite does not expose a forced long-rep alternative when its 10-15 minute budget cannot support at least two long repetitions.

Pace is an initial controller, not the physiological definition of threshold. The UI must state that "threshold is a state, not one mandatory pace."

## Intensity Controller

For trained runners using a lactate meter, the LetsRun discussion commonly used a final-session range around 2.5-3.5 mmol/L. Present this as a method-specific practical range, not a universal physiological law.

Without a lactate meter, use all of the following:

- Stable repetitions.
- Gradual rather than abrupt heart-rate drift.
- Controlled RPE with another one or two reps plausibly available.
- Recovery heart rate that continues to fall between reps.

If the session drifts too hard, slow the next target by roughly 3-5 seconds per kilometre before removing recovery or adding repetitions.

## Easy and Long Running

- Easy running must remain conversational and recoverable.
- `<=70% HRmax` is the method's practical reference cap, not a universal individual physiological boundary.
- Vanilla long runs remain Easy and normally fall around 75-90 minutes.
- Low-volume adaptations may use 60-75 minutes.
- Do not add a weekly fast finish to the Vanilla plan.
- Do not use the marathon adaptation until a separate marathon-specific rule has been researched and approved.

## Specificity

Vanilla mode contains only Sub-T, Easy, and an Easy Long run.

Specific mode replaces one existing quality session. It must never add an extra fourth quality day.

When the automatic structure is `2 + 1 T-lite`, defer Specific mode until the runner has completed the transition. Do not replace the T-lite exposure with harder specificity and still describe the week as an adaptation.

- 5K: controlled 60-75 second hills or 30/30 work.
- 10K: threshold variation plus short 30/30 work.
- Half marathon: longer variable threshold or 3 x 10-12 minute work.

The UI must say that this is a replacement week. It must not imply that specificity runs every week by default.

## Website Safety Layer

The following are application safety rules and must be visibly distinguished from the LetsRun thread rules:

- Three available running days cap quality at one; four or five days cap it at two; six or seven days permit up to three.
- The plan must leave room for a long run and at least one Easy exposure; very limited running days reduce quality further.
- Injured or returning runners are capped at one quality session and cannot enable specificity.
- If total weekly time cannot contain the quality sessions, recoveries, warm-up/cooldown, and long run, reduce quality count rather than compressing recovery into an unsafe schedule.

## Implementation Boundaries

- Core generator: `src/training-planner/norwegianSinglesPlanner.mjs`.
- Shared model integration: `src/training-planner/paceCalculator.mjs`.
- Web and Android UI: `web/app.mjs`.
- The generated schedule must preserve the entered weekly minutes and, when physiologically feasible, the entered weekly distance after rounding. If current-ability Sub-T work alone exceeds the entered distance, preserve time and intensity and show an explicit input-conflict warning.
- Norwegian Singles uses its own short/medium/long format switcher and must not draw candidates from the Daniels workout picker.
- The 270, 360, and 510 level boundaries, 299/300 continuity, budget thresholds, running-day limits, return-to-running, specificity, and low-time reductions all require automated tests.

---

# Git Branch Policy

- 未經使用者明確同意，不得建立新的 Git branch。
- 使用者要求推送時，先確認目前展示或部署網站使用的既有 branch，並直接推送到該 branch；不得自行建立 feature branch 或 PR branch。

