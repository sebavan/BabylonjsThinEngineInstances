const vertexShader = `
attribute vec3 position;
attribute vec4 matrix0;
attribute vec4 matrix1;
attribute vec4 matrix2;
attribute vec4 matrix3;

void main(void) {
    mat4 matrix = mat4(matrix0, matrix1, matrix2, matrix3);
    gl_Position = matrix * vec4(position, 1.);
}`;

const fragmentShader = `
uniform vec3 handleColor;

void main(void) 
{
    gl_FragColor = vec4(handleColor, 1.);
}`;

/**
 * Defines all the data required for our effect
 */
export const HandleShaderConfiguration = {
    name: "Handle",
    vertexShader,
    fragmentShader,
    attributeNames: ["position", "matrix0", "matrix1", "matrix2", "matrix3"],
    uniformNames: ["handleColor"]
}