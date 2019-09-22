import { ColorTexture } from './../textures/ColorTexture';
import { ShadersLoader } from './../webgl/ShadersLoader';
import { Material } from './Material';

export class SimpleMaterial extends Material {
  public texture: ColorTexture

  constructor (webgl: WebGLRenderingContext) {
    const shader = ShadersLoader.createShader(webgl, './shaders/simple/vertex.glsl', './shaders/simple/fragment.glsl');
    super(shader)

    this.texture = new ColorTexture()
  }
}