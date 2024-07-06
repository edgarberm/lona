import Layer from './Layer'

export default class TextLayer extends Layer {
  public type: string = 'text'
  private _text: string = ''
  private _fontFamily: string = 'Helvetica'
  private _fontSize: number = 14
  private _fontWeight: number = 400
  private _color: string = '#000000'

  constructor(
    protected context: CanvasRenderingContext2D,
    text?: string,
  ) {
    super(context)

    this.loaded = true
    this.text = text ?? ''
  }

  public render(): void {
    this.context.save()

    const ratio = this.fontSize / this.context.canvas.width
    const fontSize = this.context.canvas.width * ratio
    const lines = this.text.split('\n')
    this.context.fillStyle = this.color
    this.context.textBaseline = 'top'
    this.context.font = `${this.fontWeight} ${fontSize}px ${this.fontFamily}`

    const sizes = lines.map((l) => this.context.measureText(l).width)
    this.width = Math.max(...sizes)
    /** @todo set lineHeight property */
    const H = this.context.measureText('M').width * 1.5

    const cx = this.x + this.width / 2
    const cy = this.y + this.height / 2

    this.context.translate(cx, cy)
    this.context.rotate((this.rotation * Math.PI) / 180.0)
    this.context.translate(-cx, -cy)

    // this.context.fillText(this.text, this.x, this.y)
    let Y = this.y
    for (let i = 0; i < lines.length; ++i) {
      this.context.fillText(lines[i], this.x, Y)
      Y += H
    }

    this.height = H * lines.length
    this.context.restore()
  }

  get text(): string {
    return this._text
  }

  set text(text: string) {
    this._text = text
  }

  get fontFamily(): string {
    return this._fontFamily
  }

  set fontFamily(family: string) {
    this._fontFamily = family
  }

  get fontSize(): number {
    return this._fontSize
  }

  set fontSize(size: number) {
    this._fontSize = size
  }

  get fontWeight(): number {
    return this._fontWeight
  }

  set fontWeight(weight: number) {
    this._fontWeight = weight
  }

  get color(): string {
    return this._color
  }

  set color(color: string) {
    this._color = color
  }
}
