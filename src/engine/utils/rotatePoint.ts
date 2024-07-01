/** @deprecated */
export default function rotatePoint(
  cx: number,
  cy: number,
  x: number,
  y: number,
  angle: number
): { x: number; y: number } {
  const radians = (Math.PI / 180) * -angle
  const cos = Math.cos(radians)
  const sin = Math.sin(radians)
  const nx = cos * (x - cx) - sin * (y - cy) + cx
  const ny = sin * (x - cx) + cos * (y - cy) + cy

  return { x: nx, y: ny }
}
