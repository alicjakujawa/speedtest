const audioContext = new (window.AudioContext || window.webkitAudioContext)()
let sourceNode
let gainNode = audioContext.createGain()
let analyser = audioContext.createAnalyser()
analyser.smoothingTimeConstant = 0.5

export const getAnalyserForBuffer = (buffer) => {
  if (sourceNode && sourceNode.buffer) {
    sourceNode.stop()
  }
  sourceNode = audioContext.createBufferSource()
  sourceNode.buffer = buffer
  sourceNode.connect(gainNode)
  gainNode.connect(analyser)
  analyser.connect(audioContext.destination)
  sourceNode.start()
  return analyser
}
export const getAudioContext = () => audioContext

export const setBuffer = (buffer) => {
  sourceNode.buffer = buffer
}

export const stopPlay = () => {
  if (sourceNode && sourceNode.buffer) {
    sourceNode.disconnect(gainNode)
    // sourceNode.stop()
  }
}

export const startPlay = () => {
  if (sourceNode && sourceNode.buffer) {
    // sourceNode.start()
    sourceNode.connect(gainNode)
  }
}
