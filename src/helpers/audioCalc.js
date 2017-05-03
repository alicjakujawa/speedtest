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

export const feedPeakDetector = (peak, freq) => {
  const { threshold, decay, min, max, lastPeak } = peak
  const data = sumRange(freq, min, max)
  let newThreshold = Math.max(0, threshold - decay)
  let newLastPeak = 0
  if (data > newThreshold) {
    newThreshold = data + decay * 5
  } else {
    newLastPeak = lastPeak + 1
  }
  return {
    ...peak,
    threshold: newThreshold,
    lastPeak: newLastPeak
  }
}

export const makePeakDetector = (min, max) => {
  return {
    min,
    max,
    decay: (max - min) / 2,
    threshold: 0,
    lastPeak: 0
  }
}

export const randomCoord = (dimension, step) => {
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
