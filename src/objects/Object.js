import * as Matrixes from "../math/Matrixes"
import * as Math from '../math/Math'

 /**
 * Creates and bind to engine object. The object must be loaded from .obj file.
 * @class
 * @constructor
 * @param {Engine} engine 
 */
export class Object {
    constructor (engine) {
        engine.objects.push(this)
        
        /**
         * Engine where object attached.
         * @type {Engine}
         * @private
         */
        this.engine = engine

        /**
         * WebGL context of engine
         * @private
         */
        this.webGL = engine.webGL

        /**
         * Camera of engine.
         * @type {Camera}
         * @private
         */
        this.camera = engine.camera

        /**
         * Object texture.
         * @type {Texture} texture
         * @public
         */
        this.texture = engine.noTexture

        /**
         * Object position vector. Maybe you need setPosition(), move() or moveRelativeToTheCamera() methods? It'd be more convenient to use.
         * @public
         * @type {Array.<{0: Number, 1: Number, 2: Number}>} vector 3 array
         * @property {Number} x position on axis x
         * @property {Number} y position on axis y
         * @property {Number} z position on axis z
         */
        this.position = [0, 0, 0]

        /**
         * Object rotation vector. Angles in radians. Maybe you need setRotation() or rotate() methods? It'd be more convenient to use.
         * @public
         * @type {Array.<{0: Number, 1: Number, 2: Number}>} vector 3 array
         * @property {Number} x rotation on axis x
         * @property {Number} y rotation on axis y
         * @property {Number} z rotation on axis z
         */
        this.rotation = [0, 0, 0]

        /**
         * Object scaling vector. Maybe you need scale() method? It'd be more convenient to use.
         * @public
         * @type {Array.<{0: Number, 1: Number, 2: Number}>} vector 3 array
         * @property {Number} x scaling on axis x
         * @property {Number} y scaling on axis x
         * @property {Number} z scaling on axis x
         */
        this.scaling = [1, 1, 1]

        /**
         * Object scaling vector. Angles in radians. Maybe you need setRotationPoint() method? It'd be more convenient to use.
         * @public
         * @type {Array.<{0: Number, 1: Number, 2: Number}>} vector 3 array
         * @property {Number} x rotation point coordinate on axis x
         * @property {Number} y rotation point coordinate on axis y
         * @property {Number} z rotation point coordinate on axis z
         */
        this.rotationPoint = [0, 0, 0]

        /**
         * Object scaling vector. Angles in radians. Maybe you need setParentRotation() method? It'd be more convenient to use.
         * @public
         * @type {Array.<{0: Number, 1: Number, 2: Number}>} vector 3 array
         * @property {Number} x parent rotation on axis x
         * @property {Number} y parent rotation on axis y
         * @property {Number} z parent rotation on axis z
         */
        this.parentRotation = [0, 0, 0]

        /**
         * These are the edges of the object on the monitor.
         * @readonly
         * @Type {Object}   
         * @property {Number} relativeCameraPosition.x.left
         * @property {Number} relativeCameraPosition.x.right
         * @property {Number} relativeCameraPosition.y.top
         * @property {Number} relativeCameraPosition.y.bottom
         * @property {Number} relativeCameraPosition.depth
         */
        this.relativeCameraPosition = null

        /**
         * Faces of object. Needs to draw object. Creates when object is compiled.
         * @readonly
         * @type {Array}
         */
        this.faces = []

        /**
         * Collision boxes coordinates array.
         * @type {
         *      x: Number[2],
         *      y: Number[2],
         *      z: Number[2]
         *  }
         * @property {Number[]} collisionBoxes.x contains array[2] of left and right x coords.
         * @property {Number[]} collisionBoxes.y contains array[2] of bottom and top y coords.
         * @property {Number[]} collisionBoxes.z contains array[2] of far and close z coords.
         * @public
         */
        this.collisionBoxes = []

        /**
         * Sets whether the object will be attached to the camera like UI element.
         * @type {boolean}
         * @public
         */
        this.UIElement = false 
    }

    /**
     * Setting texture for object.
     * @param {Texture} texture 
     * @public
     */
    setTexture (texture) {
        this.texture = texture
    }

    /**
     * Translate polygon for x,y,z pixels.
     * 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} z 
     * @public
     */
    setPosition (x, y, z) {
        if (!this.UIElement) {
            this.position[0] = x
            this.position[1] = y
            this.position[2] = z
        } else {
            this.position[0] = this.engine.width / 2 * x / 100
            this.position[1] = this.engine.height / 2 * y / 100
            this.position[2] = z
        }
    }

    /**
     * Adds values to position which moves object.
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} z 
     * @public
     */
    move (x, y, z) {
        this.position[0] += x
        this.position[1] += y
        this.position[2] += z
    }

    /**
     * Moves object around x, y, z axis relative to the camera angles.
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} z 
     * @public
     */
    moveRelativeToTheCamera (x, y, z) {
        let pos = [x, y, z, 1]
            pos = Matrixes.vec3Multiply(this.camera.inventedMatrix, pos)
        this.position[0] += pos[0]
        this.position[1] += pos[1]
        this.position[2] += pos[2]
    }

    /**
     * Add rotation for x, y, z axis for current rotation.
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} z
     * @public
     */
    rotate (x, y, z) {
        this.rotation[0] += x
        this.rotation[1] += y
        this.rotation[2] += z
    }

    /**
     * Set rotate for x, y, z axis.
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} z
     * @public 
     */
    setRotation (x, y, z) {
        this.rotation[0] = Math.degToRad(x)
        this.rotation[1] = Math.degToRad(y)
        this.rotation[2] = Math.degToRad(z)
    }

    /**
     * Setting coordinates for rotation point.
     * @param {Number} x
     * @param {Number} y 
     * @param {Number} z
     * @public
     */
    setRotationPoint (x, y, z) {
        this.rotationPoint = [x, y, z]
    }

    /**
     * Setting rotation values of parent object.
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} z
     * @public
     */
    setParentRotation (x, y, z) {
        this.parentRotation = [x, y, z]
    }

    /**
     * Set scaling for object.
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} z 
     * @public
     */
    scale (x, y, z) {
        this.scaling = [x, y, z]
    }

    /**
     * Default animation function.
     * @private
     */
    animation () {
        this.rotate(0, 0, 0)
    }

    /**
     * Sets the animation function which execute every engine update.
     * @param {Number} fps
     * @param {Function} [animateFunction] default - animation function.
     * @public
     */
    animate (fps, animateFunction) {
        animateFunction = animateFunction || this.animation
        setInterval(animateFunction, 1000 / fps)
    }

    /**
     * Function detaches from engine. If you need to clean memory, you this method and then you default javascript operator `delete`.
     * @public
     */
    destroy() {
        this.engine.splice(this.engine.objects.indexOf(this), 1)
    }

    /**
     * Function to compile object from text of .obj file.
     * @param {String} fileText
     * @public
     */
    compile(fileText) {
        let vertexes = []
        let textureCoords = []
        let normals = []
        let splitted = fileText.split('\n')
        let collisionBox = {
            x: [0, 0],
            y: [0, 0],
            z: [0, 0]
        }
        splitted.forEach(element => {
            let values = element.split(' ')
            let name = 0
            
            for(let i = values.length; i--;){
                if (values[i] == "" || values[i] == "\r")
                    values.splice(i, 1);
            }

            if (values[name] == 'v') {
                let v1 = parseFloat(values[1])
                let v2 = parseFloat(values[2])
                let v3 = parseFloat(values[3])
                if (collisionBox.x[1] < v1) {
                    collisionBox.x[1] = v1 
                }
                if (collisionBox.y[1] < v2) {
                    collisionBox.y[1] = v2 
                }
                if (collisionBox.z[1] < v3) {
                    collisionBox.z[1] = v3 
                }
                if (collisionBox.x[0] > v1) {
                    collisionBox.x[0] = v1 
                }
                if (collisionBox.y[0] > v2) {
                    collisionBox.y[0] = v2 
                }
                if (collisionBox.z[0] > v3) {
                    collisionBox.z[0] = v3 
                }
                vertexes.push([v1, v2, v3])
            } else if (values[name] == 'vn') {
                normals.push([parseFloat(values[1]), 
                                   parseFloat(values[2]),
                                   parseFloat(values[3])])
            } else if (values[name] == 'vt') {
                textureCoords.push([parseFloat(values[1]), 
                                   parseFloat(values[2])])
            } else if (values[name] == "f") {
                for (let i = 1; i < values.length; i++) {
                    const face = values[i].split('/');
                    if (face[length - 1] == "\r") {
                        break;
                    }
                    let faceVertexes = null, faceTextureCoords = null, faceNormals
                    for (let k = 0; k < this.faces.length; k++) {
                        const element = this.faces[k];
                        if (element.vertexesCount == values.length - 1) {
                            faceVertexes = element.vertexes
                            faceTextureCoords = element.textureCoords
                            faceNormals = element.normals
                        }
                    }
                    if (faceVertexes == null) {
                        this.faces.push({
                            vertexesCount: values.length - 1,
                            vertexes: [],
                            textureCoords: [],
                            normals: []
                        })
                        faceVertexes = this.faces[this.faces.length - 1].vertexes
                        faceTextureCoords = this.faces[this.faces.length - 1].textureCoords
                        faceNormals = this.faces[this.faces.length - 1].normals
                    } 
                    let vertexPosition = parseFloat(face[0])
                        if (vertexPosition < 0) vertexPosition = vertexes.length + vertexPosition + 1
                    let textureCoordPosition = parseFloat(face[1])
                        if (textureCoordPosition < 0) textureCoordPosition = textureCoords.length + textureCoordPosition + 1 
                    let normalPosition = parseFloat(face[2])
                        if (normalPosition < 0) normalPosition = normals.length + normalPosition + 1
                    vertexes[vertexPosition - 1].forEach(vertex => {
                        faceVertexes.push(vertex)
                    })
                    if (textureCoords.length > 0) {
                        textureCoords[textureCoordPosition - 1].forEach(textureCoord => {
                            faceTextureCoords.push(textureCoord)
                        })
                    }
                    
                    if (face[2] != undefined) {
                        normals[normalPosition - 1].forEach(normal => {
                            faceNormals.push(normal)
                        })
                    } else {
                        faceNormals.push(0, 0, 0)
                    }
                }
            }
        });
        for (let i = 0; i < this.faces.length; i++) {
            const element = this.faces[i];
            element.vertexesBuffer = this.webGL.createBuffer()
            this.webGL.bindBuffer(this.webGL.ARRAY_BUFFER, element.vertexesBuffer)
            this.webGL.bufferData(this.webGL.ARRAY_BUFFER, new Float32Array(element.vertexes), this.webGL.STATIC_DRAW);

            element.coordsBuffer = this.webGL.createBuffer()
            this.webGL.bindBuffer(this.webGL.ARRAY_BUFFER, element.coordsBuffer)
            this.webGL.bufferData(this.webGL.ARRAY_BUFFER, new Float32Array(element.textureCoords), this.webGL.STATIC_DRAW)
        
            element.normalBuffer = this.webGL.createBuffer();
            this.webGL.bindBuffer(this.webGL.ARRAY_BUFFER, element.normalBuffer);
            this.webGL.bufferData(this.webGL.ARRAY_BUFFER, new Float32Array(element.normals), this.webGL.STATIC_DRAW);
        }
        this.collisionBoxes.push(collisionBox)
    }

    /**
     * Async load object using ajax and compile on load.
     * @param {String} path
     * @public
     */
    loadFromObj (path) {
        let self = this
        let objectsLoader = new XMLHttpRequest();
        objectsLoader.open('GET', path);
        objectsLoader.onreadystatechange = function() {
            if (objectsLoader.readyState == 4) {
                self.compile(objectsLoader.responseText)
            }
        }
        objectsLoader.send();
    }
}
