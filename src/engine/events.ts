import { Canvas } from './Canvas'
import TextLayer from './layers/TextLayer'
import clickInsideLayer from './utils/clickInsideLayer'
import getClientCoordinates from './utils/getClientCoordinates'
import setResizeCursor from './utils/setResizeCursor'
import setRotateCursor from './utils/setRotateCursor'

export function handleCanvasMouseDown(event: MouseEvent, canvas: Canvas): void {
  document.addEventListener('mouseup', canvas.onMouseUp.bind(canvas))

  const coords = getClientCoordinates(event, canvas.viewport)
  const transformLayer = canvas.transformLayer

  const handleIndex = transformLayer.checkHandleHit(coords.x, coords.y)
  if (handleIndex !== null && handleIndex !== -1) {
    transformLayer.startDraggingHandle(handleIndex)
    return
  }

  if (transformLayer.layer && transformLayer.isNearHandle(coords.x, coords.y)) {
    transformLayer.startRotating(coords.x, coords.y)
    return
  }

  canvas.layers.forEach((l) => (l.active = false))

  canvas.interactiveLayer = null
  transformLayer.layer = null
  transformLayer.draw()

  for (let i = canvas.layers.length - 1; i >= 0; i--) {
    const layer = canvas.layers[i]
    const inside = clickInsideLayer(coords.x, coords.y, layer)

    if (inside) {
      canvas.interactiveLayer = layer
      transformLayer.layer = layer

      canvas.offsetX = coords.x - layer.x
      canvas.offsetY = coords.y - layer.y

      transformLayer.draw()
      break
    }
  }
}

export function handleCanvasMouseMove(event: MouseEvent, canvas: Canvas): void {
  const coords = getClientCoordinates(event, canvas.viewport)
  const transformLayer = canvas.transformLayer
  const handleIndex = transformLayer.checkHandleHit(coords.x, coords.y)
  const isText = transformLayer.layer instanceof TextLayer

  if (transformLayer.handleIndex !== null && !isText) {
    transformLayer.dragHandle(coords.x, coords.y)
    canvas.render()
    return
  }

  if (transformLayer.rotating) {
    transformLayer.rotate(coords.x, coords.y)
    canvas.render()
    return
  }

  if (handleIndex !== null && handleIndex !== -1 && !isText) {
    const rotation = transformLayer.layer!.rotation

    if (handleIndex === 0 || handleIndex === 2) {
      document.body.style.cursor = setResizeCursor(-45 + rotation)
    } else if (handleIndex === 1 || handleIndex === 3) {
      document.body.style.cursor = setResizeCursor(45 + rotation)
    } else {
      document.body.style.cursor = 'default'
    }

    return
  }

  if (transformLayer.layer) {
    const inside = clickInsideLayer(coords.x, coords.y, transformLayer.layer)
    const isNearRotateHandle = transformLayer.isNearHandle(coords.x, coords.y)
    
    if (isNearRotateHandle && !inside) {
      document.body.style.cursor = setRotateCursor()
      return
    }
  }

  for (let i = canvas.layers.length - 1; i >= 0; i--) {
    const layer = canvas.layers[i]
    const inside = clickInsideLayer(coords.x, coords.y, layer)

    if (inside) {
      document.body.style.cursor = 'pointer'
      break
    } else {
      document.body.style.cursor = 'default'
    }
  }

  if (canvas.interactiveLayer) {
    canvas.interactiveLayer.x = coords.x - canvas.offsetX
    canvas.interactiveLayer.y = coords.y - canvas.offsetY
    canvas.render()
  }
}

export function handleCanvasMouseUp(_: MouseEvent, canvas: Canvas): void {
  document.removeEventListener('mouseup', canvas.onMouseUp.bind(canvas))
  canvas.transformLayer.stopDraggingHandle()
  canvas.transformLayer.stopRotating()
  canvas.interactiveLayer = null
}
