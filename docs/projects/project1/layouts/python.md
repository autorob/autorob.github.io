# Suggested Python submission layout

The grader requires only the top-level Makefile ABI and runtime network
contract. Internal layout may differ.

```text
student-project/
├── Makefile
├── scripts/
│   └── run.sh
└── autorob/
    ├── __init__.py
    ├── middleware/
    ├── hub.py
    ├── rosbridge_server.py
    ├── heap_sort_node.py
    └── astar_node.py
```

Use the Python standard library only. `make build` can use `compileall` as its
offline validation step.
