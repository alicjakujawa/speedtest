import { linearPeak } from './audioCalc'

const lutSize = 512
const lutMask = lutSize - 1

const sinLut = new Float32Array(lutSize)
for (let i = 0; i < lutSize; i++) {
  let rad = (i / lutSize) * 2 * Math.PI
  sinLut[i] = Math.sin(rad) * 1024
}

const initState = {
  drift1: 0
}

const easeInOutQuad = t =>
  t < 0.5
    ? 2 * t * t
    : -1 + (4 - 2 * t) * t

const clamp = t => t < 0 ? 0 : t > 1 ? 1 : t

export const draw = (dt, T, w, h, buffer, peakData, state) => {
  state = state || initState
  // binary fractal
  // buffer[i + 0] = (x & y) & 254
  // buffer[i + 1] = (x | y) & 254
  // buffer[i + 2] = (x ^ y) & 254
  // buffer[i + 3] = 255

  // this.drift1 = (this.drift1 || 0) + linearPeak(peakData.lows, 0, 0.5)
  const s = {
    drift1: peakData.lows === 0 ? 1 : Math.max(0, (state.drift1 - dt))
  }

  // value1 += linearPeak(peakData.lows, 0, 50) + T
  // value2 += linearPeak(peakData.mids, 0, 50) + T
  // value3 += linearPeak(peakData.highs, 0, 50) + T
  // console.log(s.drift1)

  // const peakT = T + linearPeak(peakData.lows, 0, 200)
  const driftT = T + s.drift1 * 1000
  let i = 0
  const t1Inc = 6 + Math.sin(driftT / 500) // * (1 + Math.sin(T / 200)) // + 2 * Math.sin(T / 1000) + Math.sin(T / 733)
  const t2Inc = 3 + peakData.amplitude // T / 1000 // * (1 + Math.sin(T / 200)) // + 3 * Math.sin(T / 5012) // + Math.sin(T / 561)
  const t3Inc = 3 + Math.sin(driftT / 300) // 1 + 2 * Math.sin(T / 4012) // + Math.sin(T / 621)
  const t4Inc = 2 + peakData.amplitude // 6 + 2 * Math.sin(T / 5053) // + 1.2 * Math.sin(T / 335)

  const startT1 = -t1Inc * (h / 2) // T / 5
  const startT2 = -t2Inc * (h / 2) + Math.cos(T / 1000) * 200 // * Math.sin(T / 4012)
  const startT3 = -t3Inc * (w / 2) // T / 1
  const startT4 = -t4Inc * (w / 2) + Math.sin(T / 1000) * 200 // T / 3

  const rMul = 1 / 512 // (5.1 + Math.sin(T / 1000) + 4 * Math.sin(T / 6213))
  const gMul = 1 / 1024 // (7 + 5 * Math.sin(T / 1234))
  const bMul = 1 / -512 // (-4 + 3 * Math.sin(T / 712)) * (0.51 + 0.5 * Math.sin(T / 7852))

  const colorRotate = phi => Math.sin(phi + T / 1000)

  const rOffset = colorRotate(0) + linearPeak(peakData.lows, 1, 1.2)
  const gOffset = colorRotate(2) + linearPeak(peakData.mids, 0.1, 1)
  const bOffset = colorRotate(4) + linearPeak(peakData.highs, -1, -0.5)

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

      // const easedMin = easeInOutQuad(-sinSum / 255) * 255
      // const easedClamp = easeInOutQuad(clamp(sinSum / 255)) * 255
      // const easedClampMin = easeInOutQuad(clamp(-sinSum / 255)) * 255

      buffer[i + 0] = easeInOutQuad(clamp(sinSum * rMul + rOffset)) * 255
      buffer[i + 1] = easeInOutQuad(clamp(sinSum * gMul + gOffset)) * 255
      buffer[i + 2] = easeInOutQuad(clamp(sinSum * bMul + bOffset)) * 255
      buffer[i + 3] = 255
      i += 4
    }
  }

  return s
}
