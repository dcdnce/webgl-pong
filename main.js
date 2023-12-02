import Shader from './Shader.js';
import Paddle from './Paddle.js';
import Mesh from './Mesh.js';
import Vertex from './Vertex.js';
import { Vec2, Vec3 } from './Vector.js';

let gl = null;
let glCanvas = null;

// Aspect ratio and coordinate system
let aspectRatio;
let currentRotation = [0, 1];
let currentScale = [1.0, 1.0];

// Vertex information
let mesh;
let paddle;
let vertices = [];
let indices = [];
let currVertex;

// Rendering data shared with the scaler
let uScalingFactor;
let uRotationVector;

// Animation timing
let currentAngle;
let previousTime = 0.0;
let degreesPerSecond = 90.0;

// Fonction a executer lorsque la page charge
window.addEventListener("load", init, false);

async function init() {
	glCanvas = document.getElementById("glcanvas");
	gl = glCanvas.getContext("webgl");

	aspectRatio = glCanvas.width / glCanvas.height;
	currentRotation = [0, 1];
	currentScale = [1.0, aspectRatio];

	paddle = new Paddle(0.05, 0.2, new Vec2(0., 0.), new Vec3(1.0, 0.5, 0.0));	
	await paddle.setup()
	
	currentAngle = 0.0;

	drawLoop();
}

function drawLoop() {
	gl.viewport(0, 0, glCanvas.width, glCanvas.height);
	gl.clearColor(0.8, 0.9, 1.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);

	const radians = (currentAngle * Math.PI) / 180.0;
	currentRotation[0] = Math.sin(radians);
	currentRotation[1] = Math.cos(radians);

	gl.useProgram(paddle.attachedShader.program);

	uScalingFactor = gl.getUniformLocation(paddle.attachedShader.program, "uScalingFactor");
	uRotationVector = gl.getUniformLocation(paddle.attachedShader.program, "uRotationVector");
	gl.uniform2fv(uScalingFactor, currentScale);
	gl.uniform2fv(uRotationVector, currentRotation);

	paddle.draw();

	requestAnimationFrame((currentTime) => {
		const deltaAngle =
			((currentTime - previousTime) / 1000.0) * degreesPerSecond;

		currentAngle = (currentAngle + deltaAngle) % 360;

		previousTime = currentTime;
		drawLoop();
	});
}

export default gl;