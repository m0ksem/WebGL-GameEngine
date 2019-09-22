import { BronzeError } from './../debug/Error';

export class Shader {
  readonly webgl: WebGLRenderingContext;
  public program: WebGLProgram;
  public attributes: {[key: string]: number} = {};
  public uniforms: {[key: string]: WebGLUniformLocation} = {};

  constructor (webgl: WebGLRenderingContext, vertexSource: string, fragmentSource: string) {
    this.webgl = webgl
    const vertexShader = this.compileShader(webgl.VERTEX_SHADER, vertexSource)
    const fragmentShader = this.compileShader(webgl.FRAGMENT_SHADER, fragmentSource)
    this.program = this.createProgram(vertexShader, fragmentShader);
    this.linkVariables(vertexSource)
    this.linkVariables(fragmentSource)
  }

  private compileShader (type: number, source: string) {
    const shader = this.webgl.createShader(type)

    if (!shader) throw new BronzeError("Could not create shader.");

    this.webgl.shaderSource(shader, source)
    this.webgl.compileShader(shader)

    if (!this.webgl.getShaderParameter(shader!, this.webgl.COMPILE_STATUS)) {
      console.error("There are shader error:");
      console.error(this.webgl.getShaderInfoLog(shader!));
      throw new BronzeError("Could not compile shader.");
    }

    return shader
  }

  private createProgram (vertexShader: WebGLShader, fragmentShader: WebGLShader) {
    const program = this.webgl.createProgram()

    if (!program) throw new BronzeError("Could not compile shader.");

    this.webgl.attachShader(program, vertexShader);
    this.webgl.attachShader(program, fragmentShader);

    this.webgl.linkProgram(program)
    return program
  }

  private linkVariables (shaderSource: string) {
    const rows = ShaderParser.getRows(shaderSource)
    
    for (const row of rows) {
      const words = ShaderParser.getWords(row)

      const qualifier = words[0]
      let name = words[2]
      name = ShaderParser.removeArraySizeFromName(name)
      const nameInShader = name
      name = ShaderParser.removePrefixFromName(name)
      name = ShaderParser.addLocationMarker(name)

      if (qualifier === "attribute") {
        this.attributes[name] = this.webgl.getAttribLocation(this.program, nameInShader)
        if (this.attributes[name] === -1) {
          throw new Error(`Can not link attribute ${name}. The variable ${nameInShader} may not exist or not be used in shader.`);
        }
      }
      else if (qualifier === "uniform") {
        const uniformLocation = this.webgl.getUniformLocation(this.program, nameInShader)

        if (uniformLocation === -1 || uniformLocation == null) {
          throw new Error(`Can not link attribute ${name}. The variable ${nameInShader} may not exist or not be used in shader.`);
        }

        this.uniforms[name] = uniformLocation
      }
    }
  }
}

const ShaderParser = {
  getRows (shaderSource: string) {
    return shaderSource.replace(new RegExp("\r|\n", "g"), "").split(";");
  },

  getWords (row: string) {
    return this.removeEmptyWords(row.split(" "))
  },

  removeEmptyWords (words: string[]) {
    for (let i = words.length - 1; i--; ) {
      if (words[i] === "") {
        words.splice(i, 1);
      }
    }
    return words
  },

  removeArraySizeFromName (name: string) {
    const arraySizeStartIndex = name.indexOf("[")

    if (arraySizeStartIndex === -1) return name
    
    return name.slice(0, arraySizeStartIndex)
  },

  removePrefixFromName (name: string) {
    return name.slice(2, name.length)
  },

  addLocationMarker (name: string) {
    return name + 'Location'
  }
}