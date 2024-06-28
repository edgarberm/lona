import Layer from './Layer'

export default class ImageLayer extends Layer {
  private _url: string = ''
  private _width: number = 0
  private _height: number = 0
  private _rotate: number = 0
  private _image?: HTMLImageElement = undefined

  constructor(protected context: CanvasRenderingContext2D, url: string) {
    super(context)

    this.url = url ?? ''

    if (url) {
      this.loadImage(url)
    }
  }

  public draw(): void {
    if (!this._image) return

    const centerX = this.x + this.width / 2
    const centerY = this.y + this.height / 2

    this.context.save()
    this.context.translate(centerX, centerY)
    this.context.rotate((this.rotation * Math.PI) / 180.0)
    this.context.translate(-centerX, -centerY)
    this.context.drawImage(this._image, this.x, this.y, this.width, this.height)

    this.context.restore()
  }

  get url() {
    return this._url
  }

  set url(url: string) {
    this._url = url

    this.loadImage(url)
  }

  get width() {
    return this._width
  }

  set width(width: number) {
    this._width = width
    this.setRect()
  }

  get height() {
    return this._height
  }

  set height(height: number) {
    this._height = height
    this.setRect()
  }
  
  get rotation(): number {
    return this._rotate
  }

  set rotation(rotation: number) {
    this._rotate = rotation
    this.setRect()
  }

  private loadImage(url: string) {
    const image = new Image()
    image.src = url

    image.addEventListener('load', () => {
      this._image = image
      this.width = image.width
      this.height = image.height

      this.setRect()
      this.draw()
    })
  }

  private setRect() {
    const width = this._image?.width ?? this.width
    const height = this._image?.height ?? this.height
    
    this.rect = new DOMRect(this.x, this.y, width, height)
  }
}
