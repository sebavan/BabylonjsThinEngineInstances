import { Constants } from "@babylonjs/core/Engines/constants";
import { ThinEngine } from "@babylonjs/core/Engines/thinEngine";
import { EffectWrapper } from "@babylonjs/core/Materials/effectRenderer";
import { BaseTexture } from "@babylonjs/core/Materials/Textures/baseTexture";
import { IColor3Like } from "@babylonjs/core/Maths/math.like";
import { VertexBuffer } from "@babylonjs/core/Meshes/buffer";
import { DataBuffer } from "@babylonjs/core/Meshes/dataBuffer";
import { ImageShaderConfiguration } from "../shaders/imageShader";

export class ImageRenderer {
    private readonly engine: ThinEngine;
    private readonly effectWrapper: EffectWrapper;
    private readonly bind: () => void;
    private readonly vao: WebGLVertexArrayObject | undefined;
    private readonly indexBuffer: DataBuffer;
    private readonly vertexBuffers: { [key: string]: VertexBuffer };

    constructor(engine: ThinEngine) {
        this.engine = engine;
        this.effectWrapper = new EffectWrapper({ engine, ...ImageShaderConfiguration });

        this.indexBuffer = engine.createIndexBuffer([0, 1, 2, 0, 2, 3], false);
        this.vertexBuffers = {
            "position": new VertexBuffer(engine, [1, 1, -1, 1, -1, -1, 1, -1], "position", false, false, 2),
        };

        if (engine.webGLVersion >= 2) {
            this.vao = engine.recordVertexArrayObject(this.vertexBuffers, this.indexBuffer, this.effectWrapper.effect);
            this.bind = () => { engine.bindVertexArrayObject(this.vao, this.indexBuffer); };
        }
        else {
            this.bind = () => { engine.bindBuffers(this.vertexBuffers, this.indexBuffer, this.effectWrapper.effect); };
        }
    }

    public render(texture: BaseTexture, borderMixColor: IColor3Like): void {
        const { engine, bind, effectWrapper: { effect } } = this;

        engine.enableEffect(effect);
        effect.setTexture("imageSampler", texture);
        effect.setColor3("borderMixColor", borderMixColor);
        bind();
        engine.drawElementsType(Constants.MATERIAL_TriangleFillMode, 0, 6);
    }

    public dispose(): void {
        const { engine, effectWrapper, vao, indexBuffer, vertexBuffers: { position: positionBuffer} } = this;

        vao && engine.releaseVertexArrayObject(vao);
        engine._releaseBuffer(indexBuffer);
        positionBuffer.dispose();
        effectWrapper.dispose();
    }
}