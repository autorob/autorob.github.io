# AutoRob Course Learning Objectives

## Fall 2026: Agentic Edition (current semester)

AutoRob focuses on the computational foundations for kinematic modeling and planning for
autonomous robots with an emphasis on manipulation and mobility. Successful completion of AutoRob
will result in the student having implemented a full software stack for "mobile pick-and-place" —
given a robot and perception (or "full observation") of the robot's environment, the resulting
code modules can enable the robot to pick up an object at an arbitrary grasping location and
place the object in a new location.

At a finer level of resolution, a student who has successfully completed the AutoRob course is
capable of the following:

1. Implement collision-free 2D path planning using the A-Star algorithm in a procedural computer programming language
2. Formulate a graph and a search procedure to find an optimal route to a given goal location
3. Implement dynamical simulation for a robot through numerical integration of given equations of motion
4. Create a kinematic description of an arbitrary open-chain robot in a common convention, such as the Universal Robot Description Format (URDF)
5. Compute solutions for the gripper on an arbitrary robot arm to reach an arbitrary goal location in a 3D workspace through forward and inverse kinematics
6. Define mathematically how multiple 3D homogeneous transforms can be composed into a common frame of reference
7. Express mathematically the effect of the movement of a robot's joint on the pose of the robot's endeffector through a Jacobian matrix
8. Compose a gradient descent optimization algorithm to search for parameters that minimize error expressed as a function
9. Implement collision-free high-dimensional motion planning using the RRT-Connect algorithm in configuration space
10. Implement coding-intensive projects through fluency with generative and agentic AI

*Source: AutoRob Fall 2026 Course Missive, "Learning objectives."*

### Agentic Edition infrastructure

In this edition, students direct AI tools to build a publish-subscribe messaging system as the
course's own robot middleware infrastructure (supporting the *rosbridge* protocol), then use AI
tools to implement course concepts as nodes interconnected through topic messages over that
infrastructure — see [Project 1](../projects/project1/index.md). Students remain fully
responsible for being able to clearly explain any code they have generated, and for fixing any
bugs that arise or are deliberately inserted through mutation testing (the course's "Agenticate,
Mutate, Test" structure — see the [Home page](../index.md)).

*Source: [`autorob_agentic/pubsub_testbed_rs/CLAUDE.md`](https://github.com/odestcj/autorob_agentic/blob/main/pubsub_testbed_rs/CLAUDE.md), "Course learning objectives and code commenting," and the Fall 2026 Course Missive.*

## Previous editions' objectives (KinEval, 2025 and earlier)

Kept here for continuity with the [Archive](../archive/index.md) of past-semester projects, which
were built against these objectives rather than the Agentic Edition's objectives above.

AutoRob focused on the computational foundations for kinematic modeling and planning for
autonomous robots with an emphasis on manipulation and mobility, implemented via the
JavaScript/HTML5 [KinEval stencil](https://github.com/autorob/kineval-stencil) rather than a
student-built pubsub system. A student who successfully completed an earlier edition of AutoRob
was capable of the following:

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
