# Suggested C submission layout

The grader requires only the top-level Makefile ABI and runtime network contract. Internal
layout may differ.

```text
student-project/
├── Makefile
├── scripts/
│   └── run.sh
└── src/
    ├── autorob.h
    ├── json.c
    ├── middleware.c
    ├── hub.c
    ├── rosbridge.c
    ├── arm_dynamics.c
    ├── integrators.c
    ├── pid.c
    ├── expr.c
    ├── kinematics.h
    ├── kinematics.c
    ├── arm_sim_node.c
    ├── ik_node.c
    ├── ik_action_node.c
    └── ik_trial_node.c
```

C17/POSIX. Bundle your own JSON parsing (no system dependency required — matches Project 1's
convention). `scripts/run.sh` must read `ARM_SIM_LINKS` (default `2`) to select link count.
