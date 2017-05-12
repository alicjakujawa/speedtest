const audioContext = new (window.AudioContext || window.webkitAudioContext)()
import { store } from './main'
import { Reader } from 'jsmediatags'
import { updateProgress } from './actions'

// let sourceNode
let gainNode = audioContext.createGain()
let analyser = audioContext.createAnalyser()
let currentFileId = null
const audioTag = document.createElement('audio')
const source = audioContext.createMediaElementSource(audioTag)

audioTag.addEventListener('timeupdate', (event) => {
  store.dispatch(updateProgress(audioTag.currentTime))
}, false)

source.connect(gainNode)
gainNode.connect(analyser)
analyser.connect(audioContext.destination)

analyser.smoothingTimeConstant = 0.5

export const setAudioTag = (audioFile) => {
  if (audioFile && currentFileId !== audioFile.id) {
    const src = URL.createObjectURL(audioFile.file)
    audioTag.src = src
    audioTag.play()
    currentFileId = audioFile.id
  }
}

export const getAudioInfo = (audioFile) => {
  return new Promise((resolve, reject) => {
    new Reader(audioFile)
      .setTagsToRead(['title', 'artist', 'album'])
      .read({ onSuccess: resolve, onError: reject })
  })
}

export const getAnalyser = () => analyser

export const stopPlay = () => {
  if (audioTag && audioTag.src) {
    audioTag.pause()
  }
}

export const startPlay = () => {
  if (audioTag && audioTag.src) {
    audioTag.play()
  }
}

export const changeVol = (vol) => {
  gainNode.gain.value = vol
}
