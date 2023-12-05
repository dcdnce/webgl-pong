import { Vec3, Vec2 } from './Vector.js';
import Ball from './Ball.js';
import Paddle from './Paddle.js'

let gl = null;
let glCanvas = null;

// Aspect ratio and coordinate system
let aspectRatio;
let currentScale = [1.0, 1.0];

// Entities
let ball;
let player;

// Rendering data shared with the scaler
let uScalingFactor;

// Animation timing
let previousTime = 0.0;

window.addEventListener("load", init, false);

async function init() {
    glCanvas = document.getElementById("glcanvas");
    gl = glCanvas.getContext("webgl");

    aspectRatio = glCanvas.width / glCanvas.height;
    currentScale = [1.0, aspectRatio];

    player = new Paddle(0.01, 0.1, new Vec3(0., 0., 0.), new Vec2(-0.9, -0.9));
    await player.setup();
    ball = new Ball(0.02, 1, new Vec3(0., 0., 0.));
    await ball.setup()

    drawLoop();
}

function drawLoop() {
    gl.viewport(0, 0, glCanvas.width, glCanvas.height);
    gl.clearColor(0.8, 0.9, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Delta time
    const currentTime = performance.now();
    const deltaTime = (currentTime - previousTime) / 1000.0;
    previousTime = currentTime;

    // TO REMOVE - scaling factor
    gl.useProgram(ball.attachedShader.program);
    uScalingFactor = gl.getUniformLocation(ball.attachedShader.program, "uScalingFactor");
    gl.uniform2fv(uScalingFactor, currentScale);
    gl.useProgram(player.attachedShader.program);
    uScalingFactor = gl.getUniformLocation(player.attachedShader.program, "uScalingFactor");
    gl.uniform2fv(uScalingFactor, currentScale);

    // Collisions
    collisions();
    // Update positions
    ball.updatePosition(deltaTime);
    player.updatePosition(deltaTime);

    // Draw
    player.draw();
    ball.draw();

    requestAnimationFrame(drawLoop);
}

function collisions() {
    ball.computeBoundingBox(currentScale);
    player.computeBoundingBox(currentScale);

    // Ball -> wall
    if ((ball._uEntityPosition.x - ball.radius) * currentScale[0] < -1)
        ball.direction.x = Math.abs(ball.direction.x);
    else if ((ball._uEntityPosition.x + ball.radius) * currentScale[0] > 1.)
        ball.direction.x = -Math.abs(ball.direction.x);
    else if ((ball._uEntityPosition.y + ball.radius) * currentScale[1] > 1.)
        ball.direction.y = -Math.abs(ball.direction.y);
    else if ((ball._uEntityPosition.y - ball.radius) * currentScale[1] < -1.)
        ball.direction.y = Math.abs(ball.direction.y);

    // Player -> wall


    playerBallCollision()
}

function playerBallCollision() {
    if (
        player.boundingBoxLeft < ball.boundingBoxRight &&
        player.boundingBoxRight > ball.boundingBoxLeft &&
        player.boundingBoxTop > ball.boundingBoxBottom &&
        player.boundingBoxBottom < ball.boundingBoxTop
    ) {
        ball.direction.x = -ball.direction.x;
        if (ball.direction.x > 0.)
            ball._uEntityPosition.x = player.boundingBoxRight + ball.radius;
        else if (ball.direction.x < 0.)
            ball._uEntityPosition.x = player.boundingBoxLeft - ball.radius;
    }
}

export default gl;