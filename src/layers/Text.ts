import Layer from './Layer'

export default class Text extends Layer {
  private _text: string = ''
  private _fontFamily: string = 'Helvetica'
  private _fontSize: number = 14
  private _fontWeight: number = 400
  private _color: string = '#000000'

  constructor(protected context: CanvasRenderingContext2D, text?: string) {
    super(context)

    this.text = text ?? ''
    this.setRect()
  }

  public draw(): void {
    const y = this.y + this.fontSize
    
    this.context.save()

    this.context.fillStyle = this.color
    this.context.font = `${this.fontWeight} ${this.fontSize}px ${this.fontFamily}`
    this.context.translate(this.x, y)
    this.context.rotate((this.rotation * Math.PI) / 180.0)
    this.context.translate(-this.x, -y)
    this.context.fillText(this.text, this.x, y)

    this.context.restore()
  }

  get text(): string {
    return this._text
  }

  set text(text: string) {
    this._text = text
    this.setRect()
  }

  get fontFamily(): string {
    return this._fontFamily
  }

  set fontFamily(family: string) {
    this._fontFamily = family
    this.setRect()
  }

  get fontSize(): number {
    return this._fontSize
  }

  set fontSize(size: number) {
    this._fontSize = size
    this.setRect()
  }

  get fontWeight(): number {
    return this._fontWeight
  }

  set fontWeight(weight: number) {
    this._fontWeight = weight
    this.setRect()
  }

  get color(): string {
    return this._color
  }

  set color(color: string) {
    this._color = color
  }

  private setRect(): void {
    this.context.font = `${this.fontWeight} ${this.fontSize}px ${this.fontFamily}`

    const metrics = this.context.measureText(this.text)
    const width = metrics.width
    const actualBoundingBoxAscent = metrics.actualBoundingBoxAscent || 0
    const actualBoundingBoxDescent = metrics.actualBoundingBoxDescent || 0
    const height = actualBoundingBoxAscent + actualBoundingBoxDescent

    this.rect = new DOMRect(this.x, this.y, width, height)
  }
}
