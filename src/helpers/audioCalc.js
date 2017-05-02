export const sumRange = (buf, min, max) => {
  let sum = 0
  for (let i = min; i < max; i++) {
    sum += buf[i]
  }
  return sum
}

export const linearPeak = (peakVal, from, to) => {
  const i = 1 / (peakVal + 1)
  return to * i + from * (1 - i)
}

export const makePeakDetector = (min, max) => {
  let lastPeak = 0
  let threshold = 0
  const decay = (max - min) / 2
  return {
    feed (buf) {
      const data = sumRange(buf, min, max)
      threshold = Math.max(0, threshold - decay)
      if (data > threshold) {
        lastPeak = 0
        threshold = data + decay * 5
      } else {
        lastPeak++
      }
      return lastPeak
    },
    get () {
      return {
        v: lastPeak,
        min,
        max
      }
    }
  }
}

export const randomCoord = (type, w, h, step) => {
  const dimension = (type === 'x') ? w : h
  return Math.random() * (dimension - 2 * step) + step
}

export const getNewCoords = (coords, step, w, h) => {
  for (let key in coords) {
    let coord = coords[key]
    coord[0] += step * coord[1]
    if ((coord[0] > (h - 2 * step) && coord[2] === 'y') ||
       (coord[0] > (w - 2 * step) && coord[2] === 'x') ||
       coord[0] < 2 * step) {
      coord[1] *= -1
    }
  }
}
