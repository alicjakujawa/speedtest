import React, { Component, PropTypes } from 'react'
import chroma from 'chroma-js'
import { getAnalyser } from '../../../audioProvider'

class VisualisationView2 extends Component {

  initAnalyzer () {
    this.analyser = getAnalyser()
    this.freqDomain = new Uint8Array(this.analyser.frequencyBinCount)
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
        this.tick(dt / 1000)
        this.req = requestAnimationFrame(localTick)
      }
      this.req = requestAnimationFrame(localTick)
    }
  }

  initFramebuffer (ctx, w, h) {
    if (!this.imgData || this.imgData.width !== w || this.imgData.height !== h) {
      this.imgData = ctx.createImageData(w, h)
    } else {
      // TODO: clear buffer
    }
  }

  swapBuffer (ctx) {
    ctx.putImageData(this.imgData, 0, 0)
  }

  draw (dt, ctx, w, h) {
    const buffer = this.imgData.data
    const l = buffer.length

    const randUint8 = () => (256 * Math.random()) | 0

    for (let i = 0; i < l; i += 4) {
      buffer[i + 0] = randUint8()
      buffer[i + 1] = randUint8()
      buffer[i + 2] = randUint8()
      buffer[i + 3] = 255
    }
  }

  tick (dt) {
    // const colorScale = chroma.scale('Spectral').domain([5, 10]).out('hex')
    // const domain = this.freqDomain
    // this.analyser.getByteFrequencyData(domain)
    // this.peaks.forEach(peak => peak.feed(domain))
    const ctx = this.canvas.getContext('2d')

    // let total = domain.length
    const w = this.canvas.width
    const h = this.canvas.height
    this.initFramebuffer(ctx, w, h)

    this.draw(dt, ctx, w, h)

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
