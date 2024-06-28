import Layer from './Layer'

export default class ImageLayer extends Layer {
  private _url: string = ''
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

    this.context.save()
    
    const centerX = this.x + this.width / 2
    const centerY = this.y + this.height / 2

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

  private loadImage(url: string) {
    const image = new Image()
    image.src = url

    image.addEventListener('load', () => {
      this._image = image
      this.width = image.width
      this.height = image.height

      this.draw()
    })
  }
}
