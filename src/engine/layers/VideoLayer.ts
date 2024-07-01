import Layer from './Layer'

export default class VideoLayer extends Layer {
  private _url: string = ''
  private _video?: HTMLVideoElement = undefined
  private _currentTime: number = 0.01

  constructor(protected context: CanvasRenderingContext2D, url: string) {
    super(context)

    this.url = url ?? ''
  }

  public draw(): void {
    if (!this._video) return
    
    this._video.currentTime = this._currentTime

    this.context.save()

    const cx = this.x + this.width / 2
    const cy = this.y + this.height / 2

    this.context.translate(cx, cy)
    this.context.rotate((this.rotation * Math.PI) / 180.0)
    this.context.translate(-cx, -cy)
    this.context.drawImage(this._video, this.x, this.y, this.width, this.height)

    this.context.restore()
  }

  get url() {
    return this._url
  }

  set url(url: string) {
    this._url = url

    this.load(url)
  }

  get time() {
    return this._currentTime
  }

  set time(time: number) {
    this._currentTime = time
  }

  private load(url: string) {
    const video = document.createElement('video')
    video.setAttribute('crossorigin', 'anonymous')
    video.setAttribute('preload', 'metadata')
    video.src = url
    video.currentTime = this._currentTime
    video.load()
    
    video.addEventListener('loadedmetadata', () => {
      this._video = video
      this.width = video.videoWidth / 2
      this.height = video.videoHeight / 2
    })
    
    video.addEventListener('loadeddata', () => {
      this.draw()
    })
  }
}
