import { AUDIO } from '../constants/ActionTypes'

export function onFilesDrop (files) {
  return {
    type: AUDIO.ADD_FILES,
    files
  }
}

export function saveFiles (files) {
  return {
    type: AUDIO.FILES_ADDED,
    files
  }
}
