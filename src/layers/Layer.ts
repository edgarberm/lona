import uuidv4 from '../utils/uuidv4'

export default abstract class Layer {
  private _id: string = uuidv4()
  private _x: number = 0
  private _y: number = 0
  private _active: boolean = false
  private _rotation: number = 0
  private _rect: DOMRect = new DOMRect()

  constructor(protected context: CanvasRenderingContext2D) {}

  get id(): string {
    return this._id
  }

  set id(id: string) {
    this._id = id
  }

  get x(): number {
    return this._x
  }

  set x(x: number) {
    this._x = x
  }

  get y(): number {
    return this._y
  }

  set y(y: number) {
    this._y = y
  }

  get active(): boolean {
    return this._active
  }

  set active(active: boolean) {
    this._active = active
  }

  get rotation(): number {
    return this._rotation
  }

  set rotation(rotation: number) {
    this._rotation = rotation
  }

  get rect(): DOMRect {
    return this._rect
  }

  set rect(rect: DOMRect) {
    this._rect = rect
  }

  public abstract draw(): void
}
