import { screenToCanvas } from './utils'

export class Camera {
  private _x: number = 0
  private _y: number = 0
  private _z: number = 1

  constructor() {}

  get x(): number {
    return this._x
  }
  get y(): number {
    return this._y
  }
  get z(): number {
    return this._z
  }

  set x(value: number) {
    this._x = value
  }
  set y(value: number) {
    this._y = value
  }
  set z(value: number) {
    this._z = value
  }

  public pan(dx: number, dy: number): void {
    this.x = this.x - dx / this.z
    this.y = this.y - dy / this.z
    this.z = this.z
  }

  public zoom(point: Point, dz: number): void {
    const tmp = { x: this.x, y: this.y, z: this.z }
    const zoom = Math.min(Math.max(tmp.z - dz * tmp.z * 0.5, 0.3), 10)
    const p1 = screenToCanvas(point, tmp)
    const p2 = screenToCanvas(point, { ...tmp, z: zoom })

    this.x = tmp.x + (p2.x - p1.x)
    this.y = tmp.y + (p2.y - p1.y)
    this.z = zoom
  }
}
