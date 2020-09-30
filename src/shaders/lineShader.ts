const vertexShader = `
attribute vec2 lineData;

varying vec2 vPos;

void main(void) {
    vPos = lineData;

    gl_Position = vec4(lineData, 0., 1.0);
}`;

const fragmentShader = `
varying vec2 vPos;

uniform vec3 lineColor;

void main(void) 
{
    gl_FragColor = vec4(lineColor, 1.);
}`;

/**
 * Defines all the data required for our effect
 */
export const LineShaderConfiguration = {
    name: "Line",
    vertexShader,
    fragmentShader,
    attributeNames: ["lineData"],
    uniformNames: ["lineColor"]
}