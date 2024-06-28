export default function applyInverseRotation(
  x: number,
  y: number,
  cx: number,
  cy: number,
  rotation: number
) {
  const angle = -rotation * (Math.PI / 180)
  const cos = Math.cos(angle)
  const sin = Math.sin(angle)

  const dx = x - cx
  const dy = y - cy

  return {
    x: cos * dx - sin * dy + cx,
    y: sin * dx + cos * dy + cy,
  }
}
