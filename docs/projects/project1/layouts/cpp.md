# Suggested C++ submission layout

The grader requires only the top-level Makefile ABI and runtime network
contract. Internal layout may differ.

```text
student-project/
├── Makefile
├── CMakeLists.txt
├── scripts/
│   └── run.sh
├── include/
│   └── autorob/
└── src/
    ├── middleware/
    ├── hub.cpp
    ├── rosbridge_server.cpp
    ├── heap_sort_node.cpp
    └── astar_node.cpp
```

C++20, POSIX sockets/threads, and the sandbox's nlohmann JSON headers are
available. A self-contained parser is also acceptable.
