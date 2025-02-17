import Layer from './Layer'

export default class ImageLayer extends Layer {
  public type: string = 'image'
  private _url: string = ''
  private _image?: HTMLImageElement = undefined

  constructor(
    protected context: CanvasRenderingContext2D,
    url: string,
  ) {
    super(context)

    this.url = url ?? ''
  }

  public render(): void {
    if (!this.loaded || !this._image) return

    this.context.save()
    const cx = this.x + this.width / 2
    const cy = this.y + this.height / 2

    this.context.translate(cx, cy)
    this.context.rotate((this.rotation * Math.PI) / 180.0)
    this.context.translate(-cx, -cy)

    this.context.drawImage(this._image, this.x, this.y, this.width, this.height)

    this.context.restore()
  }

  get url() {
    return this._url
  }

  set url(url: string) {
    this._url = url

    this.loaded = false
    this.load(url)
  }

  private load(url: string) {
    const image = new Image()
    image.src = url

    image.addEventListener('load', () => {
      this._image = image
      this.loaded = true
      // this.draw()
    })
  }
}
