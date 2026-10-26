# Project 3 — Forward Kinematics

## Overview

Build the part of a [ROS](https://www.ros.org/)-style robot software stack that answers the
question "where is every part of my robot right now?" Your runtime receives a robot as the text
of a real [URDF](https://wiki.ros.org/urdf/XML) file, builds the kinematic tree it describes,
and turns the robot's joint positions into the pose of every link: forward kinematics (FK).

As in ROS, the work is split across a few small nodes. A **parameter server** holds the robot's
description. A **`robot_state_publisher`** reads that description, listens to `/joint_states`,
and publishes every joint's parent-to-child transform on `/tf`. A
**`robot_world_state_publisher`** composes those transforms, together with the robot's pose in
the world, into every link's pose in one global frame on `/xform_world`. Two more nodes are
recommended so your robot can move on its own: a `joint_state_publisher` that servos the joints
toward setpoints, and a `finite_state_machine` that runs a choreography of setpoints. You use
those two to record your portfolio video.

It all speaks the same ROS-like publish/subscribe protocol your Project 1 and 2 runtimes do, on
the same `127.0.0.1:9095` TCP/JSON gateway: newline-delimited JSON over a plain TCP socket, not
HTTP and not WebSocket. **Bring your own Project 1 middleware and gateway.**
The starters do not include one.

**Do not use a kinematics, transform, or URDF-model library.** Implement the rotation math, the
tree traversal, and the transform composition yourself. A submission that includes such a library
**may** not receive credit and **may** not be eligible for the mutation challenge. The one piece of plumbing the course
supplies is an **XML parser**: each starter vendors a small parser (or, for Python, uses the
standard library's), which you may use or replace. Parsing XML is not the learning objective;
interpreting URDF is. You may use Python, C, C++, or Rust, and internal process/thread topology
is your choice, as in Projects 1 and 2.

## Learning goals

- Read a real robot description (URDF) and build the kinematic tree it describes: find the root,
  connect parents to children, and reject descriptions that are not valid robots.
- Implement 3D rigid-body transforms: fixed-axis roll-pitch-yaw, axis-angle rotation, unit
  quaternions, and homogeneous transform composition.
- Compute forward kinematics by traversing the tree from the root, composing each joint's
  `T_origin · T_motion(q)` down every branch (the matrix-stack traversal from lecture).
- Split a robot system into cooperating nodes the way ROS does: a parameter server, a
  `robot_state_publisher` (`/joint_states` in, `/tf` out), and a world-state publisher.
- Drive a robot through a choreography with a joint servo and a finite state machine, and show
  it off in a portfolio video.
- Reuse a publish/subscribe transport across a third course assignment: the same protocol, a
  new domain.

## System architecture

```text
   External clients (Autograder, your own test scripts and viewer)
                                  |
                             TCP / JSON
                                  |
                       rosbridge-style gateway          <- your Project 1 gateway
                                  |
                      publish / subscribe system        <- your Project 1 middleware
                                  |
   param_server  (/param_server/set_param, /param_server/get_param)
        |  robot_description
        v
   robot_state_publisher   <-- /joint_states --  joint_state_publisher  (recommended)
        |  /tf: every joint, parent -> child          ^
        v                                             |  /joint_trajectory
   robot_world_state_publisher  <-- /global_pose   finite_state_machine  (recommended)
        |
        v
   /xform_world: every link in global_frame, as a 4x4 matrix
```

| Node | Required | Started by | Job |
|---|---|---|---|
| `param_server` | **yes**, graded | `make run`, `make demo` | Stores named parameters, including `robot_description` (the URDF text). |
| `robot_state_publisher` | **yes**, graded | `make run`, `make demo` | Reads `robot_description`, reports a description status, applies `/joint_states`, publishes `/tf`. |
| `robot_world_state_publisher` | **yes**, graded | `make run`, `make demo` | Composes `/tf` and `/global_pose` into `/xform_world`. |
| `joint_state_publisher` | recommended, not graded | `make demo` only | Servos the joints toward `/joint_trajectory` setpoints and publishes `/joint_states`. |
| `finite_state_machine` | recommended, not graded | `make demo` only | Runs a choreography of joint setpoints and publishes `/joint_trajectory`. |

The transport is the [rosbridge TCP/JSON protocol](../project1/ROSBRIDGE_PROTOCOL.md), reused
unchanged from Projects 1 and 2, with one practical consequence spelled out in the line-size box
below. From outside, your runtime must behave like the node graph above, reachable through the
gateway. Whether that is one process or several is up to you.

The exact contract is in two specs. This handout explains them; if the two ever seem to
disagree, **the specs win**:

- [`spec/FK_API.md`](FK_API.md): the node graph, the parameter server's services,
  `robot_description` and the description status, `/joint_states`, `/tf`, `/global_pose`,
  `/xform_world`, the message shapes and accuracy tolerances, what `make run` and `make demo`
  start, and the recommended nodes.
- [`spec/ROBOT_DESCRIPTION.md`](ROBOT_DESCRIPTION.md): which parts of a URDF are read,
  the XML features you must accept, the kinematic conventions, and the validity rules.

## Starter projects

Each starter (`starter/{python,c,cpp,rust}`) is a placeholder, as in Project 2: a
`Makefile` (`build`, `run`, `demo`, `clean`), a `main` program that prints a `TODO` line and
idles, and a small working example of reading a URDF with that language's supplied XML parser:

| Language | Supplied XML parser | Example |
|---|---|---|
| Python | standard library `xml.etree.ElementTree` | `src/urdf_example.py` |
| C | ezxml 0.8.6 (vendored in `third_party/ezxml/`) | `src/urdf_example.c` |
| C++ | pugixml 1.14 (vendored in `third_party/pugixml/`) | `src/urdf_example.cpp` |
| Rust | roxmltree 0.20.0 (vendored in `vendor/roxmltree/`) | `print_links` in `src/main.rs` |

The starters contain **no middleware and no nodes**. Bring your Project 1 hub, rosbridge
gateway, and node client, write the nodes above, and extend the `Makefile` so `make build`
compiles everything and `make run` and `make demo` start what "Submission, building, and
running" lists. How you organize files, classes, and processes is up to you. See
[`starter/README.md`](https://drive.google.com/drive/folders/1gkF34pQfb5r5x4-EqAWoy4Q-3iIDepKj?usp=drive_link).

### The student kit

This handout, the specs it links to, the four starters, the Fetch robot described below, and a
submission script are available pre-packaged as the **student kit**: a bundle with no other
course-repo material, distributed by course staff. Its `README.md` lists what is inside.

The kit includes one real robot to try your runtime on: the Fetch mobile manipulator,
`robots/fetch/fetch.urdf`, redistributed unmodified. The Fetch robot description is copyright
Fetch Robotics, Inc., from [fetch_ros](https://github.com/fetchrobotics/fetch_ros), and is
licensed **CC BY-NC-SA 4.0** (non-commercial use only); see `robots/fetch/LICENSE.md` for the
full attribution and terms, and keep that license with the file if you share it.

## Submission, building, and running

Submit a project root with a top-level `Makefile` providing:

```bash
make build
make run
make clean
```

and, recommended for your portfolio video, `make demo`.

Choose **one** supported implementation language, as in Projects 1 and 2: your
`submission.tar.gz` extracts to one project root whose direct contents include that submission's
`Makefile`. There is **no `make map` target for Project 3.** If you have the student kit,
`./make_submission.sh <c|cpp|python|rust>` at its root builds a correctly shaped
`submission.tar.gz` from your completed starter directory; see the kit's `README.md`.

- `make build` is noninteractive, repeatable, and offline: the grading environment has no
  network. It must finish within the setup time limit (**180 s**, including extraction). Use
  only the course image's toolchain and libraries (the same ones Project 1 allowed) plus source
  you include in your submission, such as the vendored XML parser.
- `make run` launches your runtime in the foreground, exposing `127.0.0.1:9095`: your gateway,
  `param_server`, `robot_state_publisher`, and `robot_world_state_publisher`. It needs **no**
  files, environment variables, or command-line arguments, and it starts with **no robot
  loaded**: every robot arrives as a `set_param` of `robot_description`. Your runtime must be
  ready within **10 seconds** of `make run` starting, and "ready" means the whole pipeline works:
  a small valid robot set through the parameter server is accepted and shows up on `/tf` and
  `/xform_world` (see `spec/FK_API.md`, "Runtime and Make ABI").
- `make run` must **not** start `joint_state_publisher`, `finite_state_machine`, or anything else
  that publishes `/joint_states`, `/joint_trajectory`, or `/global_pose`, or that sets
  `robot_description`. During grading, those come only from outside your runtime.
- `make demo` starts everything `make run` does, plus `joint_state_publisher` and
  `finite_state_machine`. `make demo` is not graded.
- `make clean` removes generated artifacts.

## Autograder.io

**Grading is black-box using Autograder.io**, exactly like Projects 1 and 2: it extracts your
project, runs the Make targets in the offline course environment, launches your runtime with
`make run`, and connects externally to `127.0.0.1:9095` using the documented TCP/JSON protocol.
It loads robots through `/param_server/set_param`, publishes `/joint_states` and `/global_pose`,
and reads the description status, `/tf`, and `/xform_world`. It never reads your files, logs, or
output, and it never starts `make demo`. No frontend or visualization is part of grading.

There are two hosted projects: the **checkpoint** and the **final project**. Each test is
all-or-nothing and has a time limit, so keep startup fast.

**Do not hard-code version numbers.** Other robots may already have been loaded into your
runtime before the one you care about. A `version` means something only relative to the version
`set_param` returned.

## Request line size

> **Every hop in your runtime MUST carry lines of at least 1 MiB** (checkpoint and final).
>
> A URDF travels as one JSON string, inside **one** line: the `set_param` request line, and
> again the `get_param` reply that `robot_state_publisher` reads back. Real robots are big: the
> PR2's request line is about 110 KiB, and a description can come close to the 1 MiB bound. The
> Project 1 rosbridge protocol already permits lines up to **4 MiB**, but many Project 1
> gateways buffer much less.
>
> **A fixed 64 KiB line buffer will fail.** The fix: **read lines until the newline**, growing
> your buffer as needed, instead of reading into a fixed-size array and treating whatever fits
> as a line.
>
> Check every hop a big message takes: the gateway, the hub, and every node-to-node connection,
> in both directions.

## Project checkpoint — Zero Configuration FK Transforms

**Project checkpoint:** complete the parameter server, description handling, and
zero-configuration FK by **Mon Oct 12, 2026**. At zero configuration every joint is at
position `0`, so no `/joint_states` are involved.

The checkpoint is a separate hosted project. It grades:

- **The parameter server**: `set_param` and `get_param`, per-name versions, and rejecting a
  request with no valid `name`.
- **Description handling**: `robot_state_publisher` picks up each new `robot_description`,
  validates it against [`spec/ROBOT_DESCRIPTION.md`](ROBOT_DESCRIPTION.md), and reports
  the result in `/robot_state_publisher/description_status`. A rejected description leaves the
  previous robot in effect; an accepted one replaces it completely. Real-world XML syntax must
  load.
- **Zero-configuration FK on `/tf` and `/xform_world`**: with every joint at `0`, `/tf` carries
  every joint's `T_origin`, and `/xform_world` carries every link's pose in `global_frame`
  (with no `/global_pose`, the root sits at the origin). This includes real robot URDFs sent
  unmodified, such as the PR2, whose request lines are well over 64 KiB, so **fix your line
  buffer now**.

All three graded nodes have to work for the checkpoint, because a runtime is ready only when a
robot set through the parameter server reaches `/tf` and `/xform_world`.

**What the checkpoint does not grade** (the final project does):

- subscribing to `/joint_states`, and joint motion `T_motion(q)` (at `q = 0` it is the identity
  for every joint type, so each joint's transform is exactly its `T_origin`);
- `/global_pose`;
- `/tf` and `/xform_world` timing: the publishing rate, and serving a subscriber that joins late;
- a description near the 1 MiB line bound.

You still have to **parse and validate** every joint's `axis` and `<limit>` for the checkpoint
(a malformed axis, or a revolute or prismatic joint with no `<limit>`, must be rejected), even
though nothing moves yet.

The checkpoint's features are graded again in the final project, so this work counts toward
both.

## The parameter server and `robot_description`

Both parameter-server services use the standard rosbridge envelope: every response is
`{"values": {...}, "result": <bool>, "status": <string>}`.

- **`/param_server/set_param`**, request `{"name": "<name>", "value": <any JSON>}`: store the
  value under the name and reply `{"version": <n>}`. Each name has its own version, starting at
  `0`; the first set makes it `1`, and every set adds one. A missing or non-string `name` is
  rejected (`result: false`, non-empty `status`). The server never interprets the value: a
  broken URDF is still stored, and judging it is `robot_state_publisher`'s job.
- **`/param_server/get_param`**, request `{"name": "<name>"}`: reply
  `{"value": <stored value>, "version": <n>}`, or `result: false` with
  `{"value": null, "version": 0}` for a name that was never set.

`robot_state_publisher` reads `robot_description` through `get_param` (polling is fine) and
processes every new version it sees. After a `set_param` of `robot_description` returns version
`V`, it must report a status for some version `>= V` within **2 seconds**. It reports by setting
the parameter `/robot_state_publisher/description_status`:

```json
{"version": 7, "accepted": true, "error": "", "loaded_version": 7, "root_link": "base_link"}
```

- `version` is the `robot_description` version just processed, and `accepted` says whether it
  loaded. `error` is `""` when accepted and a non-empty reason when not.
- `loaded_version` and `root_link` describe the robot **now in effect**. After a rejection they
  still describe the previous robot (`0` and `""` if there is none).
- Write the status only **after** an accepted robot is fully in effect, so every `/tf` message
  published after the status reflects it.
- **Validate the whole description before touching the current robot.** A rejected description
  leaves the previous robot, its joint state, and your `/tf` exactly as they were.

## Robot descriptions (URDF)

A description is a real, flat (already xacro-expanded) URDF, exactly as a robot ships it. You
parse it as it arrives; you never expand xacro yourself, and every description you are sent is
already flat. Links carry `<visual>`, `<collision>`, and `<inertial>` elements. We encourage you to
write a parser for the full URDF, since later projects use `<collision>` (for motion planning)
and `<inertial>` (for simulation). In Project 3, though, only a link's first `<visual>` is read:
whatever `<collision>` and `<inertial>` contain must never cause a rejection. The full rules are in
[`spec/ROBOT_DESCRIPTION.md`](ROBOT_DESCRIPTION.md); the essentials:

- **Only the direct children of `<robot>` count.** `<link>` and `<joint>` elements nested
  anywhere else, for example inside `<gazebo>` or `<transmission>` blocks, are not links or
  joints of the robot. Real URDFs, including the PR2's, contain such hollow `<joint>` elements.
  Iterate over `<robot>`'s children; never search the whole document for `<joint>`.
- **What is read**: each joint's `type`, `<parent>`, `<child>`, `<origin>`, `<axis>`, and
  `<limit>`, and each link's first `<visual>`. Everything else is ignored: collisions,
  inertials, materials, `<gazebo>`, `<transmission>`, `<mimic>`, `<safety_controller>`, unknown
  attributes, and so on.
- **Defaults**: a missing `<origin>`, `xyz`, or `rpy` means zeros; a missing `<axis>` means
  `1 0 0`, as in URDF. `name` on `<robot>` may be absent.
- **Joint types**: `revolute`, `continuous`, `prismatic`, and `fixed`. Anything else, including
  URDF's `floating` and `planar`, is rejected. A `revolute` or `prismatic` joint must have a
  `<limit>`. The limit is informational: FK never clamps to it.
- **Visuals**: a link's first `<visual>`, if present, must hold a valid `box`, `cylinder`,
  `sphere`, or `mesh`. It never changes FK; it exists so a viewer, such as the one you build for
  your portfolio, can draw the robot.
- **Numbers**: `xyz`, `rpy`, and `axis xyz` hold exactly three decimal numbers separated by any
  XML whitespace, in any ordinary spelling (`1`, `-0.5`, `.25`, `3.`, `1.5e-1`). A wrong count,
  or a token that is not a number, is rejected.
- **Real-world XML**: an XML declaration, comments (including comments that contain markup),
  `xmlns:xacro="..."` on `<robot>`, single or double quotes, entity and character references,
  CDATA, paired or self-closing tags, CRLF line endings, and joints that appear before their
  links. Names are compared after entity decoding, so `a&amp;b` is the link `a&b`.
- **Validity**: the spec's numbered "Validity" list is the authority. A description that passes
  every check must be accepted. A few inputs with no well-defined FK (duplicate names, cycles,
  zero-length axes on movable joints) are UNSPECIFIED: do anything you like with them except
  crash or hang.

### Kinematics

**Use unit quaternions for 3D rotation.** This is part of the assignment, and `/tf` and
`/global_pose` already carry rotations as quaternions. A submission built on another
representation, such as Denavit-Hartenberg parameters, **may** not receive credit and **may** not
be eligible for the mutation challenge. Every value you publish follows the URDF conventions
below.

- **`rpy`** is fixed-axis roll-pitch-yaw: `R = Rz(yaw) · Ry(pitch) · Rx(roll)`.
- **Joint transform**: `T_joint(q) = T_origin · T_motion(q)`, with
  `T_origin = Trans(xyz) · Rot(rpy)` in the parent link's frame. The motion happens **after** the
  origin, in the joint's own frame, so a revolute joint pivots about its origin.
- **`T_motion(q)`**:
  - `revolute` and `continuous` rotate by `q` radians about `axis` **normalized to unit
    length** (axes such as `0 0 2` or `1 1 0` are legal);
  - `prismatic` translates by `q · axis`, with the axis **as written, not normalized**: an axis
    of `2 0 0` at `q = 0.7` moves `1.4` m (real URDFs use unit axes, where this makes no
    difference);
  - `fixed` is the identity.
- **The root** is the unique link that is no joint's child. The description does not name it,
  and it is often not the first `<link>` in the file.
- **FK**: a link's pose relative to the root is the product of the `T_joint` edges along the
  path from the root to that link, composed parent first:
  `T_root_child = T_root_parent · T_joint`.
- **Mimic joints** are driven by their own names, like any other joint.

## Topics

### `/joint_states` (`robot_state_publisher` subscribes)

`sensor_msgs/JointState`:
`{"header": {"stamp": {...}, "frame_id": ""}, "name": [...], "position": [...], "velocity": [...], "effort": [...]}`.

- **Each message replaces the joint state.** Joint `name[i]` is at `position[i]`, and a movable
  joint the latest message does not name is at `0`.
- **Ignore, don't fail**: names that are not movable joints of the loaded robot (unknown names,
  and fixed joints) are ignored; the rest of the message still applies.
- `velocity` and `effort` may be absent or empty; ignore them.
- **The stamp**: the latest message's `header.stamp` becomes the stamp of every `/tf` entry,
  verbatim. Do not replace it with your own clock. Before any message, the stamp is
  `{"sec": 0, "nanosec": 0}`.
- **No clamping**: use positions exactly as given.
- **Promptly**: a message must show up on `/tf` within a few seconds at most, and the same
  message may arrive more than once.

### `/tf` (`robot_state_publisher` publishes)

`{"transforms": [ <TransformStamped>, ... ]}`, where a `TransformStamped` is the ROS
`geometry_msgs/TransformStamped` shape:

```json
{"header": {"stamp": {"sec": 0, "nanosec": 0}, "frame_id": "<parent link>"},
 "child_frame_id": "<child link>",
 "transform": {"translation": {"x": 0.0, "y": 0.0, "z": 0.0},
               "rotation": {"x": 0.0, "y": 0.0, "z": 0.0, "w": 1.0}}}
```

- While a robot is loaded, publish `/tf` **at least 5 times per second**, whether or not anything
  changed. Do not publish it while no robot is loaded.
- Every message is **complete**: exactly one entry per joint, **including `fixed` joints**,
  from the joint's parent link to its child link, holding `T_joint(q)` at the current joint
  state. Every entry carries the same stamp.
- A client that subscribes late must receive a complete, current message within one publishing
  period.

### `/global_pose` and `/xform_world` (`robot_world_state_publisher`)

`/global_pose` (subscribe) is a `geometry_msgs/Pose`, the pose of the robot's root link in
`global_frame`: `{"position": {"x", "y", "z"}, "orientation": {"x", "y", "z", "w"}}`. Until one
arrives the global pose is the identity; after that, use the most recent one.

`/xform_world` (publish) is `{"transforms": [ <MatrixTransform>, ... ]}`:

```json
{"header": {"stamp": {"sec": 0, "nanosec": 0}, "frame_id": "global_frame"},
 "child_frame_id": "<link name>",
 "matrix": [m00, m10, m20, m30,  m01, m11, m21, m31,  m02, m12, m22, m32,  m03, m13, m23, m33]}
```

- `matrix` is the link's 4x4 pose `T_global_link = T_global_root · T_root_link`, flattened in
  **column-major** order (`matrix[4*c + r] = M[r][c]`, so the translation is `matrix[12..14]`).
- Compute from the **most recent `/tf` message alone**: find its root (the frame that is some
  entry's parent and no entry's child), and compose its edges down to every link. Do not merge
  in edges from older messages, or a previous robot's links linger after a reload.
- Every message is **complete**: one entry for **every link, including the root**, each stamped
  with the stamp of the `/tf` message it came from. Publish at least 5 times per second once
  you have received a `/tf`, and serve late subscribers within one period, as for `/tf`.
- `global_frame` is z-up, like every URDF frame. Do not add a rendering correction for a 3D
  viewer; the viewer applies its own.

### Accuracy

Every translation must be within `1e-4` m of the exact value, and every rotation within
`1e-4` rad of it (the angle between the two rotation matrices). Quaternions must have norm
within `1e-4` of 1, and their sign does not matter; `/xform_world` rotation blocks must be
orthonormal within `1e-4` with determinant `+1`. Printing numbers with 6 or more decimal places
is precise enough. Every numeric field must be a JSON number.

## Recommended nodes: joint servo and choreography

`joint_state_publisher` and `finite_state_machine` are **recommended, not graded**: nothing
launches, calls, or listens for them during grading. They are how your robot moves on its own
in `make demo`, which you need for your portfolio video, and later projects build on them.
`spec/FK_API.md`, "Recommended nodes", describes the course reference's design; your own design
is fine.

- **`joint_state_publisher`** reads `robot_description`, subscribes `/joint_trajectory`
  (`trajectory_msgs/JointTrajectory`; the last point is the setpoint for the named joints), and
  publishes `/joint_states` for every movable joint at about 10 Hz, moving each joint toward its
  setpoint. The reference uses a proportional servo with gain 50 per second, clamped to the
  joint's limits, and offers `/joint_state_publisher/reset`.
- **`finite_state_machine`** runs a choreography: a table of states, each a joint-space setpoint
  with named transitions. On entering a state it publishes the setpoint on `/joint_trajectory`;
  when `/joint_states` shows every named joint within the state's `epsilon`, it follows the
  state's `on_arrival` transition. The reference offers `/fsm/update_logic`, `/fsm/get_logic`,
  `/fsm/set_running`, `/fsm/fire_transition`, `/fsm/save_to_file`, `/fsm/load_from_file`, and
  `/fsm/list_saved`, and publishes `/fsm/status`.

**FSM files.** A saved choreography lives in `fsm/<identifier>.json`, where the identifier
matches `[A-Za-z0-9_-]{1,64}` (check it, so a request cannot write outside `fsm/`). The FSM
document format, with a worked example, is in `spec/FK_API.md`, "finite_state_machine".

## Portfolio deliverable

Add a page to your course portfolio website with a **video of your robot performing an FSM
choreography**: run `make demo`, load a robot and a choreography of your own, and record the
robot moving. No viewer is supplied: build your own, as an external client of your runtime that
draws each link from `/xform_world` (the matrices are column-major, the layout three.js's
`Matrix4.fromArray` reads, so a small three.js page is one option). Briefly describe the robot,
the choreography, and how you drew it on the page. If you show the kit's Fetch robot, credit it
on the page as "Fetch robot description © Fetch Robotics, Inc., CC BY-NC-SA 4.0".

The video (15%) and the portfolio page (10%) are **required**. Autograder.io does not grade them;
course staff do. They are due **[portfolio due date TBD]**.

## Testing

Test the way Autograder.io does: as an external TCP/JSON client of your running runtime on
`127.0.0.1:9095`. A few lines of Python are enough to load a robot, wait for its status, and read
one `/xform_world` message:

```python
import itertools, json, socket, sys, time

sock = socket.create_connection(("127.0.0.1", 9095))
stream = sock.makefile("rwb")
ids = itertools.count()

def send(message):
    stream.write((json.dumps(message) + "\n").encode())
    stream.flush()

def call(service, args):
    call_id = f"call-{next(ids)}"
    send({"op": "call_service", "service": service, "id": call_id, "args": args})
    for line in stream:  # skip status and publish traffic until our reply arrives
        reply = json.loads(line)
        if reply.get("op") == "service_response" and reply.get("id") == call_id:
            return reply

with open(sys.argv[1], encoding="utf-8") as f:  # any .urdf file
    reply = call("/param_server/set_param", {"name": "robot_description", "value": f.read()})
version = reply["values"]["version"]

while True:  # wait for robot_state_publisher to process our version
    status = call("/param_server/get_param",
                  {"name": "/robot_state_publisher/description_status"})["values"]["value"]
    if status and status["version"] >= version:
        break
    time.sleep(0.1)
print(status)

send({"op": "subscribe", "topic": "/xform_world", "type": "xform_world/MatrixTransformArray"})
for line in stream:
    message = json.loads(line)
    if message.get("op") == "publish" and message.get("topic") == "/xform_world":
        for entry in message["msg"]["transforms"]:
            print(entry["child_frame_id"], entry["matrix"][12:15])
        break
```

To move joints, `advertise` `/joint_states` (`sensor_msgs/JointState`) and `publish` a message
naming them; to watch `/tf`, subscribe to it the same way.

Things worth testing yourself:

- **Hand-checkable robots.** The example in `spec/ROBOT_DESCRIPTION.md`, and small robots of your
  own: a single translated link, a single `rpy` rotation about each axis, a two-link planar arm
  whose tool pose you can compute on paper, a branching tree, a root that is not the first link.
- **Every validity rule.** Write one broken description per rule, check that each is rejected in
  the description status, and check that `/tf` and `/xform_world` still show the previous robot.
- **Real robots.** Load the kit's `robots/fetch/fetch.urdf`, and the flat URDF of another real
  robot such as the PR2 (make sure it is expanded URDF, not `.xacro`), unmodified. Their request
  lines are well over 64 KiB, so they also test your line-size fix.
- **Joint motion** (final): revolute joints with non-unit axes, prismatic joints with non-unit
  axes under a rotated origin, continuous joints past ±π, messages that name only some joints,
  and names your robot does not have.
- **World pose** (final): publish a `/global_pose` and check that every `/xform_world` matrix
  moves with it, root included.
- **Topic behavior** (final): check the publishing rate with nothing changing, subscribe late
  and check the first message is complete, and reload a different robot and check that no old
  link remains.

## Common pitfalls

- **A fixed-size line buffer** in the gateway, the hub, or any node connection. Read until the
  newline.
- **Searching the whole document for `<joint>`.** Only direct children of `<robot>` count.
- **Assuming the first `<link>` is the root.** Compute it: the one link that is no joint's child.
- **Wrong `rpy` order or a transposed rotation.** It is `Rz(yaw) · Ry(pitch) · Rx(roll)`, fixed
  axes. Test each axis alone, then a combination, against a hand computation.
- **Composing in the wrong order.** Child poses are `parent · T_joint`, never `T_joint · parent`;
  and within a joint, `T_origin · T_motion`, never `T_motion · T_origin`.
- **Axis handling.** Normalize revolute and continuous axes, but **not** prismatic ones. A
  missing `<axis>` is `1 0 0`, not `0 0 1`.
- **Dropping fixed joints.** They belong in `/tf`, and their child links in `/xform_world`.
- **Forgetting the root in `/xform_world`.** It needs its own entry, too.
- **Partial loads.** Build the new robot completely, validate it, and only then swap it in.
- **Reporting the status too early.** Set `description_status` only once the new robot is what
  `/tf` publishes.
- **Merging `/tf` messages in `robot_world_state_publisher`.** Use only the latest one, or a
  previous robot's links linger.
- **Keeping joints the latest `/joint_states` message does not name.** They go back to `0`.
- **Using your own clock for the stamp.** Copy the latest `/joint_states` stamp verbatim.
- **Clamping to `<limit>`, or wrapping continuous joints**, in FK. Use positions exactly as
  given.
- **Hard-coding version numbers.** Compare against the version `set_param` returned.
- **Publishing only when something changes.** `/tf` and `/xform_world` must keep coming at
  5 Hz or more with nothing changing, and every message must be complete.
- **Writing JSON by hand.** Link and joint names can contain `"`, `&`, `<`, and other characters
  that must be escaped in JSON output. Use your language's JSON library, and never emit `NaN`
  or `Infinity`, which are not JSON numbers.
- **XML parser error checks.** In C, ezxml is lenient: check `ezxml_error()` after parsing so
  text that is not well-formed XML is still rejected, and pass it a writable copy of the string.
  In C++, check the `pugi::xml_parse_result`.
- **Converting a rotation matrix to a quaternion with the trace formula only.** It divides by
  a number near zero for rotations near 180°. Use the four-branch version (pick the largest of
  `w`, `x`, `y`, `z` first), or build the quaternion directly from the rpy and axis-angle parts.
- **Not setting `SO_REUSEADDR` on your gateway's listening socket.** Your runtime is started
  again and again on port 9095. If your side closed a connection first, the old socket lingers
  in TIME_WAIT for up to a minute, and a plain `bind` then fails with "address already in
  use". Rust's `TcpListener` sets the option for you; in Python set
  `allow_reuse_address = True` (socketserver) or `setsockopt(SOL_SOCKET, SO_REUSEADDR, 1)`;
  in C and C++ call `setsockopt` before `bind`.
- **A slow start.** The whole pipeline must be ready within 10 s of `make run`, so do not do
  heavy work at startup or poll with long sleeps.

## Grading

| Category | Weight | Graded by |
| --- | ---: | --- |
| A. Parameter server and description handling | 15% | Autograder.io |
| B. Zero-configuration FK | 25% | Autograder.io |
| C. Joint-state FK | 25% | Autograder.io |
| D. Topic behavior and global pose | 10% | Autograder.io |
| E. FSM choreography video | 15% | course staff |
| F. Project portfolio page | 10% | course staff |
| **Total** | **100%** | |

The checkpoint grades categories A and B, except B's near-1 MiB description, which is graded
only in the final project.

**A. Parameter server and description handling** covers `set_param` and `get_param` with
per-name versions; the description status for every load; rejecting every structural and value
error in the validity rules while accepting valid descriptions that rely on defaults, unknown
elements, and every legal number spelling; a rejected load leaving the previous robot in
effect; a reload replacing, not merging, the previous robot; and the same robots written in
real-world XML styles.

**B. Zero-configuration FK** checks `/tf` and `/xform_world` with every joint at `0`:
translation-only and `rpy` origins, chains and branching trees with fixed joints, real robot
URDFs sent unmodified, and a description near the 1 MiB line bound.

**C. Joint-state FK** publishes `/joint_states` and checks `/tf` and `/xform_world` against the
expected FK: revolute joints about axis-aligned and general (non-unit) axes, continuous joints,
prismatic joints, origin-then-motion order, stamps reported verbatim, each message replacing
the joint state while unknown names are ignored, and real robots at configurations within their
joint limits.

**D. Topic behavior and global pose** checks that `/tf` matches the current joint state, that
complete messages keep arriving at the required rate with no new trigger, that a late subscriber
is served, and that `/global_pose` is composed into every `/xform_world` matrix.

**E and F**, the choreography video and the portfolio page around it, are graded by course staff,
not by Autograder.io. See "Portfolio deliverable".

For reference, see the archived
[2025 version of this project](https://github.com/autorob/autorob.github.io/blob/ebf12dbe733c9aa6621735f1933810e9e4696b76/index.html#L826)
(KinEval/JavaScript-based, pinned to the Winter 2025 commit for archival purposes).
