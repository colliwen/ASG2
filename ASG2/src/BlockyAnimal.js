// From ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  void main() {
    gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
  }`

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  uniform vec4 u_FragColor;
  void main() {
    gl_FragColor = u_FragColor;
  }`

// Global Variables
let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_Size;
let u_ModelMatrix;

function setUpWebGL() {
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  //gl = getWebGLContext(canvas);
  gl = canvas.getContext("webgl", { preserveDrawingBuffer: true});
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  gl.enable(gl.DEPTH_TEST);
}

function connectVariablesToGLSL() {
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }

  //Get the storage location of u_GlobalRotateMatrix
  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
  if (!u_GlobalRotateMatrix) {
    console.log('Failed to get the storage location of u_GlobalRotateMatrix');
    return;
  }
  
  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
}

// Constants
const POINT = 0;
const TRIANGLE = 1;
//const Circle = -2;

// Globals related to UI elements
let g_selectedColor=[1.0,1.0,1.0,1.0];
let g_selectedSize=5;
let g_selectedType=POINT;
let g_globalAngle=0;

//Set up actions for the HTML UI elementsfunction addActionsForHtmlUI() {
function addActionsForHtmlUI() {
  //Angle Slider Events
  document.getElementById('angleSlide').addEventListener('mousemove', function() { g_globalAngle = this.value; renderAllShapes(); });

  document.getElementById('headSlide').addEventListener('mousemove', function() { g_headAngle = this.value; renderAllShapes(); });
}

function main() {
  setUpWebGL();
  connectVariablesToGLSL();

  //Set up actions for the HTML UI elements
  addActionsForHtmlUI();
  
  
  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  renderAllShapes();
}



//Draw every shape that is supposed to be in the canvas
function renderAllShapes() {
  var startTime = performance.now();
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  
  // Pass the matri to u_ModelMatrix attribute
  var globalRotMat=new Matrix4().rotate(g_globalAngle,0,1,0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);
  
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Draw test Triangle
  //drawTriangle3D( [-1.0,0.0,0.0, -0.5,-1.0,0.0, 0.0,0.0,0.0] );
  
  // Draw the goat's body
  var body = new Cube();
  body.color = [0.8, 0.8, 0.7, 1.0]; // Light brown/grayish for goat fur
  body.matrix.translate(-0.55, -0.4, 0.0);
  body.matrix.scale(1, 0.3, 0.3);
  body.render();
  
  
  
  // Draw the front left leg
  var frontLeftLeg = new Cube();
  frontLeftLeg.color = [0.6, 0.5, 0.4, 1.0]; // Darker shade for legs
  frontLeftLeg.matrix.translate(-0.25, -0.7, 0.1);
  frontLeftLeg.matrix.scale(0.1, 0.3, 0.1);
  frontLeftLeg.render();
  
  // Draw the front right leg
  var frontRightLeg = new Cube();
  frontRightLeg.color = [0.6, 0.5, 0.4, 1.0];
  frontRightLeg.matrix.translate(0.15, -0.7, 0.1);
  frontRightLeg.matrix.scale(0.1, 0.3, 0.1);
  frontRightLeg.render();
  
  // Draw the back left leg
  var backLeftLeg = new Cube();
  backLeftLeg.color = [0.6, 0.5, 0.4, 1.0];
  backLeftLeg.matrix.translate(-0.25, -0.7, -0.1);
  backLeftLeg.matrix.scale(0.1, 0.3, 0.1);
  backLeftLeg.render();
  
  // Draw the back right leg
  var backRightLeg = new Cube();
  backRightLeg.color = [0.6, 0.5, 0.4, 1.0];
  backRightLeg.matrix.translate(0.15, -0.7, -0.1);
  backRightLeg.matrix.scale(0.1, 0.3, 0.1);
  backRightLeg.render();
  
  // Draw the left horn
  var leftHorn = new Cube();
  leftHorn.color = [0.3, 0.3, 0.3, 1.0]; // Darker gray horns
  leftHorn.matrix.translate(-0.5, 0, 0.05);
  leftHorn.matrix.scale(0.08, 0, 0.08);
  leftHorn.matrix.rotate(-10, 0, 0, 1);
  leftHorn.render();
  
  
  // Draw the tail
  var tail = new Cube();
  tail.color = [0.8, 0.8, 0.7, 1.0];
  tail.matrix.translate(-0.3, -0.2, 0.0);
  tail.matrix.scale(0.1, 0.15, 0.1);
  tail.render();

  // Draw the goat's head
  var head = new Cube();
  head.color = [0.8, 0.8, 0.7, 1.0];
  head.matrix.translate(0.15, -0.1, 0.0);
  head.matrix.scale(0.3, 0.25, 0.3);
  head.matrix.rotate(-g_headAngle, 0,0,1);
  head.render();

  // Draw the right horn
  var rightHorn = new Cube();
  rightHorn.color = [0.3, 0.3, 0.3, 1.0];
  rightHorn.matrix = head.matrix;
  rightHorn.matrix.translate(0.3, 0.13, 0.05);
  rightHorn.matrix.scale(0.08, 0.2, 0.08);
  rightHorn.matrix.rotate(10, 0, 0, 1);
  rightHorn.render();

  var duration = performance.now() - startTime;
  sendTextToHTML(" ms:" + Math.floor(duration) + " fps: " + Math.floor(1000/duration), "numdot");

}

// Set the text of a HTML element
function sendTextToHTML(text, htmlID) {
  var htmlElm = document.getElementById(htmlID);
  if (!htmlElm) {
    console.log("Failed to get " + htmlID + " from HTML");
    return;
  }
  htmlElm.innerHTML = text;
}
