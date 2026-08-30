# AutoRob — Agentic Edition

**Robotics 380 · Robotics 511 · EECS 367 — Introduction to Autonomous Robotics**

![Fetch mobile manipulator](assets/images/diagrams/um_fetch.jpg)

!!! info "An experimental offering"
    This semester's AutoRob is the **"Agentic Edition"** — an experimental revision and
    evolution of the previous version of the AutoRob course and its use of the
    [kineval-stencil](https://github.com/autorob/kineval-stencil). Students build a
    publish-subscribe messaging system as the course's own robot middleware infrastructure,
    then implement course concepts (A* search, physical simulation, forward and inverse
    kinematics, motion planning) as nodes interconnected through topic messages on that
    infrastructure. Students are encouraged to use agentic AI tools to help build both the
    infrastructure and the nodes themselves — while remaining responsible for explaining any
    generated code and fixing bugs that arise. See the full
    [learning objectives](policies/learning-objectives.md) for details.

## First Week Action Items

Students enrolled in an AutoRob section (Robotics 380, Robotics 511, EECS 367) should do the following as soon as possible:

- Complete the Student Workflow Survey *(link to be provided by course staff)*
- Join the AutoRob Slack workspace *(invite link to be provided by course staff)*

## Introduction

AutoRob is an introduction to the computational foundations of autonomous robotics for building modern robot operating systems and applications to perform mobile manipulation tasks. AutoRob covers fundamental concepts in autonomous robotics for the kinematic modeling of articulated robots and algorithmic reasoning for autonomous path and motion planning. These core concepts are contextualized through their instantiation in modern robot middleware systems, along with coverage of paradigms for interprocess communication. AutoRob covers some of the fundamental concepts in computing, common to a [second semester data structures course](https://eecs281staff.github.io/eecs281.org/), in the context of robot reasoning, but without analysis of computational complexity. The AutoRob [learning objectives](policies/learning-objectives.md) are geared to ensure students completing the course are fluent programmers capable of computational thought and can develop full-stack mobile manipulation software systems.

Within the [Michigan Robotics Undergraduate Program](https://robotics.umich.edu/academics/undergraduate/), the AutoRob course can be thought of as an exploration into the foundation for reasoning and computation by autonomous robots — and, more generally, how to build "brains for robots." That is, given a robot as a machine with sensing, actuation, and computation, how do we build computational models, algorithms, programming environments, and applications that allow the robot to function autonomously? Such computation involves functions for robots to perceive the world, make decisions towards achieving a given objective (this class), transform action into motor commands, and usably work with human users. Computationally, these functions form the basis of the **sense-plan-act** paradigm that defines the discipline of robotics as the study of [embodied intelligence](https://dspace.mit.edu/bitstream/handle/1721.1/6569/AIM-1293.pdf), as described by [Brooks](https://rodneybrooks.com). Embodied intelligence allows for understanding and extending concepts essential for modern robotics, especially mobile manipulators such as the pictured [Fetch](http://fetchrobotics.com/research/) robot.

In the Agentic Edition, AutoRob projects ground course concepts through implementation of a from-scratch publish-subscribe robot middleware system (in Rust, per the `autorob_agentic` [pubsub_testbed_rs](https://github.com/odestcj/autorob_agentic/tree/main/pubsub_testbed_rs) codebase) plus a `rosbridge`-subset gateway, rather than the previous editions' JavaScript/HTML5 [KinEval code stencil](https://github.com/autorob/kineval-stencil). Course projects still cover the same core algorithmic ground as prior editions — graph search path planning ([A\* algorithm](https://en.wikipedia.org/wiki/A*_search_algorithm)), basic physical simulation ([Lagrangian dynamics](https://en.wikipedia.org/wiki/Classical_mechanics), [numerical integrators](https://en.wikipedia.org/wiki/Numerical_integration)), forward kinematics (3D geometric [matrix transforms](https://en.wikipedia.org/wiki/Transformation_matrix)), inverse kinematics ([gradient descent](https://en.wikipedia.org/wiki/Gradient_descent) optimization, geometric [Jacobian](https://en.wikipedia.org/wiki/Jacobian_matrix_and_determinant)), and motion planning ([RRT-Connect](https://en.wikipedia.org/wiki/Rapidly-exploring_random_tree)) — but implemented as independent nodes communicating over [publish-subscribe messaging](https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern), as described in [Project 1](projects/project1/index.md).

### Concepts to build your own robot operating system

AutoRob aims to provide a general conceptual framework that enables students to build their own robot operating systems. Like computing [operating systems](https://www.merriam-webster.com/dictionary/operating%20system), the fundamental goal of a robot operating system is to bridge the gap between robot hardware and application programs to control the robot purposefully. Robot operating systems hide the gory details of managing robot devices, software processes, and (especially) low-level sensorimotor routines. This abstraction provides a platform for robot applications to run seamlessly across a wide variety of robots with different physical and electronic configurations.

The area of robot operating systems has emerged from pioneering work in [robot middleware](https://en.wikipedia.org/wiki/Robotics_middleware) systems over the last 20 years. AutoRob draws from historically significant and modern robot operating systems, including Lightweight Communications and Marshalling (LCM), Yet Another Robot Platform (YARP), the MOOS, JAUS-based systems, Player/Stage, and the well-branded [Robot Operating System (ROS)](http://ros.org). Topics covered in AutoRob will help you understand the insides of all of these robot middleware systems, make them better, and develop the robot operating systems of the future.

### Related Courses

AutoRob is a computing-friendly pathway into robotics, providing broad exposure to autonomous robotics without covering the whole of robotics. The scope of AutoRob is introductory kinematic modeling and reasoning.

AutoRob is well-suited as preparation for a Major Design Experience, such as in EECS 467 (Autonomous Robotics Laboratory). AutoRob complements courses covering computational perception (EECS 467, EECS 568 Mobile Robotics, EECS 442 Computer Vision), artificial intelligence courses (EECS 492, EECS 445, EECS 595), and embedded systems (EECS 373, EECS 473). AutoRob is a computation-focused alternative to ME 567/ROB 510 (Robot Kinematics and Dynamics), with a greater emphasis on algorithmic methods for autonomous path and motion planning. AutoRob can be taken in parallel with ROB 502 (Programming for Robotics).

## Discussion Server

### Slack

The AutoRob Slack workspace will be used for course-related discussions and announcements. [Slack](https://en.wikipedia.org/wiki/Slack_(software)) is a cloud-hosted online discussion and collaboration system with functionality that resembles [Internet Relay Chat (IRC)](https://en.wikipedia.org/wiki/Internet_Relay_Chat). Slack is [FERPA](https://safecomputing.umich.edu/dataguide/?q=node/257) compliant.

Students enrolled in AutoRob will receive an invitation to the AutoRob Slack workspace with channels for general course discussion, lecture questions, per-project discussion, and optional extensions.

## Prerequisites

This course has recommended prerequisites of "Linear Algebra" and "Data Structures and Algorithms", or permission from the instructor.

*Programming proficiency*: EECS 280, EECS 402, ROB 502, or proficiency in data structures and algorithms should provide an adequate programming background for the projects in this course.

*Mathematical proficiency*: Math 214, 217, 417, 419, or proficiency in linear algebra should provide an adequate mathematical background for the projects in this course.

*Recommended optional proficiency*: Differential equations, computer graphics, computer vision, artificial intelligence.

## Textbook

AutoRob is compatible with both the Spong et al. and Corke textbooks (listed below), although only one of these books is needed.

[**Robot Modeling and Control**](http://bcs.wiley.com/he-bcs/Books?action=index&itemId=0471649902&bcsId=2888)
Mark W. Spong, Seth Hutchinson, and M. Vidyasagar · Wiley, 2005

### *Alternate textbooks*

[**Robotics, Vision and Control: Fundamental Algorithms in MATLAB**](http://www.springer.com/gp/book/9783319544120)
Peter Corke · Springer, 2011

[**Modern Robotics: Mechanics, Planning, and Control**](http://modernrobotics.org)
Kevin M. Lynch, Frank C. Park · Cambridge University Press, 2017

## Course Structure

!!! warning "Needs update for the current semester"
    Meeting formats, times, and locations below are carried over from the Winter 2023
    offering as a template and must be updated for the current semester.

This course is typically offered in a [flipped classroom](https://en.wikipedia.org/wiki/Flipped_classroom) format: pre-recorded lectures are watched before class, and course meetings focus on interactive activities, individualized support, and lab sessions that build on those lectures. See the [course schedule](schedule.md) for the current lecture and meeting list.

## Office Hours Calendar

Office hours calendar link *(to be provided by course staff for the current semester)*.
