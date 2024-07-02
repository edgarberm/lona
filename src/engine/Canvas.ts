import { handleCanvasMouseDown, handleCanvasMouseMove, handleCanvasMouseUp } from './events'
import Layer from './layers/Layer'
import TransformLayer from './layers/TransformLayer'

/**
 * https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Pixel_manipulation_with_canvas
 */
export class Canvas {
  public version: number = 0.1
  public viewport: HTMLCanvasElement
  public context: CanvasRenderingContext2D
  public layers: Layer[] = []
  public dpr: number = 1
  public transformLayer: TransformLayer
  public interactiveLayer: Layer | null = null
  public offsetX: number = 0
  public offsetY: number = 0
  private _width: number
  private _height: number
  private _fill: string

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
    handleCanvasMouseDown(event, this)
  }

  private onMouseMove(event: MouseEvent): void {
    handleCanvasMouseMove(event, this)
  }

  public onMouseUp(event: MouseEvent): void {
    handleCanvasMouseUp(event, this)
  }
}
