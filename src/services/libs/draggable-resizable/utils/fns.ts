export function isFunction (func: any) {
  return (
    typeof func === 'function' ||
    Object.prototype.toString.call(func) === '[object Function]'
  )
}

export function snapToGrid (
  grid: any,
  pendingX: number,
  pendingY: number,
  scale = 1
) {
  const [scaleX, scaleY] = typeof scale === 'number' ? [scale, scale] : scale
  const x = Math.round(pendingX / scaleX / grid[0]) * grid[0]
  const y = Math.round(pendingY / scaleY / grid[1]) * grid[1]
  return [x, y]
}

export function getSize (el: any) {
  const rect = el.getBoundingClientRect()

  return [parseInt(rect.width), parseInt(rect.height)]
}

export function computeWidth (parentWidth: number, left: number, right: number) {
  return parentWidth - left - right
}

export function computeHeight (
  parentHeight: number,
  top: number,
  bottom: number
) {
  return parentHeight - top - bottom
}

export function restrictToBounds (value: number, min: number, max: number) {
  if (min !== null && value < min) {
    return min
  }

  if (max !== null && max < value) {
    return max
  }

  return value
}
