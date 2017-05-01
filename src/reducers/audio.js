import { AUDIO } from '../constants/ActionTypes'
import R from 'ramda'

const initialState = {
  playlist: [], // playlist data
  decodedAudioInfo: {},
  currentPlayedId: null, // id of file
  decodingInProgress: [], // ids currently decoded
  audioInProgress: false
}

export default function counter (state = initialState, action) {
  switch (action.type) {
    case AUDIO.DECODE:
      if (state.decodingInProgress.indexOf(action.decodeId) >= 0) {
        return state
      }

      return {
        ...state,
        decodingInProgress: [...state.decodingInProgress, action.decodeId]
      }

    case AUDIO.DECODED_BUFFER:
      let newSong = {}
      newSong[action.id] = action.buffer
      const indexOfDecodedAudio = state.decodingInProgress.indexOf(action.id)
      return {
        ...state,
        decodedAudioInfo: { ...state.decodedAudioInfo, ...newSong },
        decodingInProgress: R.remove(indexOfDecodedAudio, 1, state.decodingInProgress)
      }
    case AUDIO.PLAYLIST_UPDATED:
      return {
        ...state,
        playlist: action.playlist
      }

    case AUDIO.RUN_SONG:
      return {
        ...state,
        currentPlayedId: action.id
      }

    case AUDIO.PLAY:
      if (state.playlist.length) {
        return {
          ...state,
          currentPlayedId: state.playlist[0].id,
          audioInProgress: true
        }
      }
      return state

    case AUDIO.STOP:
      return {
        ...state,
        currentPlayedId: null,
        audioInProgress: false
      }

    case AUDIO.AUDIO_IN_PROGRESS:
      return {
        ...state,
        audioInProgress: true
      }

    default:
      return state
  }
}
