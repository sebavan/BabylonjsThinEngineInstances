const vertexShader = `
attribute vec2 position;

varying vec2 vUV;
varying vec2 vPos;

const vec2 madd = vec2(0.5, 0.5);

void main(void) {
    vPos = position;
    vUV = (position * madd + madd);
    gl_Position = vec4(position, 0.9, 1.0);
}
`;

const fragmentShader = `
varying vec2 vUV;
varying vec2 vPos;

uniform sampler2D imageSampler;
uniform vec3 borderMixColor;

void main(void) 
{
    vec4 finalColor = texture2D(imageSampler, vUV);
    vec4 finalColorOut = vec4(finalColor.rgb * borderMixColor, 1.0);

    vec2 above = step(0.75, abs(vPos));
    float mixValue = min(above.x + above.y, 1.);

    gl_FragColor = mix(finalColor, finalColorOut, mixValue);
}`;

/**
 * Defines all the data required for our effect
 */
export const ImageShaderConfiguration = {
    name: "Image",
    vertexShader,
    fragmentShader,
    samplerNames: ["imageSampler"],
    uniformNames: ["borderMixColor"],
}