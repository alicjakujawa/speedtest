import { AUDIO } from '../constants/ActionTypes'
import { getAudioContext, stopPlay, startPlay } from '../audioProvider'

export function updatePlaylist (playlist) {
  return {
    type: AUDIO.PLAYLIST_UPDATED,
    playlist
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

export function play (id) {
  startPlay()
  return {
    type: AUDIO.PLAY,
    id
  }
}

export function stop () {
  stopPlay()
  return {
    type: AUDIO.STOP
  }
}

export function next () {
  return (dispatch, getState) => {
    const { playlist, currentPlayedId } = getState().audio
    if (!currentPlayedId && playlist.length) {
      return dispatch(change(playlist[0].id))
    }
    if (currentPlayedId) {
      const currentPlayed = playlist.find(song => song.id === currentPlayedId)
      let currentPlayedIndex = playlist.indexOf(currentPlayed)
      return playlist.length - 1 === currentPlayedIndex
        ? dispatch(change(playlist[0].id))
        : dispatch(change(playlist[currentPlayedIndex + 1].id))
    }
  }
}

export function prev () {
  return (dispatch, getState) => {
    const { playlist, currentPlayedId } = getState().audio
    if (!currentPlayedId && playlist.length) {
      return dispatch(change(playlist[playlist.length - 1].id))
    }
    if (currentPlayedId) {
      const currentPlayed = playlist.find(song => song.id === currentPlayedId)
      let currentPlayedIndex = playlist.indexOf(currentPlayed)
      return currentPlayedIndex === 0
        ? dispatch(change(playlist[playlist.length - 1].id))
        : dispatch(change(playlist[currentPlayedIndex - 1].id))
    }
  }
}

function change (id) {
  return {
    type: AUDIO.CHANGE_SONG,
    id
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
      })
    }
    reader.readAsArrayBuffer(fileObj.file)
    dispatch(setDecodedId(decodeId))
  }
}
