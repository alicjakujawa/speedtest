import { draw as transpiledTunnel } from '../../src/components/Visualisation/visualisationTunnel'
import { draw as nativeTunnel } from '!!../../src/components/Visualisation/visualisationTunnel'
import { draw as transpiledPlasma } from '../../src/components/Visualisation/visualisationPlasma'
import { draw as nativePlasma } from '!!../../src/components/Visualisation/visualisationPlasma'

makeSuite('Tunnel visualisation', transpiledTunnel, nativeTunnel)
makeSuite('Plasma visualisation', transpiledPlasma, nativePlasma)

function makeSuite (name, transpiledDraw, nativeDraw) {
  suite(name, () => {
    const w = 640
    const h = 480
    const dt = 1 / 60
    const buffer = new Uint8ClampedArray(w * h * 4)
    const freq = new Uint8Array(1024)
    let state = null
    let T = 0

    // warmup and initialize state
    for (let i = 0; i < 10; i++) {
      state = transpiledDraw(dt, T, w, h, buffer, freq, state)
      T += dt * 1000
      state = nativeDraw(dt, T, w, h, buffer, freq, state)
      T += dt * 1000
    }

    benchmark('transpiled draw', () => {
      state = transpiledDraw(dt, T, w, h, buffer, freq, state)
      T += dt * 1000
    })

    benchmark('native draw', () => {
      state = nativeDraw(dt, T, w, h, buffer, freq, state)
      T += dt * 1000
    })
  })
}
