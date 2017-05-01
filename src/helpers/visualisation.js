const lutSize = 512
const lutMask = lutSize - 1

const sinLut = new Float32Array(lutSize)
for (let i = 0; i < lutSize; i++) {
  let rad = (i / lutSize) * 2 * Math.PI
  sinLut[i] = Math.sin(rad) * 1024
}

export const draw = (dt, T, ctx, w, h, buffer) => {
  // const buffer = this.imgData.data
  // const freq = this.freqDomain

  // binary fractal
  // buffer[i + 0] = (x & y) & 254
  // buffer[i + 1] = (x | y) & 254
  // buffer[i + 2] = (x ^ y) & 254
  // buffer[i + 3] = 255

  let i = 0
  const t1Inc = 3 * Math.sin(T / 305) + 2 * Math.sin(T / 1000) + Math.sin(T / 733)
  const t2Inc = 6 + 3 * Math.sin(T / 512) + Math.sin(T / 561)
  const t3Inc = 1 + 2 * Math.sin(T / 412) + Math.sin(T / 621)
  const t4Inc = 6 + 2 * Math.sin(T / 553) + 1.2 * Math.sin(T / 335)

  const startT1 = T / 5
  const startT2 = 1000 * Math.sin(T / 412)
  const startT3 = T / 1
  const startT4 = T / 3

  const rDiv = 1 / (5.1 + Math.sin(T / 1000) + 4 * Math.sin(T / 6213))
  const gDiv = 1 / (7 + 5 * Math.sin(T / 1234))
  const bDiv = 1 / (-4 + 3 * Math.sin(T / 712)) * (0.51 + 0.5 * Math.sin(T / 7852))

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

      buffer[i + 0] = sinSum * rDiv
      buffer[i + 1] = sinSum * gDiv
      buffer[i + 2] = sinSum * bDiv
      buffer[i + 3] = 255
      i += 4
    }
  }
}
