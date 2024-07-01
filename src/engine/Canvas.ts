import Layer from './layers/Layer'
import TextLayer from './layers/TextLayer'
import TransformLayer from './layers/TransformLayer'
import clickInsideLayer from './utils/clickInsideLayer'
import getClientCoordinates from './utils/getClientCoordinates'
import setResizeCursor from './utils/setResizeCursor'

/**
 * https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Pixel_manipulation_with_canvas
 */
export class Canvas {
  public version: number = 0.1
  public viewport: HTMLCanvasElement
  public context: CanvasRenderingContext2D
  public layers: Layer[] = []
  public dpr: number = 1
  private _width: number
  private _height: number
  private _fill: string
  private transformLayer: TransformLayer
  private interactiveLayer: Layer | null = null
  private offsetX: number = 0
  private offsetY: number = 0

  constructor(
    width: number,
    height: number,
    element?: Element,
    fill: string = '#fff'
  ) {
    this._width = width
    this._height = height
    this._fill = fill

    const container = element ?? document.body
    this.dpr = window.devicePixelRatio ?? 1

    this.viewport = document.createElement('canvas')
    this.viewport.id = 'canvas'
    this.viewport.width = width * this.dpr
    this.viewport.height = height * this.dpr
    this.viewport.style.width = `${width}px`
    this.viewport.style.height = `${height}px`

    container.appendChild(this.viewport)

    this.context = this.viewport.getContext('2d')!
    this.context.scale(this.dpr, this.dpr)

    this.transformLayer = new TransformLayer(this.context)

    this.viewport.addEventListener('mousedown', this.onMouseDown.bind(this))
    this.viewport.addEventListener('mousemove', this.onMouseMove.bind(this))
  }

  public render(callback?: (context: CanvasRenderingContext2D) => void): void {
    this.context.clearRect(0, 0, this._width, this._height)
    this.context.fillStyle = this._fill
    this.context.fillRect(0, 0, this._width, this._height)

    for (const layer of this.layers) {
      layer.draw()
    }

    this.transformLayer.draw()

    callback?.(this.context)
  }

  public addLayer(layer: Layer): void {
    this.layers = [...this.layers, layer].sort(
      (a: Layer, b: Layer) => a.index - b.index
    )
  }

  public removeLayer(layer: Layer): void {
    const filtered = this.layers.filter((l) => l.id === layer.id)

    if (filtered.length) {
      this.layers = filtered
    } else {
      console.error(
        `Layer not found: the provided layer is not found into Canvas layers.`
      )
    }
  }

  private onMouseDown(event: MouseEvent): void {
    document.addEventListener('mouseup', this.onMouseUp.bind(this))

    const coords = getClientCoordinates(event, this.viewport)

    const handleIndex = this.transformLayer.checkHandleHit(coords.x, coords.y)
    if (handleIndex !== null && handleIndex !== -1) {
      this.transformLayer.startDraggingHandle(handleIndex)
      return
    }

    this.layers.forEach((l) => (l.active = false))

    this.interactiveLayer = null
    this.transformLayer.layer = null
    this.transformLayer.draw()

    for (let i = this.layers.length - 1; i >= 0; i--) {
      const layer = this.layers[i]
      const inside = clickInsideLayer(coords.x, coords.y, layer)

      if (inside) {
        this.interactiveLayer = layer
        this.transformLayer.layer = layer

        this.offsetX = coords.x - layer.x
        this.offsetY = coords.y - layer.y

        this.transformLayer.draw()
        break
      }
    }
  }

  private onMouseMove(event: MouseEvent): void {
    const coords = getClientCoordinates(event, this.viewport)
    const handleIndex = this.transformLayer.checkHandleHit(coords.x, coords.y)
    const isText = this.transformLayer.layer instanceof TextLayer

    if (this.transformLayer.draggingHandleIndex !== null && !isText) {
      this.transformLayer.dragHandle(coords.x, coords.y)
      this.render()
      return
    }

    if (handleIndex !== null && handleIndex !== -1 && !isText) {
      const layerRotation = this.transformLayer.layer!.rotation // Asumiendo que tienes acceso a la rotación de la capa

      if (handleIndex === 0 || handleIndex === 2) {
        document.body.style.cursor = setResizeCursor(-45 + layerRotation)
      } else if (handleIndex === 1 || handleIndex === 3) {
        document.body.style.cursor = setResizeCursor(45 + layerRotation)
      } else {
        document.body.style.cursor = 'default'
      }

      return
    }

    for (let i = this.layers.length - 1; i >= 0; i--) {
      const layer = this.layers[i]
      const inside = clickInsideLayer(coords.x, coords.y, layer)

      if (inside) {
        document.body.style.cursor = 'pointer'
        break
      } else {
        document.body.style.cursor = 'default'
      }
    }

    if (this.interactiveLayer) {
      this.interactiveLayer.x = coords.x - this.offsetX
      this.interactiveLayer.y = coords.y - this.offsetY
      this.render()
    }
  }

  private onMouseUp(): void {
    document.removeEventListener('mouseup', this.onMouseUp)
    this.transformLayer.stopDraggingHandle()
    this.interactiveLayer = null
  }
}
