import { AUDIO } from '../constants/ActionTypes'
import { getAudioContext, setBuffer, stopPlay, startPlay } from '../audioProvider'

export function updatePlaylist (playlist) {
  return {
    type: AUDIO.PLAYLIST_UPDATED,
    playlist
  }
}

function run (id) {
  return {
    type: AUDIO.RUN_SONG,
    id
  }
}

export function runSong (id) {
  return (dispatch, getState) => {
    // const state = getState()
    dispatch(run(id))
  }
}

function setDecodedId (decodeId) {
  return {
    type: AUDIO.DECODE,
    decodeId
  }
}

function setDecodedBuffer (buffer, id) {
  return {
    type: AUDIO.DECODED_BUFFER,
    buffer,
    id
  }
}

export function play () {
  return {
    type: AUDIO.PLAY
  }
}

export function stop () {
  stopPlay()
  return {
    type: AUDIO.STOP
  }
}

function setAudioInProgress () {
  return {
    type: AUDIO.AUDIO_IN_PROGRESS
  }
}

export function start () {
  return (dispatch, getState) => {
    startPlay()
    dispatch(setAudioInProgress())
  }
}

export function startDecode (decodeId) {
  return (dispatch, getState) => {
    const { audio } = getState()
    const fileObj = audio.playlist.find(file => file.id === decodeId)
    var reader = new FileReader()
    reader.onload = function (e) {
      getAudioContext().decodeAudioData(e.target.result, buffer => {
        dispatch(setDecodedBuffer(buffer, decodeId))
        setBuffer(buffer)
      })
    }
    reader.readAsArrayBuffer(fileObj.file)
    dispatch(setDecodedId(decodeId))
  }
}
