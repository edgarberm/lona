import Layer from '../layers/Layer'
import getClientCoordinates from '../utils/getClientCoordinates'
import isInsideRect from '../utils/isInsideRect'

export class Canvas {
  public viewport: HTMLCanvasElement
  public context: CanvasRenderingContext2D
  public layers: Layer[] = []
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

    const parent = element ?? document.body
    const dpr = window.devicePixelRatio ?? 1

    this.viewport = document.createElement('canvas')
    this.viewport.id = 'canvas'
    this.viewport.width = width * dpr
    this.viewport.height = height * dpr
    this.viewport.style.width = `${width}px`
    this.viewport.style.height = `${height}px`

    parent.appendChild(this.viewport)

    this.context = this.viewport.getContext('2d')!
    this.context.scale(dpr, dpr)

    this.viewport.addEventListener('mousedown', this.onMouseDown.bind(this))
  }

  public render(callback?: (context: CanvasRenderingContext2D) => void): void {
    this.context.clearRect(0, 0, this._width, this._height)
    this.context.fillStyle = this._fill
    this.context.fillRect(0, 0, this._width, this._height)

    for (const layer of this.layers) {
      layer.draw()
    }

    callback?.(this.context)
  }

  public addLayer(layer: Layer): void {
    this.layers = [...this.layers, layer]
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

  onMouseDown(event: MouseEvent): void {
    const coords = getClientCoordinates(event, this.viewport)

    this.layers.forEach((l) => (l.active = false))

    for (const layer of this.layers) {
      const inside = isInsideRect(layer.rect, coords.x, coords.y)
      console.log(inside)
    }
  }
}
