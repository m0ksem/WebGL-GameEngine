/**
 * Help class for creating user controls.
 * @class
 * @constructor
 * @param {Engine} engine 
 */
export class Controls {
    /**
     * Help class for creating user controls.
     * @param {Engine} engine 
     */
    constructor (engine) {
        engine.controls = this
        this.engine = engine

        /**
         * True if mouse cursor over canvas element.
         * @type {boolean}
         * @readonly
         */
        this.mouseOverCanvas = false

        /**
         * @type {boolean}
         * @private
         */
        this._lockPointer = true

        /**
         * @type {boolean}
         * @public
         */
        this.pointerLocked = false

        /**
         * Rebind
         * @type {boolean}
         * @private 
         */
        this._rebind = true

        /**
         * Rebind
         * @type {boolean}
         * @private 
         */
        this._globalRebind = false

        /**
         * Array in which the true elements if button are pressed. Every element corresponds to the button code.
         * @type {Array.<{boolean}>}
         * @readonly
         */
        this.keys = []

        /**
         * Functions which triggers if key pressed.
         * @type {Array.<{Function}>}
         * @private
         */
        this._handlers = []

        /**
         * Handlers for canvas on focus.
         * @type {Array.{Function}}
         * @private
         */
        this._focusHandlers = []

        /**
         * Handlers for canvas on blur (or un focus).
         * @type {Array.{Function}}
         * @private
         */
        this._blurHandlers = []

        /**
         * Set focus only if canvas clicked like on default input or button. 
         * If [true] then you need to click on canvas before it will be focused.
         * If [false] then you just need to move your cursor over canvas.
         * @type {boolean}
         * @default true
         * @private
         */
        this._focusOnlyIfClick = true

        /**
         * Displays if canvas focused.
         * @type {boolean}
         * @readonly
         */
        this.isFocused = false

        /**
         * Functions which triggers if mouse button pressed.
         * @type {Array.<{Function}>}
         * @private
         */
        this._mouseDownHandlers = [
            null, null,
            null, null, null,
            null
        ]

        /**
         * Functions which triggers if mouse button pressed.
         * @type {Array.<{Function}>}
         * @private
         */
        this._mouseUpHandlers = [
            null, null,
            null, null, null,
            null
        ]

        /**
         * Mouse object which contains position and pressed buttons.
         * @type {Object}
         * @property {Number} x mouse position x.
         * @property {Number} y mouse position y.
         * @property {Array}  buttons mouse buttons clicks.
         * @property {Number} movement.x mouse movement x from last frame.
         * @property {Number} movement.y mouse movement y from last frame.
         * @property {Number} sensitivity sensitivity for mouse movement.
         * @public
         */
        this.mouse = {
            x: 0,
            y: 0,
            buttons: [false, false, false],
            movement: {
                x: 0,
                y: 0
            },
            sensitivity: 1
        }

        /**
         * @type {Object}
         * @property {Number} x mouse position x.
         * @property {Number} y mouse position y.
         * @property {Number} movement.x mouse movement x from last frame.
         * @property {Number} movement.y mouse movement y from last frame.
         * @property {boolean} click is current action is click.
         * @property {boolean} longClick is current action is longClick.
         * @property {Number} duration how long does it take to press.
         * @property {String} actionBeforeMove 'click' or 'long click'
         * @public
         */
        this.touch = {
            x: 0,
            y: 0,
            movement: {
                x: 0,
                y: 0
            },
            click: false,
            longClick: false,
            duration: null,
            actionBeforeMove: null
        }

        /**
         * The time that the user must spend on a long press.
         * A long press counts as a right mouse click.
         * @type {Number} 
         * @default 500
         */
        this.longTouchTime = 500

        this.touchDuration

        for (let i = 0; i < 255; i++) {
            this.keys[i] = false
            this._handlers[i] = null
        }
        window.onkeydown = (event) => {
            if (this.isFocused) {
                if (event.keyCode == 27) {
                    engine.div.blur()
                }
                this.keys[event.keyCode] = true;
                if (this._handlers[event.keyCode] != null) {
                    this._handlers[event.keyCode](event)
                }
                return !this._rebind
            }
            else {
                if (this._globalRebind) {
                    return !this._rebind
                }
                else {
                    return true
                }
            }
        };
        window.onkeyup = (event) => {
            this.keys[event.keyCode] = false;
            return !this._rebind
        };

        engine.div.setAttribute('tabindex','0');


        engine.div.onblur = () => {
            this.isFocused = false
            for (let i = 0; i < this._blurHandlers.length; i++) {
                this._blurHandlers [i]()
            }
        }

        engine.div.onfocus = () => {
            this.isFocused = true
            for (let i = 0; i < this._focusHandlers.length; i++) {
                this._focusHandlers[i]()
            }
        }

        engine.div.onclick = () => {
            if (this._focusOnlyIfClick && !this.isFocused) {
                engine.div.focus()
            }
            if (this._lockPointer) {
                engine.div.requestPointerLock();
            }
        }

        engine.div.oncontextmenu = function () {
            return false;
        }

        if (isTouchDevice()) {
            let toucheTime
            let touchDurationFunction = () => {
                this.touch.duration = new Date().getTime() - toucheTime
                if (this.touch.duration > this.longTouchTime) {
                    this.touch.longClick = true
                    this.touch.click = false
                    clearInterval()
                }
            }
            let durationCalculation
            let touchMoved = false
            engine.div.addEventListener("touchstart", (event) => {
                if (this._mouseDownHandlers[2] != null) this._mouseDownHandlers[2](event)
                durationCalculation = setInterval(touchDurationFunction, 100)
                toucheTime = new Date().getTime()
                this.touch.duration = 0
                touchMoved = false
                return false
            }, false);
            engine.div.addEventListener("touchend", (event) => {
                if (!touchMoved && this.touch.duration < this.longTouchTime) {
                    this.touch.click = true
                    setTimeout(() => {
                        this.touch.click = false
                    }, 100)
                } else {
                    this.touch.actionBeforeMove = false
                }
                lastMousePosition = null
                this.touch.longClick = false
                clearInterval(durationCalculation)
                return false
            }, false);
            let lastMousePosition = null
            engine.div.addEventListener("touchmove", (event) => {
                let mousePos = engine.div.getBoundingClientRect()
                let x = event.touches[0].clientX - mousePos.left
                let y = event.touches[0].clientY - mousePos.top
                this.mouse.x = x
                this.mouse.y = y
                if (lastMousePosition == null) {
                    lastMousePosition = {
                        x: x,
                        y: y
                    }
                }
                let moveX = (x - lastMousePosition.x) * this.mouse.sensitivity
                let moveY = (y - lastMousePosition.y) * this.mouse.sensitivity
                this.mouse.movement.x = moveX
                this.mouse.movement.y = moveY
                lastMousePosition.x = x
                lastMousePosition.y = y
                this.touch.x = x
                this.touch.y = y
                this.touch.movement.x = moveX
                this.touch.movement.y = moveY
                if (!touchMoved) {
                    if (this.touch.duration > this.longTouchTime) {
                        this.touch.actionBeforeMove = 'long click'
                        this.touch.longClick = false
                    } else {
                        this.touch.actionBeforeMove = 'click'
                        this.touch.click = false
                    }
                }
                
                touchMoved = true
                clearInterval(durationCalculation)
            }, false)
        } else {
            let lastMousePosition = null
            engine.div.addEventListener('mousemove', (event) => {
                if (this.isFocused) {
                    if (!this.pointerLocked) {
                        let mousePos = engine.div.getBoundingClientRect()
                        let x = event.clientX - mousePos.left
                        let y = event.clientY - mousePos.top
                        this.mouse.x = x
                        this.mouse.y = y
                        if (lastMousePosition == null) {
                            lastMousePosition = {
                                x: x, 
                                y: y
                            }
                        }
                        this.mouse.movement.x = (x - lastMousePosition.x) * this.mouse.sensitivity
                        this.mouse.movement.y = (y - lastMousePosition.y) * this.mouse.sensitivity
                        lastMousePosition.x   = x
                        lastMousePosition.y   = y
                    } else {
                        this.mouse.movement.x = -event.movementX * this.mouse.sensitivity
                        this.mouse.movement.y = -event.movementY * this.mouse.sensitivity
                        this.mouse.x = this.engine.width / 2
                        this.mouse.y = this.engine.height / 2
                    }
                }
            }, false);

            window.addEventListener('mousemove', (event) => {
                let canvasPos = engine.div.getBoundingClientRect()
                let x = event.clientX
                let y = event.clientY
                if (x < canvasPos.right  && x > canvasPos.left &&
                    y < canvasPos.bottom && y > canvasPos.top    ) {
                    this.mouseOverCanvas = true
                    if (!this._focusOnlyIfClick && !this.isFocused) {
                        engine.div.focus()
                    }
                }
                else {
                    this.mouseOverCanvas = false
                    if (!this._focusOnlyIfClick) {
                        engine.div.blur()
                    }
                }
            })

            engine.div.onmousedown = (event) => {
                if (this.isFocused) {
                    this.mouse.buttons[event.button] = true
                    if (this._mouseDownHandlers[2 + event.button] != null) this._mouseDownHandlers[2 + event.button](event)
                    return false
                }
            }

            engine.div.onmouseup = (event) => {
                this.mouse.buttons[event.button] = false
                if (this._mouseUpHandlers[2 + event.button] != null) this._mouseUpHandlers[2 + event.button](event)
                return false
            }

            document.addEventListener('pointerlockchange', () => {
                if(document.pointerLockElement === engine.div){
                    engine.div.focus()
                    this.pointerLocked = true
                }
                else {
                    engine.div.blur()
                    this.pointerLocked = false
                }
            }, false);
        }
    }

    /**
     * 
     */
    clickForFocus (bool) {
        bool = bool || !this._focusOnlyIfClick
        this._focusOnlyIfClick = bool
    }

    /**
     * Set sensitivity for mouse movement
     * @default 1
     * @param {Number} sensitivity 
     * @public
     */
    setSensitivity (sensitivity) {
        this.mouse.sensitivity = sensitivity
    }

    /**
     * Rebind default browser shortcut actions. Will switch rebind option.
     * @default true
     * @param {boolean} [bool] switch to
     */
    rebindDefaultBrowserActions (bool) {
        bool = bool || !this._rebind
        this._rebind = bool
    }

    /**
     * Rebind default browser shortcut actions on all page. By default rebind occurs only if canvas focused.
     * @default false
     * @param {boolean} bool 
     */
    globalRebind (bool) {
        bool = bool || !this._globalRebind
        this._globalRebind = bool
    }

    /**
     * Adds handler which will execute on canvas focus.
     * @param {Function} handler 
     */
    addOnFocusHandler (handler) {
        this._focusHandlers.push(handler)
    }    

    /**
     * Adds handler which will execute on canvas blur.
     * @param {Function} handler 
     */
    addOnBlurHandler (handler) {
        this._blurHandlers.push(handler)
    }

    /**
     * Sets handler for keyboard key down.
     * @param {Number} keyCode 
     * @param {Function} handler 
     * @public
     */
    onKeyDown(keyCode, handler) {
        this._handlers[keyCode] = handler
    }

    /**
     * Sets handler for mouse key down.
     * @param {Number} keyCode 
     * @param {Function} handler 
     * @public
     */
    onMouseDown(keyCode, handler) {
        this._mouseDownHandlers[2 + keyCode] = handler
    }

    /**
     * Sets handler for mouse key down.
     * @param {Number} keyCode 
     * @param {Function} handler 
     * @public
     */
    onMouseUp(keyCode, handler) {
        this._mouseUpHandlers[2 + keyCode] = handler
    }
    
    /**
     * Sets handler for mouse moving.
     * @param {Function} handler 
     * @public
     */
    onMouseMove(handler) {
        this.engine.div.addEventListener('mousemove', handler, false);
    }

    /**
     * Sets function on right click for context menu.
     * @param {Function} handler 
     * @public
     */
    onContextMenu (handler) {
        this.engine.div.oncontextmenu = handler
    }

    /**
     * Lock pointer on canvas. Useful for FPS Games.
     * @default true
     * @param {boolean} [bool]
     */
    lockPointer (bool) {
        bool = bool || !this._lockPointer
        this._lockPointer = bool
    }
}

function isTouchDevice() {
    let prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');
    let mq = function (query) {
        return window.matchMedia(query).matches;
    }

    if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
        return true;
    }

    var query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('');
    return mq(query);
}
