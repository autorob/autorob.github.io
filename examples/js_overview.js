/*|\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\
|\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/|
||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/
/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\

    tutorialJSCoding | JavaScript support functions

    Quick JavaScript Code-by-Example Tutorial 
     
    @author ohseejay / https://github.com/ohseejay
                     / https://bitbucket.org/ohseejay

    Chad Jenkins
    Laboratory for Perception RObotics and Grounded REasoning Systems
    University of Michigan

    License: Michigan Honor License 

|\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/|
||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/
/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\
\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/*/


/* Function definition for main JavaScript Tutorial routine, which will be 
   invoked once the body of the document "js_overview.html" is loaded by the
   browser.
*/
function tutorialJSCoding() {

    /*** JAVASCRIPT TUTORIAL: Variables and Data structures ***/

    /* JavaScript variables are implicitly defined upon assignment, without 
       the need for explicit declaration.  Variables are globally scoped by
       default, unless locally scoped using the "var" reserved word at first
       assignment.  Primitive types for JavaScript variables include number, 
       boolean, and string.
    */

    stringGlobal = "this is a global variable";
    var booleanLocal = true;
    numberLocal = 20 - 18;
    
    /* Objects are the core data structure type in JavaScript, consisting of 
         key/value pairs.  Object keys are properties of the object that index 
         into values, stored as variables.  JavaScript variables can be of a 
         primitive type (e.g., "number", "string") or of an object type.
         Other than objects as prototypes, JavaScript does not have an
         explicit notion of classes for its object orientation.
    */

    myObject = {};  // objects can also be created dynamically

    // create object property "university" with an assignment of "Michigan"
    myObject.university = "Michigan"; // this variable is of type "string"

    // equivalent to myObject.department = "EECS";
    myObject["department"] = "EECS"; // this variable is of type "string"

    myObject.course_number = 367;  // this variable is of type "number"

    /* JavaScript has core arithemtic operators following the order of 
         operations.  The "Math" object has additional standard operations.
         For a complete listing of the Math object, open the "browser console"
         and entering "Math".
       IMPORTANT: The "+" operator is overloaded to also concatenate strings
         (e.g, https://www.w3schools.com/js/js_mistakes.asp)
    */

    // this variable is a number with value 367002; "+" operator adds numbers
    myObject.course_number = myObject.course_number * Math.pow(10,3) + 2;  

    // this variable is a string; "+" operator concatenates strings 
    myObject.course_number = Math.floor(myObject.course_number/1000).toString()         + "-" + "00" + (myObject.course_number%1000).toString();  

    /* A property of an object can be index using the key within brackets or 
       after a period.  However, myObject[string_containing_the_word_subject] 
       is not equivalent to  myObject.string_containing_the_word_subject
    */

    var string_containing_the_word_subject = "subject";
    myObject[string_containing_the_word_subject] = "robotics"; 
    myObject.string_containing_the_word_subject = "an irrelevant property"; 


    /*** JAVASCRIPT TUTORIAL: References to objects ***/

    /* JavaScript allows access to variables that are references to JavaScript 
         objects, but not the actual object data structure itself.  As such,
         memory management is handled automatically, which includes garbage 
         collection.  Another convenience is that a reference to an object
         can be copied to another variable through a simple assignment.
         However, such assignments can lead to unexpected behavior if deep 
         copying of the object is assumed.
       Note: the "typeof" operator returns the type of a variable, and also 
         returns "undefined" when a variable does not exist.  
       Note: the equivalence boolean operators are "===" for equals and "!==" 
         for not equals. "==" and "!=" also work, but with less predictability
    */

    // if the variable copiedObject does not already exist
    if (typeof copiedObject === 'undefined') {  

        console.log(myObject);  // check it out on the console  
        console.log(JSON.stringify(myObject));  // same thing as a string  

        /* IMPORTANT!!! 
             objects are not "deep" copied upon assignment.  This assignment 
             will only copy a reference to the same object in memory.  Thus, 
             modifying a property of copiedObject will also modify myObject.
        */

        // these assignments will modify the data structure underlying both
        // copiedObject and myObject
        copiedObject = myObject;
        copiedObject.subject = "autonomous_robotics";  

        /* VERIFY
             - What does myObject.subject report on the console?
             - Inspect "copiedObject.subject" in the console and compare.
        */
    }

    // using our knowledge of references, we can use "autorobObject" instead 
    //   of my Object
    autorobObject = myObject;


    /*** JAVASCRIPT TUTORIAL: Arrays ***/

    /* JavaScript arrays are a special instance of an object data structure
       with numeric keys for indexing and a "length" property 
    */

    var emptyArray = [];  // create an object as an empty array
    myArray = [8, 6, 7, 5, 3, 0, 9]; // create a 7-element array

    // output each element to the console
    var i;  // local variable serving as an iterator through an array
    for (i=0;i<myArray.length;i++) {
        console.log(myArray[i]);  
    }


    /*** JAVASCRIPT TUTORIAL: Dynamic typing ***/

    /* JavaScript does not enforce strict typing of variables.  Thus, the type
         of a variable can changed based on the value last assigned
    */

    // replace the sixth element, currently a number, with a string
    myArray[6] = 'ni-i-i-ine';  

    // store a reference to myArray as a property in autorobObject
    autorobObject.phoneArray = myArray;


    /*** JAVASCRIPT TUTORIAL: The "window" object and global variables ***/

    /* The "window" object maintains the global scope for all variables. The 
         browser maintains a sandboxed run-time environment for each 
         individual web page being displayed.  All global variables are 
         properties of the window object, including myObject.  Other variables
         are scoped locally within a function, object, etc.
    */

    window.autorobObject.instructor = "ocj"; // myObject.instructor === "ocj"


    /*** JAVASCRIPT TUTORIAL: Functions ***/ 

    /* JavaScript functions are a special instance of object that can be 
         invoked with a function a call.  Functions are declared are declared
         using the "function" reserved word. A reference to a function
         object can be assigned by reference to another variable.
    */

    // a simple function that returns the sum of two given numbers
    function sum(a,b) {
       return a+b;
    }

    // function call to add two numbers (can you verify in the console?)
    sumNumber = sum(3,67);  // 70
    sumString = sum("20","18");  // "367"

    /* JavaScript supports recursion such that functions can call themselves.
       Note: a reference to JavaScript function can be assigned to a variable
    */

    fac = function factorialFunction(inputNumber) {
       if (inputNumber > 1) // recursive case
           { return inputNumber * factorialFunction(inputNumber-1); }
       else { return 1; }  //base case
    }

    factorialNumber = fac(6);  // 720


    /* Example: declare a function to print elements myObject to the console 
         as formatted strings and return these strings in an array
    */
    function myFunction(inputObject) {

        // create array that will be returned
        var outputArray = [];

        // Object.keys() method returns an array of top-level keys in an object
        myObjectKeys = Object.keys(inputObject);

        // format and output strings for each key/value element of myObject
        for (i=0;i<myObjectKeys.length;i++) {
            var x = myObjectKeys[i];
            var currentString = "AutoRob " + x + " is " + inputObject[x];
            console.log(currentString);
            outputArray[i] = currentString;
        }

        /* the reserved variable "this" is a reference based on the context
             by which myFunction is invoked.  "this" has been assigned to a 
             member property in the global scope of a longer discussion. 
        */ 

        //console.log(this);
        
        /* even though outputArray is a variable local to this function, the
             underlying data structure will remain and a reference to this
             data structure will be returned.
        */ 

        return outputArray;
    }

    // assign myFunction() function as a property of the autorobObject object
    autorobObject.printCourseInfo = myFunction;

    // invoke myFunction as a member of the autorobObject function
    autorobString = window.myObject.printCourseInfo(window.autorobObject);


    /*** JAVASCRIPT TUTORIAL: The "document" object and the DOM ***/

    /* JavaScript can dynamically modify HTML documents running in a browser
       window environment.  The global variable "document" maintains the 
       Document Object Model (DOM) that stores the HTML document of the web 
       page in a tree data structure.  The document object can be accessed
       from JavaScript to dynamically alter the DOM, and thus the run-time
       version of the web page.  The document object is a property of window.
    */

    // create an empty div HTML element in the DOM
    textbar = document.createElement('div'); 

    // set element style (CSS) parameters of the created element
    textbar.style.position = 'absolute'; 
    textbar.style.top = 70 + 'px';
    textbar.style.left = 10 + 'px';
    textbar.style["font-family"] = "Monospace";
    textbar.style.color = "#ffc90b";
    textbar.style.backgroundColor = "#00234c";
    
    // if you do not see the textbar, try uncommenting this
    textbar.style.zIndex = 1; 

    // add text into the created div HTML element
    textbar.innerHTML = "autorob.org|autorob.online|autorob.github.io";

    // assign an identifier to the created div element
    textbar.id = "textbar";

    // attach the div element to the DOM under the body of the HTML document
    document.body.appendChild(textbar);  

    /* The document.getElementById() method returns a reference to an object
         in the DOM that has the id specified in the input parameter
    */

    // get a reference to the textbar element in the DOM
    textbarReference = document.getElementById("textbar");

    // modify the text of the textbar
    textbarReference.innerHTML += "<br><br>"; // add linespacing
    textbarReference.innerHTML += 
        "--> Please review the tutorialJSCoding() function";

    // output the contents of the autorobString to the textbar
    textbarReference.innerHTML += "<br><br>"; 
    textbarReference.innerHTML += "autorobObject contents:";
    textbarReference.innerHTML += "<br><br>"; 
    for (i=0;i<autorobString.length;i++) {
        textbarReference.innerHTML += autorobString[i];  
        textbarReference.innerHTML += "<br><br>"; 
    }


    /*** JAVASCRIPT TUTORIAL: A few peculiarities of the language ***/

    /* Function not found?
       Unclosed open braces, parentheses, or function definitions in a file 
       can cause the browser to treat this file as missing.  The browser might 
       report an error due to a missing function, but the issue could really 
       be a parsing error arising from an unclosed block.
    */

    // to create an error by ignoring this file and the tutorialJSCoding()
    //   function, uncomment function "fac2" at the bottom of this file 
    //fac2(9);

    // to create an error by ignoring this file and the tutorialJSCoding()
    //   function, uncomment this line by removing the leading "//" chars

    /* Zero is not always 0
       JavaScript represents all numbers in the IEEE 754 floating point
       representation, which can produce imprecise results.
    */

    zeroProbably = 99-1*((0.1*999)-(0.9));  // this should produce 0

    // likely a really really small number that is close enough to 0
    zeroUnlikely = 99-(0.1*999)+(0.9);  

    oneProbably = 1111 - 1110;  // this will produce 1

    // likely around 0.001 that is close enough
    oneThousandthUnlikely = 1.111 - 1.110 ;  

    /* Wat
       https://www.destroyallsoftware.com/talks/wat
    */
    
    emptyString = [] + [];
    objectObject = [] + {}; 
    zeroNumber = {} + [];  // Firefox gave "[object Object]"... wat 
    notaNumber = {} + {};
    watMan = Array(16).join("wat" - 1) + " Batman!"; 
    textbarReference.innerHTML += Array(100).join("<br><br>") + watMan; 
  
}


/* Uncommenting the fac2 function below would misaligned braces and could 
   produce the following error:  
     "ReferenceError: tutorialJSCoding is not defined" 
*/

/*
fac2 = function factorial2(inputNumber) {
   if (inputNumber > 1) 
       { 
           return inputNumber * factorial2(inputNumber-1);  
       // } <-- a closing brace taht should be here for the if clause
   else { return 1; } 
}
*/

