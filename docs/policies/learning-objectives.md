# AutoRob Course Learning Objectives

## Agentic Edition (current semester)

AutoRob — Agentic Edition is an experimental offering that is a revision and evolution of the
previous version of the AutoRob course and its use of the
[kineval-stencil](https://github.com/autorob/kineval-stencil). In this edition, students build a
publish-subscribe messaging system as the course's own robot middleware infrastructure, and
implement course concepts as nodes interconnected through topic messages over that
infrastructure, rather than working within the earlier JavaScript/HTML5 KinEval stencil.

A student who successfully completes AutoRob — Agentic Edition should have a clear computational
understanding of, and be able to implement:

1. **A-star pathfinding** for collision-free 2D path planning
2. **Numerical integration** over equations of motion for physical simulation
3. **Forward kinematics** for arbitrary open-chain robots
4. **URDF** (Universal Robot Description Format) definitions of robot kinematic structure
5. **Inverse kinematics** for reaching arbitrary goal configurations
6. **Motion planning**, primarily the **RRT-Connect** algorithm

Students are encouraged to use agentic AI tools to implement the publish-subscribe system itself,
which serves as infrastructure for course projects. Students are also permitted to use agentic AI
tools to implement the nodes for course concepts (A*, kinematics, planning, etc.) themselves —
but remain fully responsible for being able to clearly explain any code they have generated, and
for fixing any bugs that arise or are deliberately inserted through mutation testing.

*Source: [`autorob_agentic/pubsub_testbed_rs/CLAUDE.md`](https://github.com/odestcj/autorob_agentic/blob/main/pubsub_testbed_rs/CLAUDE.md), "Course learning objectives and code commenting."*

## Previous edition's objectives (KinEval / Winter 2023 and earlier)

Kept here for continuity with the [Archive](../archive/index.md) of past-semester projects, which
were built against these objectives rather than the Agentic Edition's objectives above.

AutoRob focused on the computational foundations for kinematic modeling and planning for
autonomous robots with an emphasis on manipulation and mobility. Successful completion of AutoRob
resulted in the student having implemented a full software stack for "mobile pick-and-place" —
given a robot and perception (or "full observation") of its environment, the resulting code
modules enable the robot to pick up an object at an arbitrary location and place it in a new
location. A student who successfully completed this earlier edition of AutoRob was capable of the
following:

1. Explain how a publish-subscribe messaging model works for robot middleware systems
2. Implement collision-free 2D path planning using the A-Star algorithm in a procedural computer programming language
3. Formulate a graph and a search procedure to find an optimal route to a given goal location
4. Implement dynamical simulation for a robot through numerical integration given equations of motion
5. Create a kinematic description of an arbitrary open-chain robot in the Universal Robot Description Format (URDF)
6. Compute solutions for the gripper on an arbitrary robot arm to reach an arbitrary goal location in a 3D workspace through forward and inverse kinematics
7. Define mathematically how two 3D homogeneous transforms can be composed into a common frame of reference
8. State mathematically the effect of the movement of a robot's joint on the pose of the robot's endeffector
9. Compose a gradient descent optimization algorithm to search for parameters that minimize error expressed as a function
10. Implement collision-free high-dimensional motion planning using the RRT-Connect algorithm in configuration space
