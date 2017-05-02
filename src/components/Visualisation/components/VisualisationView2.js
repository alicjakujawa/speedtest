import React, { Component, PropTypes } from 'react'
// import chroma from 'chroma-js'
import { getAnalyser } from '../../../audioProvider'
import { draw } from '../../../helpers/visualisation'
import { makePeakDetector, sumRange } from '../../../helpers/audioCalc'

class VisualisationView2 extends Component {

  initAnalyzer () {
    this.analyser = getAnalyser()
    this.freqDomain = new Uint8Array(this.analyser.frequencyBinCount)
    let bands = []
    const bins = this.freqDomain.length
    bands.push([0, Math.floor(bins - 1)])
    bands.push([Math.floor(bins / 4), Math.floor(bins * 2 / 3)])
    bands.push([0, Math.floor(bins / 5)])
    bands.push([Math.floor(bins * 3 / 4), Math.floor(bins - 1)])

    this.peaks = bands.map(([a, b]) => makePeakDetector(a, b))
    this.peakAll = this.peaks[0]
    this.peakLows = this.peaks[1]
    this.peakMids = this.peaks[2]
    this.peakHighs = this.peaks[3]
  }

  componentDidUpdate () {
    if (this.props.audioInProgress) { // check also if its changed
      this.initAnalyzer()
      this.startAnim()
    }
    if (!this.props.audioInProgress) {
      cancelAnimationFrame(this.req)
      this.req = null
    }
  }

  componentWillUnmount () {
    cancelAnimationFrame(this.req)
    this.req = null
  }

  startAnim () {
    let prevT = performance.now()
    if (!this.req) {
      const localTick = (T) => {
        const dt = T - prevT
        prevT = T
        this.tick(dt / 1000, T)
        this.req = requestAnimationFrame(localTick)
      }
      this.req = requestAnimationFrame(localTick)
    }
  }

  initFramebuffer (ctx, w, h) {
    if (!this.imgData || this.imgData.width !== w || this.imgData.height !== h) {
      this.imgData = ctx.createImageData(w, h)
      this.zeroBuffer = new Uint8ClampedArray(w * h * 4)
    } else {
      // clear buffer in optimal way (memcpy)
      this.imgData.data.set(this.zeroBuffer)
    }
  }

  swapBuffer (ctx) {
    ctx.putImageData(this.imgData, 0, 0)
  }

  tick (dt, T) {
    // const colorScale = chroma.scale('Spectral').domain([5, 10]).out('hex')
    // const domain = this.freqDomain
    this.analyser.getByteFrequencyData(this.freqDomain)

    // this.peaks.forEach(peak => peak.feed(this.freqDomain))
    const ctx = this.canvas.getContext('2d')
    const peakData = {
      lows: this.peaks[1].feed(this.freqDomain),
      mids: this.peaks[2].feed(this.freqDomain),
      highs: this.peaks[3].feed(this.freqDomain),
      amplitude: sumRange(this.freqDomain, 0, this.freqDomain.length) / (255 * (this.freqDomain.length - 1))
    }

    // console.log(peakData)

    // let total = domain.length
    const w = this.canvas.width
    const h = this.canvas.height
    // const peak = linearPeak(this.peakMids.get().v, 5, 50)

    this.initFramebuffer(ctx, w, h)

    this.state = draw(dt, T, w, h, this.imgData.data, peakData, this.state)

    this.swapBuffer(ctx)
  }

  render () {
    const props = this.props
    return (
      <span>
        <canvas height={props.height} width={props.width} ref={c => { this.canvas = c }} />
      </span>
    )
  }
}

VisualisationView2.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  audioInProgress: PropTypes.bool.isRequired
}

export default VisualisationView2
