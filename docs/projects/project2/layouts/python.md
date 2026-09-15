# Suggested Python submission layout

The grader requires only the top-level Makefile ABI and runtime network contract. Internal
layout may differ.

```text
student-project/
├── Makefile
├── scripts/
│   └── run.sh
├── hub.py
├── rosbridge_server.py
├── arm_sim_node.py
├── kinematics.py
├── ik_node.py
├── ik_action_node.py
├── ik_trial_node.py
└── arm_lib/
    ├── __init__.py
    ├── internal.py
    ├── arm_dynamics.py
    ├── integrators.py
    ├── pid.py
    └── expr.py
```

Standard library only. `scripts/run.sh` must read `ARM_SIM_LINKS` (default `2`) to select link
count.
