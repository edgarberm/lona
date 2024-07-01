import applyInverseRotation from '../utils/applyInverseRotation'
import Layer from './Layer'

const size = 8

export default class TransformLayer extends Layer {
  private _layer: Layer | null = null
  private handles: Point[] = []
  public handleIndex: number | null = null
  private initialLayer: Partial<Layer> | null = null
  public rotating: boolean = false
  private initialAngle: number = 0
  private initialMouseAngle: number = 0

  constructor(protected context: CanvasRenderingContext2D) {
    super(context)
  }

  get layer(): Layer | null {
    return this._layer
  }

  set layer(layer: Layer | null) {
    this._layer = layer
  }

  public draw(): void {
    if (!this.layer) return

    const { x, y, width, height, rotation } = this.layer
    const cx = x + width / 2
    const cy = y + height / 2

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

    return this.handles.findIndex(
      (handle) =>
        rotatedPoint.x >= handle.x - size / 2 &&
        rotatedPoint.x <= handle.x + size / 2 &&
        rotatedPoint.y >= handle.y - size / 2 &&
        rotatedPoint.y <= handle.y + size / 2
    )
  }

  public startDraggingHandle(index: number): void {
    this.handleIndex = index

    if (this.layer) {
      this.initialLayer = {
        width: this.layer.width,
        height: this.layer.height,
        x: this.layer.x,
        y: this.layer.y,
      }
    }
  }

  public stopDraggingHandle(): void {
    this.handleIndex = null
    this.initialLayer = null
  }

  public dragHandle(x: number, y: number): void {
    if (
      this.handleIndex === null ||
      !this.layer ||
      !this.initialLayer
    )
      return

    const {
      width,
      height,
      x: initialX,
      y: initialY,
    } = this.initialLayer as Layer
    const { handles } = this
    const oppositeHandle = handles[(this.handleIndex + 2) % 4]
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

    if (this.handleIndex === 0) {
      this.layer.x = initialX - deltaX
      this.layer.y = initialY - deltaY
    } else if (this.handleIndex === 1) {
      this.layer.y = initialY - deltaY
    } else if (this.handleIndex === 3) {
      this.layer.x = initialX - deltaX
    }

    this.updateHandles()
  }

  public isNearHandle(x: number, y: number): boolean {
    if (!this.layer) return false

    const { x: layerX, y: layerY, width, height, rotation } = this.layer
    const cx = layerX + width / 2
    const cy = layerY + height / 2
    const distance = 10

    const rotatedPoint = applyInverseRotation(x, y, cx, cy, rotation)

    const nearLeftEdge =
      rotatedPoint.x >= layerX - distance && rotatedPoint.x < layerX
    const nearRightEdge =
      rotatedPoint.x > layerX + width &&
      rotatedPoint.x <= layerX + width + distance
    const nearTopEdge =
      rotatedPoint.y >= layerY - distance && rotatedPoint.y < layerY
    const nearBottomEdge =
      rotatedPoint.y > layerY + height &&
      rotatedPoint.y <= layerY + height + distance

    return (
      (nearLeftEdge || nearRightEdge || nearTopEdge || nearBottomEdge) &&
      !this.isCursorOnHandle(rotatedPoint.x, rotatedPoint.y)
    )
  }

  private isCursorOnHandle(x: number, y: number): boolean {
    return this.handles.some(
      (handle) =>
        x >= handle.x - size / 2 &&
        x <= handle.x + size / 2 &&
        y >= handle.y - size / 2 &&
        y <= handle.y + size / 2
    )
  }

  public startRotating(x: number, y: number): void {
    this.rotating = true

    if (this.layer) {
      const { x: layerX, y: layerY, width, height } = this.layer
      const cx = layerX + width / 2
      const cy = layerY + height / 2

      this.initialAngle = this.layer.rotation
      this.initialMouseAngle = Math.atan2(y - cy, x - cx)
    }
  }

  public stopRotating(): void {
    this.rotating = false
  }

  public rotate(x: number, y: number): void {
    if (!this.rotating || !this.layer) return

    const { x: layerX, y: layerY, width, height } = this.layer
    const cx = layerX + width / 2
    const cy = layerY + height / 2
    const currentMouseAngle = Math.atan2(y - cy, x - cx)
    const angleDelta = currentMouseAngle - this.initialMouseAngle

    this.layer.rotation =
      (this.initialAngle + (angleDelta * 180) / Math.PI) % 360

    this.updateHandles()
  }
}
