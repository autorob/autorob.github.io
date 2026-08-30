# Suggested C submission layout

The grader requires only the top-level Makefile ABI and runtime network
contract. Internal layout may differ.

```text
student-project/
├── Makefile
├── scripts/
│   └── run.sh
├── include/
│   └── autorob/
└── src/
    ├── middleware/
    ├── hub.c
    ├── rosbridge_server.c
    ├── heap_sort_node.c
    └── astar_node.c
```

C17, POSIX sockets/pthreads, and the sandbox's cJSON library are available. A
self-contained parser is also acceptable.
