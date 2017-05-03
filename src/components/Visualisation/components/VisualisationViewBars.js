import chroma from 'chroma-js'
import { linearPeak, makePeakDetector, feedPeakDetector, randomCoord, getNewCoords } from '../../../helpers/audioCalc'
import VisualisationBase from './VisualisationBase'

class VisualisationViewBars extends VisualisationBase {

  initAnalyzer () {
    super.initAnalyzer()
    const bins = this.freqDomain.length

    let bands = []
    bands.push([0, Math.floor(bins - 1)])
    bands.push([Math.floor(bins / 4), Math.floor(bins * 2 / 3)])
    bands.push([0, Math.floor(bins / 5)])
    bands.push([Math.floor(bins * 3 / 4), Math.floor(bins - 1)])

    this.peaks = bands.map(([a, b]) => makePeakDetector(a, b))

    const w = this.canvas.width
    const h = this.canvas.height
    this.step = 5

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

    this.coords = Array.from({ length: 3 }, () => ({
      x1: [randomCoord(w, this.step), -1, 'x'],
      y1: [randomCoord(h, this.step), 1, 'y'],
      x2: [randomCoord(w, this.step), -1.5, 'x'],
      y2: [randomCoord(h, this.step), -1.5, 'y'],
      cx1: [randomCoord(w, this.step), 1, 'x'],
      cy1: [randomCoord(h, this.step), -1, 'y'],
      cx2: [randomCoord(w, this.step), -1, 'x'],
      cy2: [randomCoord(h, this.step), 1, 'y']
    }))
  }

  tick (dt) {
    const ctx = this.canvas.getContext('2d')
    const colorScale = chroma.scale('Spectral').domain([5, 10]).out('hex')
    const domain = this.freqDomain
    this.peaks = this.peaks.map(peak => feedPeakDetector(peak, domain))
    this.peakAll = this.peaks[0]
    this.peakLows = this.peaks[1]
    this.peakMids = this.peaks[2]
    this.peakHighs = this.peaks[3]

    let total = domain.length
    const w = this.canvas.width
    const h = this.canvas.height
    const size = linearPeak(this.peakMids.lastPeak, 5, 50)

    // ctx.clearRect(0, 0, w, h)
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, w, h)

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
      let ph = (10 / (peak.lastPeak + 10)) * 200
      let p = 360 * (peak.min + peak.max) / 2048
      ctx.strokeStyle = `hsla(${p},100%,50%,0.5)`
      ctx.beginPath()
      ctx.lineWidth = ph
      ctx.moveTo(fd(peak.min), h / 2)
      ctx.lineTo(fd(peak.max), h / 2)
      ctx.stroke()
    }
    this.peaks.forEach(drawPeak)

    const lineSize = Math.floor(linearPeak(this.peakMids.lastPeak, 2, 10))
    this.step = Math.floor(linearPeak(this.peakMids.lastPeak, 5, 10))
    const value = linearPeak(this.peakMids.lastPeak, 5, 10)
    const strokeStyle = colorScale(value)
    // lines
    getNewCoords(this.coords[0], this.step, w, h)
    for (let i = lineSize; i >= 0; i--) {
      ctx.beginPath()
      ctx.lineWidth = (i + 1) * 4 - 2
      if (i === 0) {
        ctx.strokeStyle = '#fff'
      } else {
        ctx.strokeStyle = chroma(strokeStyle).alpha(0.5).css()
      }
      const { x1, y1, x2, y2, cx1, cy1, cx2, cy2 } = this.coords[0]
      ctx.moveTo(x1[0], y1[0])
      ctx.bezierCurveTo(cx1[0], cy1[0], cx2[0], cy2[0], x2[0], y2[0])
      ctx.stroke()
      ctx.closePath()
    }

    const lineSize2 = Math.floor(linearPeak(this.peakLows.lastPeak, 2, 10))
    this.step = Math.floor(linearPeak(this.peakLows.lastPeak, 5, 10))
    const valueSecond = linearPeak(this.peakLows.lastPeak, 5, 10)

    const strokeStyle2 = colorScale(valueSecond)

    getNewCoords(this.coords[1], this.step, w, h)
    for (let i = lineSize2; i >= 0; i--) {
      ctx.beginPath()
      ctx.lineWidth = (i + 1) * 4 - 2
      if (i === 0) {
        ctx.strokeStyle = '#fff'
      } else {
        ctx.strokeStyle = chroma(strokeStyle2).alpha(0.5).css()
      }
      const { x1, y1, x2, y2, cx1, cy1, cx2, cy2 } = this.coords[1]
      ctx.moveTo(x1[0], y1[0])
      ctx.bezierCurveTo(cx1[0], cy1[0], cx2[0], cy2[0], x2[0], y2[0])
      ctx.stroke()
      ctx.closePath()
    }
  }
}

VisualisationViewBars.propTypes = VisualisationBase.propTypes

export default VisualisationViewBars
