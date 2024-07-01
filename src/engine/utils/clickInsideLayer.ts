import Layer from '../layers/Layer'
import applyInverseRotation from './applyInverseRotation'

export default function clickInsideLayer(
  clickX: number,
  clickY: number,
  layer: Layer
): boolean {
  const { x, y, width, height, rotation } = layer
  const centerX = x + width / 2
  const centerY = y + height / 2
  const transformedPoint = applyInverseRotation(
    clickX,
    clickY,
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
