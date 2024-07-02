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
