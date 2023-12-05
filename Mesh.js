import { Vec3 } from './Vector.js';
import Vertex from './Vertex.js';
import Shader from './Shader.js';

class Mesh {
	// thx webgl :)
	static sharedVBO = null;
	static sharedEBO = null;
	static sharedVertices = [];
	static sharedIndices = [];
	static VBOOffset = [0];
	static EBOOffset = [0];
	static MeshInstancesTotal = 0;

	constructor(vertices, indices, randomColor = false, shaderInfo) {
		this.gl = document.getElementById('glcanvas').getContext('webgl');
		this.vertices = vertices || [new Vertex()];
		this.indices = indices || [];
		this.attachedShader = new Shader();
		this.randomColor = randomColor;
		this.shaderInfo = shaderInfo;
		this.MeshInstancesIndex = Mesh.MeshInstancesTotal;
		Mesh.MeshInstancesTotal += 1;
	}

	async setup() {
		await this._setupShaders();
		if (this.randomColor)
			this._setupColors();
		this._setupBuffers();
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
		if (!Mesh.sharedEBO || !Mesh.sharedVBO) {
			Mesh.sharedVBO = this.gl.createBuffer();
			Mesh.sharedEBO = this.gl.createBuffer();
		}

		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, Mesh.sharedVBO);
		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, Mesh.sharedEBO);

		// Refresh shared buffers data
		Mesh.sharedVertices.push(...this.vertices);
		for (let i = 0 ; i < this.indices.length ; i++)
			this.indices[i] += Mesh.VBOOffset[this.MeshInstancesIndex];
		Mesh.sharedIndices.push(...this.indices);
		
		// Refresh offsets
		Mesh.VBOOffset.push(this.vertices.length);
		Mesh.EBOOffset.push(this.indices.length);
		console.log(Mesh.VBOOffset);
		console.log(Mesh.EBOOffset);

		// Send data
		const verticesData = [];
		for (let i = 0; i < Mesh.sharedVertices.length; i++) {
			verticesData.push(...Mesh.sharedVertices[i].toArray());
		}
		this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(verticesData), this.gl.DYNAMIC_DRAW);
		this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(Mesh.sharedIndices), this.gl.DYNAMIC_DRAW);

		//Link
		this.gl.enableVertexAttribArray(0);
		this.gl.vertexAttribPointer(0, 2, this.gl.FLOAT, false, 5 * Float32Array.BYTES_PER_ELEMENT, 0);
		this.gl.enableVertexAttribArray(1);
		this.gl.vertexAttribPointer(1, 3, this.gl.FLOAT, false, 5 * Float32Array.BYTES_PER_ELEMENT, 2 * Float32Array.BYTES_PER_ELEMENT);

		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
	}

	async _setupShaders() {
		await this.attachedShader.buildProgram(this.shaderInfo);
	}

	draw() {
		this.gl.useProgram(this.attachedShader.program);
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, Mesh.sharedVBO);
		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, Mesh.sharedEBO);

		this.gl.drawElements(this.gl.TRIANGLES, this.indices.length, this.gl.UNSIGNED_SHORT, Mesh.EBOOffset[this.MeshInstancesIndex]);

		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
		this.gl.useProgram(null);
	}
}

export default Mesh;
