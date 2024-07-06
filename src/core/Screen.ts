import { Camera } from './Camera'
import Frame from './layers/Frame'
import Layer from './layers/Layer'
import TextLayer from './layers/TextLayer'
import TransformLayer from './layers/TransformLayer'
import { clickInsideLayer, screenToCanvas } from './utils'

export class Screen {
  private canvas: HTMLCanvasElement
  public context: CanvasRenderingContext2D
  private camera: Camera
  private dpr: number = 1
  private frame: Frame
  private layers: Layer[] = []
  private transformLayer: TransformLayer
  private transform: TransformTypes = 'NONE'
  private mouseOffset: Point = { x: 0, y: 0 }

  constructor(selector: string) {
    this.dpr = window.devicePixelRatio ?? 1
    this.canvas = document.querySelector(selector) as HTMLCanvasElement
    this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D
    this.camera = new Camera()

    this.setCanvasSize()

    /** @todo set correct props */
    this.frame = new Frame(this.context)
    this.frame.width = 1920
    this.frame.height = 1080

    this.transformLayer = new TransformLayer(this.context, this.camera)

    this.canvas.addEventListener('wheel', this.handleWheelEvent.bind(this), {
      passive: false,
    })

    document.addEventListener('mousedown', this.handleMouseDown.bind(this))
    document.addEventListener('mousemove', this.handleMouseMove.bind(this))
    document.addEventListener('mouseup', this.handleMouseUp.bind(this))

    window.requestAnimationFrame(this.render.bind(this))
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
      console.error('Screen: Layer not found: the provided layer is not found.')
    }
  }

  private setCanvasSize(): void {
    this.canvas.width = window.innerWidth * this.dpr
    this.canvas.height = window.innerHeight * this.dpr
    this.canvas.style.width = `${window.innerWidth}px`
    this.canvas.style.height = `${window.innerHeight}px`

    this.context.scale(this.dpr, this.dpr)
  }

  private render(): void {
    if (!this.context) return

    this.context.resetTransform()
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)

    this.context.scale(this.camera.z * this.dpr, this.camera.z * this.dpr)
    this.context.translate(this.camera.x, this.camera.y)

    this.frame.render()

    for (const layer of this.layers) {
      if (layer.loaded) layer.render()
    }

    this.transformLayer.render()

    window.requestAnimationFrame(this.render.bind(this))
  }

  private handleMouseDown(event: MouseEvent): void {
    const point = { x: event.clientX, y: event.clientY }
    const mouse = screenToCanvas(point, this.camera)

    if (this.transformLayer.layer) {
      const isNearRotateHandle = this.transformLayer.isNearHandle(
        mouse.x,
        mouse.y
      )
      const inTransformLayer = clickInsideLayer(
        mouse,
        this.transformLayer.layer
      )
      const handlerIndex = this.transformLayer.checkHandleHit(mouse.x, mouse.y)

      if (inTransformLayer) {
        this.transform = 'MOVE'
      }

      if (handlerIndex !== null && handlerIndex !== -1) {
        this.transform = 'RESIZE'
        this.transformLayer.startDraggingHandle(handlerIndex)
        return
      }
      if (isNearRotateHandle && !inTransformLayer) {
        this.transform = 'ROTATE'
        this.transformLayer.startRotating(mouse.x, mouse.y)
        return
      }
    }

    this.layers.forEach((l: Layer) => (l.active = false))
    this.transformLayer.layer = null

    for (let i = this.layers.length - 1; i >= 0; i--) {
      const layer = this.layers[i]
      const inLayer = clickInsideLayer(mouse, layer)

      if (inLayer) {
        layer.active = true
        this.transformLayer.layer = layer

        this.mouseOffset = {
          x: mouse.x - layer.x,
          y: mouse.y - layer.y,
        }
        break
      }
    }
  }

  private handleMouseMove(event: MouseEvent): void {
    const point = { x: event.clientX, y: event.clientY }
    const mouse = screenToCanvas(point, this.camera)
    const handleIndex = this.transformLayer.checkHandleHit(mouse.x, mouse.y)
    const isText = this.transformLayer.layer instanceof TextLayer

    if (this.transformLayer.layer) {
      const layer = this.transformLayer.layer
      const handlerIndex = this.transformLayer.checkHandleHit(mouse.x, mouse.y)
      const nearToHandle = this.transformLayer.isNearHandle(mouse.x, mouse.y)
      const inTransformLayer = clickInsideLayer(mouse, layer)

      if (this.transform === 'MOVE') {
        layer.x = mouse.x - this.mouseOffset.x
        layer.y = mouse.y - this.mouseOffset.y
      }
      if (this.transform === 'RESIZE' && handleIndex !== null && !isText) {
        this.transformLayer.dragHandle(mouse.x, mouse.y)
      }
      if (this.transform === 'ROTATE') {
        this.transformLayer.rotate(mouse.x, mouse.y)
      }

      if (nearToHandle && !inTransformLayer) {
        this.canvas.style.cursor = 'crosshair'
        return
      } else if (handlerIndex !== -1) {
        this.canvas.style.cursor = 'ns-resize'
        return
      } else if (inTransformLayer) {
        this.canvas.style.cursor = 'move'
        return
      }

      this.canvas.style.cursor = 'default'
    }
  }

  private handleMouseUp(_event: MouseEvent): void {
    this.transform = 'NONE'
    this.canvas.style.cursor = 'default'
  }

  private handleWheelEvent(event: WheelEvent) {
    event.preventDefault()

    const { clientX, clientY, deltaX, deltaY, ctrlKey, metaKey } = event

    if (ctrlKey || metaKey) {
      this.camera.zoom({ x: clientX, y: clientY }, deltaY / 100)
    } else {
      this.camera.pan(deltaX, deltaY)
    }
  }
}
