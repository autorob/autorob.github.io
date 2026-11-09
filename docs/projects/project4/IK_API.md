# Project 4 wire contract — the Jacobian, one gradient-descent step, and inverse kinematics

This is the external contract for Project 4's runtime. It reuses the Project 1 transport
unchanged: `spec/ROSBRIDGE_PROTOCOL.md`, TCP, newline-delimited JSON, `127.0.0.1:9095`,
`advertise/publish/subscribe`, `advertise_service/call_service/service_response`. Grading is
100% black-box over this contract. Nothing depends on a UI, internal file names, or process
topology.

**Keywords.** MUST and MUST NOT are requirements; SHOULD is a strong recommendation that is not
graded; MAY is permitted but optional. An input marked UNSPECIFIED is one your runtime will not
receive: you may do anything with it except crash or hang. OUT OF SCOPE is not part of the
project at all.

Project 4 is **kinematics only**. Nothing here involves mass, inertia, gravity, simulation or
control gains.

## What you build

| Service | What it answers |
|---|---|
| `/param_server/set_param`, `/param_server/get_param` | The parameter server, the same as Project 3's (restated below). The robot arrives as the `robot_description` parameter. |
| `/ik/robot_jacobian` | The manipulator Jacobian of the chain from the robot's root link to an end-effector link, at a given configuration. **This is the checkpoint.** |
| `/ik/solve_robot_step` | One gradient-descent step toward an end-effector target: Jacobian transpose, or the Jacobian pseudoinverse, plain or damped (damped least squares). |
| `/ik/solve_robot` | Inverse kinematics: iterate that step until the end effector reaches the target, or give up. |

Internal topology is up to you: one node offering all three IK services, three nodes, or IK
folded into another process. Only the wire is graded.

## Runtime and Make ABI

`make build`, `make run` and `make clean` are defined in the handout's "Submission, building,
and running" section (the same rules as Projects 1–3).

- **`make run`** MUST launch the gateway, the parameter server, and whatever answers the IK
  services, and each service you implement MUST be answering within **10 seconds** of `make run`
  starting. (For the checkpoint, that is the parameter server and `/ik/robot_jacobian`.)
- The gateway speaks the shared protocol (`spec/ROSBRIDGE_PROTOCOL.md`). Project 4 uses only
  `call_service` and the protocol's error `status` reply to an unknown operation; the rest of
  your Project 1 gateway may stay as it is.
- `make run` MUST NOT launch anything that publishes `/joint_states` or that sets
  `robot_description`. Your Project 3 `robot_state_publisher` and `robot_world_state_publisher`
  MAY run; nothing in Project 4 depends on them.
- `make demo` MAY exist for anything you want to show off (a viewer, an IK demo, ...). It is
  not graded.

The runtime starts with **no `robot_description` set**. It needs no files, environment
variables or command-line arguments: every robot arrives through `/param_server/set_param`.

**Versions are relative.** Do not assume `robot_description`'s `version` starts at any
particular number: other robots may already have been loaded. A version number is meaningful
only relative to the version `set_param` returns.

> **Line size: every hop MUST carry lines of at least 1 MiB.** A URDF travels as one JSON
> string, inside the `set_param` request line and again inside the `get_param` reply your IK
> node reads. A real robot's request line is 20–110 KiB, and a description can come close to
> 1 MiB. **A fixed 64 KiB line buffer will fail; read until the newline**, in the gateway and in
> every node-to-node connection.

## `param_server`

The same as Project 3's, restated here in full. Both services use the standard
`{"values": {...}, "result": <bool>, "status": <string>}` envelope.

### `/param_server/set_param`

Request: `{"name": "<parameter name>", "value": <any JSON value>}`.

- A missing or non-string `name` MUST be rejected: `result: false`, non-empty `status`, nothing
  stored.
- Otherwise the server MUST store `value` under `name` (a missing `value` stores `null`),
  increment that name's `version` (each name's version starts at 0 and the first set makes it
  1), and reply `result: true` with `{"version": <new version>}`.
- The server MUST NOT interpret or validate `value`. A malformed URDF is still stored.

### `/param_server/get_param`

Request: `{"name": "<parameter name>"}`.

- If `name` has been set: `result: true` with `{"value": <stored value>, "version": <version>}`,
  the value exactly as stored.
- If it has never been set: `result: false`, non-empty `status`, values
  `{"value": null, "version": 0}`.
- UNSPECIFIED: the `values` of a rejected `set_param`, and `get_param` with a missing or
  non-string `name`.

The only parameter set from outside your runtime during grading is `robot_description`: the
URDF text as one JSON string (`spec/ROBOT_DESCRIPTION.md`). A node MAY read other parameters of
its own (for example a default step length), and MUST then use its documented default when one
has never been set.

## Reading the robot

Each IK service answers for the robot described by `robot_description`. Read it through
`/param_server/get_param`, either in the background (polling is fine) or on each request.

- **`description_version` (MUST).** Every reply of every IK service, success or error, carries
  `values.description_version`: the `robot_description` version the reply reflects, or `0` if
  `robot_description` has never been set.
- **Pickup bound (MUST).** Once `set_param` of `robot_description` has replied with version `V`,
  every IK reply sent 2 seconds or more later MUST carry `description_version >= V`, and every
  reply MUST be computed for the description whose version it echoes. If versions arrive faster than you poll, you MAY skip
  intermediate ones.
- **An invalid description** (anything `spec/ROBOT_DESCRIPTION.md` "Validity" says MUST be
  rejected, a value that is not a JSON string, or text that is not well-formed XML) MUST NOT
  crash or hang any service. While it is the newest version, the IK services MAY either reject
  every request (`result: false`, non-empty `status`, `description_version` = the invalid
  version) or keep answering for the previously loaded valid robot (`description_version` = that
  robot's version). Either way, the next valid version MUST be picked up under the bound above.
- With no robot loaded, every IK request MUST get `result: false` with a non-empty `status`.

## Frames and conventions

- **Everything is in the root-link frame.** The root link is the unique link that is no joint's
  child (`spec/ROBOT_DESCRIPTION.md`). The Jacobian's rows, a step's or solve's target pose, and
  every reported error are expressed in the frame of the loaded robot's root link. There is
  no world frame or global pose in Project 4.
- **Forward kinematics (the same as Project 3's):** `T_joint(q) = T_origin · T_motion(q)`, with `rpy`
  fixed-axis (`R = Rz(yaw)·Ry(pitch)·Rx(roll)`), revolute and continuous joints rotating about
  their axis **normalized**, and prismatic joints translating by `q · axis` with the axis **as
  written** (not normalized). See `spec/ROBOT_DESCRIPTION.md`, "Kinematic semantics".
- **The chain.** For an end-effector link `e`, the chain is the path of joints from the root
  link down to `e`. Its **movable joints** are the chain's `revolute`, `continuous` and
  `prismatic` joints, in root-to-end-effector order. Fixed joints on the chain still contribute
  their origin to forward kinematics but have no degree of freedom. Joints on other branches of
  the tree are not part of the chain.
- **The end-effector point** is the origin of link `e`'s frame, `p_e`.

### Rotations

- A target `orientation` is a unit quaternion `(x, y, z, w)`, with `w` the scalar part (the
  `geometry_msgs/Pose` convention). `R_target` is its rotation matrix:

  ```text
  R_target = | 1−2(y²+z²)   2(xy−wz)     2(xz+wy)   |
             | 2(xy+wz)     1−2(x²+z²)   2(yz−wx)   |
             | 2(xz−wy)     2(yz+wx)     1−2(x²+y²) |
  ```

- `R_e(q)` is the rotation of link `e`'s frame in the root-link frame at configuration `q`: the
  rotation part of link `e`'s forward-kinematics transform.
- The **angle** of a rotation matrix `R` is `θ = atan2(‖v‖/2, (trace(R) − 1)/2)`, in `[0, π]`,
  where `v = (R₃₂ − R₂₃, R₁₃ − R₃₁, R₂₁ − R₁₂)`. `R_target · R_eᵀ` and `R_targetᵀ · R_e` have
  the same angle (their traces are equal).
- The **rotation vector** of `R` is `θ·u`, with `u` its unit axis: `u = v/‖v‖` when
  `0 < θ < π`; the zero vector when `θ = 0`; when `θ = π`, a unit `u` with `R = 2uuᵀ − I`
  (either sign).

### `joint_state` (request field, all three IK services)

`{"name": ["<joint>", ...], "position": [<number>, ...]}`, the shape of `sensor_msgs/JointState`.
Other fields (`header`, `velocity`, `effort`) MAY be present and MUST be ignored.

- For each `i`, joint `name[i]` is at `position[i]`. A movable joint of the robot that
  `joint_state` does not name is at `0`.
- Names that are not movable joints of the loaded robot (unknown names, `fixed` joints, joints on
  other branches) MUST be ignored.
- Positions are used **exactly as given**. Your runtime MUST NOT clamp them to the joint limits,
  and MUST accept any finite position, including revolute and prismatic positions outside their
  limits and continuous positions past ±π.
- Numbers are JSON numbers; integers MUST be accepted where a number is expected. `true` and
  `false` are not numbers (in Python, `isinstance(True, int)` is `True`, so test for `bool`
  first).
- MUST be rejected (`result: false`, non-empty `status`): `name` and `position` of different
  lengths, and a position that is not a number for a movable joint of the chain.
- UNSPECIFIED: a missing `joint_state`; a `joint_state` that is not an object, or whose `name` or
  `position` is missing or not an array; a non-string entry in `name`; a non-number position for
  a name that is not a movable joint of the chain; duplicate names; non-finite numbers;
  hexadecimal floats.

## `/ik/robot_jacobian` (checkpoint)

Request:

```json
{"joint_state": {"name": ["shoulder", "elbow"], "position": [0.0, 1.5707963267948966]},
 "endeffector_frame": "tip"}
```

- `endeffector_frame` is the name of a link of the loaded robot whose chain has at least one
  movable joint. UNSPECIFIED: a missing `endeffector_frame`, the root link itself, and a link
  whose chain has no movable joints (an empty `joint_names` and `jacobian` is the natural
  answer).

Reply on success (`result: true`):

```json
{"values": {"joint_names": ["shoulder", "elbow"],
            "jacobian": [[-1.0, 1.0, 0.0, 0.0, 0.0, 1.0],
                         [-1.0, 0.0, 0.0, 0.0, 0.0, 1.0]],
            "description_version": 7,
            "endeffector_frame": "tip"},
 "result": true, "status": ""}
```

- `joint_names` MUST be the chain's movable joints in root-to-end-effector order, each exactly
  once.
- `jacobian` MUST be an array with one row per entry of `joint_names`: **row `i` belongs to
  joint `joint_names[i]` and is `[v_x, v_y, v_z, ω_x, ω_y, ω_z]`**, the linear velocity of `p_e`
  and the angular velocity of link `e` per unit rate of that joint, in the root-link frame. (This
  N×6 layout is the transpose of the 6×N textbook Jacobian; each row is one joint's column.)
- `endeffector_frame` MAY be echoed.

Each row, for joint `i` whose frame (after its origin, before its motion) has origin `p_i` and
rotation `R_i` in the root frame, with axis `a_i` as written in the URDF:

| Joint type | Row `i` |
|---|---|
| `revolute`, `continuous` | `[ẑ_i × (p_e − p_i) ; ẑ_i]` with `ẑ_i = R_i·a_i / ‖a_i‖` |
| `prismatic` | `[R_i·a_i ; 0, 0, 0]` with `a_i` **not normalized** (the derivative of `q·axis`) |

Every entry MUST be within `1e-4` of the exact value. A Jacobian reply SHOULD arrive within a
second.

**Worked example.** The two-link planar arm below has `shoulder` at the root, `elbow` 1 m
along the upper arm's x axis, and the tip a further 1 m along the forearm's x axis, all rotating
about z:

```xml
<robot name="two_link">
  <link name="base"/><link name="upper"/><link name="fore"/><link name="tip"/>
  <joint name="shoulder" type="revolute"><parent link="base"/><child link="upper"/>
    <axis xyz="0 0 1"/><limit lower="-3" upper="3"/></joint>
  <joint name="elbow" type="revolute"><parent link="upper"/><child link="fore"/>
    <origin xyz="1 0 0"/><axis xyz="0 0 1"/><limit lower="-3" upper="3"/></joint>
  <joint name="tip_mount" type="fixed"><parent link="fore"/><child link="tip"/>
    <origin xyz="1 0 0"/></joint>
</robot>
```

At `shoulder = 0`, `elbow = π/2` the tip is at `p_e = (1, 1, 0)`. The shoulder sits at
`p_1 = (0, 0, 0)` with `ẑ_1 = (0, 0, 1)`, so its row is `[(0,0,1) × (1,1,0) ; (0,0,1)] =
[-1, 1, 0, 0, 0, 1]`. The elbow sits at `p_2 = (1, 0, 0)`, so its row is
`[(0,0,1) × (0,1,0) ; (0,0,1)] = [-1, 0, 0, 0, 0, 1]`. `tip_mount` is fixed, so it has no row.
That is exactly the reply shown above.

**Errors.** Each of these MUST give `result: false` with a non-empty `status`, and the service
MUST keep answering later requests: no robot loaded; an `endeffector_frame` that is not a link of
the robot; a malformed `joint_state` (see above).

## `/ik/solve_robot_step` (final)

One gradient-descent step, **stateless**: everything it needs is in the request, and nothing
carries over from one call to the next.

Request:

```json
{"joint_state": {"name": ["shoulder", "elbow"], "position": [0.3, 0.9]},
 "endeffector_frame": "tip",
 "endeffector_pose": {"position": {"x": 1.2, "y": 0.8, "z": 0.0},
                      "orientation": {"x": 0.0, "y": 0.0, "z": 0.0, "w": 1.0}},
 "ik_position_only": true,
 "method": "JacobianTranspose",
 "step_length": 0.05,
 "damping": 0.2}
```

| Field | Meaning |
|---|---|
| `joint_state` | The current configuration `q` (rules above). |
| `endeffector_frame` | The end-effector link `e`. |
| `endeffector_pose` | The target, a `geometry_msgs/Pose` in the root-link frame. `orientation` is a unit quaternion `(x, y, z, w)`; it MUST be ignored when `ik_position_only` is `true`. |
| `ik_position_only` | `true`: reach the target position only. `false`: position and orientation. |
| `method` | `"JacobianTranspose"` or `"JacobianPseudoinverse"` (exact strings). `"JacobianPseudoinverse"` is the plain pseudoinverse when λ = 0 and damped least squares when λ > 0. |
| `step_length` | α > 0. |
| `damping` | λ ≥ 0, used only by `"JacobianPseudoinverse"`. |

**Defaults.** Every request your runtime is graded on carries all of these fields. The course's
expected defaults, for a client that leaves one out, are `method` `"JacobianTranspose"`,
`step_length` 0.1, `ik_position_only` `true`, and `damping` 0 (which makes
`"JacobianPseudoinverse"` the plain, undamped pseudoinverse). Your runtime MAY reject a request
that omits one of these four fields or MAY fill the field in; if it fills one in, it SHOULD use
these defaults. Every other field is required.

**The step (position only).** Let `p_e(q)` be the end-effector point at `q`, `e = p_target −
p_e(q)` the position error, and `J_v` the 3×n linear part of the Jacobian at `q` (columns in the
order of the chain's movable joints). Then `q_next = q + Δq` with:

| `method` | Δq |
|---|---|
| `JacobianTranspose` | `Δq = α · J_vᵀ · e` |
| `JacobianPseudoinverse` | `Δq = α · J_vᵀ (J_v J_vᵀ + λ² I)⁻¹ e`, or the identical `α · (J_vᵀ J_v + λ² I)⁻¹ J_vᵀ e` |

Each joint's `q_next` MUST be within `1e-4` of the exact value. Solve the small linear system
yourself, for example by Gaussian elimination with partial pivoting (in the `J_v J_vᵀ` form it is
3×3 whatever the number of joints, 6×6 for a full-pose step; the `J_vᵀ J_v` form is n×n); the
course image has no linear-algebra library.

**The step (position and orientation).** With `ik_position_only: false`, use the 6-vector error
`[e ; e_ω]` and the full 6×n Jacobian. `e_ω` SHOULD be the rotation vector (axis × angle, angle
in `[0, π]`) of `R_target · R_e(q)ᵀ`, in the root frame. Other orientation error vectors MAY be
used; a single 6-D step's exact result is not graded.

Reply (`result: true` for every valid request):

```json
{"values": {"configuration_solution": {"name": ["shoulder", "elbow"], "position": [0.3123, 0.9061]},
            "description_version": 7},
 "result": true, "status": ""}
```

- `configuration_solution` MUST be a JointState-shaped object (`name`, `position`; other fields
  MAY be present) that names every movable joint of the chain exactly once, with its `q_next`.
  Other joints MAY be named too; they are ignored.
- `endeffector_frame` and an error report MAY be included.
- Joint limits: whether a step clamps to `[lower, upper]` is UNSPECIFIED. Your runtime will not
  receive a step that would cross a limit.
- Errors (`result: false`, non-empty `status`): as for `/ik/robot_jacobian`.
- UNSPECIFIED: any other `method` string; `step_length <= 0`; `λ = 0` when `J_v J_vᵀ` is
  singular; a missing field (see "Defaults" above); a non-unit target quaternion.

## `/ik/solve_robot` (final)

Iterate to convergence. Request: every `/ik/solve_robot_step` field, plus:

| Field | Meaning |
|---|---|
| `position_tolerance` | Meters, > 0. |
| `orientation_tolerance` | Radians, > 0; used only when `ik_position_only` is `false`. |
| `max_iterations` | An integer ≥ 1: the most steps the solve may take. |

`joint_state` is the starting configuration.

Reply:

```json
{"values": {"configuration_solution": {"name": ["shoulder", "elbow"], "position": [0.1, 1.2]},
            "converged": true,
            "final_error": {"position": 0.00071, "orientation": null},
            "iterations": 37,
            "description_version": 7},
 "result": true, "status": "converged"}
```

- `configuration_solution` (MUST): as for the step, the final configuration.
- **Error measures.** The position error of a configuration is `‖p_target − p_e(q)‖`. Its
  orientation error is the angle of the rotation `R_targetᵀ · R_e(q)` (the geodesic angle, in
  `[0, π]`; it does not depend on how you represent rotations).
- `final_error` (MUST): `{"position": <m>, "orientation": <rad> | null}` for the returned
  configuration, each within `1e-4` of the exact value. `orientation` is `null` when
  `ik_position_only` is `true`.
- `converged` (MUST): `true` only if the returned configuration's position error is below
  `position_tolerance` and, unless `ik_position_only`, its orientation error is below
  `orientation_tolerance`.
- `result` MUST equal `converged`. A target the robot cannot reach is a normal
  `converged: false` reply with `configuration_solution` and `final_error` present, not an error.
- `iterations` MAY be reported.
- **Joint limits (MUST).** Every `revolute` and `prismatic` joint in `configuration_solution`
  MUST lie within its `[lower, upper]` (to within `1e-4`). (Clamping each joint after each step is one way.)
  `continuous` joints have no limits.
- **Convergence (MUST).** Iterate the step of `/ik/solve_robot_step` from `joint_state` with the
  request's `method`, `step_length` and `damping`, clamping revolute and prismatic joints to their
  limits after each step. If that iteration reaches the tolerances within `max_iterations` steps
  **without any joint ever reaching one of its limits**, the reply MUST report `converged: true`.
  (When a limit is reached, convergence is not guaranteed; the rules above still apply.) For
  orientation this is stated for the recommended rotation-vector error. You MAY use a different
  or faster iteration as long as it meets this.
- **Time (SHOULD).** For a chain of at most 10 movable joints and `max_iterations <= 2000`, the
  reply SHOULD arrive within **5 seconds**. A test makes several calls within its time limit, so
  faster is safer. Make sure your gateway's service-call timeout is longer than your slowest
  solve.
- Errors (`result: false`, non-empty `status`, no `configuration_solution` required): as for the
  step.
- UNSPECIFIED: a starting configuration outside the joint limits; any input the step leaves
  UNSPECIFIED.

## Out of the graded surface

These are OUT OF SCOPE for the graded runtime. A runtime MAY offer them; none is graded:

- dynamics of any kind: mass, inertia, gravity, simulation, PID or gain tuning;
- the nodes and topics of the course's later IK setpoint competition (a separate activity), such
  as IK action and trial nodes and joint-trajectory topics;
- targets in a world frame (a robot placed somewhere in a world) and world-frame poses: every pose
  in Project 4 is in the root-link frame;
- defaults taken from live state: the latest `/joint_states`, an `endeffector_frame` parameter, or
  a list of preferred link names;
- progress or "ghost" topics published during a solve, and pausing between iterations;
- Cyclic Coordinate Descent, downhill simplex and other IK methods (you MAY add them under other
  `method` names);
- a WebSocket gateway (port 9096 is a non-goal for every course project).
