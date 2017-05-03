import React, { Component, PropTypes } from 'react'
import { getAnalyser } from '../../../audioProvider'

class VisualisationBase extends Component {

  initAnalyzer () {
    this.freqDomain = new Uint8Array(getAnalyser().frequencyBinCount)
  }

  checkProgress () {
    if (this.props.audioInProgress && !this.req) {
      this.initAnalyzer()
      this.startAnim()
    }
    if (!this.props.audioInProgress && this.req) {
      cancelAnimationFrame(this.req)
      this.req = null
    }
  }

  componentDidUpdate () {
    this.checkProgress()
  }

  componentDidMount () {
    this.checkProgress()
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
        getAnalyser().getByteFrequencyData(this.freqDomain)
        this.tick(dt / 1000, T)
        this.req = requestAnimationFrame(localTick)
      }
      this.req = requestAnimationFrame(localTick)
    }
  }

  tick (dt, T) {
    throw new Error('tick not implemented')
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

VisualisationBase.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  audioInProgress: PropTypes.bool.isRequired
}

export default VisualisationBase
