import Layer from './Layer'

export default class Frame extends Layer {
  public type: string = 'frame'
  private _fill: string = '#fff'

  constructor(context: CanvasRenderingContext2D) {
    // this.context = context
    super(context)
  }

  public render(): void {
    this.context.save()

    this.context.fillStyle = this.fill
    // this.context.shadowColor = '#eee'
    // this.context.shadowBlur = 20


    this.context.beginPath()
    this.context.rect(this.x, this.y, this.width, this.height)
    this.context.fill()

    this.context.restore()
  }

  set fill(fill: string) {
    this._fill = fill
  }

  get fill(): string {
    return this._fill
  }
}
