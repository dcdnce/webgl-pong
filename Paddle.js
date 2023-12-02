import Mesh from './Mesh.js'
import { Vec2, Vec3 } from './Vector.js';
import Vertex from './Vertex.js';

class Paddle extends Mesh {
	constructor (width, height, color = null) {
		const shaderInfo = [
		{
			type: WebGL2RenderingContext.VERTEX_SHADER,
			filePath: "./entity.vs",
		},
		{
			type: WebGL2RenderingContext.FRAGMENT_SHADER,
			filePath: "./entity.fs",
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

		this._uEntityPosition = new Vec2(0., 0.);
	}

	moveUp(deltaTime) {
        this._uEntityPosition.y += 0.5 * deltaTime;
		this.gl.useProgram(this.attachedShader.program);
		this.gl.uniform2f(
			this.gl.getUniformLocation(this.attachedShader.program, "uEntityPosition"),
			this._uEntityPosition.x,
			this._uEntityPosition.y)	
    }

    moveDown(deltaTime) {
        this._uEntityPosition.y -= 0.5 * deltaTime;
		this.gl.useProgram(this.attachedShader.program);
		this.gl.uniform2f(
			this.gl.getUniformLocation(this.attachedShader.program, "uEntityPosition"),
		this._uEntityPosition.x,
		this._uEntityPosition.y)	
    }
}

export default Paddle;