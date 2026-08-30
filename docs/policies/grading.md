# Grading & Rubric

!!! warning "Needs update for the current semester"
    The point totals, grade thresholds, and rubric below are carried over from the Winter
    2023 (ROB 320/511) offering as a structural template. They must be reviewed and updated
    for the current ROB 380/511/EECS 367 "Agentic Edition" semester — including how projects
    map onto the new publish-subscribe node architecture described in the
    [learning objectives](learning-objectives.md) — before publishing.

The AutoRob course will assign a set of projects (programming and oral) and periodic quizzes. Each project has been decomposed into a collection of features, each of which is worth a specified number of points. AutoRob project features are graded as "checked" (completed) or "due" (incomplete). Prior to its due date, the grading status of each feature will be in the "pending" state. In terms of workload, each project is expected to take approximately 4 hours of work on average.

Each quiz will consist of a short set of questions given in two parts: an interactive quiz given synchronously in class and done in "pods" of 3, and an individual quiz to be completed asynchronously on the day of the quiz. Quiz questions will be within the scope of previously covered lectures and graded projects.

Individual final grades are assigned based on the sum of points earned from coursework (detailed in subsections below). The timing and due dates for course projects and quizzes will be announced on an ongoing basis. The official due date of a project is listed with its project description, such as for [Project 1](../projects/project1/index.md). Due dates listed in the [course schedule](../schedule.md) are tentative. All project work must be checked by the final grading deadline to receive credit.

### ROB 380: Robot Operating Systems / EECS 367: Introduction to Autonomous Robotics

Each fully completed project is weighted as 10 points and each quiz is weighted as 2 points. Based on this sum of points from coursework, an overall grade for the course is earned as follows: an "A" grade in the course is earned if graded coursework sums to 95 points or above; a "B" grade in the course is earned if graded coursework sums to 83 points or above; a "C" grade in the course is earned if graded coursework sums to 73 points or above. The instructor reserves the option to assign appropriate course grades with plus or minus modifiers.

Students have the opportunity to earn 2 extra credit points through optional extensions of the course projects. Extension points are limited to 2 **total** over the course of the semester.

### ROB 511: Robot Operating Systems

In the graduate section, each fully completed project is weighted as 16 points and each quiz is weighted as 2 points. The first and last projects are weighted as 10 points instead of 16. Based on this sum of points from coursework, an overall grade for the course is earned as follows: an "A" grade in the course is earned if graded coursework sums to 130 points or above; a "B" grade in the course is earned if graded coursework sums to 115 points or above; a "C" grade in the course is earned if graded coursework sums to 100 points or above.

Students have the opportunity to earn 6 extra credit points through optional extensions of the course projects. Extension points are limited to 6 **total** over the course of the semester.

## Project Rubrics (tentative and subject to change)

The following project features are planned for AutoRob this semester. Students are expected to complete all features.

*This rubric is carried over from the previous (KinEval/JavaScript) offering as a formatting template — it should be replaced with rubric features for the current Agentic Edition pubsub-node projects, starting with [Project 1](../projects/project1/index.md).*

| Points | Sections | Feature |
| --- | --- | --- |
| | | **Assignment 0: ROS Publisher and Subscriber** |
| 5 | All | Laser range scan subscriber |
| 5 | All | Random walk control publisher |
| | | **Assignment 1: 2D Path Planning** |
| 4 | All | Heap implementation |
| 6 | All | A-star search |
| 2 | 511 | BFS |
| 2 | 511 | DFS |
| 2 | 511 | Greedy best-first |
| | | **Assignment 2: Pendularm** |
| 3 | All | Euler integrator |
| 3 | All | Velocity Verlet integrator |
| 4 | All | PID control |
| 2 | 511 | Verlet integrator |
| 2 | 511 | RK4 integrator |
| 2 | 511 | Double pendulum |
| | | **Assignment 3: Forward Kinematics** |
| 2 | All | Core matrix routines |
| 5 | All | FK transforms |
| 1 | All | Joint selection/rendering |
| 2 | All | New robot definition |
| 2 | 511 | Base offset transform |
| 4 | 511 | Fetch *rosbridge* interface (due before final grading deadline) |
| | | **Assignment 4: Dance Controller** |
| 6 | All | Quaternion joint rotation |
| 1 | All | Interactive base control |
| 1 | All | Pose setpoint controller |
| 2 | All | Dance FSM |
| 3 | Ext | Joint limits |
| 3 | 511 | Prismatic joints |
| | | **Assignment 5: Inverse Kinematics** |
| 6 | All | Manipulator Jacobian |
| 4 | All | Gradient descent with Jacobian transpose |
| 3 | 511 | Jacobian pseudoinverse |
| 3 | 511 | Euler angle conversion |
| | | **Assignment 6: Motion Planning** |
| 4 | All | 2D RRT-Connect |
| 2 | All | Robot collision detection |
| 4 | All | Configuration space RRT-Connect |
| 6 | 511 | 2D RRT-Star |
| | | **Optional** |
| 4 | | Optional feature extensions (extra credit) |

### Project Submission and Regrading

[Git](https://en.wikipedia.org/wiki/Git) repositories will be used for project implementation, version control, and submission for grading. The implementation of your project is submitted through an update to the *main* (or *master*) branch of your designated repository. Updates must be committed and pushed prior to the due date for each assignment for any consideration of full credit. Your implementation will be checked out and executed by the course staff. Through your repository, you will be notified by the course staff whether your implementation of assignment features is sufficient to receive credit.

### Continuous Integration Project Grading

AutoRob makes use of "continuous integration grading" for student project implementations. The "CI grader" will automatically pull code from your repository, run tests for **all** assignments that are due to the current time, and push the results of grading back to your repository. Please remember to not break the functionality of project features that are already working in your code. Grades automatically generated by the CI grader are considered tentative and reviewable by the course staff.

### Late Policy

**Do not submit assignments late.** The course staff reserves the right to not grade late submissions. The course instructor reserves the right to decline late submissions and/or adjust partial credit on regraded assignments.

If granted by the course instructor, late submissions can be graded for partial credit: submissions pushed within two weeks past the project deadline will be graded for 80% credit; submissions pushed within four weeks of the project deadline will be graded for 60% credit; submissions pushed at any time before the semester project submission deadline will be considered for 50% credit.

### Regrading Policy

The regrading policy allows for submission and regrading of projects up through the final grading of projects. This regrading policy will grant full credit for project submissions pushed to your repository before the corresponding project deadline. If a feature of a graded project is returned as not completed ("DUE"), your code can be updated for consideration at 80% credit if pushed within two weeks from when the originally graded project was returned; regrades updated beyond this two-week window can receive at most 60% credit.

### Completed Features Policy

All checked features must continue to function properly in your repository up through the final grading deadline. Checked features that do not function properly for subsequent projects will be treated as a new submission and subject to the regrading policy.

### Final Grading

All grading will be finalized on the announced final grading deadline. Regrading of specific assignments can be done upon request during office hours. No regrading will be done after grades are finalized.

### Repositories

You are expected to provide a **private** git repository for your work in this course with the course instructor added as a read/write collaborator. If needed, the course staff can assist in the setup of an online git repository through providers such as [GitHub](https://github.com/) or [Bitbucket](https://bitbucket.org/). All Michigan Engineering students have access to an account on the internal EECS [GitLab](https://gitlab.eecs.umich.edu) server at no additional cost.

There are many different tutorials for learning how to use git repositories. The AutoRob course site also has its own basic [quick start tutorial](../git-tutorial.md). The [Pro Git book](http://www.git-scm.com/book/en/v2) provides an in-depth introduction to git and version control.

We expect students to use these repositories for collaborative development as well as project submission. It is the responsibility of each student group to ensure their repository adheres to the [Collaboration Policy](collaboration.md) and submission standards for each assignment.

### Code Maintenance Policy and Branching

This section outlines expectations for maintenance of source code repositories used by students for submission of their work in this course. Repositories that do not maintain these standards will not be graded at the discretion of the course staff.

Code submitted for projects in this course must reside in the *main* (or *master*) branch of your repository. The *main* branch must always maintain a working (or stable) version of your code for this course, and must always be in compliance with the [Michigan Honor Code](https://bulletin.engin.umich.edu/rules/) and [Michigan Honor License](collaboration.md), as described in the course Collaboration Policy. To be considered for grading, a commit of code to your *main* branch must be signed with your name and the instructor name at the bottom of the file named `LICENSE` with an unmodified version of the Michigan Honor License.

If optional extension features have been implemented and are ready for grading, such features must be listed in a file in the top level directory of the *main* branch. Optional extension features not listed in this file may not be graded at the discretion of the course staff.

#### Branching

Students are encouraged to update their repository often with the help of branching. Branching spawns a copy of code in your *main* branch into a new branch for development, and then merging integrates these changes back into *main* once they are complete. This configuration allows your work to be continually updated and built upon such that versions are tracked and grading interruptions are minimized.
