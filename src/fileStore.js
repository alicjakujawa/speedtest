import localforage from 'localforage'
import uuid from 'uuid/v4'
import { getAudioInfo } from './audioProvider'
import R from 'ramda'

localforage.getItem('files')
  .then(files => {
    if (files) {
      localFileList = files
      notifyUpdate()
    }
  })

let localFileList = []
const updateCallbacks = []

const notifyUpdate = () => {
  updateCallbacks.forEach(cb => cb(localFileList))
}

export const streamFiles = (onUpdate) => {
  if (updateCallbacks.indexOf(onUpdate) < 0) {
    updateCallbacks.push(onUpdate)
  }

  onUpdate(localFileList)

  return () => {
    const idx = updateCallbacks.indexOf(onUpdate)
    if (idx >= 0) {
      updateCallbacks.splice(idx, 1)
    }
  }
}

const gatherDuration = (file) => {
  const localAudio = document.createElement('audio')
  const src = URL.createObjectURL(file)
  localAudio.src = src
  return new Promise(resolve => {
    const onDuration = (event) => {
      localAudio.removeEventListener('durationchange', onDuration, false)
      resolve(localAudio.duration)
    }

    localAudio.addEventListener('durationchange', onDuration, false)
  })
}

const gatherMetadata = async (file) => {
  const [{ tags }, duration] = await Promise.all([
    getAudioInfo(file).catch(x => ({ tags: {} })),
    gatherDuration(file)
  ])

  return {
    file,
    title: tags.title,
    artist: tags.artist,
    album: tags.album,
    duration,
    id: uuid()
  }
}

export const addFiles = async (files) => {
  const newFilesResolved = await Promise.all(files.map(gatherMetadata))

  localFileList = [...localFileList, ...newFilesResolved]
  localforage.setItem('files', localFileList)
  notifyUpdate()
}

export const removeFile = (fileId) => {
  const idx = localFileList.findIndex(file => file.id === fileId)
  if (idx >= 0) {
    localFileList = R.remove(idx, 1, localFileList)
    localforage.setItem('files', localFileList)
    notifyUpdate()
  }
}

// DEBUG
streamFiles((files) => {
  console.log('files', files)
})
