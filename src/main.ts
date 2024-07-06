import ImageLayer from './core/layers/ImageLayer'
import TextLayer from './core/layers/TextLayer'
import VideoLayer from './core/layers/VideoLayer'
import { Screen } from './core/Screen'
import './style.css'

const screen = new Screen('#canvas')

// Image
const img = new ImageLayer(
  screen.context,
  'https://images.pexels.com/photos/14998052/pexels-photo-14998052/free-photo-of-photo-of-a-camera-body-on-yellow-background.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'
)
img.x = 650
img.y = 200
img.width = 500
img.height = 625
img.rotation = -45

// Text
const txt = new TextLayer(
  screen.context,
  `Agachupaguer 🧬 \nWow! \nWTF! \nI can't belive it! \nI'm a multi paragraph text!`
)
txt.x = 150
txt.y = 150
txt.fontFamily = 'Chalkboard'
txt.fontSize = 40
txt.fontWeight = 600

// Video
const video = new VideoLayer(
  screen.context,
  'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4'
)
video.x = 0
video.y = 0
video.width = 1920
video.height = 1080

img.index = 2
txt.index = 1
video.index = 0

screen.addLayer(img)
screen.addLayer(txt)
screen.addLayer(video)
