# Project 2 — Pendularm

## Overview

Build a planar rotational robot arm physics simulation and PID servo controller that supports
**both** 2-link and 3-link configurations, selectable at launch via the `ARM_SIM_LINKS`
environment variable (see "Submission, building, and running" below), speaking the same
[ROS-like](https://www.ros.org/) publish/subscribe protocol Project 1's
runtime does. Implement the equations of motion (Lagrangian dynamics: mass matrix, Coriolis/
centrifugal forces, gravity load), four selectable numerical integrators (Euler, Midpoint,
Verlet, Runge-Kutta 4), and a multi-joint PID controller — the whole assignment is "why does
integrator/timestep choice matter for a real closed-loop control system," taught by building the
system that demonstrates it.

**Do not use a physics engine or ODE-solver library.** Implement the dynamics, integrators, and
control law yourself. You may use Python, C, C++, or Rust; internal process/thread topology is
your choice, same as Project 1.

## Learning goals

- Derive and implement closed-form Lagrangian dynamics for a serial rotational manipulator.
- Implement and compare four numerical ODE integration methods on the same physical system.
- Implement a PID controller and understand each term's role (proportional/integral/derivative)
  through direct observation of convergence behavior.
- Reuse a publish/subscribe transport across two different course assignments — the same
  protocol, a new domain.
- Apply closed-form inverse kinematics (Law of Cosines, kinematic decoupling for orientation) to
  a planar serial manipulator, and drive a live control loop toward IK-solved targets.

## System architecture

```text
             External clients (Autograder, grader)
                                  |
                             TCP / JSON
                                  |
                      rosbridge-style gateway
                                  |
                   publish / subscribe system
             |            |              |              |
        arm_sim         ik          ik_action        ik_trial
          node          node           node             node
    (dynamics +    (/ik/solve —   (drives arm_sim   (orchestrates
     integrator +   closed-form    toward a solved   ik_action —
     PID, one        kinematics)   IK goal via        samples and
     loop)                         /joint_trajectory)  times targets)
```

Reuses the [rosbridge TCP/JSON protocol](../project1/ROSBRIDGE_PROTOCOL.md) — the same external
transport Project 1 uses — unchanged; the topics and services this project adds on top of it are
described in full below. Four logical nodes are shown — `arm_sim`, `ik`, `ik_action`, and
`ik_trial` — matching the reference implementations, but as with Project 1, internal design (one
process or many; how many of these fold together, or split further) is entirely yours, as long as
the external behavior described below holds.

## Starter projects

Minimal build/run skeletons: [Python](layouts/python.md), [C](layouts/c.md),
[C++](layouts/cpp.md), and [Rust](layouts/rust.md). They are not partial dynamics/integrator/PID
solutions; another layout is allowed.
Download the [Project 2 starter kit](https://drive.google.com/drive/folders/1EztLZppnoQj80l8m1FI3ZWq5VN97203L?usp=drive_link).

## Submission, building, and running

Submit a project root with a top-level `Makefile` providing:

```bash
make build
make run
make clean
```

Choose **one** supported implementation language, same rule as Project 1: your
`submission.tar.gz` extracts to one project root whose direct contents include that submission's
`Makefile`. There is **no `make map` target for Project 2** — there is no map/occupancy-grid
concept here. The starter kit ships `make_submission.sh <c|cpp|python|rust>` at its root, which
builds this correctly from your completed starter directory.

`make build` is noninteractive, repeatable, offline. `make run` launches your runtime in the
foreground, exposing `127.0.0.1:9095`, and should read the `ARM_SIM_LINKS` environment variable
(`"2"` or `"3"`, defaulting to a 2-link arm when it's unset) to decide how many links to simulate
— that's how both link counts get exercised without a separate flag or config file. `make clean`
removes generated artifacts.

## Autograder.io

**Grading is black-box using Autograder.io**, exactly like Project 1: it extracts your project,
runs the Make targets in the offline course environment, launches your runtime, and connects
externally to `127.0.0.1:9095` using the documented TCP/JSON protocol. No frontend or
visualization is ever part of grading.

## Project checkpoint — Numerical Integration Step Service

**Project checkpoint:** complete `/arm_sim/integration_step` by the in-person Pendularm lab. It's
a standalone service, fully decoupled from the live arm — it never reads or writes the runtime's
own `(q, qdot)`, and has no effect on `/joint_states`. That isolation is deliberate: it gives you
a way to directly compare how each of the four integration methods tracks a known function,
without the extra variables a live, closed-loop, gravity-driven arm would introduce.

### `/arm_sim/integration_step`

Arguments: `{"function": "<expression in t>", "x0": <f64>, "xdot0": <f64, optional, default 0>,
"dt": <f64>, "steps": <u64>, "integrator": "euler"|"midpoint"|"verlet"|"rk4"}`. On success,
returns `{"times": [...], "positions": [...], "velocities": [...]}` — one entry per requested
step, plus the starting point at index 0 (`times[0]==0`, `positions[0]==x0`,
`velocities[0]==xdot0`). `function` is parsed as a purely time-varying forcing `qddot = f(t)` on
a 1-DOF, unit-mass particle; the call integrates it forward `steps` times with the chosen method,
starting from `(x0, xdot0)` at `t=0` — a self-contained way to compare each method against a
function whose closed-form integral you can check by hand.

Reject the request (`result:false`, with a non-empty `status` message explaining why) rather than
crashing or hanging, for: a `function` string that doesn't parse, an `integrator` name that isn't
one of the four above, `dt <= 0`, or `steps == 0`. Whatever the outcome, the runtime should stay
fully responsive to later calls — a bad request here is a normal, expected input to handle
gracefully, not something that should take the service down.

### The `function` field

`function` is a small math expression in one free variable, `t`. At minimum, handle standard
infix arithmetic: `+` `-` `*` `/` (left-associative), `^` for exponentiation
(right-associative), unary minus, parentheses, numeric literals, and the single-argument named
functions `sin`, `cos`, `tan`, `exp`, `sqrt`, `ln`, and `abs`. Precedence from lowest to highest:
`+`/`-`, then `*`/`/`, then `^`, then unary minus, then the atoms themselves. `"t"`, `"sin(t)"`,
`"t^2 + 3*t - 1"`, and `"-t + 1"` are all valid inputs.

Malformed input is common here, not an edge case to skip: an empty string, unbalanced
parentheses, an unknown identifier, trailing garbage after an otherwise-complete expression,
adjacent tokens with no operator between them (`"1 2"`), or an unrecognized character should all
be rejected cleanly rather than crashing the parser. A domain error at evaluation time — `sqrt`
of a negative number, say — is fine to just let become `NaN`/`inf`, the same as ordinary
floating-point arithmetic; there's no need to special-case that.

## Topics and services

Everything below rides on the same rosbridge envelope Project 1 uses: topic messages as-is, and
every service response as `{"values": {...}, "result": <bool>, "status": <string>}`. The four
simulation-control and PID services below additionally share one convention worth knowing up
front: **every request field is optional and independently applied**, and sending an empty `{}`
request queries current values without changing anything.

### `/joint_trajectory` and `/joint_states`

`/joint_trajectory` (subscribe) is `trajectory_msgs/JointTrajectory`-shaped:

```json
{
  "header": {"stamp": {"sec": 0, "nanosec": 0}, "frame_id": ""},
  "joint_names": ["joint1", "joint2"],
  "points": [
    {"positions": [0.3, -0.5], "velocities": [0.0, 0.0], "accelerations": [],
     "time_from_start": {"sec": 0, "nanosec": 0}}
  ]
}
```

This is a **step-setpoint servo, not a trajectory follower**: only the *last* entry of `points`
is used as the held PID setpoint (`positions` becomes `setpoint_pos`, `velocities` becomes
`setpoint_vel`, defaulting to all-zero if omitted or the wrong length). Sending a multi-waypoint
trajectory doesn't produce interpolated motion through the intermediate points — only the final
one is held, the same instant the message arrives.

`/joint_states` (publish) mirrors it: `{"header": {...}, "name": [...], "position": [...],
"velocity": [...], "effort": [...]}`, published continuously while the runtime runs (the exact
rate is up to you — the reference publishes at 60 Hz, decoupled from the physics timestep).
`name` has exactly one entry per joint; `position`/`velocity`/`effort` are parallel arrays
indexed the same way. The timestamp can reflect simulation time or wall time, whichever is more
convenient for your implementation — nothing downstream depends on which clock it is.

### Simulation-control services

- **`/arm_sim/set_integrator`** — `{"method": "euler"|"midpoint"|"verlet"|"rk4", "timestep":
  <positive seconds>}`. Changes which integrator and timestep the live simulation uses going
  forward. An unrecognized method name or a non-positive timestep isn't a valid request — reject
  it rather than quietly falling back to some default, so a caller reading the response can trust
  that a change either took effect or didn't.
- **`/arm_sim/set_params`** — `{"gravity": <>=0>, "masses": [n values, each >0], "lengths": [n
  values, each >0]}` (`n` is however many links the runtime was started with; gravity defaults to
  9.81 m/s²). Every field is optional, and the response always echoes the *current* post-update
  parameters — even when the request changed nothing, or was rejected outright — which is how a
  caller reads back current link lengths and masses without separately tracking launch flags. A
  wrong-length array, a non-positive mass or length, or a negative gravity value should each be
  rejected independently, without touching whichever fields in the same request were valid.
- **`/arm_sim/pause`** — `{"data": <bool>}`. Freezes/resumes the simulation clock: while paused,
  `/joint_states` keeps publishing a frozen snapshot and every other service keeps responding
  normally, but the physics step and the PID integral both stop advancing.
- **`/arm_sim/reset`** — `{}`. Snaps `(q, qdot)` back to a fixed starting pose and zeroes the
  simulation clock, and resets the PID controller's setpoint and integral to match — otherwise
  the freshly-reset arm would immediately get pulled back toward whatever setpoint the controller
  still remembers. The response echoes the resulting pose (`{"position": [...], "velocity":
  [...]}`), so you can read it straight from the response instead of a separate `/joint_states`
  read.

### PID services

- **`/pid_controller/enable`** — `{"data": <bool>}`. PID starts **disabled by default**, so a
  runtime you've just started reports zero effort on `/joint_states` — you'll see the arm swing
  freely under gravity before you ever enable control, as a deliberate second step. Re-enabling
  after a disable clears out whatever integral accumulated while disabled, since that accumulated
  value was never actually driving anything.
- **`/pid_controller/set_gains`** — `{"kp": [...], "ki": [...], "kd": [...]}`, each field
  independently optional; a wrong-length array or a negative value for any of them should be
  rejected on its own, without disturbing the other fields in the same request. The response
  echoes current gains. Unlike `enable`, changing gains does *not* reset the accumulated integral
  — if you're tuning gains live, you want to see the effect of a nudge against the controller's
  current state, not against a hidden reset every time you touch a slider.

### Control law

At every control update, for each joint independently:

```text
position_error = setpoint_pos - actual_pos
velocity_error = setpoint_vel - actual_vel
integral       = clamp(integral + position_error * dt, -integral_limit, +integral_limit)
effort         = kp * position_error + ki * integral + kd * velocity_error
```

The derivative term uses the setpoint's *commanded* velocity minus the *measured* velocity, not a
finite difference of the position error — differentiating a noisy measured position amplifies
noise far more than working from a velocity you already have. The `clamp` on the integral term is
anti-windup: without some bound, a large, sustained error would let the integral term grow
without limit, and the controller would keep overshooting long after the error was corrected.
Pick a reasonable fixed limit for your own implementation — its exact value doesn't matter, only
that some bound exists.

Because PID starts disabled, you'll see the arm swing freely under gravity as soon as your
runtime starts — enabling it is a deliberate second step. Once enabled, watch for something a
pure P (or PD) controller can't do: gravity is a constant load, so a controller with no integral
term settles into a persistent steady-state offset instead of ever reaching the exact setpoint.
That's precisely the gap the integral term exists to close — it accumulates the error over time
and keeps adding effort until the offset is driven out. If your integral term isn't behaving
correctly, you'll usually see one of two symptoms: a `ki=0` case that mysteriously converges
exactly anyway (something else is compensating for gravity), or a `ki>0` case that still leaves a
steady offset (the integral isn't accumulating, or isn't reaching the effort output).

Two more behaviors worth getting right, both about *not* carrying integral state over when it
shouldn't be: re-enabling the controller after a disable should start from a clean integral
rather than whatever accumulated while nothing was listening, and calling `/arm_sim/reset` should
reset the controller along with the plant (see `/arm_sim/reset` above) — a reset that only zeroes
the plant while the controller keeps chasing the old setpoint would pull the arm right back away
from home again. Changing gains through `/pid_controller/set_gains`, on the other hand, should
leave the integral alone — tune live and you should see the effect of each change against
whatever the controller has already accumulated, not a hidden reset on every adjustment.

There's no single correct set of gains here: convergence is judged by outcome, not by matching
any particular `kp`/`ki`/`kd` values. Given *some* reasonable gains, your implementation should
drive the measured state to a commanded setpoint within a generous position tolerance and stay
there. That tolerance is intentionally loose, so it isn't sensitive to the specific — and
admittedly imperfect, decentralized-per-joint — control law this project's math implies.

### Dynamics

The simulated arm is a serial, planar, `n`-link (`n` = 2 or 3) rotational ("RR...R") arm. Each
link `i` is a uniform rigid rod of length `l_i` and mass `m_i`, hinged to the previous link (link
0 is a fixed base at a static frame's origin). `q_i` is joint `i`'s own relative rotation angle,
so the absolute world orientation of link `i` is the running sum `phi_i = q_1 + ... + q_i`.
Gravity acts along world `-y` with magnitude `g` (`/arm_sim/set_params`'s `gravity`).

The motion follows the standard manipulator equation of motion:

```text
M(q) qddot + C(q, qdot) qdot + G(q) = tau
```

- `M(q)` is the configuration-dependent mass/inertia matrix — symmetric and positive-definite for
  any physically valid arm (positive lengths and masses).
- `C(q, qdot) qdot` is the Coriolis/centrifugal force term, coming from the Christoffel symbols of
  `M(q)` — this is what lets one joint's motion push on the others.
- `G(q)` is the gravity-load vector, the gradient of the arm's potential energy.
- `tau` is the applied joint effort — the PID controller's output, or zero while it's disabled.

Forward dynamics — what the simulator actually needs each step — solves this for acceleration:
`qddot = M(q)^{-1} (tau - C(q,qdot) qdot - G(q))`.

That equation directly implies several things you can check in your own implementation, and that
the tests exercise:

- **Starting from the reset pose with PID disabled, the arm should visibly move** (unless that
  particular pose happens to be a gravity equilibrium) — with zero effort and nonzero gravity,
  `qddot` is nonzero unless `G(q)` happens to be exactly zero there, so position and velocity
  change on their own over time.
- **At a converged PID setpoint, steady-state effort should equal the gravity load there.**
  There's no way to inject torque directly — effort always comes from the controller's own error
  calculation — but once the arm has settled (`qddot = qdot = 0`), the equation of motion
  collapses to exactly `tau = G(q)`. That gives you a way to sanity-check your own `M`/`C`/`G`
  sign conventions from the outside: command a setpoint, let PID converge, and compare the
  steady-state effort you're seeing against `G(q)` computed independently from the reported
  lengths, masses, and gravity using the formula above.
- **A 3-link arm should couple more strongly than a 2-link one, not less.** The Coriolis term is
  what makes one joint's motion push on the others; if a 3-link arm's dynamics quietly degenerate
  into three independent single-joint problems, that's a sign the coupling term isn't really
  wired in. There's no need to match any particular exact `C(q,qdot)` matrix — only the
  observable coupling behavior matters.
- **A too-large timestep is expected to go unstable — and that's the point, not a bug to hide.**
  Numerical integration only stays accurate within some range of `dt`; push past it with an
  aggressive, enabled PID loop and a physically-correct implementation will visibly diverge.
  That's the actual lesson this project is teaching about integrator/timestep choice, so don't be
  surprised if pushing `dt` too far breaks things — it's supposed to.

One derivation note worth taking seriously: derive the dynamics from Lagrangian mechanics for a
general `n`-link arm, rather than hand-deriving two separate formulas for the 2-link and 3-link
cases. It's easy for two special-cased derivations to each look right in isolation while actually
being subtly wrong, and testing both link counts against the same code is exactly how that kind
of mistake tends to surface.

What's genuinely up to you: the exact linear-algebra method for inverting/solving `M(q)`
(Gauss-Jordan with partial pivoting works fine, but so does anything else), how you split the
dynamics/integration/control code internally, and anything about the root joint beyond it being a
fixed base at a static frame's origin with gravity along that frame's `-y` — no mobile base or
coordinate-frame tracking is needed here.

### Numerical integrators

Four selectable methods advance a second-order system `qddot = f(t, q, qdot)` forward by one
timestep `dt`, given the current `(q, qdot)` — the same abstraction whether it's driving the live
arm (`/arm_sim/set_integrator`'s `method`) or the standalone 1-DOF checkpoint service above
(`/arm_sim/integration_step`'s `integrator`):

- **`euler`** — forward Euler, the simplest option: evaluate the acceleration once at the
  current state, then step both position and velocity forward using that one value —
  `q_{n+1} = q_n + qdot_n*dt`, `qdot_{n+1} = qdot_n + qddot_n*dt`. First-order accurate, and it
  should visibly lose accuracy faster than the other three on the same input — that visible gap
  is the point of including it, not a flaw to smooth over.
- **`midpoint`** — evaluate the acceleration at the current state, take a trial half-step to
  estimate what the state will be at the timestep's midpoint, evaluate the acceleration *there*,
  then use that midpoint value to take the real full step. Two acceleration evaluations per step,
  and a better accuracy/cost trade-off than Euler.
- **`verlet`** — **velocity Verlet**: predict the new position using the current velocity and
  acceleration, provisionally estimate the new velocity, evaluate the acceleration again at that
  predicted state, then finalize the velocity by averaging the two acceleration evaluations. Two
  evaluations per step. (This project's forces depend on velocity as well as position, which is
  why it's velocity Verlet with a predictor-corrector rather than the textbook position-only
  version — plain Verlet doesn't have anywhere to plug in a velocity-dependent force.)
- **`rk4`** — classical 4th-order Runge-Kutta: four acceleration evaluations per step (at the
  start, twice near the midpoint from two different trial states, and at the end), blended with
  `1:2:2:1` weights. The most accurate of the four per step, at the highest cost per step.

One detail that's easy to get wrong and hard to notice if you do: each method's sub-stages need
to evaluate the acceleration at the *correct fractional time* — `t`, `t+dt/2`, `t+dt`, whichever
apply — not just at `t` for the whole step. Freeze `t` across a step and a genuinely time-varying
forcing function (exactly what `/arm_sim/integration_step` gives you) won't show each method's
real accuracy advantage — midpoint and RK4 would quietly degrade toward Euler's accuracy instead
of clearly outperforming it. This shows up most clearly on something like `f(t) = t` (whose
closed form is `x(t) = t^3/6` from rest): a method that freezes `t` across the step ends up
measurably worse than one that doesn't, even at the same `dt`.

### Inverse kinematics

Given a desired end-effector position (and, for a 3-link arm, orientation), solve for the joint
angles that reach it — the classic "given where I want the hand, what should the joints be"
problem. This project's arm is planar and only 2 or 3 links, so the solution is closed-form (Law
of Cosines for position, then kinematic decoupling for orientation), not the iterative/Jacobian
approach a later, unrelated project covers for a different kind of arm. Using the same
joint-angle convention as the dynamics section above, the end effector's world position is
`x = sum(l_i * cos(phi_i))`, `y = sum(l_i * sin(phi_i))`, and its absolute orientation is `phi_n`
(the last link's own heading).

- **`/ik/solve`** — `{"x": <m>, "y": <m>, "phi": <rad, optional>}` → `{"positions": [n values]}`.
  `phi` is the desired end-effector orientation; only meaningful for a 3-link arm (a 2-link arm's
  2 degrees of freedom are already fully consumed by position alone, so `phi` is ignored for it).
  Fetch the arm's *current* link lengths fresh on every call (e.g. via `/arm_sim/set_params`'s own
  empty-request query convention) rather than caching them — a solve issued after link lengths
  changed at runtime should reflect the change. Reject the request (`result:false`, nonempty
  `status`) rather than crashing or hanging, for: a request missing a numeric `x` or `y`; a target
  farther than the arm's full extension (`sum(lengths)`), or, for a 2-link arm, closer than
  `|l1-l2|`; or, for a 3-link arm, a position that's reachable on its own but whose requested
  `phi` pushes the resulting wrist point (the end effector's position minus link 3's own
  contribution) outside the first two links' reach. Treat the exact boundary of reach
  (a fully-extended or, for a 2-link arm, fully-folded target) as reachable, not rejected by
  floating-point error accumulated getting there. A reachable 2-link (sub)problem generally has
  two elbow configurations ("elbow-up"/"elbow-down"); either is an acceptable answer — grading
  checks the round-trip property (feeding the result back through forward kinematics reproduces
  the requested target and orientation), not a specific configuration choice.
- **`/ik_action/send_goal`** / **`/ik_action/cancel_goal`** — drives the arm toward a solved
  target rather than just computing it: solves via `/ik/solve`, then commands the result on
  `/joint_trajectory` and tracks convergence, at most one goal active at a time. `send_goal`
  request: `{"x": <m>, "y": <m>, "phi": <rad, optional>, "epsilon": <m, optional>,
  "success_hold": <s, optional>}`; on success, `{"goal_id": <string>}`. `epsilon`/`success_hold`
  fall back to your own implementation-defined defaults when omitted (exact values are up to you,
  but `epsilon` must be positive and `success_hold` non-negative). Reject an unreachable target
  using `/ik/solve`'s own rules, leaving whatever goal was already active completely undisturbed;
  a *reachable* new goal, by contrast, preempts any goal currently active — publishing that old
  goal's `/ik_action/result` as `"preempted"` before starting the new one. `cancel_goal` request:
  `{}` or `{"goal_id": <string>}`; with no active goal, or a `goal_id` that doesn't match the
  currently active one, reject (`result:false`) without side effects — otherwise preempt the
  active goal (publishing its result as `"preempted"`) and succeed.
- **`/ik_action/feedback`** (publish) — once per control tick while a goal is active:
  `{"goal_id", "target": {"x": .., "y": .. ["phi": ..]}, "positions": [the commanded joint-space
  setpoint], "distance_remaining": <m>, "elapsed": <s>}`.
- **`/ik_action/result`** (publish) — exactly once per goal, when it concludes: `{"goal_id",
  "outcome": "reached"|"preempted", "target": {...}, "final_distance": <m>}`. Don't report
  `"reached"` on the first tick the end effector merely passes through the `epsilon` ball — it
  must stay within `epsilon` continuously for at least `success_hold` seconds of **simulation**
  time before concluding `"reached"`; any excursion outside `epsilon`, even briefly, resets that
  dwell requirement back to zero (read simulation time from the same clock `/joint_states`'s
  `header.stamp` already carries, so this doesn't depend on real-time factor). A `success_hold`
  of `0` is satisfied immediately on first entry — a one-shot epsilon check, not a case to
  special-case away.
- **`/ik_trial/start`** / **`/ik_trial/skip`** / **`/ik_trial/stop`** — a timed trial harness,
  orchestrating `/ik_action/*` as a client (it should never read `/joint_states` or publish
  `/joint_trajectory` directly itself): repeatedly samples reachable random targets and counts
  how many get reached within a time window. `start` request: `{}` or `{"duration": <s>,
  "epsilon": <m>, "success_hold": <s>}`, all optional (the same partial-override convention
  `/arm_sim/set_params` uses); always (re)starts a fresh trial — cancels any goal left over from a
  previous trial, resets the reached-count and elapsed clock, and submits a first sampled target.
  Response is `result:true` on success, or `result:false` (with a `status` reason) if no reachable
  target could be sampled at all. `skip` request: `{}`; abandons whatever target is currently in
  flight *without* counting it as reached, and immediately submits a new one — reject
  (`result:false`) if no trial is currently running. `stop` request: `{}`; ends the trial early,
  abandoning the in-flight target and stopping advancement without submitting a replacement —
  reject (`result:false`) if no trial is currently running.
- **`/ik_trial/status`** (publish) — published periodically while a trial exists:
  `{"running": <bool>, "elapsed": <s>, "duration": <s>, "targets_reached": <count>, "target":
  {"x": .., "y": .. ["phi": ..]} | null, "error": <m> | null, "desired_positions": [<rad>, ...] |
  null, "action_status": "idle"|"active"|"reached"|"preempted"}`. `error`/`desired_positions`/
  `action_status` reflect this node's own most recent view of the goal it's tracking — clear them
  back to their "nothing in flight" values (`null`/`"idle"`) whenever a goal is abandoned without
  an immediate replacement (`/ik_trial/stop`, or the trial's `duration` elapsing), rather than
  leaving a stale value from a goal nobody is pursuing anymore.

What's explicitly up to you: exact default `epsilon`/`success_hold`/trial `duration` values, the
exact target-sampling distribution the trial harness uses (any distribution that reliably
produces reachable targets is acceptable — sampling a bounding box and rejecting unreachable
draws is one valid approach, not a mandated one), and internal process topology (one node per
service group, folded into `arm_sim_node`, or split further).

## Testing

Test each integrator's numerical accuracy and its rejection of malformed requests, PID
enable/disable and gain-update behavior and convergence to a commanded setpoint,
controller/plant reset and pause semantics, `/joint_trajectory`'s setpoint handling,
gravity-load and inter-joint coupling correctness at both supported link counts, and `/ik/solve`'s
geometry (round-trip through forward kinematics, reachability rejection, both link counts).

## Grading

| Category | Weight |
| --- | ---: |
| Integrators | 25% |
| PID control | 20% |
| Arm dynamics & service contract | 40% |
| Inverse kinematics | 15% |
| **Total** | **100%** |

The Integrators category is exactly the Sep 25 checkpoint and covers each method's numerical
behavior on `/arm_sim/integration_step`. The PID control category covers gain handling,
enable/disable semantics, and convergence to a commanded setpoint. The Arm dynamics & service
contract category covers gravity-load and inter-joint coupling correctness at both link counts,
plus the rest of the topic/service contract (trajectories, joint-state publication, pause/reset).
The Inverse kinematics category grades `/ik/solve`'s closed-form geometry/math thoroughly; grading
`/ik_action/*` and `/ik_trial/*` is limited to their transport contract (reachable/unreachable
goals accepted or rejected correctly, correct envelope shapes) rather than waiting on real-time
convergence — the same reason PID convergence itself is checked against a generous tolerance and
time budget, not exact trajectories.
