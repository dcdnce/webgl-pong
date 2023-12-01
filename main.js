import Shader from './Shader.js';

let gl = null;
let glCanvas = null;

// Aspect ratio and coordinate system
let aspectRatio;
let currentRotation = [0, 1];
let currentScale = [1.0, 1.0];

// Vertex information
let vertices;
let vertexBuffer;
let vertexNumComponents;
let vertexCount;

// Rendering data shared with the scaler
let shader = new Shader();
let uScalingFactor;
let uGlobalColor;
let uRotationVector;
let aVertexPosition;

// Animation timing
let currentAngle;
let previousTime = 0.0;
let degreesPerSecond = 90.0;

function animateScene() {
	gl.viewport(0, 0, glCanvas.width, glCanvas.height);
	gl.clearColor(0.8, 0.9, 1.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);
  
	const radians = (currentAngle * Math.PI) / 180.0;
	currentRotation[0] = Math.sin(radians);
	currentRotation[1] = Math.cos(radians);
  
	gl.useProgram(shader.program);
  
	uScalingFactor = gl.getUniformLocation(shader.program, "uScalingFactor");
	uGlobalColor = gl.getUniformLocation(shader.program, "uGlobalColor");
	uRotationVector = gl.getUniformLocation(shader.program, "uRotationVector");
	gl.uniform2fv(uScalingFactor, currentScale);
	gl.uniform2fv(uRotationVector, currentRotation);
	gl.uniform4fv(uGlobalColor, [0.1, 0.7, 0.2, 1.0]);
  
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  
	aVertexPosition = gl.getAttribLocation(shader.program, "aVertexPosition");
  
	gl.enableVertexAttribArray(aVertexPosition);
	gl.vertexAttribPointer(
	  aVertexPosition,
	  vertexNumComponents,
	  gl.FLOAT,
	  false,
	  0,
	  0,
	);
  
	gl.drawArrays(gl.TRIANGLES, 0, vertexCount);
  
	requestAnimationFrame((currentTime) => {
	  const deltaAngle =
		((currentTime - previousTime) / 1000.0) * degreesPerSecond;
  
	  currentAngle = (currentAngle + deltaAngle) % 360;
  
	  previousTime = currentTime;
	  animateScene();
	});
  }
  
// Fonction a executer lorsque la page charge
window.addEventListener("load", startup, false);

async function startup() {
  glCanvas = document.getElementById("glcanvas");
  gl = glCanvas.getContext("webgl");

  const shaderSet = [
    {
      type: gl.VERTEX_SHADER,
      filePath: "./vs.glsl",
    },
    {
      type: gl.FRAGMENT_SHADER,
      filePath: "./fs.glsl",
    },
  ];

  await shader.buildShaderProgram(shaderSet);

  aspectRatio = glCanvas.width / glCanvas.height;
  currentRotation = [0, 1];
  currentScale = [1.0, aspectRatio];

  vertices = new Float32Array([
    -0.5, 0.5, 0.5, 0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5, -0.5, -0.5,
  ]);

  vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  // Link 
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

  vertexNumComponents = 2;
  vertexCount = vertices.length / vertexNumComponents;

  currentAngle = 0.0;

  animateScene();
}

export default gl;