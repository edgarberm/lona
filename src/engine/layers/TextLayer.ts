import Layer from './Layer'

export default class TextLayer extends Layer {
  private _text: string = ''
  private _fontFamily: string = 'Helvetica'
  private _fontSize: number = 14
  private _fontWeight: number = 400
  private _color: string = '#000000'

  constructor(protected context: CanvasRenderingContext2D, text?: string) {
    super(context)

    this.text = text ?? ''
  }

  public draw(): void {
    this.context.save()
    
    this.context.fillStyle = this.color
    this.context.font = `${this.fontWeight} ${this.fontSize}px ${this.fontFamily}`
    
    this.width = this.context.measureText(this.text).width
    this.height = this.fontSize
    
    const cx = this.x + this.width / 2
    const cy = this.y + this.fontSize / 2

    this.context.translate(cx, cy)
    this.context.rotate((this.rotation * Math.PI) / 180.0)
    this.context.translate(-cx, -cy)

    this.context.fillText(this.text, this.x, this.y + this.fontSize)

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
