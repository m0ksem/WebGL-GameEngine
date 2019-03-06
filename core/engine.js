class Engine {
    /**
     * GameEngine core class.
     * @param {HTMLElement} canvas
     */
    constructor (canvas) {
        this.webGL = getWebGL(canvas)
        this.canvas = canvas
        this.width = canvas.width
        this.height = canvas.height
        this.polygons = []
        this.objects = []
        this.textures = []
        this.camera = null
        this.debugger = null
        this.controls = null
        this.selectedObject = null
        
        this._globalPossitionBuffer = this.webGL.createBuffer()
        this.webGL.bindBuffer(this.webGL.ARRAY_BUFFER, this._globalPossitionBuffer)
        this._globalTextureBuffer = this.webGL.createBuffer()
        this.webGL.bindBuffer(this.webGL.ARRAY_BUFFER, this._globalTextureBuffer)

        canvas.addEventListener('resize', function () {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        })

        this.initShaders()
        this.noTexture = new Texture()
        this.noTexture.setColorRGBA(219, 58, 52, 255)
        this.bindTexture(this.noTexture)
    }

    /**
     * Creating shaders and attaching to webGL context.
     */
    initShaders () {
        let vertex = createShaderFromScript("shader/vertex", this.webGL)
        let fragment = createShaderFromScript("shader/fragment", this.webGL)
        this.shaderProgram = createWebGLProgram(this.webGL, vertex, fragment, false)
        this.positionLocation = this.webGL.getAttribLocation(this.shaderProgram, "a_position")
        this.texcoordLocation = this.webGL.getAttribLocation(this.shaderProgram, "a_texcoord")
        this.textureLocation = this.webGL.getUniformLocation(this.shaderProgram, "u_texture")
        this.matrixLocation = this.webGL.getUniformLocation(this.shaderProgram, "u_matrix")
        this.objectRotationLocation = this.webGL.getUniformLocation(this.shaderProgram, "u_objectRotation")
        this.normalLocation = this.webGL.getAttribLocation(this.shaderProgram, "a_normal")
        this.everseLightDirectionLocation = this.webGL.getUniformLocation(this.shaderProgram, "u_reverseLightDirection");
        this.lightWorldPositionLocation = this.webGL.getUniformLocation(this.shaderProgram, "u_lightWorldPosition");
        this.cameraLocation = this.webGL.getUniformLocation(this.shaderProgram, "u_cameraMatrix");

        this.webGL.useProgram(this.shaderProgram)
                this.webGL.viewport(0, 0, this.width, this.height)

        this.webGL.enable(this.webGL.CULL_FACE)
        this.webGL.enable(this.webGL.DEPTH_TEST);
    }
    
    /**
     * @param {Camera} camera
     */
    setCamera (camera) {
        this.camera = camera
    }

    /**
     * Binding texture to engine.
     * @param {Texture} texture 
     */
    bindTexture (texture) {
        texture._textureBlockLocation = this.textures.length
        this.textures.push(texture)
        texture._WebGLtexture = this.webGL.createTexture()
        this.webGL.activeTexture(this.webGL.TEXTURE0 + texture._textureBlockLocation)
        this.webGL.bindTexture(this.webGL.TEXTURE_2D, texture._WebGLtexture)
        if (texture.loaded) {
            this.webGL.texImage2D(this.webGL.TEXTURE_2D, 0, this.webGL.RGBA, this.webGL.RGBA, this.webGL.UNSIGNED_BYTE, texture)
            this.webGL.generateMipmap(this.webGL.TEXTURE_2D)
            if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
                this.webGL.generateMipmap(this.webGL.TEXTURE_2D)
            } else {
                this.webGL.texParameteri(this.webGL.TEXTURE_2D, this.webGL.TEXTURE_WRAP_S, this.webGL.CLAMP_TO_EDGE);
                this.webGL.texParameteri(this.webGL.TEXTURE_2D, this.webGL.TEXTURE_WRAP_T, this.webGL.CLAMP_TO_EDGE);
                this.webGL.texParameteri(this.webGL.TEXTURE_2D, this.webGL.TEXTURE_MIN_FILTER, this.webGL.LINEAR);
            }
        } else {
            this.webGL.texImage2D(this.webGL.TEXTURE_2D, 0, this.webGL.RGBA, 1, 1, 0, this.webGL.RGBA, this.webGL.UNSIGNED_BYTE,
            texture.color);
            texture.addEventListener('load', () => {
                this.webGL.activeTexture(this.webGL.TEXTURE0 + texture._textureBlockLocation)
                this.webGL.texImage2D(this.webGL.TEXTURE_2D, 0, this.webGL.RGBA, this.webGL.RGBA, this.webGL.UNSIGNED_BYTE, texture)
                if (isPowerOf2(texture.width) && isPowerOf2(texture.height)) {
                    this.webGL.generateMipmap(this.webGL.TEXTURE_2D)
                } else {
                    this.webGL.texParameteri(this.webGL.TEXTURE_2D, this.webGL.TEXTURE_WRAP_S, this.webGL.CLAMP_TO_EDGE);
                    this.webGL.texParameteri(this.webGL.TEXTURE_2D, this.webGL.TEXTURE_WRAP_T, this.webGL.CLAMP_TO_EDGE);
                    this.webGL.texParameteri(this.webGL.TEXTURE_2D, this.webGL.TEXTURE_MIN_FILTER, this.webGL.LINEAR);
                }
            })
        }
        
    }

    /**
     * Function to update all positions, size etc.
     */
    update () {
        let temp
        let rot
        let parentRot
        let world
        if (this.camera._controlFunction != null) {
            this.camera._controlFunction()
        }

        this.selectedObject = null

        this.polygons.forEach(element => {           
            temp = new Matrix()
            temp.perspective(this.camera.fieldOfViewRad, this.width, this.height, 1, 20000)
            temp.multiply(this.camera.inserved)
            world = new Matrix()
            world.multiply(inverse(Matrixes.translation(element.rotationPoint[0], element.rotationPoint[1], element.rotationPoint[2])))
            world.translate(element.position[0], element.position[1], element.position[2])
            rot = Matrixes.multiply(Matrixes.rotationX(element.rotation[0]), Matrixes.rotationY(element.rotation[1]))
            rot = Matrixes.multiply(rot, Matrixes.rotationZ(element.rotation[2]))
            if (element.parentRotation != null) {
                parentRot = Matrixes.multiply(Matrixes.rotationX(element.parentRotation[0]), Matrixes.rotationY(element.parentRotation[1]))
                parentRot = Matrixes.multiply(parentRot, Matrixes.rotationZ(element.parentRotation[2]))
                element._world = parentRot
                rot = Matrixes.multiply(parentRot, rot)
            }
            world.multiply(rot)
            
            world.translate(element.rotationPoint[0], element.rotationPoint[1], element.rotationPoint[2])     
            world.scale(1, 1, 1)
                        
            temp.multiply(world.matrix)

            element._matrix = temp.matrix
            element._rotataionMatrix = rot
        })

        this.objects.forEach(element => {           
            temp = new Matrix()
            temp.perspective(this.camera.fieldOfViewRad, this.width, this.height, 1, 20000)
            temp.multiply(this.camera.inserved)
            world = new Matrix()
            world.multiply(inverse(Matrixes.translation(element.rotationPoint[0], element.rotationPoint[1], element.rotationPoint[2])))
            world.translate(element.position[0], element.position[1], element.position[2])
            rot = Matrixes.multiply(Matrixes.rotationX(element.rotation[0]), Matrixes.rotationY(element.rotation[1]))
            rot = Matrixes.multiply(rot, Matrixes.rotationZ(element.rotation[2]))
            parentRot = Matrixes.multiply(Matrixes.rotationX(element.parentRotation[0]), Matrixes.rotationY(element.parentRotation[1]))
            parentRot = Matrixes.multiply(parentRot, Matrixes.rotationZ(element.parentRotation[2]))
            element._world = parentRot
            rot = Matrixes.multiply(parentRot, rot)
            world.multiply(rot)
            
            world.translate(element.rotationPoint[0], element.rotationPoint[1], element.rotationPoint[2])     
            world.scale(element.scaling[0], element.scaling[1], element.scaling[2])
                        
            temp.multiply(world.matrix)

            let mouseOverHitBox = false
            element.collisionBoxes.forEach(collisionBox => {
                let boxInPixels = []
                for (let ix = 0; ix < collisionBox.x.length; ix++) {
                    const x = collisionBox.x[ix];
                    for (let iy = 0; iy < collisionBox.y.length; iy++) {
                        const y = collisionBox.y[iy];
                        for (let iz = 0; iz < collisionBox.z.length; iz++) {
                            const z = collisionBox.z[iz];
                            let coordsInPixels = Matrixes.transformVector(temp.matrix, [x, y, z, 1])
                                coordsInPixels[0] =  coordsInPixels[0] / coordsInPixels[3]
                                coordsInPixels[1] =  coordsInPixels[1] / coordsInPixels[3]
                                coordsInPixels[0] = (coordsInPixels[0] *  0.5 + 0.5) * this.width;
                                coordsInPixels[1] = (coordsInPixels[1] * -0.5 + 0.5) * this.height;
                                if (coordsInPixels[0] > -this.width && coordsInPixels[0] < this.width &&
                                    coordsInPixels[1] > -this.height && coordsInPixels[1] < this.height)
                                    boxInPixels.push({x: coordsInPixels[0], y: coordsInPixels[1]})
                        }
                    }
                }

                let smallest = [10000,  10000]
                let biggest = [-10000, -10000]
                for (let i = 0; i < boxInPixels.length; i++) {
                    const box = boxInPixels[i];
                    if (box.x < smallest[0]) {
                        smallest[0] = box.x
                    } else if (box.x > biggest[0]) {
                        biggest[0] = box.x
                    }
                    if (box.y < smallest[1]) {
                        smallest[1] = box.y
                    } else if (box.y > biggest[1]) {
                        biggest[1] = box.y
                    }
                }

                if (this.controls.mouse.x > smallest[0] && this.controls.mouse.x < biggest[0] &&
                    this.controls.mouse.y > smallest[1] && this.controls.mouse.y < biggest[1]   ) {
                    mouseOverHitBox = true
                }


                let mouse = this.controls.mouse
                if (mouseOverHitBox) {
                    this.selectedObject = element
                    this.debugger.logArray[2].output = function () {
                        return "Hitbox x " + mouse.x + " > " + smallest[0] + " && " + mouse.x + " < " + biggest[0]
                    }
                    this.debugger.logArray[3].output = function () {
                        return "Hitbox y " + mouse.y + " > " + smallest[1] + " && " + mouse.y + " < " + biggest[1]
                    }
                }
            })

            let selectedObject = this.selectedObject
            if (selectedObject != null) {
                this.debugger.logArray[4].output = function () {
                    return "Mouse over " + selectedObject.name
                }
            } else {
                this.debugger.logArray[4].output = function () {
                    return "There are no objects over mouse"
                }
            }

            element._matrix = temp.matrix
            element._rotataionMatrix = rot
        })
    }

    /**
     * Main drawing function. All polygons are drawn here.
     */
    draw () {
        this.webGL.clear(this.webGL.COLOR_BUFFER_BIT | this.webGL.DEPTH_BUFFER_BIT);

        this.webGL.uniform3fv(this.everseLightDirectionLocation, normalize([-0.1, 0.5, 1]))
        this.webGL.uniform3fv(this.lightWorldPositionLocation, [0, 100, 400]);
        this.webGL.uniformMatrix4fv(this.cameraLocation, false, this.camera.matrix)

        this.polygons.forEach(element => {
            this.webGL.enableVertexAttribArray(this.positionLocation)
            this.webGL.bindBuffer(this.webGL.ARRAY_BUFFER, element._vertexesBuffer)
            this.webGL.vertexAttribPointer(
                this.positionLocation, 3, this.webGL.FLOAT, false, 0, 0
            )
    
            this.webGL.enableVertexAttribArray(this.texcoordLocation)
            this.webGL.bindBuffer(this.webGL.ARRAY_BUFFER, element._coordsBuffer)
            this.webGL.vertexAttribPointer(
                this.texcoordLocation, 2, this.webGL.FLOAT, false, 0, 0
            )

            this.webGL.enableVertexAttribArray(this.normalLocation);
            this.webGL.bindBuffer(this.webGL.ARRAY_BUFFER, element._normalBuffer);
            this.webGL.vertexAttribPointer(
                this.normalLocation, 3, this.webGL.FLOAT, false, 0, 0)

            this.webGL.uniform1i(this.textureLocation, element.texture._textureBlockLocation)
            this.webGL.uniformMatrix4fv(this.matrixLocation, false, element._matrix)
            this.webGL.uniformMatrix4fv(this.objectRotationLocation, false, element._world)

            this.webGL.drawArrays(this.webGL.TRIANGLES, 0, 3)
        });

        this.objects.forEach(o => {
            o.faces.forEach(face => {
                // console.log(face)
               
                this.webGL.enableVertexAttribArray(this.positionLocation)
                this.webGL.bindBuffer(this.webGL.ARRAY_BUFFER, face.vertexesBuffer)
                this.webGL.vertexAttribPointer(
                    this.positionLocation, 3, this.webGL.FLOAT, false, 0, 0
                )

                this.webGL.enableVertexAttribArray(this.texcoordLocation)
                this.webGL.bindBuffer(this.webGL.ARRAY_BUFFER, face.coordsBuffer)
                this.webGL.vertexAttribPointer(
                    this.texcoordLocation, 2, this.webGL.FLOAT, false, 0, 0
                )

                this.webGL.enableVertexAttribArray(this.normalLocation);
                this.webGL.bindBuffer(this.webGL.ARRAY_BUFFER, face.normalBuffer);
                this.webGL.vertexAttribPointer(
                    this.normalLocation, 3, this.webGL.FLOAT, false, 0, 0)

                this.webGL.uniform1i(this.textureLocation, o.texture._textureBlockLocation)
                this.webGL.uniformMatrix4fv(this.matrixLocation, false, o._matrix)
                this.webGL.uniformMatrix4fv(this.objectRotationLocation, false, o._world)
                
                this.webGL.drawArrays(this.webGL.TRIANGLES, 0, face.vertexes.length / face.vertexesCount)
            })
        });
        if (this.debugger != null) {
            this.debugger.updateInfo()
        }
        // alert()
    }

    /**
     * Rendering function.
     */
    render () {
        this.update()
        this.draw()
    }

    /**
     * Start rendering.
     */
    run () {
        e = this
        requestAnimationFrameEngine()
    }
}


class Camera {
    /**
     * Creates camera object
     */
    constructor () {
        this.position = [0, 0, 100]
        this.up = [0, 1, 0]
        this.target = [0, 0, 0]
        this.fieldOfView = 90
        this.fieldOfViewRad = degToRad(90)
        this.matrix = Matrixes.unit()
        this.position = [0, 0, 0]
        this.rotation = [0, 0, 0]
        this._collisions = false
        this._lookUpMatrix = null
    }

    /**
     * Sets field of view for camera
     * @param {Number} angle 
     */
    setFieldOfView (angle) {
        this.fieldOfView = angle;
        this.fieldOfViewRad = degToRad(angle)
    }

    /**
     * Sets collision
     * @param {*} bool 
     */
    setCollisions (bool) {
        this._collisions = bool
    }

    /**
     * Absolutly sets position for camera
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} z 
     */
    setPosition (x, y, z) {
        this.position = [x, y, z]
        this.computeMatrix()
    }

    /**
     * Moving camera
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} z 
     */
    move (x, y, z) {
        // let translationMatrix = Matrixes.translation(x, y, z)
        // let matrix = Matrixes.multiply(translationMatrix, this.rotationMatrix)
        // let xt = this.rotationMatrix[0] * x + this.rotationMatrix[1] * y + this.rotationMatrix[2] * z + this.rotationMatrix[3]
        // let yt = y//this.rotationMatrix[4] * x + this.rotationMatrix[5] * y + this.rotationMatrix[6] * z + this.rotationMatrix[7]
        // let zt = this.rotationMatrix[8] * x + this.rotationMatrix[9] * y + this.rotationMatrix[10] * z + this.rotationMatrix[11]
        this.position[0] += x
        this.position[1] += y
        this.position[2] += z
        this.computeMatrix()
    }

    /**
     * Rotate for x, y, z deggres.
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} z 
     */
    rotate (x, y, z) {
        this.rotation[0] += x
        this.rotation[1] += y
        this.rotation[2] += z
        this.computeMatrix()
    }

    setRotation (x, y, z) {
        this.rotation = [x, y, z]
        this.computeMatrix()
    }

    computeMatrix () {
        this.matrix = Matrixes.unit()
        this.matrix = Matrixes.multiply(this.matrix, Matrixes.translation(this.position[0], this.position[1], this.position[2]))
        let rotation = new Matrix()
        rotation.multiply(Matrixes.rotationY(degToRad(this.rotation[1])))
        rotation.multiply(Matrixes.rotationX(degToRad(this.rotation[0])))
        rotation.multiply(Matrixes.rotationZ(degToRad(this.rotation[2])))
        this.matrix = Matrixes.multiply(this.matrix, rotation.matrix)
        if (this._lookUpMatrix != null) {
            this.matrix = Matrixes.multiply(this.matrix, 
            this.lookAt(
                camera._lookUpMatrix,
                [0, 1, 0]
            )
            )
        }
        this.rotationMatrix = inverse(rotation.matrix)
        this.inserved = inverse(this.matrix)
    }

    /**
     * Sets fuction to control camera.
     * @param {Function} handler 
     */
    setControl (handler) {
        this._controlFunction = handler
    }


    setLookUp(x, y, radius) {
        if (x == null) {
            this._lookUpMatrix = null
            return
        }
        this._lookUpMatrix = [x, y, radius]
    }

    /**
     * @deprecated
     * @param {*} result 
     */
    lookAt(target, up) {
        if (target != null) {
            var zAxis = normalize(
                subVec3(this.position, target));
            var xAxis = normalize(cross(up, zAxis));
            var yAxis = normalize(cross(zAxis, xAxis));
            
            return [
                xAxis[0], xAxis[1], xAxis[2], 0,
                yAxis[0], yAxis[1], yAxis[2], 0,
                zAxis[0], zAxis[1], zAxis[2], 0,
                this.position[0],
                this.position[1],
                this.position[2],
                1,
            ];
        }
        else {
            return [
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 0
            ]
        }
    }
}


class Controls {
    /**
     * Help class for creating user controls
     * @param {Engine} engine 
     */
    constructor (engine) {
        engine.controls = this
        this.keys = []
        this._handlers = []
        this._mouseHandlers = [
            null, null,
            null, null, null,
            null
        ]
        this.mouse = {
            x: 0,
            y: 0,
            buttons: [false, false, false]
        }

        let self = this

        for (let i = 0; i < 255; i++) {
            this.keys[i] = false
            this._handlers[i] = null
        }
        window.onkeydown = function(event){
            self.keys[event.keyCode] = true;
            if (self._handlers[event.keyCode] != null) {
                self._handlers[event.keyCode]()
            }
        };
        window.onkeyup = function(event){
            self.keys[event.keyCode] = false;
        };

        engine.canvas.addEventListener('mousemove', function (evt) {
            let mousePos = engine.canvas.getBoundingClientRect()
            let x = evt.clientX - mousePos.left
            let y = evt.clientY - mousePos.top
            self.mouse.x = x
            self.mouse.y = y
        }, false);

        window.onmousedown = function (event) {
            self.mouse.buttons[event.button] = true
            if (self._mouseHandlers[2 + event.button] != null) self._mouseHandlers[2 + event.button]()
        }

        window.onmouseup = function (event) {
            self.mouse.buttons[event.button] = false
        }
    }

    /**
     * Sets handler for keyboard key down
     * @param {Number} keyCode 
     * @param {Function} handler 
     */
    onKeyDown(keyCode, handler) {
        this._handlers[keyCode] = handler
    }

    /**
     * Sets handler for mouse key down.
     * @param {Number} keyCode 
     * @param {Function} handler 
     */
    onMouseDown(keyCode, handler) {
        this._mouseHandlers[2 + keyCode] = handler
    }
    
    /**
     * Sets handler for mouse moving
     * @param {Function} handler 
     */
    onMouseMove(handler) {
        engine.canvas.addEventListener('mousemove', handler, false);
    }
}

class Debugger {
    /**
     * Debuger for engine.
     * @param {Engine} engine 
     */
    constructor(engine) {
        engine.debugger = this
        this.logArray = []
        this.element = null
    }

    setElemenent(element) {
        this.element = element
    }

    addLog(name, object, value, view, output) {
        output = output || this.defaultOutput
        this.logArray.push({name: name, object: object, value: value, view: view, output: output})
        this.addView(view)
    }

    createLogView () {
        let node = document.createElement('p')
        return node
    }

    defaultOutput (log) {
        return log.name + " : " + log.object[log.value]
    }

    addView(view) {
        this.element.appendChild(view)
    }

    updateInfo () {
        this.logArray.forEach(e => {
            e.view.innerText = e.output(e)
        })
    }
}


let e

/**
 * RequestAnimationFrame wrapper for Engine rendering.
 */
function requestAnimationFrameEngine () { 
    requestAnimationFrame(requestAnimationFrameEngine)
    e.render()
}


(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame']
                                   || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());
