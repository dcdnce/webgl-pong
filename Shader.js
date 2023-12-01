class Shader {
	constructor() {
		this._projMat = null;
		this._viewMat = null;
		this._modelMat = null;
		this.program = null;
		this.gl = document.getElementById('glcanvas').getContext('webgl');
	}

	async _compileShader(filePath, type) {
		const response = await fetch(filePath);
		if (!response.ok) {
			console.error(`Unable to fetch shader file: ${filePath}`);
			return null;
		}

		const code = await response.text();
		const shader = this.gl.createShader(type);

		this.gl.shaderSource(shader, code);
		this.gl.compileShader(shader);

		if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
			console.log(
				`Error compiling ${type === this.gl.VERTEX_SHADER ? "vertex" : "fragment"
				} shader:`,
			);
			console.log(this.gl.getShaderInfoLog(shader));
		}
		return shader;
	}

	async buildProgram(shaderInfo) {
		this.program = this.gl.createProgram();
		// Utilise Promise.all pour attendre toutes les compilations de shader
		await Promise.all(shaderInfo.map(async (desc) => {
			const shader = await this._compileShader(desc.filePath, desc.type);
			if (shader) {
				this.gl.attachShader(this.program, shader);
			}
		}));

		this.gl.linkProgram(this.program);

		if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
			console.log("Error linking shader program:");
			console.log(this.gl.getProgramInfoLog(program));
		}
	}
}

export default Shader;
