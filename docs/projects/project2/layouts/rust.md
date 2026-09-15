# Suggested Rust submission layout

The grader requires only the top-level Makefile ABI and runtime network contract. Internal
layout may differ.

```text
student-project/
├── Makefile
├── Cargo.toml
├── Cargo.lock
├── scripts/
│   └── run.sh
└── src/
    ├── lib.rs
    ├── arm_dynamics.rs
    ├── integrators.rs
    ├── pid.rs
    ├── expr.rs
    ├── kinematics.rs
    └── bin/
        ├── hub.rs
        ├── rosbridge_server.rs
        ├── arm_sim_node.rs
        ├── ik_node.rs
        ├── ik_action_node.rs
        └── ik_trial_node.rs
```

Use only crates in the sandbox's offline Cargo source. Run Cargo with `--locked --offline`
during grading. `scripts/run.sh` must read `ARM_SIM_LINKS` (default `2`) to select link count.
