import Layer from './Layer'

export default class VideoLayer extends Layer {
  public type: string = 'video'
  private _url: string = ''
  private _video?: HTMLVideoElement = undefined
  private _currentTime: number = 0.01
  private _playing: boolean = false

  constructor(
    protected context: CanvasRenderingContext2D,
    url: string
  ) {
    super(context)

    this.url = url ?? ''
  }

  public render(): void {
    if (!this.loaded || !this._video) return

    if (!this._playing) {
      this._video.currentTime = this._currentTime
    }

    this.context.save()

    const cx = this.x + this.width / 2
    const cy = this.y + this.height / 2

    this.context.translate(cx, cy)
    this.context.rotate((this.rotation * Math.PI) / 180.0)
    this.context.translate(-cx, -cy)
    this.context.drawImage(this._video, this.x, this.y, this.width, this.height)

    this.context.restore()
  }

  public play(): void {
    this._playing = true
    this._video?.play()
  }

  public pause(): void {
    this._playing = false
    this._video?.pause()
  }


  get url() {
    return this._url
  }

  set url(url: string) {
    this._url = url

    this.load(url)
  }

  get currentTime() {
    return this._currentTime
  }

  set currentTime(time: number) {
    this._currentTime = time
  }

  private load(url: string) {
    const video = document.createElement('video')
    video.setAttribute('crossorigin', 'anonymous')
    video.setAttribute('preload', 'metadata')
    video.src = url
    video.preload = 'metadata'
    // video.autoplay = true
    video.loop = true
    video.currentTime = this._currentTime
    video.load()

    this._video = video

    video.addEventListener('loadedmetadata', () => {
      this.loaded = true
    })

    // video.addEventListener('loadeddata', () => {
    //   console.log(video.duration);
    //   this.draw()
    // })
  }
}
