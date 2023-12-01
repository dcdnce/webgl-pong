import { Vec3 } from './Vector.js';
import Vertex from './Vertex.js';
import Shader from './Shader.js';

class Mesh {
	// constructor(vertices = null, indices = null) {
	constructor(vertices = null) {
		this.gl = document.getElementById('glcanvas').getContext('webgl');
		this.VBO = null;
		// this.EBO = null;
		this.vertices = vertices || [new Vertex()];
		if (vertices === null || vertices.length === 0) {
            throw new Error("La classe Mesh nécessite des données de vertices non nulles et non vides.");
		}
		// this.indices = indices || [];
		this.attachedShader = new Shader();
	}

	async setup() {
		this._setupColors();
		this._setupBuffers();
		await this._setupShaders();
	}

	_setupColors() {
		for (let i = 0; i < this.vertices.length; i++) {
			this.vertices[i].color = new Vec3(
				Math.random(),
				Math.random(),
				Math.random()
			);
		}
	}

	_setupBuffers() {
		this.VBO = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.VBO);

		// Send data
		const verticesData = [];
		for (let i = 0; i < this.vertices.length; i++) {
			verticesData.push(...this.vertices[i].toArray());
		}
		console.log(verticesData);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(verticesData), this.gl.STATIC_DRAW);

		//Link
		this.gl.enableVertexAttribArray(0);
		this.gl.vertexAttribPointer(0, 2, this.gl.FLOAT, false, 5 * Float32Array.BYTES_PER_ELEMENT, 0);
		this.gl.enableVertexAttribArray(1);
		this.gl.vertexAttribPointer(1, 3, this.gl.FLOAT, false, 5 * Float32Array.BYTES_PER_ELEMENT, 2 * Float32Array.BYTES_PER_ELEMENT);
	}

	async _setupShaders() {
		const shaderSet = [
		{
			type: this.gl.VERTEX_SHADER,
			filePath: "./vs.glsl",
		},
		{
			type: this.gl.FRAGMENT_SHADER,
			filePath: "./fs.glsl",
		},
		];

		await this.attachedShader.buildProgram(shaderSet);
	}

	draw() {
		this.gl.useProgram(this.attachedShader.program);

		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.VBO);

		this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertices.length);

		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
	}
}

// Exporte la classe Mesh pour qu'elle puisse être importée ailleurs
export default Mesh;