export default function getClientCoordinates(
  event: MouseEvent,
  canvas: HTMLCanvasElement
) {
  const dpr = window.devicePixelRatio
  const canvasRect = canvas.getBoundingClientRect()
  const scaleX = canvas.width / canvasRect.width / dpr
  const scaleY = canvas.height / canvasRect.height / dpr

  return {
    x: (event.clientX - canvasRect.left) * scaleX,
    y: (event.clientY - canvasRect.top) * scaleY,
  }
}
