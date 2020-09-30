import { ThinEngine } from "@babylonjs/core/Engines/thinEngine";
import { Texture } from "@babylonjs/core/Materials/Textures/texture";

import { HandleRenderer } from './renderers/handleRenderer';
import { ImageRenderer } from "./renderers/imageRenderer";
import { GridRenderer } from "./renderers/gridRenderer";

// SETUP DATA: START //
const imageUrl = "assets/landscape.jpg";
const borderMixColor = { r: 0.8, g: 0.8, b: 0.9 };
const lineColor = { r: 0.1, g: 0.1, b: 0.1 };
const handleColor = { r: 0.8, g: 0.8, b: 0.9 };
// SETUP DATA: END   //

// Find our elements
const mainCanvas = document.getElementById("renderCanvas") as HTMLCanvasElement;

// Create the associated engine
const engine = new ThinEngine(mainCanvas, true, {
    antialias: true,
    preserveDrawingBuffer: false,
    disableWebGL2Support: true,
}, true);
// prevents dealing with effect readyness for POC Code only.
engine.getCaps().parallelShaderCompile = undefined;

// Creates the dedicated renderers.
const imageRenderer = new ImageRenderer(engine);
const gridRenderer = new GridRenderer(engine);
const handleRenderer = new HandleRenderer(engine);

// Set the engine default state to improve perfs.
engine.depthCullingState.depthTest = true;
engine.depthCullingState.cull = false;
engine.stencilState.stencilTest = false;
engine.setViewport({ x: 0, y: 0, width: 1, height: 1 });

// Creates the texture first as it needs time to load.
const image = new Texture(imageUrl, engine);
image.onLoadObservable.addOnce(() => {
    // Run simple render loop once all is ready.
    engine.runRenderLoop(() => {
        handleRenderer.render(handleColor);
        gridRenderer.render(lineColor);
        imageRenderer.render(image, borderMixColor);
    });
});
