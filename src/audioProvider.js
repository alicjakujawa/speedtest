const audioContext = new (window.AudioContext || window.webkitAudioContext)()
import { Reader } from 'jsmediatags'

let sourceNode
let gainNode = audioContext.createGain()
let analyser = audioContext.createAnalyser()
analyser.smoothingTimeConstant = 0.5

export const getAudioInfo = (audioFile) => {
  new Reader(audioFile)
  .setTagsToRead(['title', 'artist', 'album'])
  .read({
    onSuccess: function (tag) {
      console.log(tag)
    },
    onError: function (error) {
      console.log(':(', error.type, error.info)
    }
  })
  return new Promise((resolve, reject) => {
    new Reader(audioFile)
      .setTagsToRead(['title', 'artist', 'album'])
      .read({ onSuccess: resolve })
  })
}

export const setCurrentPlayBuffer = (buffer) => {
  if (sourceNode && sourceNode.buffer === buffer) {
    return
  }

  if (sourceNode && sourceNode.buffer) {
    sourceNode.stop()
  }
  sourceNode = audioContext.createBufferSource()
  sourceNode.buffer = buffer
  sourceNode.connect(gainNode)
  gainNode.connect(analyser)
  analyser.connect(audioContext.destination)
  sourceNode.start()
}

export const getAnalyser = () => analyser

export const getAudioContext = () => audioContext

export const stopPlay = () => {
  if (sourceNode && sourceNode.buffer) {
    sourceNode.disconnect(gainNode)
  }
}

export const startPlay = () => {
  if (sourceNode && sourceNode.buffer) {
    sourceNode.connect(gainNode)
  }
}
