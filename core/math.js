class Vector2 {
    constructor (x, y) {
        this.x = x
        this.y = y
    }
    set () {
        this.x = x
        this.y = y
    }
    addScalar (a, b) {
        this.x = a
        this.y = b
    }
}


class Vector3 {
    constructor(x, y, z) {
        this.x = x
        this.y = y
        this.z = z
    }
    set (x, y, z) {
        this.x = x
        this.y = y
        this.z = z
    }
}

/**
 * Converting radians to degress
 * @param {Number} rad radians
 * @return {Number} degress
 */
function radToDeg(rad) {
    return rad * 180 / Math.PI;
}

/**
 * Converting degress to radians
 * @param {Number} deg
 * @return {Number} radians
 */
function degToRad(deg) {
    return deg * Math.PI / 180;
}


/**
 * Normalize a vector.
 * @param {Array[3]} vector vector to normalize.
 * @return {Array[3]} normalized vector
 */
function normalize (vector) {
    let result = new Float32Array(3);
    let length = Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1] + vector[2] * vector[2]);
    if (length > 0.00001) {
        result[0] = vector[0] / length;
        result[1] = vector[1] / length;
        result[2] = vector[2] / length;
        return result
    }
    else {
        return false
    }
}

/**
 * Sub vector3 a and vector3 b.
 * @param {Array} a vector 3.
 * @param {Array} b vector 3.
 * @return {Float32Array} result.
 */
function subVec3 (a, b) {
    let result = new Float32Array(3);
    result[0] = a[0] - b[0];
    result[1] = a[1] - b[1];
    result[2] = a[2] - b[2];
    return result;
}

/**
   * Computes the cross product of 2 vectors 3.
   * @param {Array} a vector 3.
   * @param {Array} b vector 3.
   * @return {Float32Array} result
   * @memberOf module:webgl-3d-math
   */
function cross(a, b) {
    let result =  new Float32Array(3);
    result[0] = a[1] * b[2] - a[2] * b[1];
    result[1] = a[2] * b[0] - a[0] * b[2];
    result[2] = a[0] * b[1] - a[1] * b[0];
    return result;
}

/**
   * Computes the inverse of a matrix.
   * @param {Matrix4} m matrix to compute inverse of
   * @return {Matrix4} result or a new matrix
   */
  function inverse(m) {
    let result = new Float32Array(16);
    let m00 = m[0 * 4 + 0];
    let m01 = m[0 * 4 + 1];
    let m02 = m[0 * 4 + 2];
    let m03 = m[0 * 4 + 3];
    let m10 = m[1 * 4 + 0];
    let m11 = m[1 * 4 + 1];
    let m12 = m[1 * 4 + 2];
    let m13 = m[1 * 4 + 3];
    let m20 = m[2 * 4 + 0];
    let m21 = m[2 * 4 + 1];
    let m22 = m[2 * 4 + 2];
    let m23 = m[2 * 4 + 3];
    let m30 = m[3 * 4 + 0];
    let m31 = m[3 * 4 + 1];
    let m32 = m[3 * 4 + 2];
    let m33 = m[3 * 4 + 3];
    let tmp_0  = m22 * m33;
    let tmp_1  = m32 * m23;
    let tmp_2  = m12 * m33;
    let tmp_3  = m32 * m13;
    let tmp_4  = m12 * m23;
    let tmp_5  = m22 * m13;
    let tmp_6  = m02 * m33;
    let tmp_7  = m32 * m03;
    let tmp_8  = m02 * m23;
    let tmp_9  = m22 * m03;
    let tmp_10 = m02 * m13;
    let tmp_11 = m12 * m03;
    let tmp_12 = m20 * m31;
    let tmp_13 = m30 * m21;
    let tmp_14 = m10 * m31;
    let tmp_15 = m30 * m11;
    let tmp_16 = m10 * m21;
    let tmp_17 = m20 * m11;
    let tmp_18 = m00 * m31;
    let tmp_19 = m30 * m01;
    let tmp_20 = m00 * m21;
    let tmp_21 = m20 * m01;
    let tmp_22 = m00 * m11;
    let tmp_23 = m10 * m01;

    let t0 = (tmp_0 * m11 + tmp_3 * m21 + tmp_4 * m31) -
        (tmp_1 * m11 + tmp_2 * m21 + tmp_5 * m31);
    let t1 = (tmp_1 * m01 + tmp_6 * m21 + tmp_9 * m31) -
        (tmp_0 * m01 + tmp_7 * m21 + tmp_8 * m31);
    let t2 = (tmp_2 * m01 + tmp_7 * m11 + tmp_10 * m31) -
        (tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31);
    let t3 = (tmp_5 * m01 + tmp_8 * m11 + tmp_11 * m21) -
        (tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21);

    let d = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3);

    result[0] = d * t0;
    result[1] = d * t1;
    result[2] = d * t2;
    result[3] = d * t3;
    result[4] = d * ((tmp_1 * m10 + tmp_2 * m20 + tmp_5 * m30) -
          (tmp_0 * m10 + tmp_3 * m20 + tmp_4 * m30));
    result[5] = d * ((tmp_0 * m00 + tmp_7 * m20 + tmp_8 * m30) -
          (tmp_1 * m00 + tmp_6 * m20 + tmp_9 * m30));
    result[6] = d * ((tmp_3 * m00 + tmp_6 * m10 + tmp_11 * m30) -
          (tmp_2 * m00 + tmp_7 * m10 + tmp_10 * m30));
    result[7] = d * ((tmp_4 * m00 + tmp_9 * m10 + tmp_10 * m20) -
          (tmp_5 * m00 + tmp_8 * m10 + tmp_11 * m20));
    result[8] = d * ((tmp_12 * m13 + tmp_15 * m23 + tmp_16 * m33) -
          (tmp_13 * m13 + tmp_14 * m23 + tmp_17 * m33));
    result[9] = d * ((tmp_13 * m03 + tmp_18 * m23 + tmp_21 * m33) -
          (tmp_12 * m03 + tmp_19 * m23 + tmp_20 * m33));
    result[10] = d * ((tmp_14 * m03 + tmp_19 * m13 + tmp_22 * m33) -
          (tmp_15 * m03 + tmp_18 * m13 + tmp_23 * m33));
    result[11] = d * ((tmp_17 * m03 + tmp_20 * m13 + tmp_23 * m23) -
          (tmp_16 * m03 + tmp_21 * m13 + tmp_22 * m23));
    result[12] = d * ((tmp_14 * m22 + tmp_17 * m32 + tmp_13 * m12) -
          (tmp_16 * m32 + tmp_12 * m12 + tmp_15 * m22));
    result[13] = d * ((tmp_20 * m32 + tmp_12 * m02 + tmp_19 * m22) -
          (tmp_18 * m22 + tmp_21 * m32 + tmp_13 * m02));
    result[14] = d * ((tmp_18 * m12 + tmp_23 * m32 + tmp_15 * m02) -
          (tmp_22 * m32 + tmp_14 * m02 + tmp_19 * m12));
    result[15] = d * ((tmp_22 * m22 + tmp_16 * m02 + tmp_21 * m12) -
          (tmp_20 * m12 + tmp_23 * m22 + tmp_17 * m02));

    return result;
  }


class MatrixesClass {
    /**
     * Returns translation matrix.
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} z 
     */
    translation (x, y, z) {
        return [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            x, y, z, 1
        ]
    }

    /**
     * Returns rotation matrix for x axis.
     * @param {Number} angle angle in radians
     */
    rotationX (angle) {
        let c = Math.cos(angle)
        let s = Math.sin(angle)

        return [
            1, 0, 0, 0,
            0, c, s, 0,
            0, -s, c, 0,
            0, 0, 0, 1
        ]
    }

    /**
     * Returns rotation matrix for y axis.
     * @param {Number} angle angle in radians
     */
    rotationY (angle) {
        let c = Math.cos(angle)
        let s = Math.sin(angle)

        return [
            c, 0, -s, 0,
            0, 1, 0, 0,
            s, 0, c, 0,
            0, 0, 0, 1
        ]
    }

    /**
     * Returns rotation matrix for z axis.
     * @param {Number} angle angle in radians
     */
    rotationZ (angle) {
        let c = Math.cos(angle)
        let s = Math.sin(angle)

        return [
            c, s, 0, 0,
            -s, c, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]
    }

    /**
     * Returns scaling matrix for every axis
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} z 
     */
    scaling (x, y, z) {
        return [
            x, 0, 0, 0,
            0, y, 0, 0,
            0, 0, z, 0,
            0, 0, 0, 1
        ]
    }

    multiply (matrix1, matrix2) {
        let a00 = matrix1[0 * 4 + 0]
        let a01 = matrix1[0 * 4 + 1]
        let a02 = matrix1[0 * 4 + 2]
        let a03 = matrix1[0 * 4 + 3]
        let a10 = matrix1[1 * 4 + 0]
        let a11 = matrix1[1 * 4 + 1]
        let a12 = matrix1[1 * 4 + 2]
        let a13 = matrix1[1 * 4 + 3]
        let a20 = matrix1[2 * 4 + 0]
        let a21 = matrix1[2 * 4 + 1]
        let a22 = matrix1[2 * 4 + 2]
        let a23 = matrix1[2 * 4 + 3]
        let a30 = matrix1[3 * 4 + 0]
        let a31 = matrix1[3 * 4 + 1]
        let a32 = matrix1[3 * 4 + 2]
        let a33 = matrix1[3 * 4 + 3]
        let b00 = matrix2[0 * 4 + 0]
        let b01 = matrix2[0 * 4 + 1]
        let b02 = matrix2[0 * 4 + 2]
        let b03 = matrix2[0 * 4 + 3]
        let b10 = matrix2[1 * 4 + 0]
        let b11 = matrix2[1 * 4 + 1]
        let b12 = matrix2[1 * 4 + 2]
        let b13 = matrix2[1 * 4 + 3]
        let b20 = matrix2[2 * 4 + 0]
        let b21 = matrix2[2 * 4 + 1]
        let b22 = matrix2[2 * 4 + 2]
        let b23 = matrix2[2 * 4 + 3]
        let b30 = matrix2[3 * 4 + 0]
        let b31 = matrix2[3 * 4 + 1]
        let b32 = matrix2[3 * 4 + 2]
        let b33 = matrix2[3 * 4 + 3]
        return [
            b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
            b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
            b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
            b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,
            b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
            b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
            b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
            b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,
            b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
            b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
            b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
            b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,
            b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
            b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
            b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
            b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33
        ]
    }
}


var Matrixes = new MatrixesClass()


class ProjectionMatrix {
    /**
     * Creating matrix Projection matrix.
     * @param {Number} width canvas width. 
     * @param {Number} height canvas height.
     * @param {Number} depth 
     */
    constructor (width, height, depth) {
        this.matrix = [
            2 / width, 0, 0, 0,
            0, -2 / height, 0, 0,
            0, 0, 2 / depth, 0,
            -1, 1, 0, 1
        ]
        return this
    }


    perspective (fieldOfViewInRadians, width, height, near, far) {
        var f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewInRadians);
        var rangeInv = 1.0 / (near - far);
        
        return [
            f / (width / height), 0, 0, 0,
            0, f, 0, 0,
            0, 0, (near + far) * rangeInv, -1,
            0, 0, near * far * rangeInv * 2, 0
        ];
    }
    
    /**
     * Mupltiplying this matrix by another
     * @param {Array} matrix 
     */
    multiply (matrix) {
        let a00 = this.matrix[0 * 4 + 0]
        let a01 = this.matrix[0 * 4 + 1]
        let a02 = this.matrix[0 * 4 + 2]
        let a03 = this.matrix[0 * 4 + 3]
        let a10 = this.matrix[1 * 4 + 0]
        let a11 = this.matrix[1 * 4 + 1]
        let a12 = this.matrix[1 * 4 + 2]
        let a13 = this.matrix[1 * 4 + 3]
        let a20 = this.matrix[2 * 4 + 0]
        let a21 = this.matrix[2 * 4 + 1]
        let a22 = this.matrix[2 * 4 + 2]
        let a23 = this.matrix[2 * 4 + 3]
        let a30 = this.matrix[3 * 4 + 0]
        let a31 = this.matrix[3 * 4 + 1]
        let a32 = this.matrix[3 * 4 + 2]
        let a33 = this.matrix[3 * 4 + 3]
        let b00 = matrix[0 * 4 + 0]
        let b01 = matrix[0 * 4 + 1]
        let b02 = matrix[0 * 4 + 2]
        let b03 = matrix[0 * 4 + 3]
        let b10 = matrix[1 * 4 + 0]
        let b11 = matrix[1 * 4 + 1]
        let b12 = matrix[1 * 4 + 2]
        let b13 = matrix[1 * 4 + 3]
        let b20 = matrix[2 * 4 + 0]
        let b21 = matrix[2 * 4 + 1]
        let b22 = matrix[2 * 4 + 2]
        let b23 = matrix[2 * 4 + 3]
        let b30 = matrix[3 * 4 + 0]
        let b31 = matrix[3 * 4 + 1]
        let b32 = matrix[3 * 4 + 2]
        let b33 = matrix[3 * 4 + 3]
        this.matrix = [
            b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
            b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
            b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
            b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,
            b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
            b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
            b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
            b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,
            b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
            b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
            b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
            b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,
            b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
            b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
            b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
            b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33
        ]
    }

    /**
     * Return multyply this matrix by another
     * @param {Array} matrix
     * @return {Array} result of multiply
     */
    multiply_ (matrix) {
        let a00 = this.matrix[0 * 4 + 0]
        let a01 = this.matrix[0 * 4 + 1]
        let a02 = this.matrix[0 * 4 + 2]
        let a03 = this.matrix[0 * 4 + 3]
        let a10 = this.matrix[1 * 4 + 0]
        let a11 = this.matrix[1 * 4 + 1]
        let a12 = this.matrix[1 * 4 + 2]
        let a13 = this.matrix[1 * 4 + 3]
        let a20 = this.matrix[2 * 4 + 0]
        let a21 = this.matrix[2 * 4 + 1]
        let a22 = this.matrix[2 * 4 + 2]
        let a23 = this.matrix[2 * 4 + 3]
        let a30 = this.matrix[3 * 4 + 0]
        let a31 = this.matrix[3 * 4 + 1]
        let a32 = this.matrix[3 * 4 + 2]
        let a33 = this.matrix[3 * 4 + 3]
        let b00 = matrix[0 * 4 + 0]
        let b01 = matrix[0 * 4 + 1]
        let b02 = matrix[0 * 4 + 2]
        let b03 = matrix[0 * 4 + 3]
        let b10 = matrix[1 * 4 + 0]
        let b11 = matrix[1 * 4 + 1]
        let b12 = matrix[1 * 4 + 2]
        let b13 = matrix[1 * 4 + 3]
        let b20 = matrix[2 * 4 + 0]
        let b21 = matrix[2 * 4 + 1]
        let b22 = matrix[2 * 4 + 2]
        let b23 = matrix[2 * 4 + 3]
        let b30 = matrix[3 * 4 + 0]
        let b31 = matrix[3 * 4 + 1]
        let b32 = matrix[3 * 4 + 2]
        let b33 = matrix[3 * 4 + 3]
        return [
            b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
            b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
            b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
            b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,
            b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
            b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
            b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
            b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,
            b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
            b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
            b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
            b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,
            b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
            b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
            b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
            b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33
        ]
    }

    /**
     * Multyplying matrix by transition matrix (x, y, z)
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} z 
     */
    translate (x, y, z) {
        this.multiply(Matrixes.translation(x, y, z));
    }

    /**
     * Multyplying matrix by transition matrix (x, y, z)
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} z 
     */
    translate_ (x, y, z) {
        return this.multiply_(Matrixes.translation(x, y, z));
    }

    /**
     * Multiplying matrix by rotationX(angle)
     * @param {Number} angle in radians 
     */
    rotateX (angle) {
        this.multiply(Matrixes.rotationX(angle))
    }

    /**
     * Multiplying matrix by rotationY(angle)
     * @param {Number} angle in radians
     */
    rotateY (angle) {
        this.multiply(Matrixes.rotationY(angle))
    }

    /**
     * Multiplying matrix by rotationZ(angle)
     * @param {Number} angle in radians 
     */
    rotateZ (angle) {
        this.multiply(Matrixes.rotationZ(angle))
    }


    /**
     * Multoplying matrix by scale matrix (x, y, z)
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} z 
     */
    scale (x, y, z) {
        this.multiply(Matrixes.scaling(x, y, z))
    }
}