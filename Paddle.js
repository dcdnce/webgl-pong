import Mesh from './Mesh.js'
import { Vec2, Vec3 } from './Vector.js';
import Vertex from './Vertex.js';

class Paddle extends Mesh {
	constructor (width, height, color = null) {
		const shaderInfo = [
		{
			type: WebGL2RenderingContext.VERTEX_SHADER,
			filePath: "./paddle.vs",
		},
		{
			type: WebGL2RenderingContext.FRAGMENT_SHADER,
			filePath: "./paddle.fs",
		},
		];

		const vertices = [
			new Vertex (new Vec2(-width, -height), color),
			new Vertex (new Vec2(width, -height), color),
			new Vertex (new Vec2(-width, height), color),
			new Vertex (new Vec2(width, height), color)
		];

		const indices = [0, 1, 2, 1, 2, 3];

		super(vertices, indices, (color == null), shaderInfo);

		this._uPaddlePosition = new Vec2(0., 0.);
	}

	moveUp(deltaTime) {
        this._uPaddlePosition.y += 0.5 * deltaTime;
		this.gl.useProgram(this.attachedShader.program);
		this.gl.uniform2f(
			this.gl.getUniformLocation(this.attachedShader.program, "uPaddlePosition"),
			this._uPaddlePosition.x,
			this._uPaddlePosition.y)	
    }

    moveDown(deltaTime) {
        this._uPaddlePosition.y -= 0.5 * deltaTime;
		this.gl.useProgram(this.attachedShader.program);
		this.gl.uniform2f(
			this.gl.getUniformLocation(this.attachedShader.program, "uPaddlePosition"),
		this._uPaddlePosition.x,
		this._uPaddlePosition.y)	
    }
}

export default Paddle;