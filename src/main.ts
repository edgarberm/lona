import { Canvas } from './engine/Canvas'
import ImageLayer from './engine/layers/ImageLayer'
import TextLayer from './engine/layers/TextLayer'
import './style.css'

const parent = document.querySelector('#app')!
// Init canvas
const canvas = new Canvas(1024, 768, parent, 'white')

// Create a text layers
const text = new TextLayer(canvas.context, 'Agachupagüer 💀')
text.x = 600
text.y = 100
text.fontSize = 24
text.fontWeight = 600
text.color = '#9c00ff'

canvas.addLayer(text)

const text2 = new TextLayer(canvas.context, 'Hello Canva')
text2.x = 550
text2.y = 320
text2.fontSize = 24
text2.fontWeight = 600
text2.rotation = -45

canvas.addLayer(text2)

const image = new ImageLayer(
  canvas.context,
  'https://images.pexels.com/photos/14998052/pexels-photo-14998052/free-photo-of-photo-of-a-camera-body-on-yellow-background.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'
)
image.x = 0
image.y = 0
image.rotation = 45

canvas.addLayer(image)

// Render the canvas
canvas.render()

// function render() {
//   canvas.render(() => { text.draw() })
// }
// render()
