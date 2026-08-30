# Course Schedule

!!! warning "Needs update for the current semester"
    This schedule is carried over from Winter 2023 as a structural template (date format,
    topic/reading/project columns, per-week grouping). Dates, lecture links, and project
    due dates must be updated for the current ROB 380/511/EECS 367 "Agentic Edition"
    semester before publishing. Rows in ~strikethrough~ were tentative/superseded in the
    original schedule.

Course material below that is **not highlighted in grey** can be considered officially released to the course for Winter 2023. Previously recorded **preview slides and lecture recordings (in gray)** are provided below from lectures during the Winter 2022 offering of AutoRob. These preview materials will be replaced with either recorded lectures for Winter 2023 (as these videos become available) or appropriate materials from past courses.

Slides from this course borrow from and are indebted to many sources from around the web. These sources include a number of excellent robotics courses at various universities.

| **Date** | **Topic** | **Reading** | **Project** |
| --- | --- | --- | --- |
| **Jan 6** | [Initialization (2023)](https://drive.google.com/file/d/1iEhybRrTUM1wuB_HeXmJ4_GPMrCirN-k/view?usp=share_link): "So, where is my robot?", "What is a Robot OS?", Course administration and logistics  
[\[Lecture Video (2023)\]](https://youtu.be/MgljqGwfmJM)  
 | Spong Ch.1

* * *

Corke Ch.1 |
|  | [What is a robot? (2023, slides only)](https://drive.google.com/file/d/1sM9UdAWT39V4I2QjMiB8pxRwDikXkPUf/view?usp=share_link) : Brief history and definitions for robotics  
 |  |
|  | Week 2 |  |  |
| **Jan 9** | Interactive Session: Fetch robot ROS and navigation demo with [roscore,](http://wiki.ros.org/roscore) [roslaunch,](http://wiki.ros.org/roslaunch) [rosnode,](http://wiki.ros.org/rosnode) and [rostopic](http://wiki.ros.org/rostopic)  
[\[Session recording (2023)\]](https://youtu.be/VtzLgN51T-Q) | [Git-ing started with git (2023)](https://drive.google.com/file/d/1xMdrGGAUvKrNAv-Kl269CFWZTwtzprOS/view?usp=sharing)  
[ROS C++ Pub-Sub Tutorial](http://wiki.ros.org/ROS/Tutorials/WritingPublisherSubscriber%28c%2B%2B%29) | Out: [ROS Pub-Sub](archive/assignment-0-ros-pubsub.md) |
| **Jan 11** | [Path Planning (2022)](assets/lectures/autorob_02_graph_search.pdf): Navigation as graph search, DFS, BFS, Dijkstra shortest paths, A-star, Priority queues and binary heaps  
[\[Lecture Video (2020)\]](https://youtu.be/DcW7CbJ1Flw)  
 | [Wikipedia](https://en.wikipedia.org/wiki/A*_search_algorithm) |  |
|  | [JavaScript and AutoRob workflow (2022)](assets/lectures/autorob_03_jsh5_git.pdf): Project workflow with git, JS/HTML5 tutorial, Document Object Model, Version Control, LaTeX math mode, Licensing, Michigan Honor License  
[\[Lecture Video (2020)\]](https://youtu.be/VZ3llORSumk) | Crockford,  
[HTML Sandbox](assets/examples/sandbox.html),  
[hello.html](assets/examples/hello.html),  
[JavaScript by Example](assets/examples/js_overview.html),  
[hello\_anim](assets/examples/hello_anim.html),  
[hello\_anim\_text](assets/examples/hello_anim_text.html) |
| **Jan 13** | Lab Session: [KinEval Path Planning code overview (2023)](assets/labs/autorob_lab_02_search_canvas.pdf)  
[\[Session Recording (2023)\]](https://youtu.be/wavPo2SC4qA) |
|  | [Robot Middleware (2022)](assets/lectures/autorob_10_pointclouds_middleware.pdf): Hardware Abstraction, ROS, LCM, Publish-subscribe messaging, rosbridge, Client-server messaging  
[\[Lecture Video (2022)\]](https://youtu.be/IqOTiT-haSs) | [Quigley+ 2009](https://ai.stanford.edu/~mquigley/papers/icra2009-ros.pdf), [Huang+ 2010](https://april.eecs.umich.edu/pdfs/huang2010.pdf), [Toris+ 2015](http://ocj.name/papers/rctoris_iros2015.pdf) |  |
|  | Week 3 |  |  |
| **Jan 16** | **No course meeting** - [Martin Luther King, Jr. Day](https://en.wikipedia.org/wiki/Martin_Luther_King_Jr._Day)  
[UM Martin Luther King Jr. Symposium](https://oami.umich.edu/um-mlk-symposium/)  
Contribute to broadening participation in computing and robotics |  | ~Due: ROS Pub-Sub  
Out: [Path Planning](archive/assignment-1-path-planning.md)~ |
| **Jan 18** | [Dynamical Simulation (2022)](assets/lectures/autorob_04_dynamics_pendulum.pdf): Simple pendulum, Lagrangian equation(s) of motion, Initial value problem, Explicit integrators: Euler, Verlet, and Velocity Verlet, Double pendulum  
[\[Lecture Video (2020)\]](https://youtu.be/B_yWF6SqZW0) | Spong Ch.7 | Corke Ch.9  
[Euler's Method](https://en.wikipedia.org/wiki/Euler_method)  
[Verlet Integration](https://en.wikipedia.org/wiki/Verlet_integration),  
[Runge-Kutta](https://en.wikipedia.org/wiki/Runge%E2%80%93Kutta_methods#The_Runge.E2.80.93Kutta_method);  
 | Due: ROS Pub-Sub  
Out: [Path Planning](archive/assignment-1-path-planning.md) |
| **Jan 20** | Lab Session: [pendularm1.html code overview (2023)](https://drive.google.com/file/d/1LKKNreR3ZBKi7msc_q5Rw9z5_plMpKp7/view?usp=share_link)  
[\[Session recording (2023\]](https://www.youtube.com/watch?v=0pk5em-pxzg) |  |
|  | Week 4 |  |  |
| **Jan 23** | Interactive Session: Quiz 1 and [Planning scene creation activity](https://docs.google.com/document/d/18kQGngAJpHbzg92aI17xYiI6dpVPI9PSA0BRDbzqsYc/edit?usp=sharing) |  |  |
| **Jan 25** | [Motion Control (2022)](assets/lectures/autorob_05_control_pid.pdf): Cartesian vs. generalized coordinates, open-loop vs. closed-loop control, PID control; Rigid body dynamics  
[\[Lecture Video (2020)\]](https://youtu.be/VdEA4InDxKc) | Spong 6.3,  
[Vondrak+ 2012](http://ocj.name/papers/marek_pami2012.pdf)  

* * *

[Astrom Ch. 6](http://www.cds.caltech.edu/~murray/courses/cds101/fa02/caltech/astrom-ch6.pdf) |  |
| **Jan 27** | Lab Session: [Pendularm Support (2023)](https://drive.google.com/file/d/1gZmkQQWU1Vtzy-UY_3AEsJeyhwq1dRcA/view?usp=sharing)  
[\[Session recording (2023\]](https://youtu.be/tx4FVmITE8A) |
|  | Week 5 |  |  |
| **Jan 30** | Interactive Session: Quiz 2 and Extended office hours |  | Due: Path Planning  
Out: [Pendularm](archive/assignment-2-pendularm.md) |
| **Feb 1** | [Linear Algebra Refresher (2022)](assets/lectures/autorob_06_linear_refresh.pdf): Systems of linear equations, vector spaces and operations, least squares approximations  
[\[Lecture Video (2022)\]](https://youtu.be/q_9GCLb3arg) | Spong A-B

* * *

Corke D |  |
|  | [Forward Kinematics (2022)](assets/lectures/autorob_07_fk_matrixstack.pdf): Kinematic chains, URDF, homogeneous transforms, matrix stack traversal, D-H convention  
[\[Lecture Video (2020)\]](https://youtu.be/to5yp5FpsGc) | Spong 2, 3.1, 3.2

* * *

Corke 7.1-2 |  |
| **Feb 3** | Lab Session: [KinEval and urdf.js code overview (2022)](https://drive.google.com/file/d/1Bbp1D7_sthTYPGT37muW-GY4C91D0lZs/view?usp=sharing)  
[\[Session recording 2023\]](https://youtu.be/kYP2_20KvQY) |  |
|  | Week 6 |  |  |
| **Feb 6** | Interactive Session: Quiz 3 and Guest Speaker  
[Grant Gibson](https://robotics.umich.edu/profile/grant-gibson/) -- [_Digit: Control for Humanoid Robots_](https://docs.google.com/presentation/d/1y4RfNLRE-LWFYgEOt2XlvCNoLGshatGES4mEGxl7x0k/edit?usp=sharing) |  |  |
| **Feb 8** | [Axis-angle Rotation and Quaternions (2022)](assets/lectures/autorob_08_fk_quaternions.pdf): Motors, Euler angles, gimbal lock, Rodrigues rotation, rotation in complex spaces, Dual quaternions and screw coordinates  
[\[Lecture Video (2020)\]](https://youtu.be/zEmIV_FMGyo) | [Wikipedia 1](https://en.wikipedia.org/wiki/Gimbal_lock)  
[Wikipedia 2](https://en.wikipedia.org/wiki/Quaternions_and_spatial_rotation)  
[Daniilidis 1999](http://journals.sagepub.com/doi/pdf/10.1177/02783649922066213)

* * *

Corke 2.2-3 |  |
| **Feb 10** | Lab Session: [KinEval pose parameters and HTML5 audio (2022)](https://drive.google.com/file/d/1_vd-A2okF_4j-5JeLgMfPAOSWQxUF67p/view?usp=sharing)  
[\[Session recording\]](https://youtu.be/4aqnKxpok7E) |
|  | Week 7 |  |  |
| **Feb 13** | Interactive Session: Quiz 4 and Pendularm Setpoint Competition! |  | Due: Pendularm  
Out: [Forward Kinematics](archive/assignment-3-forward-kinematics.md) |
| **Feb 15** | [Reactive Controllers (2022)](assets/lectures/autorob_09_fsm_subsumption.pdf): Reactive and Deliberative Decision Making, Finite State Machines, Subsumption Architecture  
[\[Lecture Video (2022)\]](https://youtu.be/Ifp7Grcr4HE) | [Brooks 1986](http://ieeexplore.ieee.org/abstract/document/1087032/), [Mataric 1992](https://ieeexplore.ieee.org/abstract/document/143349), [Platt+ 2004](https://ieeexplore.ieee.org/abstract/document/1307247), [Cunningham+ 2015](https://ieeexplore.ieee.org/stamp/stamp.jsp?tp=&arnumber=7139412) |  |
| **Feb 17** | Lab Session: Asgn3 Help and Extended Office Hours  
[\[Session recording\]](https://youtu.be/qOe8NGA_0MI) |  |
|  | Week 8 |  |  |
| **Feb 20** | Interactive Session: Quiz 5 and URDF/JS Definition Programming |  |
| **Feb 22** | [Inverse Kinematics 1 - Closed-form (2022)](assets/lectures/autorob_11_ik_closedform.pdf): Joint vs. Endeffector control, Planar 2-link arm, Closed form solutions  
[\[Lecture Video (2020)\]](https://drive.google.com/file/d/10VDLspDS8DJAVnfQDKwOMuNmLdQFXHjF/view?usp=share_link) | Spong 3.3

* * *

Corke 7.3 |  |
|  |  | [IK robot game](https://scratch.mit.edu/projects/10607750/) |  |
| **Feb 24** | Lab Session: Extended Office Hours |  | Out: [Dance Contest](archive/assignment-4-fsm-dance.md) |
|  |
|  | Week 9: Winter Vacation |  |  |
| **Feb 27 - Mar 3** | **No course meetings** |  |  |
|  |
|  | Week 10 |  |  |
| **Mar 6** | Interactive Session: Quiz 6 and Robot URDF/JS Showcase |  | Due: Forward Kinematics |
| **Mar 8** | [Inverse Kinematics 2 - Optimization (2022)](assets/lectures/autorob_12_ik_jacobian.pdf): Gradient descent, Manipulator Jacobian, Jacobian transpose and pseudoinverse, Cyclic Coordinate Descent  
[\[Lecture Video (2020)\]](https://drive.google.com/file/d/16rw--r-hy-PnI25KkMroG1g3Lbfb-lhT/view?usp=share_link) [\[Lecture In-Class (2023)\]](https://drive.google.com/file/d/1naFZcDgi9PlGtOAUvwB3jgdljUPLyNhr/view?usp=share_link) | Spong 4, [Wang&Chen 1991](http://ieeexplore.ieee.org/xpls/abs_all.jsp?arnumber=86079), [Buss 2009](http://math.ucsd.edu/~sbuss/ResearchWeb/ikmethods/iksurvey.pdf), [Beeson+ 2015](https://personal.traclabs.com/~pbeeson/papers/Beeson-humanoids-15.pdf)

* * *

Corke 8 |  |
|  | [Bug Algorithms (2022)](assets/lectures/autorob_13_bugs.pdf): Reaction vs. Deliberation revisited, Bug\[0-2\], Tangent Bug  
[\[Lecture Video (2022)\]](https://youtu.be/pfnQ_11M8KY) | [Lumelsky+ 1986](https://ieeexplore.ieee.org/abstract/document/1104175), [Kamon+ 1996](http://www.cs.technion.ac.il/~ehudr/publications/pdf/KamonRR96i.pdf)

* * *

Corke 5 |  |  |  |
| **Mar 10** | Lab Session: [KinEval IK control flow and parameters (2022)](assets/labs/autorob_lab_08_ik.pdf)  
[\[Session recording\]](https://www.youtube.com/watch?v=aqgLOy8WQq0) |  |
|  | Week 11 |  |  |
| **Mar 13** | Interactive Session Quiz 7 and KinEval Setpoint Review |  | Out: [Inverse Kinematics](archive/assignment-5-inverse-kinematics.md)  
Due: Dance Contest |
| **Mar 15** | [Configuration Spaces (2022)](assets/lectures/autorob_14_configuration_spaces.pdf): Curse of dimensionality, Configuration space vs. Workspace, Minkowski planning, Costmaps, Holonomicity  
[\[Lecture Video (2022)\]](https://youtu.be/6HETAENDspc) | Spong 5

* * *

Corke 4, 5 |  |
|  | [Sampling-based Planning (2022)](assets/lectures/autorob_15_roadmaps_rrt.pdf): Probabilistic roadmaps, RRT-based motion planning  
[\[Lecture Video (2020)\]](https://drive.google.com/file/d/1AlMOBC48j0pjzgrsz6ZjJcf0buCjkkjf/view?usp=share_link) | [Kavraki+ 1996](http://www.kavrakilab.org/publications/kavraki-svestka1996probabilistic-roadmaps-for.pdf), [Kuffner+ 2000](https://ieeexplore.ieee.org/abstract/document/844730), [McMahon+ 2018](http://ocj.name/papers/tamcm_iros2018.pdf) |  |
| **Mar 17** | Lab Session: [search\_canvas.html revisited for 2D RRT (2022)](assets/labs/autorob_lab_09_rrt.pdf)  
[\[Session recording\]](https://youtu.be/jyhjZaLhJcU) |
|  | Week 12 |  |  |
| **Mar 20** | Interactive Session: ~Quiz 8~ and Dance FSM Showcase |  |
| **Mar 23** | [Potential fields (2022)](assets/lectures/autorob_16_potentials_wavefront.pdf): Gradient descent revisited, local search, downhill simplex, Wavefront planning  
[\[Lecture Video (2022)\]](https://youtu.be/lQhQ-XNmeTg) | [Khatib 1986](https://cs.stanford.edu/group/manips/publications/pdfs/Khatib_1986_IJRR.pdf),  
[Jarvis 1993](https://books.google.com/books?id=8MDsCgAAQBAJ&pg=PA3&lpg=PA3&dq=Distance+Transform+Based+Path+Planning+for+Robot+Navigation&source=bl&ots=4YC-ov9RTx&sig=uQAPV5UEPkqs2_JbmUWQ_Lcunec&hl=en&sa=X&ved=0ahUKEwi28Kz3yJnXAhWH6oMKHbOPAW4Q6AEINjAC#v=onepage&q=Distance%20Transform%20Based%20Path%20Planning%20for%20Robot%20Navigation&f=false),  
[Zelinsky 1992](http://ieeexplore.ieee.org/stamp/stamp.jsp?arnumber=182671) |
|  | [Collision Detection (2022)](assets/lectures/autorob_17_collision_detection.pdf): 3D Triangle-Triangle Testing, Oriented Bounding Boxes, Axis-Aligned Bounding Boxes, Separating Axis Theorem  
[\[Lecture Video\]](https://youtu.be/LgtlcU2BMlI) | [Gottschalk+ 1996](https://wwwx.cs.unc.edu/~walk/papers/gottscha/sig96.pdf), [Moller 1997](http://fileadmin.cs.lth.se/cs/Personal/Tomas_Akenine-Moller/code/tritri_tam.pdf) |  |
| **Mar 24** | Lab Session: [KinEval RRT stencil and AABB collision detection (2022)](assets/labs/autorob_lab_10_aabb.pdf)  
[\[Supplementary recording\]](https://youtu.be/liCWwjG0TVk) |
|  | Week 13 |  |  |
| **Mar 27** | Interactive Session: ~Quiz 9~ Extended office hours and Fetch/rosbridge activity |  | Due: Inverse Kinematics  
Out: [Motion Planning](archive/assignment-6-motion-planning.md),  
[Best Use of Robotics](archive/assignment-7-best-use.md) |
| **Mar 31** | ~Extended Office Hours~ No meeting |  |  |
|  | Week 14 |  |  |
| **Apr 3** | Interactive Session: ~Quiz 10~ and Optional IK Setpoint Showcase |  |
| **Apr 7** | Extended office hours |  |

|  | Week 15: [National Robotics Week](https://www.nationalroboticsweek.org) |  |  |
| **Apr 10** | Interactive Session: ~Quiz 11~ Optional Extension Evaluation |  | Due: Motion Planning |
| **Apr 14** | Extended office hours |  | Due: Best Use of Robotics |

|  | Week 16 |  |  |
| **Apr 17** | Interactive Session: Best Use of Robotics |  |  |

| **Apr 19** |  |  | Final grading deadline |

  
  
  

* * *
