import { Vec3, Vec2 } from './Vector.js';
import Ball from './Ball.js';
import Paddle from './Paddle.js'
import { scoreNode } from './overlay.js';
import { doIntersect } from './collision.js';

let gl = null;
let glCanvas = null;

// Aspect ratio and coordinate system
let aspectRatio;
let currentScale = [1.0, 1.0];

// Time
let currentTime;
let deltaTime;
let previousTime = 0.0;

// Entities
let ball;
let player;

// Game related
let score = [];

// Rendering data shared with the scaler
let uScalingFactor;

window.addEventListener("load", init, false);

async function init() {
    glCanvas = document.getElementById("glcanvas");
    gl = glCanvas.getContext("webgl");

    aspectRatio = glCanvas.width / glCanvas.height;
    currentScale = [1.0, aspectRatio];

    player = new Paddle(0.01, 0.2, new Vec3(0., 0., 0.), new Vec2(-0.9, 0.));
    await player.setup();
    ball = new Ball(0.02, 1, new Vec3(0., 0., 0.));
    await ball.setup()

    score = [0, 0];

    drawLoop();
}

function drawLoop() {
    gl.viewport(0, 0, glCanvas.width, glCanvas.height);
    gl.clearColor(0.8, 0.9, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // TO REMOVE - scaling factor
    gl.useProgram(ball.attachedShader.program);
    uScalingFactor = gl.getUniformLocation(ball.attachedShader.program, "uScalingFactor");
    gl.uniform2fv(uScalingFactor, currentScale);
    gl.useProgram(player.attachedShader.program);
    uScalingFactor = gl.getUniformLocation(player.attachedShader.program, "uScalingFactor");
    gl.uniform2fv(uScalingFactor, currentScale);

    // Delta time
    currentTime = performance.now();
    deltaTime = (currentTime - previousTime) / 1000.0;
    previousTime = currentTime;

    // Positions, events, etc
    ball.updatePosition(deltaTime);
    player.updatePosition(deltaTime, currentScale);

    // Collisions
    collisions();

    // Update uniforms (position in shader)
    ball.updateUniform();
    player.updateUniform();

    // Draw
    player.draw();
    ball.draw();

    scoreNode.nodeValue = score[0] + " | " + score[1];

    requestAnimationFrame(drawLoop);
}

function collisions() {
    ball.computeBoundingBox(currentScale);
    player.computeBoundingBox(currentScale);

    // Ball -> player
    playerBallCollision()

    // Ball -> wall
    if (ball.boundingBoxLeft <= -1) {
        ball.direction.x = Math.abs(ball.direction.x);
        ball.reset();
        score[1] += 1;
    }
    else if (ball.boundingBoxRight >= 1.) {
        ball.direction.x = -Math.abs(ball.direction.x);
    }
    else if (ball.boundingBoxTop >= 1.) {
        ball.direction.y = -Math.abs(ball.direction.y);
    }
    else if (ball.boundingBoxBottom <= -1.) {
        ball.direction.y = Math.abs(ball.direction.y);
    }

    // Player -> wall
    if (player.boundingBoxTop > 1.)
        player._uEntityPosition.y -= player.boundingBoxTop - 1.;
    else if (player.boundingBoxBottom < -1.)
        player._uEntityPosition.y += -(player.boundingBoxBottom + 1.);
}

let lastBallPos = null;
function playerBallCollision() {
    if (lastBallPos == null)
    {
        lastBallPos = ball._uEntityPosition.clone();
        return ;
    }

    let doesIntersect = false;
    if (ball.direction.y < 0.) // vers le bas
    {
        doesIntersect = doIntersect(
        new Vec2(lastBallPos.x + ball.radius, (lastBallPos.y + ball.radius) * currentScale[1]),
        new Vec2(ball.boundingBoxLeft, ball.boundingBoxBottom),
        new Vec2(player.boundingBoxRight, player.boundingBoxBottom),
        new Vec2(player.boundingBoxLeft, player.boundingBoxTop));
    }
    else if (ball.direction.y > 0.) // vers le haut
    {
        doesIntersect = doIntersect(
        new Vec2(lastBallPos.x + ball.radius, (lastBallPos.y - ball.radius) * currentScale[1]),
        new Vec2(ball.boundingBoxLeft, ball.boundingBoxTop),
        new Vec2(player.boundingBoxLeft, player.boundingBoxBottom),
        new Vec2(player.boundingBoxRight, player.boundingBoxTop));
    }
    // if (checkIntersectionTwoLines(
    //     ball._uEntityPosition.x, ball._uEntityPosition.y,
    //     lastBallPos.x, lastBallPos.y,
    //     player._uEntityPosition.x, player.boundingBoxTop,
    //     player._uEntityPosition.x, player.boundingBoxBottom))
    if (doesIntersect)
    {
        // console.log("line intersect!")
        ball.direction.x = -ball.direction.x;
        if (ball.direction.x > 0.)
            ball._uEntityPosition.x = player.boundingBoxRight + ball.radius;
        else (ball.direction.x < 0.)
            ball._uEntityPosition.x = player.boundingBoxLeft - ball.radius;
        ball.acceleration += 1;
        lastBallPos = null;
    }
    else
    {
        lastBallPos = ball._uEntityPosition.clone();
    }
}

// http://paulbourke.net/geometry/pointlineplane/
function checkIntersectionTwoLines(x1, y1, x2, y2, x3, y3, x4, y4) {

    let x4x3 = x4 - x3;
    let y1y3 = y1 - y3;    
    let y4y3 = y4 - y3;
    let x1x3 = x1 - x3;
    let x2x1 = x2 - x1;
    let y2y1 = y2 - y1;

    let a = ((x4x3 * y1y3) - (y4y3 * x1x3)) / ((y4y3 * x2x1) - (x4x3 * y2y1));
    let b = ((x2x1 * y1y3) - (y2y1 * x1x3)) / ((y4y3 * x2x1) - (x4x3 * y2y1));

    if (a >= 0 && a <= 1 && b >= 0 && b <= 1) {
        return true;
    }

    return false;
}


export default gl;