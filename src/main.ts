import { Canvas } from './engine/Canvas'
import Text from './layers/Text'
import './style.css'

const parent = document.querySelector('#app')!
// Init canvas
const canvas = new Canvas(1024, 768, parent, 'white')

// Create a text layer
const text = new Text(canvas.context, 'Hello Canva ⚡️')
text.x = 100
text.y = 100
text.fontSize = 24
text.fontWeight = 600

canvas.addLayer(text)

// const text2 = new Text(canvas.context, 'Hello Canva ⚡️')
// text2.x = 100
// text2.y = 300
// text2.fontSize = 24
// text2.fontWeight = 600
// text2.rotation = -45

// canvas.addLayer(text2)

// Render the canvas
canvas.render()

// function render() {
//   canvas.render(() => { text.draw() })
// }
// render()
