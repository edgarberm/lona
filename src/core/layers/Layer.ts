export default abstract class Layer {
  private _id: string = crypto.randomUUID()
  private _x: number = 0
  private _y: number = 0
  private _width: number = 0
  private _height: number = 0
  private _active: boolean = false
  private _rotation: number = 0
  private _index: number = 0
  private _loaded: boolean = false

  constructor(protected context: CanvasRenderingContext2D) {}

  get id(): string {
    return this._id
  }

  set id(id: string) {
    this._id = id
  }

  get x(): number {
    return this._x
    // return this._x * this.context.canvas.width
  }

  set x(x: number) {
    this._x = x
    // this._x = x / this.context.canvas.width
  }

  get y(): number {
    return this._y
    // return this._y * this.context.canvas.height
  }

  set y(y: number) {
    this._y = y
    // this._y = y / this.context.canvas.height
  }

  get width() {
    return this._width
    // return this._width * this.context.canvas.width
  }

  set width(width: number) {
    this._width = width
    // this._width = width / this.context.canvas.width
  }

  get height() {
    return this._height
    // return this._height * this.context.canvas.height
  }

  set height(height: number) {
    this._height = height
    // this._height = height / this.context.canvas.height
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

  get index(): number {
    return this._index
  }

  set index(index: number) {
    this._index = index
  }

  get loaded(): boolean {
    return this._loaded
  }

  set loaded(loaded: boolean) {
    this._loaded = loaded
  }

  public abstract render(): void
}
