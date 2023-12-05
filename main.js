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

    player = new Paddle(0.01, 0.1, new Vec3(0., 0., 0.));
    await player.setup();
    ball = new Ball(0.05, 4, new Vec3(0., 0., 0.));
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
    // Ball -> wall
    if ((ball._uEntityPosition.x - ball.radius) * currentScale[0] < -1)
        ball.direction.x = Math.abs(ball.direction.x);
    else if ((ball._uEntityPosition.x + ball.radius) * currentScale[0] > 1.)
        ball.direction.x = -Math.abs(ball.direction.x);
    else if ((ball._uEntityPosition.y + ball.radius) * currentScale[1] > 1.)
        ball.direction.y = -Math.abs(ball.direction.y);
    else if ((ball._uEntityPosition.y - ball.radius) * currentScale[1] < -1.)
        ball.direction.y = Math.abs(ball.direction.y);

    if (playerBallCollision())
        ball.direction.x = -ball.direction.x;
}

function playerBallCollision() {
    let paddleLeft = player._uEntityPosition.x - player.width / 2;
    let paddleRight = player._uEntityPosition.x + player.width / 2;
    let paddleTop = player._uEntityPosition.y + player.height / 2;
    let paddleBottom = player._uEntityPosition.y - player.height / 2;
    paddleLeft *= currentScale[0];
    paddleRight *= currentScale[0];
    paddleTop *= currentScale[1];
    paddleBottom *= currentScale[1];

    let ballLeft = ball._uEntityPosition.x - ball.radius;
    let ballRight = ball._uEntityPosition.x + ball.radius;
    let ballTop = ball._uEntityPosition.y + ball.radius;
    let ballBottom = ball._uEntityPosition.y - ball.radius;
    ballLeft *= currentScale[0];
    ballRight *= currentScale[0];
    ballTop *= currentScale[1];
    ballBottom *= currentScale[1];


    // Vérification de collision
    if (
        paddleLeft < ballRight &&
        paddleRight > ballLeft &&
        paddleTop > ballBottom &&
        paddleBottom < ballTop
    ) {
        // Collision détectée
        return true;
    }

    // Pas de collision
    return false;
}

export default gl;