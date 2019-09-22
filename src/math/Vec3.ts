export class Vec3 {
  public x: number = 0
  public y: number = 0
  public z: number = 0

  constructor(x: number, y: number, z: number) {
    this.set(x, y, z)
  }

  public set(x: number, y: number, z: number) {
    this.x = x
    this.y = y
    this.z = z
  }

  public move(x: number, y: number, z: number) {
    this.x += x
    this.y += y
    this.z += z
  }

  toArray() {
    return [this.x, this.y, this.z]
  }
}