# Course Schedule

<!--
!!! warning "Link availability note"
    This schedule was rebuilt from the Fall 2026 course schedule spreadsheet. Where a topic
    clearly reuses a lecture PDF or video already archived on this site, that link is carried
    forward and verified. Several rows reference newer (2024/2025) recordings, slides, or
    starter code that are **not yet linkable** from the source spreadsheet (Google Sheets'
    CSV export does not preserve embedded hyperlinks, only cell text) — those are listed as
    plain text below and need real links supplied by course staff. Rows marked *Optional* are
    supplementary/preview material, not required coursework.
-->

[Course Schedule (Google Sheet)](https://docs.google.com/spreadsheets/d/175IDKFZSJLymJ2ZCRzDd2OYY6ukzRo4DM9KIuaQrtJ0/edit?usp=sharing)

Lecture: Monday 4:30–7:30pm Eastern, EECS 1500<br>
Lab: Friday 2:30–4:20pm Eastern, Chrysler 151

## Week 1

| Date | Session | Topic | Notes |
| --- | --- | --- | --- |
| Mon Aug 31 | Email | Welcome message and overview | Asynchronous |
| Mon Aug 31 | Lecture | [Course Initialization (2026)](assets/lectures/autorob_01_initialization.pdf) (PDF) · [Lecture Video](https://leccap.engin.umich.edu/leccap/player/r/2Rnlik) | "So, where is my robot?" Course admin and logistics. Spong Ch.1; Corke Ch.1 |
| Mon Aug 31 | Lecture | [Path Planning (2026)](assets/lectures/autorob_02_graph_search.pdf) (PDF) | Navigation as graph search; DFS, BFS, Dijkstra, A-star, priority queues, binary heaps |
| Mon Aug 31 | Lecture | [Robot Middleware and Publish-Subscribe (2026)](assets/lectures/autorob_10_pointclouds_middleware.pdf) (PDF) | Hardware abstraction, ROS, LCM, publish-subscribe messaging, *rosbridge*, client-server messaging. Quigley+ 2009, Huang+ 2010, Toris+ 2015 |
| Mon Aug 31 | Release | [Project 1: Pathfinding (A\*)](projects/project1/index.md) | |
| Mon Aug 31 | Optional | What is a robot? | Robotics history and definitions |
| Fri Sep 4 | Lab | Course Workflow / Help Session | In person |
| Fri Sep 4 | Checkpoint | Project 1: Heapsort | |
| Fri Sep 4 | Optional | Intro and git overview | See [Git Tutorial](git-tutorial.md) |

## Week 2

| Date | Session | Topic | Notes |
| --- | --- | --- | --- |
| Mon Sep 7 | — | **No meeting — Labor Day** | |
| Fri Sep 11 | Lab | KinEval: A-Star Manual Coding | In person |
| Fri Sep 11 | Optional | KinEval A-Star Walkthrough | |
| *(optional)* | Optional | [JavaScript and AutoRob Workflow](assets/lectures/autorob_03_jsh5_git.pdf) (PDF) | Project workflow with git; JS/HTML5 tutorial; DOM; version control; Michigan Honor License |

## Week 3

| Date | Session | Topic | Notes |
| --- | --- | --- | --- |
| Mon Sep 14 | Lecture | [Dynamical Simulation](assets/lectures/autorob_04_dynamics_pendulum.pdf) (PDF) | Simple pendulum; Lagrangian equations of motion; initial value problem; Euler, Verlet, Velocity Verlet integrators; double pendulum. Spong Ch.7; Corke Ch.9 |
| Mon Sep 14 | Office Hours | Extended office hours — Project 1 support | |
| Mon Sep 14 | Due | Project 1: Pathfinding (A\*) | |
| Mon Sep 14 | Release | [Project 2: Pendularm](projects/project2/index.md) | |
| Fri Sep 18 | Lab | Mutation Code Repair: A-Star | In person |
| Fri Sep 18 | Checkpoint | Mutation Repair: 1 released mutation solved | |

## Week 4

| Date | Session | Topic | Notes |
| --- | --- | --- | --- |
| Mon Sep 21 | Lecture | [Motion Control](assets/lectures/autorob_05_control_pid.pdf) (PDF) | Cartesian vs. generalized coordinates; open-loop vs. closed-loop control; PID control; rigid body dynamics. Spong 6.3 |
| Mon Sep 21 | Lecture | [Inverse Kinematics 1: Closed-Form](assets/lectures/autorob_11_ik_closedform.pdf) (PDF) | Joint vs. endeffector control; planar 2-link arm; closed-form solutions. Spong 3.3; Corke 7.3 |
| Mon Sep 21 | Quiz | Quiz 1 | |
| Fri Sep 25 | Lab | KinEval: Pendularm Manual Coding | In person |
| Fri Sep 25 | Optional | pendularm1.html code overview | |
| Fri Sep 25 | Checkpoint | Project 2: Numerical Integration Step Service | |

## Week 5

| Date | Session | Topic | Notes |
| --- | --- | --- | --- |
| Mon Sep 28 | Lecture | [Forward Kinematics](assets/lectures/autorob_07_fk_matrixstack.pdf) (PDF) | Kinematic chains; URDF convention; homogeneous transforms; matrix stack traversal; D-H convention. Spong 2, 3.1, 3.2; Corke 7.1-2 |
| Mon Sep 28 | Office Hours | Extended office hours — Project 2 support | |
| Mon Sep 28 | Tentative | Pendularm Setpoint Competition | |
| Mon Sep 28 | Due | Project 2: Pendularm | |
| Mon Sep 28 | Release | [Project 3: Forward Kinematics](projects/project3/index.md) | |
| Mon Sep 28 | Optional | [Linear Algebra Refresher](assets/lectures/autorob_06_linear_refresh.pdf) (PDF) | Systems of linear equations; vector spaces; least squares. Spong A-B; Corke D |
| Fri Oct 2 | Lab | URDF/JS Definition Programming | In person |
| Fri Oct 2 | Optional | KinEval and urdf.js code overview | |
| Fri Oct 2 | Optional | KinEval pose control and HTML5 audio | |

## Week 6

| Date | Session | Topic | Notes |
| --- | --- | --- | --- |
| Mon Oct 5 | Lecture | [Axis-Angle Rotation and Quaternions](assets/lectures/autorob_08_fk_quaternions.pdf) (PDF) | Motors; Euler angles and gimbal lock; Rodrigues rotation. Corke 2.2-3 |
| Mon Oct 5 | Lecture | [Reactive Controllers](assets/lectures/autorob_09_fsm_subsumption.pdf) (PDF) | Reaction vs. deliberation; finite state machines; subsumption architecture; behavior trees. Brooks 1986; Mataric 1992 |
| Mon Oct 5 | Optional | [Bug Algorithms](assets/lectures/autorob_13_bugs.pdf) (PDF) | Reaction vs. deliberation pt. 2; Bug[0-2]; Tangent Bug. Corke 5 |
| Fri Oct 9 | Lab | Transform Trees and Joint State Publishers | In person |
| Fri Oct 9 | Checkpoint | Project 3: Zero Configuration FK Transforms | |

## Week 7

| Date | Session | Topic | Notes |
| --- | --- | --- | --- |
| Mon Oct 12 | Lecture | [Inverse Kinematics 2: Optimization](assets/lectures/autorob_12_ik_jacobian.pdf) (PDF) | Gradient descent; manipulator Jacobian; Jacobian transpose/pseudoinverse; Cyclic Coordinate Descent |
| Mon Oct 12 | Review | Exam Review | |
| Mon Oct 12 | Optional | [Potential Fields](assets/lectures/autorob_16_potentials_wavefront.pdf) (PDF) | Gradient descent revisited; local search; downhill simplex; wavefront planning |
| Fri Oct 16 | Lab | Robot Choreography Showcase | In person |
| Fri Oct 16 | Due | Project 3: Forward Kinematics | |

## Week 8

| Date | Session | Topic | Notes |
| --- | --- | --- | --- |
| Mon Oct 19 | — | **No meeting — Fall Study Break** | |
| Thu Oct 22 | Challenge | Mutation Code Repair Challenge 1 | In person |
| Fri Oct 23 | Challenge | Mutation Code Repair Challenge 1 | In person |

## Week 9

| Date | Session | Topic | Notes |
| --- | --- | --- | --- |
| Mon Oct 26 | Exam | Midterm Exam | In person |
| Mon Oct 26 | Release | [Project 4: Inverse Kinematics](projects/project4/index.md) | |
| Fri Oct 30 | Lab | Gradient Descent and Jacobians | In person |

## Week 10

| Date | Session | Topic | Notes |
| --- | --- | --- | --- |
| Mon Nov 2 | Lecture | [Configuration Spaces](assets/lectures/autorob_14_configuration_spaces.pdf) (PDF) | Curse of dimensionality; C-space vs. workspace; Minkowski planning; costmaps; holonomicity. Spong 5; Corke 4, 5 |
| Mon Nov 2 | Lecture | [Collision Detection](assets/lectures/autorob_17_collision_detection.pdf) (PDF) | 3D triangle-triangle testing; oriented/axis-aligned bounding boxes; separating axis theorem. Gottschalk+ 1996 |
| Fri Nov 6 | Lab | Collision Detection Lab | In person |
| Fri Nov 6 | Checkpoint | Project 4: Function Minimization Service | |

## Week 11

| Date | Session | Topic | Notes |
| --- | --- | --- | --- |
| Mon Nov 9 | Lecture | [Sampling-Based Planning](assets/lectures/autorob_15_roadmaps_rrt.pdf) (PDF) | Probabilistic roadmaps; RRT-based motion planning. Kavraki+ 1996; Kuffner+ 2000 |
| Mon Nov 9 | Office Hours | Extended office hours — Project 4 support | |
| Mon Nov 9 | Due | Project 4: Inverse Kinematics | |
| Mon Nov 9 | Release | [Project 5: Motion Planning](projects/project5/index.md) | |
| Mon Nov 9 | Release | [Project 6: Best Use of Robotics](projects/project6/index.md) | |
| Fri Nov 13 | Lab | 2D RRT and Best Use of Robotics workshop | In person |

## Week 12

| Date | Session | Topic | Notes |
| --- | --- | --- | --- |
| Mon Nov 16 | Lecture | 3D Rigid Body Simulation and Maximal Coordinates | New for Fall 2026 — link not yet available |
| Mon Nov 16 | Quiz | Quiz 2 | |
| Fri Nov 20 | Lab | Model Predictive Path Integral (MPPI) Control | New for Fall 2026 — link not yet available |
| Fri Nov 20 | Checkpoint | Project 5: 2D RRT Service and Follow Trajectory Action | |

## Week 13

| Date | Session | Topic | Notes |
| --- | --- | --- | --- |
| Mon Nov 23 | Lecture | ROS2 Tutorial | New for Fall 2026 — link not yet available |
| Mon Nov 23 | Optional | ROS Simple Publisher and Subscriber | Starter code — link not yet available |
| Fri Nov 27 | — | **No meeting — Thanksgiving Break** | |

## Week 14

| Date | Session | Topic | Notes |
| --- | --- | --- | --- |
| Mon Nov 30 | Review | Course / Exam Review | Submit review questions via PrairieLearn |
| Mon Nov 30 | Office Hours | Extended office hours — Project 5 support | |
| Mon Nov 30 | Tentative | IK Setpoint Competition | |
| Mon Nov 30 | Due | Project 5: Motion Planning | |
| Thu Dec 3 | Challenge | Mutation Code Repair Challenge 2 | In person |
| Fri Dec 4 | Challenge | Mutation Code Repair Challenge 2 | In person |
| Fri Dec 4 | Due | Project 6: Best Use of Robotics — slides due 11:59pm | |

## Week 15

| Date | Session | Topic | Notes |
| --- | --- | --- | --- |
| Mon Dec 7 | Presentations | **Best Use of Robotics presentations (required attendance)** | |
| Fri Dec 11 | Office Hours | Extended office hours | |
| Fri Dec 11 | Due | **Final project grading deadline** (late submissions) | |

## Weeks 16–17

| Date | Session | Topic | Notes |
| --- | --- | --- | --- |
| Mon Dec 14 | Final Exam | Final Exam, 4:00pm–6:00pm | Location TBD |
