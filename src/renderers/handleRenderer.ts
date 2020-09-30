import { Constants } from "@babylonjs/core/Engines/constants";
import { ThinEngine } from "@babylonjs/core/Engines/thinEngine";
import { EffectWrapper } from "@babylonjs/core/Materials/effectRenderer";
import { IColor3Like } from "@babylonjs/core/Maths/math.like";
import { Matrix } from "@babylonjs/core/Maths/math.vector";
import { VertexBuffer, Buffer } from "@babylonjs/core/Meshes/buffer";
import { DataBuffer } from "@babylonjs/core/Meshes/dataBuffer";
import { HandleShaderConfiguration } from "../shaders/handleShader";

export class HandleRenderer {
    private readonly engine: ThinEngine;
    private readonly effectWrapper: EffectWrapper;
    private readonly bind: () => void;
    private readonly vao: WebGLVertexArrayObject | undefined;
    private readonly indexBuffer: DataBuffer;
    private readonly vertexBuffers: { [key: string]: VertexBuffer };

    constructor(engine: ThinEngine) {
        this.engine = engine;
        this.effectWrapper = new EffectWrapper({ engine, ...HandleShaderConfiguration });

        // Creates the set of corners to render with instances.
        const numberOfCorners = 4;
        const matrices = new Float32Array(numberOfCorners * 16);
        Matrix.Translation(-0.75, -0.75, -0.9).copyToArray(matrices, 0);
        Matrix.Translation(-0.75, 0.75, -0.9).copyToArray(matrices, 16);
        Matrix.Translation(0.75, -0.75, -0.9).copyToArray(matrices, 32);
        Matrix.Translation(0.75, 0.75, -0.9).copyToArray(matrices, 48);
        const matricesBuffer = new Buffer(engine, matrices, true, 16, false, true);
        this.indexBuffer = engine.createIndexBuffer([0, 1, 2, 0, 2, 3], false);
        this.vertexBuffers = {
            // TODO, should be using proper ratio or a scale :-)
            "position": new VertexBuffer(engine, [0.015, 0.025, 0., -0.015, 0.025, 0., -0.015, -0.025, 0., 0.015, -0.025, 0.], "position", false),
            "matrix0": matricesBuffer.createVertexBuffer("matrix0", 0, 4),
            "matrix1": matricesBuffer.createVertexBuffer("matrix1", 4, 4),
            "matrix2": matricesBuffer.createVertexBuffer("matrix2", 8, 4),
            "matrix3": matricesBuffer.createVertexBuffer("matrix3", 12, 4),
        };

        if (engine.webGLVersion >= 2) {
            const handleVAO = engine.recordVertexArrayObject(this.vertexBuffers, this.indexBuffer, this.effectWrapper.effect);
    
            this.bind = () => { engine.bindVertexArrayObject(handleVAO, this.indexBuffer); };
        }
        else {
            this.bind = () => { engine.bindBuffers(this.vertexBuffers, this.indexBuffer, this.effectWrapper.effect); };
        }
    }

    public render(handleColor: IColor3Like): void {
        const { engine, bind, effectWrapper: { effect } } = this;

        engine.enableEffect(effect);
        effect.setColor3("handleColor", handleColor);
        bind();
        engine.drawElementsType(Constants.MATERIAL_TriangleFillMode, 0, 6, 4);
    }

    public dispose(): void {
        const { engine, effectWrapper, vao, indexBuffer, vertexBuffers: { lineData: positionBuffer} } = this;

        vao && engine.releaseVertexArrayObject(vao);
        engine._releaseBuffer(indexBuffer);
        positionBuffer.dispose();
        effectWrapper.dispose();
    }
}