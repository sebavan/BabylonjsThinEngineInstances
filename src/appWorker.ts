// Find our elements
const worker = new Worker("./scripts/processWorker.js");

const runLoop = () => {
    worker.postMessage({ render: true });

    window.requestAnimationFrame(runLoop);
};
window.requestAnimationFrame(runLoop);

const mainCanvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
const renderingContext = mainCanvas.getContext("bitmaprenderer");
worker.addEventListener("message", (event) => {
    const { data } = event;
    if (data.bitmap) {
        renderingContext.transferFromImageBitmap(data.bitmap)
    }
});