import { AUDIO } from '../constants/ActionTypes'
import { stopPlay, startPlay } from '../audioProvider'
import { playedItemSelector } from '../selectors/audio'

export function updatePlaylist (playlist) {
  return {
    type: AUDIO.PLAYLIST_UPDATED,
    playlist
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

export function updateProgress (currentTime) {
  return (dispatch, getState) => {
    const file = playedItemSelector(getState())
    return dispatch({
      type: AUDIO.PROGRESS_UPDATED,
      progress: currentTime / file.duration
    })
  }
}
