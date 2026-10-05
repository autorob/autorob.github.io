# Robot descriptions: URDF, the Project 3 input format

A Project 3 robot description is the text of a real, flat URDF file: an XML document whose
root element is `<robot>`. It reaches student code as one JSON string, the value of the
`robot_description` parameter, set with `/param_server/set_param` and read by
`robot_state_publisher` with `/param_server/get_param` (`spec/FK_API.md`). Students parse the
XML themselves. Each starter ships a course-supplied XML parser as vendored source, which a
student MAY use or replace (see the starter READMEs). XML plumbing is not the learning objective;
interpreting URDF is.

A description is the URDF exactly as a robot ships it, unmodified. Real robot URDFs, such as
the PR2's, are valid descriptions, so the real-world XML variation listed below is required,
not optional.

The rules here follow the course's reference parser (the lecture code). Where that parser's
behavior on an input has no sensible meaning (duplicate names, a zero axis, `nan`), the input
is UNSPECIFIED: you may do anything except crash or hang.

Keywords MUST, MUST NOT, MAY, UNSPECIFIED, and OUT OF SCOPE are used as in the Project 2 specs.

## Example

```xml
<?xml version="1.0"?>
<robot name="two_link_arm" xmlns:xacro="http://www.ros.org/wiki/xacro">
  <!-- links may come before or after the joints that use them -->
  <link name="base_link"/>
  <joint name="shoulder" type="revolute">
    <parent link="base_link"/>
    <child link="upper_arm"/>
    <origin xyz="0 0 0.1" rpy="0 0 0"/>
    <axis xyz="0 0 1"/>
    <limit lower="-3.14" upper="3.14" effort="10" velocity="1"/>
  </joint>
  <link name="upper_arm">
    <visual><geometry><cylinder radius="0.05" length="0.5"/></geometry></visual>
  </link>
  <joint name="elbow_mount" type="fixed">
    <parent link="upper_arm"/>
    <child link="forearm"/>
    <origin xyz="0.5 0 0" rpy="0 1.5707963267948966 0"/>
  </joint>
  <link name="forearm"/>
  <gazebo reference="forearm"><material>Gazebo/Grey</material></gazebo>
</robot>
```

## What is read

Only these parts of the document have meaning. Everything else MUST be ignored.

| Element / attribute | Required | Meaning |
|---|---|---|
| `<robot name="...">` | root element MUST be `robot` | `name` MAY be absent; it defaults to `"robot"`. No required output depends on it. |
| `<link name="...">` | at least one | A **direct child** of `<robot>`. A `<link>` with no `name` attribute MUST be rejected. |
| `<link>` → first `<visual>` | MAY be absent | Read for display only (see "Visual geometry"). It does not affect FK, but an invalid first `<visual>` MUST be rejected. |
| `<joint name="..." type="...">` | MAY be none | A **direct child** of `<robot>`. A joint with no `name` or no `type` attribute MUST be rejected. |
| `<joint>` → `<parent link="..."/>`, `<child link="..."/>` | MUST | Direct children of the joint. `link` MUST name a link of the robot. |
| `<joint>` → `<origin xyz="x y z" rpy="r p y"/>` | MAY be absent | A missing `<origin>`, `xyz`, or `rpy` means all zeros, as in URDF. |
| `<joint>` → `<axis xyz="x y z"/>` | MAY be absent | Defaults to `1 0 0`, as in URDF, and so does an `<axis>` with no `xyz`. Ignored for `fixed` joints, but a malformed `xyz` is still rejected. |
| `<joint>` → `<limit lower="..." upper="..."/>` | MUST for `revolute` and `prismatic` | A `revolute` or `prismatic` joint with no `<limit>` element MUST be rejected. A missing `lower` or `upper` means `0`; a present one MUST be a number. The limit is informational: FK MUST NOT clamp to it (`spec/FK_API.md`). For `continuous` and `fixed` joints `<limit>` is ignored entirely, even if malformed. |

"Direct child" is exact. `<link>` and `<joint>` elements nested anywhere else are not links
or joints of the robot, and MUST be ignored. Real URDFs contain such nested elements: PR2 has
hollow `<joint name="...">` elements inside `<gazebo>` and `<transmission>` blocks.

UNSPECIFIED: a `<joint>` with more than one `<parent>`, `<child>`, `<origin>`, `<axis>` or
`<limit>`; empty or whitespace-only names; namespaced elements such as `<xacro:link>`.

### Numbers

`xyz`, `rpy`, `axis xyz`, and the vector attributes of visual geometry each hold exactly three
numbers, separated by XML whitespace (space, tab, CR, LF) of any length, with optional leading
and trailing whitespace. A present attribute with any other count (`"1 2"`, `"1 2 3 4"`, `""`,
`"0,0,1"`) MUST be rejected.

A number MUST be accepted if it is a finite decimal literal matching
`[+-]?([0-9]+(\.[0-9]*)?|\.[0-9]+)([eE][+-]?[0-9]+)?`, for example `1`, `-0.5`, `.25`, `3.`,
`+1`, `1.5e-1`, `-2E+0`. A literal that underflows (`1e-400`) is `0`. A token that is plainly not
a number (`two`, `x`, `1_000`, `0,5`) MUST be rejected. UNSPECIFIED: hexadecimal floats,
`nan`, `inf`, `infinity`, and literals that overflow (`1e999`).

### Visual geometry

Only a link's **first** `<visual>` is read. Later ones have no effect; whether an invalid later
`<visual>` is rejected is UNSPECIFIED. If present, the first one MUST contain a `<geometry>`
with one of these shapes, or the description MUST be rejected:

| Shape | Required attributes |
|---|---|
| `<box size="x y z"/>` | `size`, three numbers |
| `<cylinder radius="r" length="l"/>` | `radius` and `length`, numbers |
| `<sphere radius="r"/>` | `radius`, a number |
| `<mesh filename="..." scale="x y z"/>` | `filename`; `scale` is optional, three numbers if present |

A `<visual>` MAY carry an `<origin>` (same rules as a joint's) and a `<material>` (ignored by
the graded runtime). Any other shape (for example `<capsule>`) or an empty `<geometry>` MUST be
rejected. Visual geometry never changes `/tf` or `/xform_world`; it exists so a viewer, such as the
one you build for your portfolio, can draw the robot. `<collision>` and `<inertial>` are ignored in Project 3.

### XML features a description MAY use (and a conforming runtime MUST accept)

The description is well-formed XML 1.0 in UTF-8. Real URDFs use all of the following:

- leading whitespace before the first `<`;
- an XML declaration (`<?xml version="1.0" encoding="UTF-8"?>`), and processing instructions;
- comments anywhere, including comments that contain markup such as `<joint name="x">`;
- namespace declarations on `<robot>`, such as `xmlns:xacro="..."` or a default `xmlns="..."`.
  A flat URDF that merely carries them MUST load. Unexpanded xacro is OUT OF SCOPE;
- single- or double-quoted attribute values;
- the predefined entities (`&amp; &lt; &gt; &quot; &apos;`) and numeric character references
  (`&#10;`, `&#x41;`) in attribute values and text. Names are compared after this decoding;
- CDATA sections (typically inside `<gazebo>`);
- self-closing (`<origin .../>`) and paired (`<origin ...></origin>`) tags;
- CRLF line endings, and any whitespace between elements and inside numeric attributes;
- unknown elements and attributes, at any depth: `<gazebo>`, `<transmission>`, `<material>`,
  `<mimic>`, `<safety_controller>`, `<calibration>`, `<dynamics>`, `<collision>`,
  `<inertial>`, and so on;
- links with no `<visual>`, and joints that appear before the links they reference.

UNSPECIFIED (the course references may reject them): a leading byte-order mark (U+FEFF), any
`<!DOCTYPE>`, an undeclared namespace prefix, and an entity reference other than the predefined
ones. Text whose first non-whitespace character is `{` (the course's JSON robot format, JRDF) is
OUT OF SCOPE.

### Size

A description MAY be large. Real robots ship URDFs of 100 KB and more (PR2 is 103,573
bytes). A runtime MUST accept a description whose `set_param` request line, and the
`get_param` reply that carries it back, are up to 1 MiB each, which is well inside the 4 MiB
line limit of `spec/ROSBRIDGE_PROTOCOL.md`. This includes the student's own gateway and every
node-to-node connection.

## Kinematic semantics (URDF conventions, restated)

- **`rpy`** is fixed-axis roll-pitch-yaw: `R = Rz(yaw) · Ry(pitch) · Rx(roll)`. Equivalently,
  the frame is rotated about the fixed parent X axis by roll, then fixed Y by pitch, then
  fixed Z by yaw.
- **Joint local transform** is `T_joint(q) = T_origin · T_motion(q)`, where
  `T_origin = Trans(xyz) · Rot(rpy)` is expressed in the parent link's frame.
- **`T_motion(q)`** depends on the joint type:
  - `revolute` and `continuous`: rotation by `q` radians about the joint axis **normalized to
    unit length**, expressed in the joint frame (after `T_origin`). A revolute axis MAY be
    non-unit, such as `0 0 2` or `1 1 0`.
  - `prismatic`: translation by `q · axis` in the joint frame, with the axis **as written,
    not normalized**. An axis of `2 0 0` at `q = 0.7` moves `1.4` m. (This matches the course
    reference; real URDFs use unit axes, where the two readings agree.)
  - `fixed`: identity.
- **The child link's frame** is the joint frame after motion, so a link's pose relative to its
  parent link is exactly `T_joint(q)`.
- **The root link** is the unique link that is no joint's child. The description does not name
  the root; implementations MUST determine it. It is often not the first `<link>` in the
  document.
- **`<mimic>`** is ignored: a mimic joint is driven like any other joint, by its own name.

## Validity (what MUST be rejected)

A rejected description is ignored: the previous robot stays loaded and the rejection is
reported through the description status (`spec/FK_API.md`). A description MUST be rejected if
any of the following holds:

1. The parameter value is not a JSON string, is empty or whitespace-only, or is not
   well-formed XML; or the root element is not `<robot>`.
2. `<robot>` has no direct-child `<link>`.
3. A link has no `name` attribute. A joint has no `name` or `type` attribute, or no `<parent>`
   or `<child>` element with a `link` attribute.
4. A joint's `type` is not exactly one of `revolute`, `continuous`, `prismatic`, or `fixed`.
   This covers URDF's `floating` and `planar` (OUT OF SCOPE), unknown types, and case variants
   such as `Revolute`.
5. A joint's parent or child is not a link of the robot.
6. The robot does not have exactly one root: every link is some joint's child (no root), or two
   or more links are no joint's child.
7. A `revolute` or `prismatic` joint has no `<limit>`, or a present `lower`/`upper` is not a
   number.
8. A present vector attribute (`origin xyz`, `origin rpy`, `axis xyz`, visual vectors) does not
   hold exactly 3 numbers, or any number attribute is not a number (see "Numbers").
9. A link's first `<visual>` is invalid (see "Visual geometry").

UNSPECIFIED, because they have no well-defined FK (the lecture code accepts most of them and the
course references reject them; your runtime MUST NOT crash or hang on them): duplicate link or
joint names; a joint whose parent equals its child; a link that is the child of two joints; a
cycle (reachable from the root or not) when exactly one root exists; a zero-length or non-finite
axis on a `revolute`, `continuous` or `prismatic` joint; non-finite numbers. A `fixed` joint's
axis is ignored, so `axis xyz="0 0 0"` on a fixed joint (Fetch and H2D ship it) MUST be
accepted.

The error text is UNSPECIFIED. A description that passes every check above and uses no
UNSPECIFIED input MUST be accepted.

OUT OF SCOPE: xacro expansion, `mimic` behavior, `floating` and `planar` joints, the content
of `<gazebo>` and `<transmission>`, mesh loading and `package://` resolution, JRDF, and
multiple robots at once.
