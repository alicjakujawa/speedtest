import localforage from 'localforage'
import uuid from 'uuid/v4'

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

export const addFiles = (files) => {
  localFileList = [...localFileList, ...files.map(file => ({
    file,
    id: uuid()
  }))]
  localforage.setItem('files', localFileList)
  notifyUpdate()
}

// DEBUG
streamFiles((files) => {
  console.log('files', files)
})
