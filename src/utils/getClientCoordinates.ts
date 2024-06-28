export default function getClientCoordinates(
  event: MouseEvent,
  canvas: HTMLCanvasElement
) {
  const dpr = window.devicePixelRatio || 1
  const rect = canvas.getBoundingClientRect()
  const scaleX = canvas.width / rect.width / dpr
  const scaleY = canvas.height / rect.height / dpr

  return {
    x: (event.clientX - rect.left) * scaleX,
    y: (event.clientY - rect.top) * scaleY,
  }
}
