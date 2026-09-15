# Suggested C++ submission layout

The grader requires only the top-level Makefile ABI and runtime network contract. Internal
layout may differ.

```text
student-project/
├── Makefile
├── scripts/
│   └── run.sh
├── include/
│   ├── json.hpp
│   ├── middleware.hpp
│   └── kinematics.hpp
└── src/
    ├── hub.cpp
    ├── rosbridge.cpp
    ├── arm_dynamics.cpp
    ├── integrators.cpp
    ├── pid.cpp
    ├── expr.cpp
    ├── kinematics.cpp
    ├── arm_sim_node.cpp
    ├── ik_node.cpp
    ├── ik_action_node.cpp
    └── ik_trial_node.cpp
```

Bundle your own JSON parsing (no system dependency required — matches Project 1's convention).
`scripts/run.sh` must read `ARM_SIM_LINKS` (default `2`) to select link count.
