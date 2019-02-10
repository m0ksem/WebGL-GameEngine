/**
 * Returns webgl context
 * 
 * @param {string} id id of canvas on DOM.
 * 
 * @return {CanvasRenderingContext2D} WebGL context.
 */
function getWebGLById(id) {
    let canvas = document.getElementById(id);
    let webGL = canvas.getContext("experimental-webgl");
    window.addEventListener('resize', function () {
        canvas.width = canvas.offsetWidth
        canvas.height = canvas.offsetHeight
    });
    return webGL
}

/**
 * Returns webgl context
 * 
 * @param {HTMLElement} canvas canvas DOM element.
 * 
 * @return {CanvasRenderingContext2D} WebGL context.
 */
function getWebGL(canvas) {
    let webGL = canvas.getContext("experimental-webgl");
    window.addEventListener('resize', function () {
        canvas.width = canvas.offsetWidth
        canvas.height = canvas.offsetHeight
    });
    return webGL
}

/**
 * Creates a shader from script DOM element source.
 * There are two types: shader/fragment and shader/vertex.
 * 
 * @param {String} id script id.
 * @param {CanvasRenderingContext2D} webGL webGL context to compile shader.
 * 
 * @return compiled shader.
 */
function createShaderFromScript(id, webGL) {
    let shaderJS = document.getElementById(id)

    let source = shaderJS.text

    let shader

    if (shaderJS.type == "shader/fragment") {
        shader = webGL.createShader(webGL.FRAGMENT_SHADER)
    } else if (shaderJS.type == "shader/vertex") {
        shader = webGL.createShader(webGL.VERTEX_SHADER)
    } else {
        console.log("Wrong shader type")
        return null
    }

    webGL.shaderSource(shader, source)
    webGL.compileShader(shader)

    if (!webGL.getShaderParameter(shader, webGL.COMPILE_STATUS)) {
        throw "Could not compile shader:" + webGL.getShaderInfoLog(shader);
    }

    return shader
}

/**
 * Creates a program, attaches shaders and link program.
 * 
 * @param {CanvasRenderingContext2D} webGL WebGL context for creating program.
 * @param vertexShader compiled vertexShader.
 * @param fragmentShader compiled fragmentShader.
 * @param {Bool} deleteShaders [optional] will delete shader after attaching.
 * 
 * @return shader program.
 */
function createWebGLProgram (webGL, vertexShader, fragmentShader, deleteShaders) {
    let shaderProgram = webGL.createProgram();

    webGL.attachShader(shaderProgram, vertexShader);
    webGL.attachShader(shaderProgram, fragmentShader);

    webGL.linkProgram(shaderProgram);
    webGL.useProgram(shaderProgram);

    if (deleteShaders) {
        webGL.deleteShader(vertexShader);
        webGL.deleteShader(fragmentShader);
    }

    return shaderProgram
}