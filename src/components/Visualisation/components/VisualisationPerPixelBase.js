import VisualisationBase from './VisualisationBase'

class VisualisationPerPixelBase extends VisualisationBase {

  getDrawMethod () {
    throw new Error('getDrawMethod not implemented')
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
    const ctx = this.canvas.getContext('2d')
    const w = this.canvas.width
    const h = this.canvas.height

    this.initFramebuffer(ctx, w, h)
    const draw = this.getDrawMethod()
    this.state = draw(dt, T, w, h, this.imgData.data, this.freqDomain, this.state)

    this.swapBuffer(ctx)
  }
}

VisualisationPerPixelBase.propTypes = VisualisationBase.propTypes

export default VisualisationPerPixelBase
