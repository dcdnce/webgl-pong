attribute vec2 aVertexPosition;
attribute vec3 aVertexColor;

uniform vec2 uScalingFactor;
uniform vec2 uBallPosition;

varying vec3 vColor;

void main() {
    vec2 position = (aVertexPosition + uBallPosition) * uScalingFactor;
    gl_Position = vec4(position, 0.0, 1.0);

    vColor = aVertexColor;
}

