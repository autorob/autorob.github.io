# Project 1 — A* Search

## Overview

Build a small, reasonable [ROS-like](https://www.ros.org/) [publish/subscribe](https://docs.ros.org/en/rolling/Concepts/Basic/About-Topics.html) system for course robot programs, plus an [A* search](https://en.wikipedia.org/wiki/A*_search_algorithm) planner for a 2D [occupancy grid](https://docs.ros.org/en/rolling/p/nav_msgs/msg/OccupancyGrid.html).

**Do not use ROS.** Implement this small ROS-like publish/subscribe system yourself. ROS 1, ROS 2, `roscpp`, `rospy`, `rclcpp`, `rclpy`, and other ROS client/runtime libraries may not be used.

You may use Python, C, C++, or Rust. Your source, process, data-structure, and internal publish/subscribe designs are your choices.

## Learning goals

- Build a reusable publish/subscribe system for topic and service communication among course robot programs.
- Expose a small [client/server](https://en.wikipedia.org/wiki/Client%E2%80%93server_model) interface for independent clients, including Autograder.io.
- Implement numeric [binary min-heap](https://en.wikipedia.org/wiki/Binary_heap) operations and A* search.
- Build and run reproducibly in an offline environment.

## System architecture

```text
             External clients (Autograder, visualizer, tools)
                                  |
                             TCP / JSON
                                  |
                      rosbridge-style gateway
                                  |
                   publish / subscribe system
                         /             \
                    A* planner       other node
```

At the internal layer, nodes communicate through topics, publishers, subscribers, services, service clients, and service providers. You create these semantics. The internal design is entirely yours: one or many processes; queues, threads, TCP, Unix sockets, shared memory, direct dispatch, or another reasonable design. There is no required internal wire protocol.

At the external layer, independent clients use the fixed TCP/[JSON](https://www.json.org/json-en.html) protocol in [`ROSBRIDGE_PROTOCOL.md`](ROSBRIDGE_PROTOCOL.md). The *rosbridge*-style gateway represents your publish/subscribe system to outside clients; it need not be separate from your nodes.

## Starter projects

Minimal build/run skeletons: [Python](layouts/python.md), [C](layouts/c.md), [C++](layouts/cpp.md), and [Rust](layouts/rust.md). They are not partial publish/subscribe, heap, or A* solutions; another layout is allowed.
Download the [Project 1 starter kit](https://drive.google.com/drive/folders/1HJJsLOeAuVukzgShXAvSY6i6PamU6Plw?usp=drive_link).


## Submission, building, and running

Submit a project root with a top-level `Makefile` providing:

```bash
make build
make run
make map
make clean
```

Choose **one** supported implementation language for the submission. Your
`submission.tar.gz` must extract to one project root whose direct contents
include that submission's `Makefile`. The distributed starter kit is a
collection of four alternative examples, not a submission template to return
unchanged: select and complete one language directory, then package that
directory's contents as your submission. Extra source files are allowed, but
`make build`, `make run`, and `make map` must operate as one complete student
runtime; the grader does not choose a language or a subdirectory for you.

`make build` is noninteractive, repeatable, offline, and leaves the runtime ready to launch. `make run` launches everything in the foreground, exposes `127.0.0.1:9095`, fails if required startup fails, and permits clean process-group termination. `make clean` removes generated artifacts and succeeds when nothing needs cleaning. No manual startup steps are permitted during grading.

`make map` is the one-shot map-publication target. Run it from the same project root **while `make run` is already running**:

```text
make build
    ↓
make run        (remains active)
    ↓
make map        (publishes once, then exits)
```

It must connect as an ordinary external TCP/JSON client to `127.0.0.1:9095`, publish your own occupancy-grid payload on `/map`, then exit successfully. It must not start a second runtime, require input or downloads, require ROS, or leave background processes behind. Only `make run` is long-lived.

## Autograder.io

**Grading is black-box using Autograder.io.** It extracts your project, runs the Make targets in the offline course environment, launches your runtime, and connects externally to `127.0.0.1:9095` using the documented TCP/JSON protocol. It publishes and subscribes to topics, calls services, and validates both your map and staff-owned grading maps on `/map`.

Your submission therefore needs a top-level Makefile, no build-time downloads, a foreground `make run` that launches all required components, and port 9095 without staff intervention. Keep diagnostic output separate from the TCP/JSON protocol stream.

## Project checkpoint — Heap services

**Project checkpoint:** Complete `/heapify` and `/heap_sort` by the first Project A* lab. They are ordinary services using the protocol's `call_service` and `service_response` envelopes.

### `/heapify`

Arguments: `{"values":[3.0,1.0,2.0]}`. On success, `values` is `{"heap":[...]}`. The result preserves the complete input multiset and is a valid binary min-heap: index `i` is no greater than either present child `2i + 1` or `2i + 2`. Empty input succeeds, duplicates remain, and any valid heap layout is accepted.

### `/heap_sort`

Arguments: `{"numbers":[3.0,1.0,2.0]}`. On success, `values` is `{"sorted":[1.0,2.0,3.0]}`. The output is ascending numeric order with the full input multiset. Empty input, duplicates, and finite negative and fractional values are supported. `/heap_sort` is both a public service and a required A* dependency: the planner must call it to order frontier priorities before choosing work to expand. The planner may apply a deterministic tie-break after using the returned minimum priority. `/heapify` remains independently callable and is not a planner dependency.

## Map creation and map handling

Create or generate at least one valid Project 1 occupancy-grid map. While your runtime is running, `make map` must publish it on `/map` through the external TCP/JSON interface and then exit. You may construct it in code, generate it, read a student-defined representation, use the public `tools/map_to_rosbridge.py` helper, or choose another reasonable method. The helper is only an external-client example; you still implement the runtime that receives and routes that publication.

This is **not** a persistent ROS map-server requirement. Do not implement `/get_map`, ROS `map_server`, YAML/PGM compatibility, or any particular map-server process or file format.

Your own map demonstrates map production. Autograder.io first subscribes to `/map`, invokes `make map`, and validates the observed publication. Separately, it directly publishes independent valid grading maps on `/map`; your planner must handle arbitrary staff maps rather than rely on your example. A later valid map replaces an earlier map, including your own map.

### `/map` format

`/map` is an OccupancyGrid-like payload:

```json
{"header":{"frame_id":"map"},"info":{"resolution":0.5,"width":4,"height":3,"origin":{"position":{"x":-1.0,"y":2.0,"z":0.0},"orientation":{"x":0.0,"y":0.0,"z":0.0,"w":1.0}}},"data":[0,0,100,0,0,0,0,0,0,0,0,0]}
```

`header`, `info.resolution`, `info.width`, `info.height`, `info.origin`, and `data` are required. Width and height are positive integers, resolution is a positive number, and `data` has exactly `width * height` integer entries in row-major order: cell `(x, y)` is `data[y * width + x]`. Origin must have the Pose-like structure shown above; its orientation is identity/axis-aligned. A cell is free exactly when `0 <= occupancy < 50`; negative values (including `-1`) and values at least `50` are blocked. Respect nonzero origins and non-unit resolutions.

Your map must contain at least two 4-connected free cells, so an ordinary nontrivial planning request is possible. There is no required map size, resolution, origin, obstacle arrangement, or file format. A newer valid map replaces the prior map.

## A* planner

### `/plan_path`

Provide `/plan_path` with named `args`:

```json
{"start":{"header":{"frame_id":"map"},"pose":{"position":{"x":-0.75,"y":2.25,"z":0.0},"orientation":{"x":0.0,"y":0.0,"z":0.0,"w":1.0}}},"goal":{"header":{"frame_id":"map"},"pose":{"position":{"x":0.25,"y":3.25,"z":0.0},"orientation":{"x":0.0,"y":0.0,"z":0.0,"w":1.0}}},"tolerance":0.0}
```

Accept `tolerance`; it need not alter Project 1 planning. On success return `result:true` with a Path-like `values.plan` containing `header.frame_id: "map"` and ordered PoseStamped-like `poses`. Timestamps are unconstrained; use zero Z and identity orientation. Historical positional-array arguments are optional.

### Geometry, movement, and optimality

```text
cell_x = floor((world_x - origin_x) / resolution)
cell_y = floor((world_y - origin_y) / resolution)
world_x = origin_x + (cell_x + 0.5) * resolution
world_y = origin_y + (cell_y + 0.5) * resolution
```

Return cell centers. Movement is 4-connected (north, south, east, west), costs one, and forbids diagonals, corner-cutting, and teleporting. A successful path is nonempty; includes free start and goal cells; stays in bounds/free cells; uses valid adjacent steps; contains one cell for a free `start == goal`; and has the minimum number of moves. Any equal-cost route is valid.

### `/path` and failures

After each successful `/plan_path`, publish the same ordered cell-center path on `/path`. Do not publish `/path` for failures. Return prompt ordinary `result:false` without crashing or hanging before a map arrives or when an endpoint is outside, blocked, unknown, or unreachable. Failure `values` and status text are unspecified.

## Testing

Test clean builds, multiple clients, topic isolation, connection cleanup, service ID correlation, heap edge cases, your map publication, map replacement, nonzero origins, non-unit resolutions, obstacles, unreachable goals, and `start == goal`.

## Grading

| Category | Weight |
| --- | ---: |
| Heap services | 30% |
| Map creation and map handling | 20% |
| A* path finder | 50% |
| **Total** | **100%** |

The map category includes producing a valid map and correctly receiving, interpreting, replacing, and planning against `/map`. The A* category includes `/plan_path`, geometry, valid optimal paths, failures, repeated planning, and `/path` behavior.
