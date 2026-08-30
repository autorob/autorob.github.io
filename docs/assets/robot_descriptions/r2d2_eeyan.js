links_geom_imported = false;

//////////////////////////////////////////////////
/////     DEFINE ROBOT AND LINKS
//////////////////////////////////////////////////

// create robot data object
robot = new Object(); // or just {} will create new object

// give the robot a name
robot.name = "r2d2";

// initialize start pose of robot in the world
robot.origin = {xyz: [0,0,0], rpy:[0,0,0]};  

// specify base link of the robot; robot.origin is transform of world to the robot base
robot.base = "base";  

// specify and create data objects for the links of the robot
robot.links = {
    "base": {},  
    "right_leg": {}, 
    "right_base": {},
    "right_front_wheel": {},
    "right_back_wheel": {},
    "left_leg": {},
    "left_base": {},
    "left_front_wheel": {},
    "left_back_wheel": {},
    "gripper_pole": {},
    "right_gripper": {},
    "left_gripper": {},
    "head": {},
    "head_box": {}
};

//////////////////////////////////////////////////
/////     DEFINE JOINTS AND KINEMATIC HIERARCHY
//////////////////////////////////////////////////

/*      joint definition template
        // specify parent/inboard link and child/outboard link
        robot.joints.joint1 = {parent:"link1", child:"link2"};
        // joint origin's offset transform from parent link origin
        robot.joints.joint1.origin = {xyz: [5,3,0], rpy:[0,0,0]}; 
        // joint rotation axis
        robot.joints.joint1.axis = [0.0,0.0,1.0]; 
*/

// specify and create data objects for the joints of the robot
robot.joints = {};

robot.joints.base_to_right_leg = {parent:"base", child:"right_leg"};
robot.joints.base_to_right_leg.origin = {xyz: [0.4,1,0], rpy: [0,0,0]};
robot.joints.base_to_right_leg.axis = [1.0,0.0,0.0]; 

robot.joints.right_base_joint = {parent:"right_leg", child:"right_base"};
robot.joints.right_base_joint.origin = {xyz: [0.1,-0.7,0], rpy: [0,0,0]};
robot.joints.right_base_joint.axis = [1.0,0.0,0.0]; 

robot.joints.right_front_wheel_joint = {parent:"right_base", child:"right_front_wheel"};
robot.joints.right_front_wheel_joint.origin = {xyz: [0,-0.25,0.2], rpy: [0,0,0]};
robot.joints.right_front_wheel_joint.axis = [1.0,0.0,0.0];

robot.joints.right_back_wheel_joint = {parent:"right_base", child:"right_back_wheel"};
robot.joints.right_back_wheel_joint.origin = {xyz: [0,-0.25,-0.2], rpy: [0,0,0]};
robot.joints.right_back_wheel_joint.axis = [1.0,0.0,0.0];

robot.joints.base_to_left_leg = {parent:"base", child:"left_leg"};
robot.joints.base_to_left_leg.origin = {xyz: [-0.4,1,0], rpy: [0,0,0]};
robot.joints.base_to_left_leg.axis = [1.0,0.0,0.0]; 

robot.joints.left_base_joint = {parent:"left_leg", child:"left_base"};
robot.joints.left_base_joint.origin = {xyz: [-0.1,-0.7,0], rpy: [0,0,0]};
robot.joints.left_base_joint.axis = [1.0,0.0,0.0];

robot.joints.left_front_wheel_joint = {parent:"left_base", child:"left_front_wheel"};
robot.joints.left_front_wheel_joint.origin = {xyz: [0,-0.25,0.2], rpy: [0,0,0]};
robot.joints.left_front_wheel_joint.axis = [1.0,0.0,0.0];

robot.joints.left_back_wheel_joint = {parent:"left_base", child:"left_back_wheel"};
robot.joints.left_back_wheel_joint.origin = {xyz: [0,-0.25,-0.2], rpy: [0,0,0]};
robot.joints.left_back_wheel_joint.axis = [1.0,0.0,0.0]; 

robot.joints.gripper_extension = {parent:"base", child:"gripper_pole"};
robot.joints.gripper_extension.origin = {xyz: [0,1.2,0.3], rpy: [0,0,0]};
robot.joints.gripper_extension.axis = [0.0,0.0,1.0];

robot.joints.right_gripper_joint = {parent:"gripper_pole", child:"right_gripper"};
robot.joints.right_gripper_joint.origin = {xyz: [0,0,0.6], rpy: [0,0,0]};
robot.joints.right_gripper_joint.axis = [0.0,1.0,0.0];

robot.joints.left_gripper_joint = {parent:"gripper_pole", child:"left_gripper"};
robot.joints.left_gripper_joint.origin = {xyz: [0,0,0.6], rpy: [0,0,0]};
robot.joints.left_gripper_joint.axis = [0.0,1.0,0.0];

robot.joints.head_swivel = {parent:"base", child:"head"};
robot.joints.head_swivel.origin = {xyz: [0,1.52,0], rpy: [0,0,0]};
robot.joints.head_swivel.axis = [0.0,1.0,0.0];

robot.joints.head_box_joint = {parent:"head", child:"head_box"};
robot.joints.head_box_joint.origin = {xyz:[0,0.15,0.25], rpy: [-Math.PI/6,0,0]};
robot.joints.head_box_joint.axis = [0.0,0.0,1.0];

// specify name of endeffector frame
robot.endeffector = {};
robot.endeffector.frame = "head_swivel";
robot.endeffector.position = [[0],[0],[0.5],[0.5]];

//////////////////////////////////////////////////
/////     DEFINE LINK threejs GEOMETRIES
//////////////////////////////////////////////////

links_geom = {};
var transform;

links_geom["base"] = new THREE.CylinderGeometry( 0.4, 0.4, 1.2, 30 );
links_geom["base"].applyMatrix( new THREE.Matrix4().makeTranslation(0, 0.9, 0) );

links_geom["right_leg"] = new THREE.CubeGeometry( 0.2, 1.2, 0.4 );
links_geom["right_leg"].applyMatrix( new THREE.Matrix4().makeTranslation( 0.1, -0.2, 0 ) );

links_geom["right_base"] = new THREE.CubeGeometry( 0.2, 0.2, 0.8 );
links_geom["right_base"].applyMatrix( new THREE.Matrix4().makeTranslation( 0, -0.15, 0 ) );

links_geom["right_front_wheel"] = new THREE.CylinderGeometry( 0.1, 0.1, 0.1, 30 );
links_geom["right_front_wheel"].applyMatrix( new THREE.Matrix4().makeRotationZ(Math.PI/2) );

links_geom["right_back_wheel"] = new THREE.CylinderGeometry( 0.1, 0.1, 0.1, 30 );
links_geom["right_back_wheel"].applyMatrix( new THREE.Matrix4().makeRotationZ(Math.PI/2) );

links_geom["left_leg"] = new THREE.CubeGeometry( 0.2, 1.2, 0.4 );
links_geom["left_leg"].applyMatrix( new THREE.Matrix4().makeTranslation( -0.1, -0.2, 0 ) );

links_geom["left_base"] = new THREE.CubeGeometry( 0.2, 0.2, 0.8 );
links_geom["left_base"].applyMatrix( new THREE.Matrix4().makeTranslation( 0, -0.15, 0 ) );

links_geom["left_front_wheel"] = new THREE.CylinderGeometry( 0.1, 0.1, 0.1, 30 );
links_geom["left_front_wheel"].applyMatrix( new THREE.Matrix4().makeRotationZ(Math.PI/2) );

links_geom["left_back_wheel"] = new THREE.CylinderGeometry( 0.1, 0.1, 0.1, 30 );
links_geom["left_back_wheel"].applyMatrix( new THREE.Matrix4().makeRotationZ(Math.PI/2) );

links_geom["gripper_pole"] = new THREE.CylinderGeometry( 0.02, 0.02, 0.6  , 20 );
transform = new THREE.Matrix4().makeTranslation(0, 0, 0.4);
transform = transform.multiply( new THREE.Matrix4().makeRotationX(Math.PI/2) );
links_geom["gripper_pole"].applyMatrix( transform );

links_geom["right_gripper"] = new THREE.CylinderGeometry( 0.1, 0.1, 0.04, 30, 30, false, 0, Math.PI );
transform = new THREE.Matrix4().makeTranslation(0.04, 0, 0.16);
transform = transform.multiply( new THREE.Matrix4().makeRotationY(Math.PI/6) );
links_geom["right_gripper"].applyMatrix( transform );

links_geom["left_gripper"] = new THREE.CylinderGeometry( 0.1, 0.1, 0.04, 30, 30, false, 0, Math.PI );
transform = new THREE.Matrix4().makeTranslation(-0.04, 0, 0.16);
transform = transform.multiply( new THREE.Matrix4().makeRotationY(-Math.PI/6) );
transform = transform.multiply( new THREE.Matrix4().makeRotationZ(Math.PI) );
links_geom["left_gripper"].applyMatrix( transform );

links_geom["head"] = new THREE.SphereGeometry( 0.4, 30, 30, 0, 2*Math.PI, 0, Math.PI/2 );
links_geom["head"].applyMatrix( new THREE.Matrix4().makeTranslation( 0, 0, 0 ) );

links_geom["head_box"] = new THREE.CubeGeometry( 0.16, 0.16, 0.16 );
transform = new THREE.Matrix4().makeTranslation( 0, 0, 0.1 );
transform = transform.multiply( new THREE.Matrix4().makeRotationX(Math.PI/6) );
links_geom["head_box"].applyMatrix( transform );