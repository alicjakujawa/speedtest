import React, { Component } from 'react'
import './HomeView.scss'
import song from '../assets/shinedown-heroes.mp3'
import chroma from 'chroma-js'
import { Circle } from '../utils/Shape'

const audioContext = new (window.AudioContext || window.webkitAudioContext)()

function fetchSong (src, cb) {
  fetch(src)
    .then(response => response.arrayBuffer())
    .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
    .then(audioBuffer => cb(audioBuffer))
    .catch(e => console.error(e))
}

const circles = []

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
  }

  componentDidMount () {
    fetchSong(this.refs.audioEl.src, (audioBuffer) => {
      this.initAnalyzer(audioBuffer)
      this.drawCircles()
      this.startAnim()
    })
  }

  startAnim () {
    requestAnimationFrame((dt) => {
      this.tick(dt)
      this.startAnim()
    })
  }

  drawCircles () {
    const ctx = this.canvas.getContext('2d')
    const colorScale = chroma.scale(['#000000', '#ff0000', '#ffff00', '#ffffff']).out('hex')
    const domain = this.freqDomain
    this.analyser.getByteFrequencyData(domain)

    for (let i = 0; i < domain.length; i++) {
      // const index = Math.ceil(domain.length / 20 * i)
      const value = Math.pow((domain[i] / 255), 2) * 255
      const randomX = Math.round(Math.random() * 800)
      const randomY = Math.round(Math.random() * 800)
      const speed = value * 0.2
      const radius = value
      const circle = new Circle(radius, speed, randomX, randomY, colorScale(value / 256))
      circles.push(circle)
      circle.update(ctx)
    }
  }

  getMagAverage (data, min, max) {
    const slicedData = data.slice(min, max)
    return slicedData.reduce((acc, val) => acc + val, 0) / (max - min + 1)
  }

  peakDetector (min, max) {
    const decay = (max - min) / 2
    let threshold = 0
    let lastPeak = 0

    return {
      process (data) {
        const mag = this.getMagAverage(data, min, max)
        threshold = Math.max(0, threshold - decay)
        if (mag > threshold) {
          lastPeak = 0
          threshold = mag + decay * 5
        } else {
          lastPeak++
        }
        return lastPeak
      },
      get () {
        return lastPeak
      }
    }
  }

  tick () {
    const ctx = this.canvas.getContext('2d')
    const colorScale = chroma.scale(['#000000', '#ff0000', '#ffff00', '#ffffff']).out('hex')
    const domain = this.freqDomain
    this.analyser.getByteFrequencyData(domain)
    ctx.clearRect(0, 0, 800, 1024)

    for (let i = 0; i < domain.length; i++) {
      // const index = Math.ceil(domain.length / 20 * i)
      const value = Math.pow((domain[i] / 255), 2) * 255
      const speed = value * 0.2
      const radius = value
      circles[i].set(radius, speed, colorScale(value / 256))
      circles[i].update(ctx)
    }
  }

  render () {
    return (
      <div>
        <h4>Music player!</h4>
        <audio src={song} ref='audioEl' />
        <canvas width='800' height='1024' ref={c => { this.canvas = c }} />
      </div>
    )
  }
}

export default HomeView
