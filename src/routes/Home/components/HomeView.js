import React, { Component } from 'react'
import './HomeView.scss'
import song from '../assets/shinedown-heroes.mp3'
import chroma from 'chroma-js'

const audioContext = new (window.AudioContext || window.webkitAudioContext)()

function fetchSong (src, cb) {
  fetch(src)
    .then(response => response.arrayBuffer())
    .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
    .then(audioBuffer => cb(audioBuffer))
    .catch(e => console.error(e))
}

const sumRange = (buf, min, max) => {
  let sum = 0
  for (let i = min; i < max; i++) {
    sum += buf[i]
  }
  return sum
}

const linearPeak = (peakVal, from, to) => {
  const i = 1 / (peakVal + 1)
  return to * i + from * (1 - i)
}

const makePeakDetector = (min, max) => {
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

class HomeView extends Component {

  initAnalyzer (audioBuffer) {
    let sourceNode = audioContext.createBufferSource()
    this.analyser = audioContext.createAnalyser()
    this.analyser.smoothingTimeConstant = 0.5
    this.freqDomain = new Uint8Array(this.analyser.frequencyBinCount)
    sourceNode.buffer = audioBuffer
    sourceNode.connect(this.analyser)
    this.analyser.connect(audioContext.destination)
    sourceNode.start()
    let bands = []
    // for (let i = 0; i < this.analyser.frequencyBinCount / 64; i++) {
    //   bands.push([i * 64, (i + 1) * 64])
    // }
    const bins = this.analyser.frequencyBinCount
    bands.push([0, Math.floor(bins - 1)])
    bands.push([Math.floor(bins / 4), Math.floor(bins * 2 / 3)])
    bands.push([0, Math.floor(bins / 5)])
    bands.push([Math.floor(bins * 3 / 4), Math.floor(bins - 1)])

    this.peaks = bands.map(([a, b]) => makePeakDetector(a, b))
    this.peakAll = this.peaks[0]
    this.peakLows = this.peaks[1]
    this.peakMids = this.peaks[2]
    this.peakHighs = this.peaks[3]

    const w = this.canvas.width
    const h = this.canvas.height

    this.dots = Array.from({ length: 20 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: Math.random() * 10 - 5,
      vy: Math.random() * 10 - 5
    }))

    this.gravity = {
      x: w / 2,
      y: h / 2,
      g: 0.1
    }
  }

  componentDidMount () {
    fetchSong(this.refs.audioEl.src, (audioBuffer) => {
      this.initAnalyzer(audioBuffer)
      this.startAnim()
    })
  }

  startAnim () {
    let prevT = performance.now()
    requestAnimationFrame((T) => {
      const dt = T - prevT
      prevT = T
      this.tick(dt / 1000)
      this.startAnim()
    })
  }

  tick (dt) {
    const ctx = this.canvas.getContext('2d')
    // const colorScale = chroma.scale(['#000000', '#ff0000', '#ffff00', '#ffffff']).out('hex')
    const domain = this.freqDomain
    this.analyser.getByteFrequencyData(domain)
    this.peaks.forEach(peak => peak.feed(domain))

    let total = domain.length
    const w = this.canvas.width
    const h = this.canvas.height
    const size = linearPeak(this.peakMids.get().v, 5, 50)
    // this.gravity.g = linearPeak(this.peakHighs.get().v, 1, -2)
    // ctx.fillStyle = 'white'
    // ctx.globalAlpha = 0.2
    // ctx.fillRect(0, 0, w, h)
    // ctx.fillStyle = 'black'
    // ctx.globalAlpha = 1

    ctx.clearRect(0, 0, w, h)

    this.gravity.g = 20

    this.dots.forEach(dot => {
      const dx = (this.gravity.x - dot.x) / 150
      const dy = (this.gravity.y - dot.y) / 150
      const ax = this.gravity.g * dt / dx
      const ay = this.gravity.g * dt / dy
      dot.vx += ax
      dot.vy += ay
      // dot.vx *= 0.95
      // dot.vy *= 0.95

      dot.x += dot.vx
      dot.y += dot.vy

      if (dot.x < 0) { dot.x = 0; dot.vx = 0 }
      if (dot.x > w) { dot.x = w; dot.vx = 0 }
      if (dot.y < 0) { dot.y = 0; dot.vy = 0 }
      if (dot.y > h) { dot.y = h; dot.vy = 0 }

      ctx.fillRect(dot.x - size / 2, dot.y - size / 2, size, size)
    })

    const fd = f => f / (total + 1) * w
    const drawPeak = (peak) => {
      const m = peak.get()
      let ph = (10 / (m.v + 10)) * 200
      let p = 360 * (m.min + m.max) / 2048
      ctx.strokeStyle = `hsla(${p},100%,50%,0.5)`
      ctx.beginPath()
      ctx.lineWidth = ph
      ctx.moveTo(fd(m.min), h / 2)
      ctx.lineTo(fd(m.max), h / 2)
      ctx.stroke()
    }
    this.peaks.forEach(drawPeak)
  }

  render () {
    return (
      <div>
        <h4>Music player!</h4>
        <audio src={song} ref='audioEl' />
        <canvas height='768' width='1024' ref={c => { this.canvas = c }} />
      </div>
    )
  }
}

export default HomeView
