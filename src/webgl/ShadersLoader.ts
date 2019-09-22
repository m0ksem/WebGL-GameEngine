import { Shader } from "./Shader";

export const ShadersLoader = {
  createShader (webgl: WebGLRenderingContext, vertexShaderPath: string, fragmentShaderPath: string) {
    const vertexShader = new XMLHttpRequest();
    vertexShader.open("GET", vertexShaderPath, false);
    vertexShader.send(null);
    const fragmentShader = new XMLHttpRequest();
    fragmentShader.open("GET", fragmentShaderPath, false);
    fragmentShader.send(null);

    return new Shader(webgl, vertexShader.responseText, fragmentShader.responseText)
  }
}