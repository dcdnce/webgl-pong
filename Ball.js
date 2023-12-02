import Mesh from './Mesh.js'
import { Vec2, Vec3 } from './Vector.js';
import Vertex from './Vertex.js';

class Ball extends Mesh {
	constructor (radius = 0.1, resolution = 4.0, color = null) {
		const shaderInfo = [
		{
			type: WebGL2RenderingContext.VERTEX_SHADER,
			filePath: "./ball.vs",
		},
		{
			type: WebGL2RenderingContext.FRAGMENT_SHADER,
			filePath: "./ball.fs",
		},
		];

		let numFaces = resolution * 4.;
		const vertices = [];
		vertices.push(new Vertex(new Vec2(0.0, 0.0), color)); // Origin
		let stepAngle = 360.0 / numFaces;
		for (let angle = 0.0; angle < 360.0 ; angle += stepAngle) {
			vertices.push(new Vertex(
				new Vec2(
					radius * Math.cos(angle * (Math.PI / 180.0)),
					radius * Math.sin(angle * (Math.PI / 180.0))
				),
				color
			));
		}

		const indices = [];
		for (let i = 0 ; i < numFaces ; i++) {
			indices.push(...[0, i+1, (i+1)%numFaces + 1]);
		}

		super(vertices, indices, (color == null), shaderInfo);

		this._uBallPosition = new Vec2(0., 0.);
	}

	moveUp(deltaTime) {
        this._uBallPosition.y += 0.5 * deltaTime;
		this.gl.useProgram(this.attachedShader.program);
		this.gl.uniform2f(
			this.gl.getUniformLocation(this.attachedShader.program, "uBallPosition"),
			this._uBallPosition.x,
			this._uBallPosition.y)	
    }

    moveDown(deltaTime) {
        this._uBallPosition.y -= 0.5 * deltaTime;
		this.gl.useProgram(this.attachedShader.program);
		this.gl.uniform2f(
			this.gl.getUniformLocation(this.attachedShader.program, "uBallPosition"),
		this._uBallPosition.x,
		this._uBallPosition.y)	
    }
}

export default Ball;