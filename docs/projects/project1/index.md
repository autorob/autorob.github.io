# Project 1 — A* Search

## Overview

Build a small, reusable robotics runtime and an A* planner for a 2D occupancy
grid. Your runtime provides generic topic and service communication, two
numeric heap services, and a path-planning service through a language-neutral
TCP/JSON interface.

You may use Python, C, C++, or Rust. Your source layout, process layout,
internal middleware design, data structures, and A* tie-breaking are your
choices.

## Learning goals

- Build reusable topic and service communication for robotics programs.
- Expose a small network interface for independent clients.
- Implement numeric heap operations with well-defined results.
- Plan minimum-cost paths through an occupancy grid.
- Build and run reproducibly in an offline environment.

## What you must provide

| Interface | Required role |
| --- | --- |
| `/map` | Subscribe to occupancy-grid maps published by an external client. |
| `/plan_path` | Provide a path-planning service. |
| `/path` | Publish each successful plan. |
| `/heapify` | Provide a numeric min-heap service. |
| `/heap_sort` | Provide a numeric ascending-sort service. |

The environment publishes maps. Do not implement or launch a map server,
`/get_map`, map-file loading, HTTP, a browser UI, WebSockets, or a listener on
port 9096. There is no ROS installation requirement.

## Submission, building, and running

Submit one project root containing a top-level `Makefile` with:

```bash
make build
make run
make clean
```

`make build` must be noninteractive, safe to run repeatedly, leave the runtime
ready to launch, and make no network downloads. Grading runs in an offline
Linux environment.

`make run` must launch the complete Project 1 runtime in the foreground while
it is healthy. It must make its TCP gateway reachable at `127.0.0.1:9095`,
exit unsuccessfully if required startup fails, and allow the grading
environment to terminate its process group cleanly.

`make clean` must remove generated artifacts without removing source files and
must succeed when there is nothing to clean.

The grader does not require a particular language, compiler, package manager,
source layout, binary name, or process topology. Use only dependencies
available in the course image or bundled with your submission.

## Middleware protocol

Your runtime must implement the course TCP/JSON rosbridge-style protocol in
[`ROSBRIDGE_PROTOCOL.md`](ROSBRIDGE_PROTOCOL.md). It defines the transport,
topic and service operations, status messages, connection ownership, request
correlation, and cleanup behavior.

Project 1 uses that protocol for `/map`, `/path`, `/plan_path`, `/heapify`,
and `/heap_sort`. The sections below define the payloads and behavior for
those Project 1 interfaces.

## Heap services

Both heap operations are ordinary services: use the protocol's `call_service`
and `service_response` envelopes.

### `/heapify`

Call `/heapify` with these service arguments:

```json
{"values":[3.0,1.0,2.0]}
```

A successful result has `result:true` and this object at `values`:

```json
{"heap":[1.0,3.0,2.0]}
```

The returned array must contain exactly the input multiset and satisfy the
array binary min-heap property: every value at index `i` is no greater than
either present child at `2i + 1` or `2i + 2`. Empty input succeeds with an
empty array, and duplicates must be retained. A heap is not necessarily
sorted; any valid heap layout is accepted.

### `/heap_sort`

Call `/heap_sort` with:

```json
{"numbers":[3.0,1.0,2.0]}
```

A successful result has `result:true` and this object at `values`:

```json
{"sorted":[1.0,2.0,3.0]}
```

The result must be in ascending numeric order and contain exactly the input
multiset. Empty input succeeds; duplicates and finite negative and fractional
values are supported.

The two services need not share an implementation. The planner does not need
to call either service internally.

## A* planner

### Map input: `/map`

Your planner subscribes to `/map`. An external client publishes an
OccupancyGrid-like payload such as:

```json
{
  "header":{"frame_id":"map"},
  "info":{
    "resolution":0.5,"width":4,"height":3,
    "origin":{"position":{"x":-1.0,"y":2.0,"z":0.0},
              "orientation":{"x":0.0,"y":0.0,"z":0.0,"w":1.0}}
  },
  "data":[0,0,100,0,0,0,0,0,0,0,0,0]
}
```

`width` and `height` define a rectangular grid. `resolution` is positive.
`data` has exactly `width * height` integer values in row-major order: cell
`(x, y)` is `data[y * width + x]`. Project 1 map origins are
identity/axis-aligned.

A cell is traversable exactly when:

```text
0 <= occupancy < 50
```

Every negative value, including unknown `-1`, and every value at least `50`
is blocked. Cells outside the grid are blocked. Each newer valid map replaces
the map for subsequent requests. Maps need not be latched or replayed, so the
planner must receive a map publication before it can use it.

### Planning service: `/plan_path`

Provide `/plan_path`. Its `args` object has this named form:

```json
{
  "start":{
    "header":{"frame_id":"map"},
    "pose":{"position":{"x":-0.75,"y":2.25,"z":0.0},
            "orientation":{"x":0.0,"y":0.0,"z":0.0,"w":1.0}}
  },
  "goal":{
    "header":{"frame_id":"map"},
    "pose":{"position":{"x":0.25,"y":3.25,"z":0.0},
            "orientation":{"x":0.0,"y":0.0,"z":0.0,"w":1.0}}
  },
  "tolerance":0.0
}
```

`start` and `goal` are PoseStamped-like objects. Accept `tolerance`, but it
need not alter Project 1 planning. Historical positional-array arguments are
optional; only the named-object form is required.

On success, return `result:true` with a Path-like object at `values.plan`:

```json
{
  "header":{"frame_id":"map"},
  "poses":[
    {"header":{"frame_id":"map"},
     "pose":{"position":{"x":-0.75,"y":2.25,"z":0.0},
             "orientation":{"x":0.0,"y":0.0,"z":0.0,"w":1.0}}}
  ]
}
```

Use `"map"` as the frame ID for Project 1 map poses and paths. Timestamps are
unconstrained. Returned poses use numeric cell-center X/Y coordinates, zero Z,
and an identity orientation.

### Grid geometry and path behavior

Convert world coordinates to grid cells using the actual map origin and
resolution:

```text
cell_x = floor((world_x - origin_x) / resolution)
cell_y = floor((world_y - origin_y) / resolution)
```

Return cell `(cell_x, cell_y)` at:

```text
world_x = origin_x + (cell_x + 0.5) * resolution
world_y = origin_y + (cell_y + 0.5) * resolution
```

Do not assume a zero origin or unit resolution; negative origins and
coordinates may occur.

The search graph is 4-connected: a legal move is exactly one cell north,
south, east, or west, and costs one. Diagonal moves, corner-cutting, and
teleporting are invalid.

A successful path must be non-empty; include the requested start and goal
cells; stay in bounds and traversable cells; use only 4-connected consecutive
cells; represent cells by their centers; contain one cell when a free start
equals the goal; and have minimum cost under this movement model (minimum
number of grid moves). Any equal-cost route is valid.

### Failures and `/path`

Return a prompt ordinary service failure (`result:false`) without hanging or
crashing the runtime when no map has arrived, an endpoint is outside, blocked,
or unknown, or the goal is unreachable. Failure `values` and diagnostic text
are not prescribed.

For each successful `/plan_path` response, publish the same ordered sequence
of cell-center poses on `/path` using the protocol's `publish` envelope.
Timestamps may differ. Do not publish `/path` for a failed request. Repeated
requests are independent and use the latest received map.

## Testing your implementation

Test from a clean build and with multiple TCP clients. Test topic delivery,
topic isolation, subscription and connection cleanup, service registration and
response-ID correlation, empty and duplicate heap inputs, nonzero origins and
non-unit resolutions, obstacles, unreachable goals, start-equals-goal, and a
map update followed by another request.

An optional course-supplied local visualizer may connect as an external client;
it is not part of your submission.

## Grading overview

Grading is black-box: it uses the Make commands and the two public documents,
not your private implementation structure. The project is worth 100 points:

| Category | Points |
| --- | ---: |
| Middleware communication | 15 |
| Heap services | 10 |
| A* map handling, path behavior, validity, and optimality | 75 |
| **Total** | **100** |

Tests may use different valid inputs from your own tests. Implement the
public behavior rather than relying on a particular map, path shape, heap
layout, or execution topology.
