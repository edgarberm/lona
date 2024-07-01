export default function applyInverseRotation(
  x: number,
  y: number,
  cx: number,
  cy: number,
  rotation: number
) {
  const radians = (rotation * Math.PI) / 180
  const cos = Math.cos(radians)
  const sin = Math.sin(radians)
  const nx = cos * (x - cx) + sin * (y - cy) + cx
  const ny = cos * (y - cy) - sin * (x - cx) + cy
  return { x: nx, y: ny }
}
