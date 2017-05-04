import {
  makePeakDetector,
  feedPeakDetector,
  sumRange
} from '../../helpers/audioCalc'

const texSize = 512 // power of 2
const texMask = texSize - 1
const maxSides = 10

let angleTable = null
let distanceTable = null
let ringOffsetTable = null
let lutW = 0
let lutH = 0

const calcLuts = (w, h) => {
  if (w === lutW && h === lutH) return
  lutW = w
  lutH = h

  const tableSize = w * h * 4
  angleTable = new Int32Array(tableSize)
  distanceTable = new Int32Array(tableSize)
  ringOffsetTable = new Float32Array(texSize * maxSides)

  for (let sides = 0; sides < maxSides; sides++) {
    for (let tex = 0; tex < texSize; tex++) {
      ringOffsetTable[tex + sides * texSize] =
        Math.sin(tex / texSize * Math.PI * 2 * (sides + 1)) -
        10 // move it a bit away from "camera"
    }
  }

  let i = 0
  for (let y = 0; y < h * 2; y++) {
    for (let x = 0; x < w * 2; x++) {
      const dx = x - w
      const dy = y - h

      distanceTable[i] = Math.floor(32 * texSize / Math.sqrt(dx * dx + dy * dy))

      const rawAngle = 0.5 + Math.atan2(dy, dx) / (2 * Math.PI)
      angleTable[i] = texSize * rawAngle
      i++
    }
  }
}

// texture
const binary = (x, y) => {
  return [
    (x & y) & 255,
    (x | y) & 255,
    (x ^ y) & 255
  ]
}

const mix = (color, lightness, beat, fog, gBeat) => {
  const mixRatio = lightness * 0.5
  return (color * (mixRatio + beat * (1 - mixRatio))) * fog + Math.max(0, (255 * gBeat * (0.5 - fog)))
}

const damp = (x) => {
  x *= 0.95
  if (x > 1) {
    return 1 + (x - 1) * 0.5
  }
  if (x < -1) {
    return -1 + (x + 1) * 0.5
  }
  return x
}

const invRingTexSize = (138 / texSize)
const inv255 = 1 / 255

const pixelColor = (data) => {
  const { x, y, w, st } = data

  // calculate dist/angle LUT index
  const idx =
    (x + st.shiftLookX) +
    (y + st.shiftLookY) * w * 2

  // lookup dist/ngle with some random offseting for fuzzy feeling
  const dist = distanceTable[idx] + (Math.random() * st.fuzzX | 0)
  const angle = angleTable[idx] + (Math.random() * st.fuzzY | 0)

  // calculate texture coordinates inside tunnel, apply offset and twist
  const texX = (dist + st.shiftX) & texMask
  const texY = (st.twist * dist + angle + st.shiftY) & texMask

  // calculate ring sides based on Y tex coord
  let ringOffset = -10 // move it a bit away from "camera"
  if (st.sides > 0) {
    ringOffset = ringOffsetTable[texY + texSize * st.sides]
  }

  // calculate beat ring table offset based on distance
  const ring = Math.max(1, ringOffset + dist * invRingTexSize) | 0
  const beatRead = (st.beatPtr - ring) & 127

  let beatAll = st.beatMapAll[beatRead] * inv255
  let beatLow = st.beatMapLow[beatRead] * inv255
  let beatHigh = st.beatMapAll[beatRead] * inv255

  // calculate "texture"
  const binArr = binary(texX, texY)

  // redirect color channels based on randomized pallete
  const r = binArr[st.pallete[0]]
  const g = binArr[st.pallete[1]]
  const b = binArr[st.pallete[2]]

  // calculate fog based on distance
  const fog = Math.max(0, Math.min(1, 1 - dist / texSize * 2))

  // final color mixing
  return {
    r: mix(r, st.lightness, beatAll, fog, st.beatsActivity),
    g: mix(g, st.lightness, beatLow, fog, st.beatsActivity),
    b: mix(b, st.lightness, beatHigh, fog, st.beatsActivity)
  }
}

const nextState = (state, freq, w, h, dt, T) => {
  const avgAmp = sumRange(freq, 0, freq.length) / (freq.length - 1)
  // calculate overall amplitude with decently looking multiplier
  const amplitude = Math.min(1, 0.05 * avgAmp)

  // feed peaks with freq data
  const newBeatAll = feedPeakDetector(state.beatAll, freq)
  const newBeatLow = feedPeakDetector(state.beatLow, freq)
  const newBeatHigh = feedPeakDetector(state.beatHigh, freq)

  // calculate "frequency sharpness"
  // - how wide the frequency spectrum is in contrast to last time
  let freqAboveAvg = 0
  let freqBarelyAlive = 0
  for (let i = 0; i < freq.length; i++) {
    const fVal = freq[i]
    if (fVal > avgAmp) {
      freqAboveAvg++
    }

    if (fVal > avgAmp * 0.01) {
      freqBarelyAlive++
    }
  }

  const freqSharpnessRaw = freqAboveAvg > 0 ? freqAboveAvg / freqBarelyAlive : 0
  const minSharp = Math.max(0, state.minSharp - 0.01, freqSharpnessRaw)
  const maxSharp = Math.min(1, state.maxSharp + 0.01, freqSharpnessRaw)
  const freqSharpness = minSharp === maxSharp
    ? 0
    : (freqSharpnessRaw - minSharp) / (maxSharp - minSharp)

  // add recent beats to run table
  state.beatMapAll[state.beatPtr] = 255 / newBeatAll.lastPeak
  state.beatMapLow[state.beatPtr] = 255 / newBeatLow.lastPeak
  state.beatMapHigh[state.beatPtr] = 255 / newBeatHigh.lastPeak

  // calculate bg lightness based on currently running beats
  let lightness = 1
  let lightnessProbe = 0.2
  for (let i = state.beatPtr; lightnessProbe > 0; i = (i - 1) & 127) {
    if (state.beatMapAll[i] > 127) {
      lightness -= lightnessProbe
    }
    lightnessProbe -= 0.01
  }
  lightness = Math.max(0, lightness)

  // calculate how active the beats are in general
  const beatsActivity =
    Math.max(0, 1 - 0.005 * (
      newBeatAll.lastPeak +
      newBeatLow.lastPeak +
      newBeatHigh.lastPeak
    ))

  // on beat: chance to reverse spin target direction
  let targetDir = (newBeatLow.lastPeak === 0 && Math.random() > 0.5)
    ? -state.targetDir
    : state.targetDir

  // on beat: chance to randomize number of sides on beat rings
  let sides = (newBeatHigh.lastPeak === 0 && Math.random() > 0.5)
    ? (Math.random() * maxSides) | 0
    : state.sides

  // on beat: chance to randomize color sourcing
  let pallete = (newBeatAll.lastPeak === 0 && Math.random() > 0.6)
    ? [
      Math.random() * 3 | 0,
      Math.random() * 3 | 0,
      Math.random() * 3 | 0
    ]
    : state.pallete

  // lean towards new spin direction
  let dir = state.dir * 0.9 + targetDir * 0.1

  // add some time-based wobble to look direction
  // - overall target coord must always stay between <0;1)
  // <-0.25 ; 0.25)
  const randPretX = 0.125 * Math.sin(T / 3333)
  const randPretY = 0.125 * Math.sin(T / 5555)

  // on beat: chance to randomize look target in tunnel
  let newTargetX = state.targetLookX
  let newTargetY = state.targetLookY
  if (newBeatAll.lastPeak === 0 && Math.random() > 0.7) {
    // <0.25 ; 0.75)
    newTargetX = 0.25 + 0.5 * Math.random()
    newTargetY = 0.25 + 0.5 * Math.random()
  }

  // lean towards new target
  const currentLookX = state.currentLookX * 0.9 + newTargetX * 0.1
  const currentLookY = state.currentLookY * 0.9 + newTargetY * 0.1

  // precompute final for frames
  const lookX = w * Math.max(0, Math.min(1, currentLookX + randPretX))
  const lookY = h * Math.max(0, Math.min(1, currentLookY + randPretY))
  return {
    amplitude,
    particles: feedParticles(state.particles, newTargetX, newTargetY, freqSharpness, newBeatAll.lastPeak, w, h),
    targetLookX: newTargetX,
    targetLookY: newTargetY,
    currentLookX,
    currentLookY,
    shiftLookX: lookX | 0,
    shiftLookY: lookY | 0,
    beatAll: newBeatAll,
    beatLow: newBeatLow,
    beatHigh: newBeatHigh,
    beatMapAll: state.beatMapAll,
    beatMapLow: state.beatMapLow,
    beatMapHigh: state.beatMapHigh,
    beatPtr: (state.beatPtr + 1) & 127,
    shiftX: state.shiftX + dt * (20 + 400 * amplitude),
    lightness,
    dir,
    beatsActivity,
    minSharp,
    maxSharp,
    sides,
    pallete,
    fuzzX: (1 - freqSharpness) * 5,
    fuzzY: (1 - freqSharpness) * 15,
    targetDir,
    twist: damp(state.twist + dt * 0.01 * (10 + 90 * amplitude - 200 * beatsActivity) * dir),
    shiftY: state.shiftY + dt * (10 + 90 * amplitude) * dir
  }
}

const makeInitState = (len, w, h) => ({
  amplitude: 0,
  particles: initParticles(300, w, h),
  beatAll: makePeakDetector(0, len),
  beatLow: makePeakDetector(0, (0.1 * len) | 0),
  beatHigh: makePeakDetector((0.55 * len) | 0, len),
  shiftX: 0,
  shiftY: 0,
  shiftLookX: 0,
  shiftLookY: 0,
  currentLookX: 0.5,
  currentLookY: 0.5,
  targetLookX: 0.5,
  targetLookY: 0.5,
  minSharp: 0,
  maxSharp: 0,
  beatPtr: 0,
  targetDir: 1,
  dir: 1,
  sides: 0,
  twist: 0,
  pallete: [0, 1, 2],
  beatsActivity: 0,
  beatMapAll: new Uint8ClampedArray(128),
  beatMapLow: new Uint8ClampedArray(128),
  beatMapHigh: new Uint8ClampedArray(128)
})

const initParticles = (num, w, h) => {
  const p = new Float32Array(num * 4)
  for (let i = 0; i < num * 4; i += 4) {
     // [x, y, vx, vy]
    p[i + 0] = Math.random() * w
    p[i + 1] = Math.random() * h
    p[i + 2] = 0
    p[i + 3] = 0
  }
  return p
}

const lutInvToLenLimit = (1 / (32 * texSize)) * 3

const feedParticles = (p, centerX, centerY, fuzzy, beat, w, h) => {
  centerX *= w
  centerY *= h

  const fuzzCoef = fuzzy * 0.2 + (beat === 0 ? 50 : 0)

  for (let i = 0; i < p.length; i += 4) {
    // calc accel
    const dx = (centerX - p[i + 0]) | 0
    const dy = (centerY - p[i + 1]) | 0

    const lutInvSqrt = distanceTable[dx + texSize + (dy + texSize) * texSize]
    const lenLimit = Math.min(1, lutInvToLenLimit * lutInvSqrt)

    const ax = (Math.random() - 0.5) * fuzzCoef + dx * lenLimit
    const ay = (Math.random() - 0.5) * fuzzCoef + dy * lenLimit

    // apply accel
    p[i + 2] = p[i + 2] * 0.9 + ax
    p[i + 3] = p[i + 3] * 0.9 + ay

    // apply velocity
    p[i + 0] = Math.max(1, Math.min(w - 2, p[i + 0] + p[i + 2]))
    p[i + 1] = Math.max(1, Math.min(h - 2, p[i + 1] + p[i + 3]))
  }
  return p
}

export const draw = (dt, T, w, h, buffer, freq, state) => {
  calcLuts(w, h)

  state = nextState(state || makeInitState(freq.length, w, h), freq, w, h, dt, T)

  // draw tunnel
  let i = 0
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const { r, g, b } = pixelColor({ x, y, w, h, st: state })
      buffer[i + 0] = r
      buffer[i + 1] = g
      buffer[i + 2] = b
      buffer[i + 3] = 255
      i += 4
    }
  }

  // draw particles
  const p = state.particles
  for (let i = 0; i < p.length; i += 4) {
    let o = ((p[i + 0] | 0) + (p[i + 1] | 0) * w) * 4

    markParticle(buffer, o)

    // fast moving particles are drawn "fat"
    if (p[i + 2] * p[i + 2] + p[i + 3] * p[i + 3] > 16) {
      markParticle(buffer, o - 4)
      markParticle(buffer, o + 4)
      markParticle(buffer, o - w * 4)
      markParticle(buffer, o + w * 4)
    }
  }

  return state
}

const markParticle = (buffer, o) => {
  // draw single particle pixel
  buffer[o + 0] = buffer[o + 0] * 4 + 40
  buffer[o + 1] = buffer[o + 1] * 4 + 40
  buffer[o + 2] = buffer[o + 2] * 4 + 40
}
