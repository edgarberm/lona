import Layer from './Layer'

export default class TransformLayer extends Layer {
  private _layer: Layer | null = null
  private handles: Point[] = []

  constructor(protected context: CanvasRenderingContext2D) {
    super(context)
  }

  public draw(): void {
    if (!this.layer) return

    const { x, y, width, height, rotation } = this.layer
    const cx = x + width / 2
    const cy = y + height / 2
    const size = 8

    this.updateHandles()

    this.context.save()

    this.context.translate(cx, cy)
    this.context.rotate((rotation * Math.PI) / 180.0)
    this.context.translate(-cx, -cy)

    this.context.strokeStyle = '#1380e4'
    this.context.lineWidth = 1
    this.context.fillStyle = 'white'
    
    this.context.strokeRect(x, y, width, height)
    
    this.handles.forEach((handle) => {
      this.context.fillRect(handle.x - (size / 2), handle.y - (size / 2), size, size)
      this.context.strokeRect(handle.x - (size / 2), handle.y - (size / 2), size, size)
    })

    this.context.restore()
  }

  get layer(): Layer | null {
    return this._layer
  }

  set layer(layer: Layer | null) {
    this._layer = layer
  }

  private updateHandles(): void {
    if (!this.layer) return

    const { x, y, width, height } = this.layer
    this.handles = [
      { x: x, y: y },
      { x: x + width, y: y },
      { x: x + width, y: y + height },
      { x: x, y: y + height },
    ]
  }
}
