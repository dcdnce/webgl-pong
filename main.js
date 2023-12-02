import Paddle from './Paddle.js';
import { Vec3 } from './Vector.js';
import Ball from './Ball.js';
import { upKeyPressed, downKeyPressed } from './Event.js';

let gl = null;
let glCanvas = null;

// Aspect ratio and coordinate system
let aspectRatio;
let currentScale = [1.0, 1.0];

// Vertex information
let paddle;

// Rendering data shared with the scaler
let uScalingFactor;

// Animation timing
let previousTime = 0.0;

// Fonction a executer lorsque la page charge
window.addEventListener("load", init, false);

async function init() {
	glCanvas = document.getElementById("glcanvas");
	gl = glCanvas.getContext("webgl");

	aspectRatio = glCanvas.width / glCanvas.height;
	currentScale = [1.0, aspectRatio];

	paddle = new Ball(0.1, 4, new Vec3(0., 0., 0.));
	await paddle.setup()
	
	drawLoop();
}

function drawLoop() {
	gl.viewport(0, 0, glCanvas.width, glCanvas.height);
	gl.clearColor(0.8, 0.9, 1.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(paddle.attachedShader.program);

    uScalingFactor = gl.getUniformLocation(paddle.attachedShader.program, "uScalingFactor");
    gl.uniform2fv(uScalingFactor, currentScale);

    paddle.draw();

	// Delta time
    const currentTime = performance.now();
    const deltaTime = (currentTime - previousTime) / 1000.0;
    previousTime = currentTime;

	//Events
    if (upKeyPressed) {
        paddle.moveUp(deltaTime);
    }
    if (downKeyPressed) {
        paddle.moveDown(deltaTime);
    }

    requestAnimationFrame(drawLoop);
}

export default gl;