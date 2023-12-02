import Mesh from './Mesh.js'
import { Vec2, Vec3 } from './Vector.js';
import Vertex from './Vertex.js';

class Paddle extends Mesh {
	constructor (color = new Vec3(0.0, 0.0, 0.0)) {
		const positions = [
			new Vec2(-0.5, 0.5),
			new Vec2(0.5, 0.5),
			new Vec2(0.5, -0.5),
			new Vec2(-0.5, -0.5),
		];
		const vertices = [];
		for (const position of positions)
			vertices.push(new Vertex(position, color));
		const indices = [0, 1, 2, 0, 3, 2];
		super(vertices, indices);
	}
}

export default Paddle;