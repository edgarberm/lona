import Layer from './layers/Layer'

/**
 * @description
 *
 * Utilities for the project
 */
export function screenToCanvas(point: Point, camera: Camera): Point {
  return {
    x: point.x / camera.z - camera.x,
    y: point.y / camera.z - camera.y,
  }
}

export function distance(a: Point, b: Point): number {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2))
}

export function clickInsideLayer(
  point: Point,
  layer: Layer
): boolean {
  const { x, y, width, height, rotation } = layer
  const centerX = x + width / 2
  const centerY = y + height / 2
  const transformedPoint = applyInverseRotation(
    Math.round(point.x),
    Math.round(point.y),
    centerX,
    centerY,
    rotation
  )

  return (
    transformedPoint.x >= x &&
    transformedPoint.x <= x + width &&
    transformedPoint.y >= y &&
    transformedPoint.y <= y + height
  )
}


export function applyInverseRotation(
  x: number,
  y: number,
  cx: number,
  cy: number,
  rotation: number
): Point {
  const radians = (rotation * Math.PI) / 180
  const cos = Math.cos(radians)
  const sin = Math.sin(radians)
  const nx = cos * (x - cx) + sin * (y - cy) + cx
  const ny = cos * (y - cy) - sin * (x - cx) + cy

  return { x: nx, y: ny }
}


const KEY_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315, 360]

export function normalizeAngle(angle: number): number {
  return ((angle % 360) + 360) % 360
}

export function snapToKeyAngle(angle: number, threshold: number = 3): number {
  for (const key of KEY_ANGLES) {
    if (Math.abs(angle - key) < threshold) {
      return key
    }
  }
  return angle
}
