import { applyInverseRotation, normalizeAngle, snapToKeyAngle } from '../utils'
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
  private camera: Camera

  constructor(protected context: CanvasRenderingContext2D, camera: Camera) {
    super(context)

    this.camera = camera
  }

  get layer(): Layer | null {
    return this._layer
  }

  set layer(layer: Layer | null) {
    this._layer = layer
  }


  public render(): void {
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
    this.context.lineWidth = 1 / this.camera.z
    this.context.fillStyle = 'white'

    this.context.strokeRect(x, y, width, height)

    this.handles.forEach((handle) => {
      this.context.fillRect(
        handle.x - size / (2 * this.camera.z),
        handle.y - size / (2 * this.camera.z),
        size / this.camera.z,
        size / this.camera.z
      )
      this.context.strokeRect(
        handle.x - size / (2 * this.camera.z),
        handle.y - size / (2 * this.camera.z),
        size / this.camera.z,
        size / this.camera.z
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
        rotatedPoint.x >= handle.x - size / (2 * this.camera.z) &&
        rotatedPoint.x <= handle.x + size / (2 * this.camera.z) &&
        rotatedPoint.y >= handle.y - size / (2 * this.camera.z) &&
        rotatedPoint.y <= handle.y + size / (2 * this.camera.z)
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
    if (this.handleIndex === null || !this.layer || !this.initialLayer) return

    const { width, height, x: lX, y: lY } = this.initialLayer as Layer
    const { handles, layer } = this
    const oppositeHandle = handles[(this.handleIndex + 2) % 4]
    const cx = lX + width / 2
    const cy = lY + height / 2
    const rotatedPoint = applyInverseRotation(x, y, cx, cy, layer.rotation)
    const dx = rotatedPoint.x - oppositeHandle.x
    const dy = rotatedPoint.y - oppositeHandle.y
    const newWidth = Math.abs(dx)
    const newHeight = Math.abs(dy)
    const scale = Math.min(newWidth / width, newHeight / height)

    layer.width = width * scale
    layer.height = height * scale

    const deltaX = layer.width - width
    const deltaY = layer.height - height

    if (this.handleIndex === 0) {
      layer.x = lX - deltaX
      layer.y = lY - deltaY
      return
    } else if (this.handleIndex === 1) {
      layer.y = lY - deltaY
      return
    } else if (this.handleIndex === 3) {
      layer.x = lX - deltaX
      return
    }

    this.updateHandles()
  }

  public isNearHandle(x: number, y: number): boolean {
    if (!this.layer) return false

    const { x: layerX, y: layerY, width, height, rotation } = this.layer
    const cx = layerX + width / 2
    const cy = layerY + height / 2
    const distance = 10 / this.camera.z
    const rotatedPoint = applyInverseRotation(x, y, cx, cy, rotation)

    const isNearEdge = (p: number, e: number, s: number) => Math.abs(p - e) <= s

    const nearLeft = isNearEdge(rotatedPoint.x, layerX, distance)
    const nearRight = isNearEdge(rotatedPoint.x, layerX + width, distance)
    const nearTop = isNearEdge(rotatedPoint.y, layerY, distance)
    const nearBottom = isNearEdge(rotatedPoint.y, layerY + height, distance)

    const isCursorOnHandle = this.isCursorOnHandle(
      rotatedPoint.x,
      rotatedPoint.y
    )

    return (nearLeft || nearRight || nearTop || nearBottom) && !isCursorOnHandle
  }

  private isCursorOnHandle(x: number, y: number): boolean {
    return this.handles.some(
      (handle) =>
        x >= handle.x - size / (2 * this.camera.z) &&
        x <= handle.x + size / (2 * this.camera.z) &&
        y >= handle.y - size / (2 * this.camera.z) &&
        y <= handle.y + size / (2 * this.camera.z)
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
    const newAngle = this.initialAngle + (angleDelta * 180) / Math.PI
    const normalizedAngle = normalizeAngle(newAngle)
    const snappedAngle = snapToKeyAngle(normalizedAngle)

    this.layer.rotation = snappedAngle

    this.updateHandles()
  }
}
