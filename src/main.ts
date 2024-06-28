import { Canvas } from './engine/Canvas'
import ImageLayer from './layers/ImageLayer'
import TextLayer from './layers/TextLayer'
import './style.css'

const parent = document.querySelector('#app')!
// Init canvas
const canvas = new Canvas(1024, 768, parent, 'white')

// Create a text layer
const text = new TextLayer(canvas.context, 'Hello Canva ⚡️')
text.x = 100
text.y = 100
text.fontSize = 24
text.fontWeight = 600

canvas.addLayer(text)

const image = new ImageLayer(
  canvas.context,
  'https://images.pexels.com/photos/14998052/pexels-photo-14998052/free-photo-of-photo-of-a-camera-body-on-yellow-background.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'
)
image.x = 300
image.y = 10
image.width = 200
image.rotation = -45

canvas.addLayer(image)

// Render the canvas
canvas.render()

// function render() {
//   canvas.render(() => { text.draw() })
// }
// render()
