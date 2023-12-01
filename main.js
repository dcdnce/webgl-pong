// main.js

const gl = document.getElementById('glcanvas').getContext('webgl');
if (!gl) {
    console.error('WebGL non pris en charge.');
}

// Définit la couleur de fond du canvas en rouge
gl.clearColor(1.0, 0.0, 0.0, 1.0);

// Efface le canvas avec la couleur de fond définie
gl.clear(gl.COLOR_BUFFER_BIT);
