# Grading & Rubric

The AutoRob course will assign 6 projects (5 programming, 1 oral), 2 Code Mutation Challenges, 2
quizzes, a midterm exam, and a final exam across all sections of the course.

Individual final grades are assigned based on the sum of points earned from coursework
deliverables. The timing and due dates for course projects, homework, and exams will be announced
on an ongoing basis. The official due date of a project is listed with its project description.
Due dates listed in the [course schedule](../schedule.md) are tentative. All project work must be
checked by the final grading deadline to receive credit.

This grading does not round scores. The instructor may adjust thresholds in your favor, relative
to your section of enrollment in the course.

## Grading Breakdown

All sections of the AutoRob course have a grading structure based on performance for these
coursework deliverables:

| Component | Points | Detail |
| --- | --- | --- |
| Projects | 30 | 6 projects, 5 points each |
| Project checkpoints | 5 | 5 projects — see inconsistency note below |
| Quizzes | 6 | 2 quizzes, 3 points each |
| Code Mutation Challenge | 20 | 2 challenges, 10 points each |
| Midterm exam | 15 | |
| Final exam | 20 | |
| Attendance or Rust | 4 | Mandatory attendance is excused if programming project back-ends are fully implemented in Rust |
| **Total** | **100** | |

- Project 1: Pathfinding — A-Star Algorithm
- Project 2: Pendularm — Physical Simulation of a 3-link Planar Robot Arm
- Project 3: Forward Kinematics — URDF and Hierarchies of 3D Rigid Transforms
- Project 4: Inverse Kinematics — Gradient Descent on the Manipulator Jacobian
- Project 5: Motion Planning — RRT-Connect Algorithm
- Project 6: Best Use of Robotics?

Based on the sum of points from completed coursework, an overall grade for the course is earned
based on the following point thresholds:

| Grade | Points Earned |
| --- | --- |
| A | 90 |
| B | 82 |
| C | 67 |
| D | 50 |
| E | 0 |

The instructor may adjust thresholds in favor of the student, relative to your section of
enrollment. Grades can go up, but not down, based on grading adjustments. Thresholds for plus and
minus grade modifiers will be determined during final grading. There is no guaranteed threshold
for an A+ — it is only awarded for exceptional work at the discretion of the instructors.

!!! danger "Inconsistencies found in the source course missive"
    Two issues in the missive's grading breakdown don't add up and should be resolved by course
    staff before publishing:

    1. **Project checkpoints arithmetic.** The missive states "Project checkpoints (5 points: 5
       projects, 5 points for each project)." Five projects at 5 points each is 25 points, not
       5 — but the missive's own component list only totals to 100 (30+5+6+20+15+20+4) if
       checkpoints are 5 points **total** (i.e. 1 point per project), not 5 points **each**. The
       table above uses the 5-points-total reading so the overall breakdown sums to 100; course
       staff should confirm whether checkpoints are meant to be worth 1 point or 5 points each
       and correct the missive's wording accordingly.
    2. **Checkpoint count vs. schedule.** The missive says checkpoints apply to "5 projects," but
       the [course schedule](../schedule.md) only lists checkpoint events for **4** of the 6
       projects (Project 1: Heapsort; Project 2: Numerical Integration Step Service; Project 3:
       Zero Configuration FK Transforms; Project 4: Function Minimization Service) — there is no
       scheduled checkpoint for Project 5 (Motion Planning) or Project 6 (Best Use of Robotics).
       Either a checkpoint is missing from the schedule, or the grading breakdown should say 4
       projects, not 5.

    Also note the Code Mutation Challenge line item is worded "(20 points: 2 challenges, 10
    points for each **quiz**)" in the source — "quiz" appears to be a copy/paste artifact from
    the adjacent Quizzes line and should read "for each challenge," to avoid confusion with the
    separate Quizzes grading component.

## Late and Regraded Work Policies

### Late Coursework Policy

Do not submit coursework late. The course staff reserves the right to not grade late submission
of a course deliverable. The course instructor reserves the right to decline late submissions
and/or adjust partial credit on regraded coursework. If granted by the course instructor, late
coursework submissions can be graded for partial credit according to the Credit Discounting
Policy.

### Coursework Regrading Policy

The regrading policy allows for submission and regrading of coursework up through the final
grading of projects, which will be **Friday, December 11, 2026** for the Fall 2026 semester
(consistent with the [course schedule](../schedule.md)). Coursework submitted for regrading can
receive partial credit according to the Credit Discounting Policy. No coursework regrading will
be done after grades are finalized.

### Project Features and Maintenance Policy

Grading is specified for each course project and varies based on the number of grading tests
passed and other specified deliverables. Every completed project test must remain working
throughout the completion of the course. If a project feature is broken in a subsequent project
submission (either for regrading or a later project), the completion timing of this deliverable
is reset and subject to the Credit Discounting Policy.

### Credit Discounting Policy

Regraded coursework deliverables and, if granted by the course instructor, late submissions can
be graded for partial credit, with the following discounted credit schedule:

| % Points Earned | Timing of completed coursework deliverable |
| --- | --- |
| 100% | On time, by the specified due date |
| 80% | Before the next programming project due date |
| 60% | Before two programming project due dates |
| 50% | Before the semester final deliverable deadline (December 11, 2026) |

As a reminder, the course instructor reserves the right to decline late submissions and/or adjust
partial credit on regraded assignments.

## Repositories

You are expected to provide a **private** git repository for your work in this course with the
course instructor added as a read/write collaborator. There are many different tutorials for
learning how to use git repositories — the AutoRob course site also has its own basic
[quick start tutorial](../git-tutorial.md).

See the [Collaboration Policy](collaboration.md) for the Michigan Honor License attestation
required in your repository, and the Generative AI Policy governing use of AI tools in this
course.
