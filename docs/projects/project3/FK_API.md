# Project 3 wire contract — parameter server, robot state publishers, and the recommended nodes

This is the external contract for Project 3's runtime. It reuses the Project 1 transport
unchanged: `spec/ROSBRIDGE_PROTOCOL.md`, TCP, newline-delimited JSON, `127.0.0.1:9095`,
`advertise/publish/subscribe`, `advertise_service/call_service/service_response`. Grading is
100% black-box over this contract. Nothing depends on a UI, internal file names, or process
topology. Type names are informational, as in Project 1; the ones below are the ones the
course reference uses.

Keywords MUST, MUST NOT, SHOULD, MAY, UNSPECIFIED, and OUT OF SCOPE are used as in the
Project 2 specs. **SHOULD** marks a recommended node or behavior: it is part of the project
(your portfolio video needs it), but it is not graded.

## The node graph

```text
                       /param_server/set_param, /param_server/get_param
   param_server   <---------------------------------------------------+
   (robot_description)                                                |
        |  get_param robot_description              set_param         |
        v                                           .../description_status
   robot_state_publisher   <-- /joint_states --  joint_state_publisher (SHOULD)
        |                                            ^
        |  /tf  (parent -> child, per joint)         |  /joint_trajectory
        v                                            |
   robot_world_state_publisher  <-- /global_pose     finite_state_machine (SHOULD)
        |                                                 /fsm/* services, /fsm/status
        v
   /xform_world  (global_frame -> every link, 4x4)
```

| Node | Graded | Role |
|---|---|---|
| `param_server` | yes | Stores named parameters, including `robot_description` (the URDF text). |
| `robot_state_publisher` | yes | Reads `robot_description`, applies `/joint_states`, publishes every joint's parent-to-child transform on `/tf`. |
| `robot_world_state_publisher` | yes | Composes `/tf` and the robot's global pose into every link's pose in the global frame, published on `/xform_world`. |
| `joint_state_publisher` | no (SHOULD) | Holds the robot's current joint angles, servos them toward `/joint_trajectory` setpoints, publishes `/joint_states`. |
| `finite_state_machine` | no (SHOULD) | Runs a choreography as a table of joint-space setpoints, publishes `/joint_trajectory`. |

## Runtime and Make ABI

`make build`, `make run`, and `make clean` work as in Projects 1 and 2 (see the handout's
"Submission, building, and running" section). There is no `make map` target for Project 3.

- **`make run`** MUST launch the gateway, `param_server`, `robot_state_publisher`, and
  `robot_world_state_publisher`, and the services below MUST be answering within 10 seconds of
  `make run` starting. `make run` MUST NOT launch anything that publishes `/joint_states`,
  `/joint_trajectory`, or `/global_pose`, or that sets `robot_description`: during grading,
  those come only from external clients. In particular, `make run` MUST NOT launch
  `joint_state_publisher` or `finite_state_machine`.
- **`make demo`** SHOULD launch everything `make run` does plus `joint_state_publisher` and
  `finite_state_machine`. It is what you run, with a viewer of your own, to record your
  portfolio video. It is not graded.

The runtime starts with **no `robot_description` set**. It needs no files, environment
variables, or command-line arguments: every robot arrives through
`/param_server/set_param`.

**Ready means the whole pipeline works.** Within the 10 seconds above, a `set_param` of
`robot_description` holding a small valid URDF MUST succeed, `robot_state_publisher` MUST
report it `accepted` (see "Description status"), and `/tf` and `/xform_world` MUST carry it.
Services that answer without doing this do not count as ready.

**Versions are relative.** Do not assume `robot_description`'s `version` starts at any
particular number when your runtime is used: other robots may already have been loaded. A
version number is meaningful only relative to the version `set_param` returns.

## Message shapes

**`TransformStamped`** (ROS `geometry_msgs/TransformStamped`), used on `/tf`:

```json
{"header": {"stamp": {"sec": 0, "nanosec": 0}, "frame_id": "<parent frame>"},
 "child_frame_id": "<child frame>",
 "transform": {"translation": {"x": 0.0, "y": 0.0, "z": 0.0},
               "rotation": {"x": 0.0, "y": 0.0, "z": 0.0, "w": 1.0}}}
```

- `rotation` MUST be a unit quaternion, with norm within `1e-4` of 1; within that tolerance it
  is treated as normalized. Its sign is UNSPECIFIED: `q` and `-q` are equally correct.

**`MatrixTransform`**, used on `/xform_world`. Not a real ROS message; the course defines it:

```json
{"header": {"stamp": {"sec": 0, "nanosec": 0}, "frame_id": "global_frame"},
 "child_frame_id": "<link name>",
 "matrix": [m00, m10, m20, m30,  m01, m11, m21, m31,  m02, m12, m22, m32,  m03, m13, m23, m33]}
```

- `matrix` is the 4x4 homogeneous transform `M` as a flat array of exactly 16 numbers in
  **column-major** order: `matrix[4*c + r] = M[r][c]`. So the translation is
  `matrix[12], matrix[13], matrix[14]`, and `matrix[3], matrix[7], matrix[11], matrix[15]` are
  `0, 0, 0, 1`. (This is the layout three.js's `Matrix4.fromArray` reads.)
- The rotation block MUST be a rotation matrix: orthonormal within `1e-4`, determinant `+1`.

**`Pose`** (ROS `geometry_msgs/Pose`), used on `/global_pose`:

```json
{"position": {"x": 0.0, "y": 0.0, "z": 0.0}, "orientation": {"x": 0.0, "y": 0.0, "z": 0.0, "w": 1.0}}
```

Extra fields (for example a `seq` counter) MUST be ignored.

Everywhere: numeric fields MUST be JSON numbers (integers are acceptable where a number is
expected), and frame names are link names, except `global_frame`.

**Accuracy.** Every translation MUST be within `1e-4` m of the exact value, and every rotation
within `1e-4` rad of it, measured as the geodesic angle between rotation matrices, so accuracy
is independent of representation and quaternion sign.

> **Line size (checkpoint and final): every hop MUST carry lines of at least 1 MiB.** A URDF
> travels as one JSON string: inside the `set_param` request line, and again inside the
> `get_param` reply that `robot_state_publisher` reads. Real robots are big: the PR2's request
> line is about 110 KiB, and a description can come close to the 1 MiB bound. The
> Project 1 rosbridge contract already permits lines up to 4 MiB. **A fixed 64 KiB line buffer
> will fail; read until the newline, growing the buffer as needed**, in the gateway and in
> every node-to-node connection.

## `param_server`

Both services use the standard `{"values": {...}, "result": <bool>, "status": <string>}`
envelope.

### `/param_server/set_param`

Request: `{"name": "<parameter name>", "value": <any JSON value>}`.

- A missing or non-string `name` MUST be rejected: `result: false`, non-empty `status`, nothing
  stored.
- Otherwise the server MUST store `value` under `name` (a missing `value` stores `null`),
  increment that name's `version` (each name's version starts at 0 and the first set makes it
  1), and reply `result: true` with `{"version": <new version>}`.
- The server MUST NOT interpret or validate `value`. A malformed URDF is still stored; judging
  it is `robot_state_publisher`'s job.

### `/param_server/get_param`

Request: `{"name": "<parameter name>"}`.

- If `name` has been set: `result: true` with `{"value": <stored value>, "version": <version>}`,
  the value exactly as stored.
- If it has never been set: `result: false`, non-empty `status`, values
  `{"value": null, "version": 0}`.

### Parameters this project uses

| Name | Written by | Value |
|---|---|---|
| `robot_description` | an external client (during grading; in `make demo`, whatever loads a robot, such as your own tooling) | URDF text, as one JSON string (`spec/ROBOT_DESCRIPTION.md`). |
| `/robot_state_publisher/description_status` | `robot_state_publisher` | See "Description status". |

A node MAY read other parameters of its own (for example a publish rate or a fixed-frame
name), and MUST use its documented default when one has never been set. No parameter other
than `robot_description` is set from outside your runtime during grading.

## `robot_state_publisher`

### Reading `robot_description`

`robot_state_publisher` MUST read `robot_description` through `/param_server/get_param`
(polling is fine) and process every new `version` it sees.

- **Pickup bound:** after a `set_param` of `robot_description` replies with version `V`, the
  node MUST set a description status for some version `>= V` within **2 seconds**. If
  versions arrive faster than it polls, it MAY skip intermediate ones; it MUST process the
  latest.
- **A valid description** (`spec/ROBOT_DESCRIPTION.md`) replaces the loaded robot.
- **An invalid description** (anything `spec/ROBOT_DESCRIPTION.md` "Validity" says MUST be
  rejected, a value that is not a JSON string, or text that is not well-formed XML) MUST be
  ignored: the previously loaded robot, if any, stays in effect, unchanged, and the node keeps
  running. Validate the whole description before touching the current robot.

### Description status

After processing a version (valid or not), `robot_state_publisher` MUST set the parameter
`/robot_state_publisher/description_status` to:

```json
{"version": 7, "accepted": true, "error": "", "loaded_version": 7, "root_link": "base_link"}
```

| Field | Value |
|---|---|
| `version` | The `robot_description` version just processed. |
| `accepted` | Whether that version was loaded. |
| `error` | `""` when accepted; a non-empty reason when not. |
| `loaded_version` | The version of the robot now in effect (`0` if none). |
| `root_link` | The root link of the robot now in effect (`""` if none). |

It MUST write the status **after** the new robot (if accepted) is fully in effect: every `/tf`
message it publishes after the status is set reflects that robot. After a rejection,
`loaded_version` and `root_link` still describe the previous robot. The text of `error` is
UNSPECIFIED.

### `/joint_states` (subscribe) — `sensor_msgs/JointState`

`{"header": {"stamp": {"sec": 0, "nanosec": 0}, "frame_id": ""}, "name": [...], "position": [...], "velocity": [...], "effort": [...]}`

- **Each message replaces the joint state.** For each `i`, joint `name[i]` is at `position[i]`.
  A movable joint the latest message does not name is at `0`.
- Names that are not movable joints of the loaded robot (unknown names, `fixed` joints) MUST
  be ignored.
- The latest message's `header.stamp` becomes the stamp of every `/tf` entry. Before any
  message has been received, the stamp is `{"sec": 0, "nanosec": 0}`. Stamps your runtime
  receives have integer `sec` and `nanosec`.
- `velocity` and `effort` MAY be absent or empty and MUST be ignored.
- **Limits:** positions are used exactly as given. FK MUST NOT clamp to `limit`. Your runtime
  will only receive revolute and prismatic positions within their limits, and continuous
  positions within `[-2π, 2π]`.
- UNSPECIFIED (your runtime will not receive them): messages whose `name` and `position` lengths
  differ or hold non-strings or non-finite numbers; malformed stamps; whether joint state and
  stamp received before a robot loads, or before a reload, carry over to the new robot.
- **Latency:** a message MUST be reflected on `/tf` promptly, within a few seconds at most.
  The same message MAY arrive more than once.

### `/tf` (publish) — `tf/tfMessage`

`{"transforms": [ <TransformStamped>, ... ]}`

- While a robot is loaded, the node MUST publish `/tf` at least **5 times per second** (the
  reference publishes at 10 Hz). It MUST NOT publish `/tf` while no robot is loaded.
- Each message MUST be complete: exactly one entry per joint of the loaded robot, **including
  `fixed` joints**, with `header.frame_id` = the joint's parent link, `child_frame_id` = its
  child link, and transform `T_joint(q) = T_origin · T_motion(q)` at the current joint state
  (`spec/ROBOT_DESCRIPTION.md`). The root link has no entry. Entry order is UNSPECIFIED.
- Every entry of one message carries the same stamp (see `/joint_states`).
- Latching is UNSPECIFIED. A subscriber that joins late MUST receive a complete, current
  message within one publishing period.

## `robot_world_state_publisher`

### Inputs

- **`/tf`** (subscribe). Each `/tf` message is a complete set of parent-to-child edges. The
  node MUST compute from the **most recent** `/tf` message alone; it MUST NOT merge in edges
  from earlier messages. (Merging would leave a previous robot's links in `/xform_world` after
  a reload.)
- **`/global_pose`** (subscribe) — `geometry_msgs/Pose`: the pose of the robot's root link in
  `global_frame`, `T_global_root = Trans(position) · Rot(orientation)`. The node MUST maintain
  the global pose itself: it is the identity until a `/global_pose` message arrives, and then
  the most recent one. Its `orientation` is always a unit quaternion.

### `/xform_world` (publish) — `xform_world/MatrixTransformArray`

`{"transforms": [ <MatrixTransform>, ... ]}`

- While it has received a `/tf` message, the node MUST publish `/xform_world` at least **5
  times per second** (the reference publishes at 10 Hz).
- **Root:** the root of a `/tf` message is the frame that appears as some entry's
  `header.frame_id` and never as any entry's `child_frame_id`. A `/tf` message whose edges do
  not form one tree is UNSPECIFIED (`robot_state_publisher` never sends one).
- Each message MUST be complete: exactly one entry for **every link** in the most recent `/tf`
  message's tree, **including the root**, with `header.frame_id` = `"global_frame"` and
  `matrix` = `T_global_link = T_global_root · T_root_link`, where `T_root_link` composes the
  `/tf` edges from the root down to the link. With no `/global_pose`, the root's matrix is the
  identity. An additional identity entry whose `child_frame_id` is `"global_frame"` MAY be
  present; it does not count as a link. Entry order is UNSPECIFIED.
- `global_frame` is z-up, like every URDF frame. It MUST NOT include any rendering correction
  (for example a y-up rotation for a 3D viewer); a viewer applies its own.
- **Stamp:** every entry carries the stamp of the `/tf` message it was computed from.
- Latching is UNSPECIFIED. A subscriber that joins late MUST receive a complete, current
  message within one publishing period.
- A robot with no joints has an empty `/tf`, so `/xform_world` cannot name its root; what
  RWSP publishes then is UNSPECIFIED.
- The node MAY read a fixed-frame parameter of its own, but its default MUST be
  `global_frame` as above (see "Parameters this project uses").

## Recommended nodes (SHOULD; never graded)

These are part of the project: they drive your robot for the portfolio video, and later projects
build on them. They are not graded: nothing launches, calls, or listens for them during grading,
so the details below are recommendations that match the course reference. Your own design is
fine.

### `joint_state_publisher`

- Reads `robot_description` from the parameter server, as `robot_state_publisher` does.
- Subscribes **`/joint_trajectory`** — `trajectory_msgs/JointTrajectory`:
  `{"joint_names": [...], "points": [{"positions": [...], "velocities": [...], "accelerations": [...], "time_from_start": {"sec": 0, "nanosec": 0}}]}`.
  It uses the last point as the setpoint for the named joints. Names the loaded robot does not
  have move nothing now (see the next bullet).
- Publishes **`/joint_states`** at about 10 Hz with every movable joint of the loaded robot,
  moving each joint toward its setpoint (the reference uses a proportional servo, gain 50 per
  second, clamped to the joint's limits; snapping straight to the setpoint is also fine).
- It reads `robot_description` on its own schedule, so a `/joint_trajectory` can arrive just
  before it has loaded a new robot. The reference therefore keeps setpoints by joint name,
  including names the loaded robot does not have yet, and applies them once a robot with those
  joints loads; a joint the old and new robot share keeps its position, clamped to the new limits.
- The reference also offers `/joint_state_publisher/reset` (move every joint to the middle of
  its limits, or 0 for continuous joints).

### `finite_state_machine`

A choreography is a table of states. Each state is a joint-space setpoint plus named
transitions. The node publishes the current state's setpoint on `/joint_trajectory` when it
enters that state, watches `/joint_states` to see when the robot has arrived (every named joint
within `epsilon`), and then follows the state's `on_arrival` transition, if it has one.

The reference's FSM document, used by its services and its saved files:

```json
{"initial_state": "home",
 "states": [
   {"name": "home",
    "target": {"joint_names": ["shoulder", "elbow"], "positions": [0.0, 0.0]},
    "epsilon": 0.02,
    "on_arrival": "to_wave",
    "transitions": [{"name": "to_wave", "next_state": "wave"}]},
   {"name": "wave",
    "target": {"joint_names": ["shoulder", "elbow"], "positions": [0.8, -0.5]},
    "epsilon": 0.02,
    "on_arrival": "to_home",
    "transitions": [{"name": "to_home", "next_state": "home"}]}]}
```

`on_arrival`, if present, names one of the state's own transitions. A valid table has at least
one state, unique state names, unique transition names within each state, every
`next_state` and `on_arrival` resolving, `initial_state` naming a state, and `epsilon >= 0`.

Recommended services (the reference's names), all with the standard envelope:

| Service | Request | Effect |
|---|---|---|
| `/fsm/update_logic` | an FSM document | Validate and replace the running table (an invalid one leaves the old table running), enter `initial_state`, and start running. Reply `{"current_state": "<name>"}`. |
| `/fsm/get_logic` | `{}` | Reply with the current table (`initial_state`, `states`). |
| `/fsm/set_running` | `{"data": true\|false}` (omit `data` to query) | Run or stop. Reply `{"running": <bool>}`. |
| `/fsm/fire_transition` | `{"transition": "<name>"}` | Take a transition of the current state by hand (rejected while stopped). |
| `/fsm/save_to_file` | `{"identifier": "<name>", "initial_state": ..., "states": [...]}` | Save the document under `fsm/<identifier>.json`, unvalidated (a work in progress may be saved). Reply `{"path": "<path>"}`. |
| `/fsm/load_from_file` | `{"identifier": "<name>"}` | Reply with the saved document (`initial_state`, `states`), unvalidated. It does not deploy it; use `update_logic`. |
| `/fsm/list_saved` | `{}` | Reply `{"identifiers": [...]}`, sorted. |

It also publishes **`/fsm/status`** at about 10 Hz:
`{"current_state": "<name>"|null, "time_in_state": 1.23, "last_transition": "<name>"|null, "running": true}`.

Identifiers SHOULD be checked so they cannot escape the `fsm/` directory (the references
accept only `[A-Za-z0-9_-]{1,64}`).

## Out of the graded surface

These are OUT OF SCOPE for the graded runtime. A runtime MAY offer them; none of them is
graded:

- the recommended nodes above, and `make demo`;
- the JSON robot description format (JRDF), `/robot_model/*` services, and robot selection
  from files on disk;
- pose memory, behavior trees, maps, and A*;
- a WebSocket gateway (port 9096 is a non-goal for every course project).
