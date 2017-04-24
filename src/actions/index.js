import { AUDIO } from '../constants/ActionTypes'

export function updatePlaylist (playlist) {
  return {
    type: AUDIO.PLAYLIST_UPDATED,
    playlist
  }
}

export function runSong (id) {
  console.log('runSong', id)
  return {
    type: AUDIO.RUN_SONG,
    id
  }
}

export function startDecode (decodeId) {
  return {
    type: AUDIO.DECODE,
    decodeId
  }
}
