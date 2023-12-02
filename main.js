import { Vec3, Vec2 } from './Vector.js';
import Ball from './Ball.js';
import { upKeyPressed, downKeyPressed } from './Event.js';

let gl = null;
let glCanvas = null;

// Aspect ratio and coordinate system
let aspectRatio;
let currentScale = [1.0, 1.0];

// Vertex information
let ball;

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

    ball = new Ball(0.05, 4, new Vec3(0., 0., 0.));
    await ball.setup()

    drawLoop();
}

function drawLoop() {
    gl.viewport(0, 0, glCanvas.width, glCanvas.height);
    gl.clearColor(0.8, 0.9, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(ball.attachedShader.program);

    uScalingFactor = gl.getUniformLocation(ball.attachedShader.program, "uScalingFactor");
    gl.uniform2fv(uScalingFactor, currentScale);

    ball.draw();

    // Delta time
    const currentTime = performance.now();
    const deltaTime = (currentTime - previousTime) / 1000.0;
    previousTime = currentTime;

    //Events
    // if (upKeyPressed) {
    //     ball.moveUp(deltaTime);
    // }
    // if (downKeyPressed) {
    //     ball.moveDown(deltaTime);
    // }

    // Collisions
    collisionWithWall(ball);

    // Update positions
    ball.updatePosition(deltaTime);

    requestAnimationFrame(drawLoop);
}

function collisionWithWall(ball) {
    if ((ball._uBallPosition.x - ball.radius) * currentScale[0] < -1)
    {
        ball.direction.x = Math.abs(ball.direction.x);
        ball.acceleration += 0.01;
    }

    if ((ball._uBallPosition.x + ball.radius) * currentScale[0] > 1.)
    {
        ball.direction.x = -Math.abs(ball.direction.x);
        ball.acceleration += 0.01;
    }

    if ((ball._uBallPosition.y + ball.radius) * currentScale[1] > 1.)
    {
        ball.direction.y = -Math.abs(ball.direction.y);
        ball.acceleration += 0.01;
    }

    if ((ball._uBallPosition.y - ball.radius) * currentScale[1] < -1.)
    {
        ball.direction.y = Math.abs(ball.direction.y);
        ball.acceleration += 0.01;
    }
}

export default gl;