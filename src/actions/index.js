import { AUDIO } from '../constants/ActionTypes'
import { getAudioContext, setBuffer, stopPlay, startPlay } from '../audioProvider'

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
