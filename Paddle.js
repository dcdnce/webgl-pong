import Mesh from './Mesh.js'
import { Vec2, Vec3 } from './Vector.js';
import Vertex from './Vertex.js';

class Paddle extends Mesh {
	constructor (width, height, position, color = null) {
		const vertices = [
			new Vertex (new Vec2(position.x, position.y), color),
			new Vertex (new Vec2(position.x + width, position.y), color),
			new Vertex (new Vec2(position.x, position.y + height), color),
			new Vertex (new Vec2(position.x + width, position.y + height), color)
		];

		const indices = [0, 1, 2, 1, 2, 3];

		super(vertices, indices, (color == null));
	}
}

export default Paddle;