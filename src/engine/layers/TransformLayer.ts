import applyInverseRotation from '../utils/applyInverseRotation'
import Layer from './Layer'

export default class TransformLayer extends Layer {
  private _layer: Layer | null = null
  private handles: Point[] = []
  public draggingHandleIndex: number | null = null
  private initialLayerState: Partial<Layer> | null = null

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
      this.context.fillRect(
        handle.x - size / 2,
        handle.y - size / 2,
        size,
        size
      )
      this.context.strokeRect(
        handle.x - size / 2,
        handle.y - size / 2,
        size,
        size
      )
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

  public checkHandleHit(x: number, y: number): number | null {
    if (!this.layer) return null

    const { x: layerX, y: layerY, width, height, rotation } = this.layer
    const cx = layerX + width / 2
    const cy = layerY + height / 2

    const rotatedPoint = applyInverseRotation(x, y, cx, cy, rotation)

    const size = 8
    return this.handles.findIndex(
      (handle) =>
        rotatedPoint.x >= handle.x - size / 2 &&
        rotatedPoint.x <= handle.x + size / 2 &&
        rotatedPoint.y >= handle.y - size / 2 &&
        rotatedPoint.y <= handle.y + size / 2
    )
  }

  public startDraggingHandle(index: number): void {
    this.draggingHandleIndex = index

    if (this.layer) {
      this.initialLayerState = {
        width: this.layer.width,
        height: this.layer.height,
        x: this.layer.x,
        y: this.layer.y,
      }
    }
  }

  public stopDraggingHandle(): void {
    this.draggingHandleIndex = null
    this.initialLayerState = null
  }

  public dragHandle(x: number, y: number): void {
    if (
      this.draggingHandleIndex === null ||
      !this.layer ||
      !this.initialLayerState
    )
      return

    const {
      width,
      height,
      x: initialX,
      y: initialY,
    } = this.initialLayerState as Layer
    const { handles } = this
    const oppositeHandle = handles[(this.draggingHandleIndex + 2) % 4]
    const rotatedPoint = applyInverseRotation(
      x,
      y,
      initialX + width / 2,
      initialY + height / 2,
      this.layer.rotation
    )

    const dx = rotatedPoint.x - oppositeHandle.x
    const dy = rotatedPoint.y - oppositeHandle.y

    const newWidth = Math.abs(dx)
    const newHeight = Math.abs(dy)

    const scaleX = newWidth / width
    const scaleY = newHeight / height
    const scale = Math.min(scaleX, scaleY)

    this.layer.width = width * scale
    this.layer.height = height * scale

    const deltaX = this.layer.width - width
    const deltaY = this.layer.height - height

    if (this.draggingHandleIndex === 0) {
      this.layer.x = initialX - deltaX
      this.layer.y = initialY - deltaY
    } else if (this.draggingHandleIndex === 1) {
      this.layer.y = initialY - deltaY
    } else if (this.draggingHandleIndex === 3) {
      this.layer.x = initialX - deltaX
    }

    this.updateHandles()
  }
}
