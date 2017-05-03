import {
  linearPeak,
  makePeakDetector,
  feedPeakDetector,
  sumRange
} from '../../helpers/audioCalc'

const lutSize = 512
const lutMask = lutSize - 1

const sinLut = new Float32Array(lutSize)
for (let i = 0; i < lutSize; i++) {
  let rad = (i / lutSize) * 2 * Math.PI
  sinLut[i] = Math.sin(rad) * 1024
}

const easeInOutQuad = t =>
  t < 0.5
    ? 2 * t * t
    : -1 + (4 - 2 * t) * t

const clamp = t => t < 0 ? 0 : t > 1 ? 1 : t

const makeInitState = (bins) => {
  return {
    lows: makePeakDetector(Math.floor(bins / 4), Math.floor(bins * 2 / 3)),
    mids: makePeakDetector(0, Math.floor(bins / 5)),
    highs: makePeakDetector(Math.floor(bins * 3 / 4), Math.floor(bins - 1)),
    drift1: 0
  }
}

export const draw = (dt, T, w, h, buffer, freq, state) => {
  state = state || makeInitState(freq.length)
  // binary fractal
  // buffer[i + 0] = (x & y) & 254
  // buffer[i + 1] = (x | y) & 254
  // buffer[i + 2] = (x ^ y) & 254
  // buffer[i + 3] = 255
  const newLows = feedPeakDetector(state.lows, freq)
  const newMids = feedPeakDetector(state.mids, freq)
  const newHighs = feedPeakDetector(state.highs, freq)

  const lows = newLows.lastPeak
  const mids = newMids.lastPeak
  const highs = newHighs.lastPeak
  const amplitude = sumRange(freq, 0, freq.length) / (255 * (freq.length - 1))

  const s = {
    lows: newLows,
    mids: newMids,
    highs: newHighs,
    drift1: lows === 0 ? 1 : Math.max(0, (state.drift1 - dt))
  }

  const driftT = T + s.drift1 * 1000
  let i = 0
  const t1Inc = 6 + Math.sin(driftT / 500)
  const t2Inc = 3 + amplitude
  const t3Inc = 3 + Math.sin(driftT / 300)
  const t4Inc = 2 + amplitude

  const startT1 = -t1Inc * (h / 2)
  const startT2 = -t2Inc * (h / 2) + Math.cos(T / 1000) * 200
  const startT3 = -t3Inc * (w / 2)
  const startT4 = -t4Inc * (w / 2) + Math.sin(T / 1000) * 200

  const rMul = 1 / 512
  const gMul = 1 / 1024
  const bMul = 1 / -512

  const colorRotate = phi => Math.sin(phi + T / 1000)

  const rOffset = colorRotate(0) + linearPeak(lows, 1, 1.2)
  const gOffset = colorRotate(2) + linearPeak(mids, 0.1, 1)
  const bOffset = colorRotate(4) + linearPeak(highs, -1, -0.5)

  let t1 = startT1
  let t2 = startT2

  for (let y = 0; y < h; y++) {
    let t3 = startT3
    let t4 = startT4

    t1 += t1Inc
    t2 += t2Inc

    for (let x = 0; x < w; x++) {
      t3 += t3Inc
      t4 += t4Inc

      const sinSum =
        sinLut[t1 & lutMask] +
        sinLut[t2 & lutMask] +
        sinLut[t3 & lutMask] +
        sinLut[t4 & lutMask]

      buffer[i + 0] = easeInOutQuad(clamp(sinSum * rMul + rOffset)) * 255
      buffer[i + 1] = easeInOutQuad(clamp(sinSum * gMul + gOffset)) * 255
      buffer[i + 2] = easeInOutQuad(clamp(sinSum * bMul + bOffset)) * 255
      buffer[i + 3] = 255
      i += 4
    }
  }

  return s
}
