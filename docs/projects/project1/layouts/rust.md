# Suggested Rust submission layout

The grader requires only the top-level Makefile ABI and runtime network
contract. Internal layout may differ.

```text
student-project/
├── Makefile
├── Cargo.toml
├── Cargo.lock
├── scripts/
│   └── run.sh
└── src/
    ├── lib.rs
    ├── p2p/
    └── bin/
        ├── hub.rs
        ├── rosbridge_server.rs
        ├── heap_sort_node.rs
        └── astar_node.rs
```

Use only crates in the sandbox's offline Cargo source. Run Cargo with
`--locked --offline` during grading.
