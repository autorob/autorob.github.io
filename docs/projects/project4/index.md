# Project 4 — Inverse Kinematics

## Overview

In Project 3 your runtime answered "where is every part of my robot, given its joint angles?"
(forward kinematics). Project 4 answers the inverse question: **which joint angles put the
robot's end effector where I want it?** That is inverse kinematics (IK).

For a general robot there is no closed-form answer, so you will solve IK the way the lectures
derive it: by **gradient descent on the manipulator Jacobian**. You will build three services
on top of your Project 3 runtime:

1. **`/ik/robot_jacobian`** — the manipulator Jacobian of any chain of a loaded URDF robot, at
   any configuration. This is the checkpoint.
2. **`/ik/solve_robot_step`** — one gradient-descent step toward an end-effector target, using
   either the **Jacobian transpose** or the **damped-least-squares (Jacobian pseudoinverse)**
   method.
3. **`/ik/solve_robot`** — the full solve: iterate that step until the end effector reaches the
   target position (and, optionally, orientation), or report honestly that it did not.

Project 4 is **kinematics only**: no mass, inertia, gravity, simulation or control gains.

The robot arrives exactly as in Project 3: as the URDF text of `robot_description`, set on your
**parameter server**. Everything speaks the same ROS-like protocol on the same
`127.0.0.1:9095` TCP/JSON gateway as Projects 1–3: newline-delimited JSON over a plain TCP
socket, not HTTP and not WebSocket. **Bring your own Project 1 middleware and gateway and your
Project 3 parameter server, URDF reader and forward kinematics.** The starters do not include
them.

**Do not use a kinematics, linear-algebra or URDF-model library.** Implement the Jacobian, the
small linear solve and the iteration yourself. The course image has no numeric library anyway
(no Eigen, BLAS, LAPACK or numpy). The one piece of plumbing the course supplies is the same
**XML parser** as Project 3. You may use Python, C, C++, or Rust, and internal process/thread
topology is your choice, as in the earlier projects.

The exact contract is [`spec/IK_API.md`](IK_API.md); the URDF rules are
[`spec/ROBOT_DESCRIPTION.md`](ROBOT_DESCRIPTION.md) (the same as Project 3's). Where this
handout and the spec differ, the spec wins.

## Learning goals

- Build the **manipulator Jacobian** from a robot's kinematic tree: which joints move a given
  link, and how each one moves it (rotation about an axis, or translation along it).
- Turn an end-effector error into joint motion with the **Jacobian transpose**
  (`Δq = α·Jᵀ·e`) and the **damped-least-squares pseudoinverse**
  (`Δq = α·Jᵀ(JJᵀ + λ²I)⁻¹e`), and see why damping keeps the step bounded near a singularity.
- Iterate to a solution, respect **joint limits**, and report **honestly** when a target is out
  of reach.
- Extend position IK to a **full pose** with an orientation error that does not depend on how
  rotations are represented.

## System architecture

```text
   your tooling ──set_param robot_description──►  param_server
                                                      │ get_param
                                                      ▼
   external client ─call─►  /ik/robot_jacobian    ┐
                            /ik/solve_robot_step  ├─  your IK node(s)
                            /ik/solve_robot       ┘   (URDF reader + FK from Project 3,
                                                       plus the Jacobian, step and solve)
```

| Piece | Status |
|---|---|
| Gateway on `127.0.0.1:9095` and middleware | yours, from Project 1 |
| `param_server` (`/param_server/set_param`, `/param_server/get_param`) | yours, from Project 3, unchanged |
| URDF reader and forward kinematics | yours, from Project 3 |
| `/ik/robot_jacobian`, `/ik/solve_robot_step`, `/ik/solve_robot` | **new**: one node or several, your choice |
| Project 3's `robot_state_publisher` and `robot_world_state_publisher` | optional: they may run, nothing in Project 4 uses them |

Every IK request carries everything it needs: the configuration, the end-effector link, the
target, the method, the step length, the damping, the tolerances and the iteration limit.
Nothing in Project 4 reads `/joint_states` or any other topic.

## Starter projects

Each starter (`project4/starter/{python,c,cpp,rust}`) is a placeholder, as in Projects 2 and 3:
a `Makefile` (`build`, `run`, `clean`, `test`), a `main` program that prints a `TODO` line and
idles, and the same small example of reading a URDF with that language's supplied XML parser as
in Project 3:

| Language | Supplied XML parser | Example |
|---|---|---|
| Python | standard library `xml.etree.ElementTree` | `src/urdf_example.py` |
| C | ezxml 0.8.6 (vendored in `third_party/ezxml/`) | `src/urdf_example.c` |
| C++ | pugixml 1.14 (vendored in `third_party/pugixml/`) | `src/urdf_example.cpp` |
| Rust | roxmltree 0.20.0 (vendored in `vendor/roxmltree/`) | `print_links` in `src/main.rs` |

The starters contain **no middleware and no nodes**. The natural route is to copy your
Project 3 runtime into your chosen starter directory, keep its gateway, middleware,
`param_server` and URDF reader, and add the IK services. Extend the `Makefile` so `make build`
compiles everything and `make run` starts what "Submission, building, and running" lists. See `starter/README.md` in the student kit.
<!-- TODO(staff): link the P4 kit's Drive folder here, as the P3 page does. -->

### The student kit

This handout, the specs it links to, the four starters, and a submission script are available
pre-packaged as the **student kit**: a bundle with no other course-repo material, distributed by
course staff. Its `README.md` lists what is inside. For a real robot to try your runtime on, use
the Fetch description from the Project 3 kit (`robots/fetch/fetch.urdf`, licensed CC BY-NC-SA
4.0): its chain from `base_link` to `gripper_link` has 8 movable joints, a prismatic torso lift
and 7 arm joints, three of them continuous.

## Submission, building, and running

Submit a project root with a top-level `Makefile` providing:

```bash
make build
make run
make clean
```

Choose **one** supported implementation language: your `submission.tar.gz` extracts to one
project root whose direct contents include that submission's `Makefile`. If you have the student
kit, `./make_submission.sh <c|cpp|python|rust>` at its root builds a correctly shaped
`submission.tar.gz` from your completed starter directory.

- `make build` is noninteractive, repeatable, and offline: the grading environment has no
  network. It must finish within the setup time limit (**180 s**, including extraction). Use
  only the course image's toolchain and libraries (the same ones as Projects 1–3) plus source
  you include in your submission, such as the vendored XML parser.
- `make run` launches your runtime in the foreground, exposing `127.0.0.1:9095`: your gateway,
  `param_server`, and whatever answers the three IK services. It needs **no** files, environment
  variables, or command-line arguments, and it starts with **no robot loaded**: every robot
  arrives as a `set_param` of `robot_description`. The services must answer within
  **10 seconds** of `make run` starting.
- `make run` must **not** start anything that publishes `/joint_states` or that sets
  `robot_description`. During grading, robots come only from outside your runtime.
- `make demo` is optional and never graded: use it for anything you want to show off, such as
  a viewer.
- `make clean` removes generated artifacts.

**Your own tests (optional, not graded).** You may also submit up to 25 pass/fail tests of your
own in a `tests/` folder, run with `make test` while `make run` is running in another terminal.
They come with your project into the mutation challenge as a debugging aid. The README in your
starter's `tests/` folder gives the rules and an example (the Jacobian of the spec's worked
two-link arm).

## Autograder.io

**Grading is black-box using Autograder.io**, as in Projects 1–3: it extracts your project, runs
the Make targets in the offline course environment, launches your runtime with `make run`, and
connects externally to `127.0.0.1:9095` using the documented TCP/JSON protocol. It loads robots
through `/param_server/set_param` and calls your three IK services. It never reads your files,
logs, or output. No frontend or visualization is part of grading.

There are two hosted projects: the **checkpoint** and the **final project**. Each test is
all-or-nothing and has a time limit, so keep startup fast.

**Do not hard-code version numbers.** Other robots may already have been loaded into your
runtime before the one you care about. A `version` means something only relative to the version
`set_param` returned.

**Raise your gateway's service-call timeout.** Your Project 1 gateway gives up on a service call
after a few seconds. A solve on a long chain can take a while in Python, so make your gateway
wait longer than your slowest solve (the spec recommends a solve reply within 5 s for chains of
up to 10 movable joints and 2000 iterations, and a gateway wait well above that).

## Request line size

> **Every hop in your runtime MUST carry lines of at least 1 MiB** (checkpoint and final), as in
> Project 3. A URDF travels as one JSON string inside one line: the `set_param` request, and
> again the `get_param` reply your IK node reads. Real robots' request lines are 20–110 KiB, and
> a description can come close to 1 MiB. **A fixed 64 KiB line buffer will fail; read until the
> newline**, in the gateway and in every node-to-node connection.

## Project checkpoint — Jacobian given URDF

**Project checkpoint:** due **TBD** (the date is announced with the release).

Given a robot description, a configuration and an end-effector link, your runtime returns the
**manipulator Jacobian**. The checkpoint uses your parameter server (`/param_server/set_param`
and `/param_server/get_param`) and `/ik/robot_jacobian`, and nothing else: `/ik/solve_robot_step`
and `/ik/solve_robot` need not exist yet. It is a separate hosted project and grades categories
A and B below, except B's near-1 MiB description, which is graded only in the final project.

To pass it you need:

- your parameter server, from Project 3;
- an `/ik/robot_jacobian` that answers for the newest `robot_description` (read it with
  `get_param`, or any way your internal design allows), reports the `description_version` it
  answered for, and picks up a new description within 2 seconds;
- the chain from the root link to the requested link, and its movable joints in order;
- the Jacobian rows for revolute, continuous and prismatic joints, in the root-link frame;
- error replies for bad requests, and real robot URDFs (including ones over 64 KiB). The 1 MiB
  line requirement holds from the checkpoint on; only its near-1 MiB test waits for the final.

The step and the solve are not part of the checkpoint. The checkpoint's features are graded
again in the final project, so this work counts toward both.

## Reading the robot

Your IK node answers for the robot in `robot_description`. Read it with
`/param_server/get_param` on each request, or poll in the background; either is fine.

- **Every reply carries `values.description_version`**: the `robot_description` version you
  computed it for (`0` if none was ever set).
- Within **2 seconds** of a `set_param` that returned version `V`, every reply must carry a
  version `>= V`, and every reply must be computed for the description whose version it echoes.
  A runtime that fetches the description on each request meets this automatically; one that
  polls must poll often enough.
- If the newest description is invalid (by `spec/ROBOT_DESCRIPTION.md`, "Validity", the same
  rules as Project 3), your services may either reject every request or keep answering for the
  previous valid robot, and they must not crash.
  The next valid description must be picked up.

## Frames and the chain

Everything in Project 4 is in the **root-link frame** of the loaded robot: the Jacobian, the
target pose, and every error. There is no world frame or global pose.

For an end-effector link `e`, the **chain** is the path of joints from the root link down to
`e`. Its **movable joints** are its revolute, continuous and prismatic joints, in
root-to-end-effector order. Fixed joints still contribute their `<origin>` to forward
kinematics but have no degree of freedom, and joints on other branches of the tree are not part
of the chain at all. The **end-effector point** `p_e` is the origin of link `e`.

A request's `joint_state` (`{"name": [...], "position": [...]}`) gives the configuration: a
movable joint it does not name is at `0`; names that are not movable joints are ignored;
positions are used **exactly as given**, never clamped to the limits.

## The Jacobian

Each movable joint `i` has a frame (after its `<origin>`, before its motion) with origin `p_i`
and rotation `R_i` in the root frame, and the axis `a` written in the URDF:

| Joint | Its row of the Jacobian |
|---|---|
| revolute, continuous | `[ ẑ × (p_e − p_i) ; ẑ ]`, with `ẑ = R_i·a / ‖a‖` |
| prismatic | `[ R_i·a ; 0, 0, 0 ]`, with `a` **as written** (not normalized) |

The first three numbers are the linear velocity of `p_e`, the last three the angular velocity
of link `e`, per unit rate of that joint. The prismatic row uses the axis as written because
Project 3's forward kinematics translates a prismatic joint by `q · axis` with the axis as
written: the Jacobian is the derivative of your FK.

The reply lists `joint_names` (the chain's movable joints, root first) and `jacobian`, **one
row per joint** in the same order. This N×6 layout is the transpose of the 6×N textbook
Jacobian: row `i` is joint `joint_names[i]`'s column. The spec works a two-link example in full:
at `shoulder = 0, elbow = π/2` the rows are `[-1, 1, 0, 0, 0, 1]` and `[-1, 0, 0, 0, 0, 1]`.

Every entry must be within `1e-4` of the exact value. An unknown end-effector link, mismatched
`name`/`position` lengths and a non-numeric position are errors (`result: false` and a
`status`), and your service must keep answering after them.

## One gradient-descent step

`/ik/solve_robot_step` takes the current configuration, the end-effector link, a target pose
(position plus a unit quaternion, in the root frame), `ik_position_only`, a `method`, a
`step_length` α and a `damping` λ. It returns the next configuration. It is **stateless**: the
answer depends only on the request, never on earlier calls.

For a position-only step, with `e = p_target − p_e` and `J_v` the first three entries of every
row (as a 3×n matrix):

| `method` | `Δq` |
|---|---|
| `"JacobianTranspose"` | `α · J_vᵀ · e` |
| `"JacobianPseudoinverse"` | `α · J_vᵀ (J_v J_vᵀ + λ² I)⁻¹ e` (or the identical `α · (J_vᵀ J_v + λ² I)⁻¹ J_vᵀ e`) |

Solve the small (at most 6×6) linear system yourself, for example by Gaussian elimination with
partial pivoting. Every joint's `q + Δq` must be within `1e-4` of the exact value. Note that
λ appears **squared**, and that with fewer than three movable joints `J_v J_vᵀ` is singular
without damping.

With `ik_position_only: false` the step uses the 6-vector error `[e ; e_ω]` and the whole 6×n
Jacobian. The spec recommends `e_ω` = the rotation vector (axis × angle) of `R_target · R_eᵀ`.
Other orientation errors, such as differences of Euler angles, may also be used, but the
rotation vector is the one that does not suffer from gimbal lock.

## Inverse kinematics: the solve

`/ik/solve_robot` takes the step's fields plus `position_tolerance`, `orientation_tolerance` and
`max_iterations`, and iterates from the given configuration:

1. Compute the **position error** `‖p_target − p_e‖` and, for a full-pose solve, the
   **orientation error**: the angle of the rotation `R_targetᵀ · R_e` (in `[0, π]`; it does not
   depend on how you represent rotations).
2. If both are below their tolerances, stop: `converged: true`.
3. If you have taken `max_iterations` steps, stop: `converged: false`.
4. Otherwise take one step, then **clamp every revolute and prismatic joint to its limits**, and
   go back to 1.

Reply with the final `configuration_solution`, `converged`, `final_error` (the position error
and the orientation error, or `null` for a position-only solve) **of the configuration you
return**, `iterations`, and `description_version`; `result` equals `converged`. A target the
robot cannot reach is a normal `converged: false` reply, not an error.

What is graded:

- **Honesty.** If you say `converged: true`, the configuration really is within tolerance, and
  `final_error` is the true error of the configuration you return.
- **Limits.** Every revolute and prismatic joint you return is within its limits.
- **Convergence.** A reachable target that the iteration above reaches within `max_iterations`
  without any joint hitting a limit must be reported converged. You may use a faster or smarter
  iteration, as long as it still does that.
- **Unreachable targets** are reported as not converged, honestly.
- **Full pose.** With `ik_position_only: false`, both errors must be below their tolerances.

## Testing

Test the way Autograder.io does: as an external TCP/JSON client of your running runtime on
`127.0.0.1:9095`. A few lines of Python load a robot and ask for one Jacobian:

```python
import itertools, json, socket, sys, time

sock = socket.create_connection(("127.0.0.1", 9095))
stream = sock.makefile("rwb")
ids = itertools.count()

def call(service, args):
    call_id = f"call-{next(ids)}"
    stream.write((json.dumps({"op": "call_service", "service": service, "id": call_id, "args": args}) + "\n").encode())
    stream.flush()
    for line in stream:  # skip other traffic until our reply arrives
        reply = json.loads(line)
        if reply.get("op") == "service_response" and reply.get("id") == call_id:
            return reply

with open(sys.argv[1], encoding="utf-8") as f:  # any .urdf file
    version = call("/param_server/set_param", {"name": "robot_description", "value": f.read()})["values"]["version"]

# An empty joint_state puts every joint at 0; name joints here to pick a configuration.
request = {"joint_state": {"name": [], "position": []}, "endeffector_frame": sys.argv[2]}
deadline = time.monotonic() + 3  # replies must reflect a new description within 2 s
while True:  # wait until the IK node answers for our version
    reply = call("/ik/robot_jacobian", request)
    if reply["values"].get("description_version", 0) >= version or time.monotonic() > deadline:
        break
    time.sleep(0.1)
if not reply["result"]:
    sys.exit(f"error: {reply['status']} (description_version {reply['values'].get('description_version')})")
for name, row in zip(reply["values"]["joint_names"], reply["values"]["jacobian"]):
    print(name, [round(v, 4) for v in row])
```

Things worth testing yourself:

- **The worked example** in `spec/IK_API.md`, and small robots you can do on paper: one revolute
  joint, a planar two- and three-link arm, a prismatic joint whose axis is `2 0 0` under a
  rotated origin.
- **Finite differences.** Your own FK is the ground truth: move one joint by a small `h` and check
  that the end-effector point moves by about `h` times that joint's row. This catches almost every
  Jacobian bug.
- **Chains in trees.** A robot with two arms: the left gripper's chain must not include right-arm
  joints. Fixed joints in the middle of a chain.
- **Real robots.** Fetch's `gripper_link` (8 movable joints, a prismatic torso). For your line
  size, any flat URDF over 64 KiB, or a robot of your own with a few thousand fixed links.
- **Steps by hand.** A two-link arm at `q = 0` toward a nearby target: compute `α·J_vᵀ·e` on paper
  and compare. Then the damped step with two values of λ.
- **Solves.** A reachable target (pick a configuration, compute its FK, and solve for it from a
  nearby start), a target out of reach, a target that needs a joint at its limit, and a full pose
  on a 6- or 7-joint arm.

## Common pitfalls

- **The sign of the error.** It is `e = p_target − p_e`. With `p_e − p_target` every step goes
  the wrong way.
- **`p_e − p_i`, not `p_i − p_e`**, inside the cross product.
- **The joint's position.** `p_i` is the joint frame's origin *after* its `<origin>` transform,
  not the parent link's origin.
- **The axis in the wrong frame.** Rotate it into the root frame with `R_i` before using it.
- **Normalizing.** Normalize revolute and continuous axes; do **not** normalize prismatic ones.
- **Fixed joints and other branches.** They get no rows.
- **The end-effector point.** It is the origin of the requested link, which may sit behind fixed
  joints after the last movable joint.
- **λ, not λ².** The damping term is `λ²I`.
- **Hard-coding α, λ or a tolerance.** Use the values in each request.
- **A step that remembers.** `/ik/solve_robot_step` must not continue a previous call's solve.
- **`final_error` for the wrong configuration.** Report the error of the configuration you
  return, not the one before your last step.
- **Claiming convergence you did not reach.** Check the tolerance before you say `true`.
- **Clamping inside the Jacobian.** The Jacobian uses the configuration exactly as given; only
  the solve's steps clamp to the limits.
- **Ignoring `ik_position_only`.** For a position-only solve, ignore the target orientation.
- **A short gateway timeout.** Raise it above your slowest solve (see "Autograder.io").
- **A fixed-size line buffer** anywhere. Read until the newline.
- **Hard-coding version numbers.** Compare against the version `set_param` returned.

## Grading

| Category | Weight |
| --- | ---: |
| A. Description and chain | 10% |
| B. Jacobian correctness | 30% |
| C. Gradient step | 20% |
| D. IK solve, position | 30% |
| E. IK solve, orientation | 10% |
| **Total** | **100%** |

Every category is graded by Autograder.io. The checkpoint grades categories A and B, except B's
near-1 MiB description, which is graded only in the final project.

**A. Description and chain** covers `description_version` and picking up each new
`robot_description`, the chain's joints and their order on robots with branches and fixed
joints, and error replies that leave your service running.

**B. Jacobian correctness** checks the rows for planar arms, spatial chains with rotated origins
and non-unit axes, prismatic joints, positions used exactly as given, partial `joint_state`, a
long chain, real robot URDFs sent unmodified (small and large), and a description near the
1 MiB line bound.

**C. Gradient step** checks single Jacobian-transpose and damped-least-squares steps exactly,
with several step lengths and damping values, and that a step depends only on its request.

**D. IK solve, position** checks solves of reachable targets with both methods on synthetic and
real robot arms, joint limits, honest reporting of unreachable targets, and a reloaded robot.

**E. IK solve, orientation** checks full-pose solves on 6- and 7-joint arms, synthetic and real.

**Optional, ungraded.** An IK *action* node (drive the robot to a solved target) and a timed
*trial* node (a sequence of random targets) are natural next steps, and a starting point for the
IK setpoint competition later in the term. They are not part of this project's grading.
