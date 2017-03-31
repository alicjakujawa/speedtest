export class Circle {
  constructor (radius, speed, xPos, yPos, fillStyle) {
    this.radius = radius
    this.speed = speed
    this.xPos = xPos
    this.yPos = yPos
    this.fillStyle = fillStyle
    this.counter = 0

    let signHelper = Math.floor(Math.random() * 2)
    this.sign = signHelper === 1 ? -1 : 1
  }

  set (radius, speed, fillStyle) {
    this.radius = radius
    this.speed = speed
    this.fillStyle = fillStyle
  }

  update (ctx) {
    this.counter += this.sign * this.speed

    ctx.beginPath()
    ctx.arc(
      this.xPos + Math.cos(this.counter / 100) * this.radius,
      this.yPos + Math.sin(this.counter / 100) * this.radius,
      this.radius,
      0,
      Math.PI * 2,
      false
    )
    ctx.closePath()
    ctx.strokeStyle = this.fillStyle
    ctx.stroke()
  }
}
