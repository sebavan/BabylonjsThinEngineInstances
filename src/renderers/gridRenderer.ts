import { Constants } from "@babylonjs/core/Engines/constants";
import { ThinEngine } from "@babylonjs/core/Engines/thinEngine";
import { EffectWrapper } from "@babylonjs/core/Materials/effectRenderer";
import { IColor3Like } from "@babylonjs/core/Maths/math.like";
import { VertexBuffer } from "@babylonjs/core/Meshes/buffer";
import { LineShaderConfiguration } from "../shaders/lineShader";

export class GridRenderer {
    private readonly engine: ThinEngine;
    private readonly effectWrapper: EffectWrapper;
    private readonly bind: () => void;
    private readonly vao: WebGLVertexArrayObject | undefined;
    private readonly vertexBuffers: { [key: string]: VertexBuffer };

    private readonly numberOfLines = 4;

    constructor(engine: ThinEngine) {
        this.engine = engine;
        this.effectWrapper = new EffectWrapper({ engine, ...LineShaderConfiguration });

        // Creates a set of horizontal and vertical lines.
        const numberOfLines = this.numberOfLines;
        const lines = new Float32Array(numberOfLines * 2 * 2 * 2);
        const space = 2 / (numberOfLines + 1);
        for (let i = 0; i < numberOfLines; i++) {
            lines[i * 4 + 0] = -1;
            lines[i * 4 + 1] = -1 + space * (i + 1);
            lines[i * 4 + 2] = 1;
            lines[i * 4 + 3] = -1 + space * (i + 1);

            lines[numberOfLines * 2 * 2 + i * 4 + 0] = -1 + space * (i + 1);
            lines[numberOfLines * 2 * 2 + i * 4 + 1] = -1;
            lines[numberOfLines * 2 * 2 + i * 4 + 2] = -1 + space * (i + 1);
            lines[numberOfLines * 2 * 2 + i * 4 + 3] = 1;
        }
        // And their associated buffers
        const linesVertexBuffers = new VertexBuffer(engine, lines, "lineData", true, false, 2, false);
        this.vertexBuffers = {
            "lineData": linesVertexBuffers
        };

        if (engine.webGLVersion >= 2) {
            const lineVAO = engine.recordVertexArrayObject(this.vertexBuffers, null, this.effectWrapper.effect);
    
            this.bind = () => { engine.bindVertexArrayObject(lineVAO, null); };
        }
        else {
            this.bind = () => { engine.bindBuffers(this.vertexBuffers, null, this.effectWrapper.effect); };
        }
    }

    public render(lineColor: IColor3Like): void {
        const { engine, effectWrapper: imageWrapper, bind, effectWrapper: { effect }, numberOfLines } = this;

        engine.enableEffect(imageWrapper.effect);
        effect.setColor3("lineColor", lineColor);
        bind();
        engine.drawArraysType(Constants.MATERIAL_LineListDrawMode, 0, numberOfLines * 2 * 2);
    }

    public dispose(): void {
        const { engine, effectWrapper: imageWrapper, vao: imageVAO, vertexBuffers: { lineData: positionBuffer} } = this;

        imageVAO && engine.releaseVertexArrayObject(imageVAO);
        positionBuffer.dispose();
        imageWrapper.dispose();
    }
}