import Mesh from './Mesh.js'
import { Vec2, Vec3 } from './Vector.js';
import Vertex from './Vertex.js';
import { upKeyPressed, downKeyPressed, leftKeyPressed, rightKeyPressed } from './Event.js';

class Paddle extends Mesh {
	constructor (width, height, color = null, position = new Vec2(0., 0.)) {
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

		this._uEntityPosition = position;
		this.speed = 2.0;
		this.width = width;
		this.height = height;
	}

	updatePosition(deltaTime) {
		if (upKeyPressed)
        	this._uEntityPosition.y += this.speed * deltaTime;
		else if (downKeyPressed)
        	this._uEntityPosition.y -= this.speed * deltaTime;
		// else if (rightKeyPressed)
        // 	this._uEntityPosition.x += this.speed * deltaTime;
		// else if (leftKeyPressed)
        // 	this._uEntityPosition.x -= this.speed * deltaTime;
		this.gl.useProgram(this.attachedShader.program);
		this.gl.uniform2f(
			this.gl.getUniformLocation(this.attachedShader.program, "uEntityPosition"),
			this._uEntityPosition.x,
			this._uEntityPosition.y)	
	}

	computeBoundingBox(currentScale) {
		this.boundingBoxLeft = this._uEntityPosition.x - this.width / 2;
		this.boundingBoxRight = this._uEntityPosition.x + this.width / 2;
		this.boundingBoxTop = this._uEntityPosition.y + this.height / 2;
		this.boundingBoxBottom = this._uEntityPosition.y - this.height / 2;
		this.boundingBoxLeft *= currentScale[0];
		this.boundingBoxRight *= currentScale[0];
		this.boundingBoxTop *= currentScale[1];
		this.boundingBoxBottom *= currentScale[1];
	}
}

export default Paddle;