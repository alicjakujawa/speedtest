import { AUDIO } from '../constants/ActionTypes'

const initialState = {
  playlist: [], // playlist data
  decodedAudioInfo: {},
  currentPlayedId: null, // id of file
  decodingInProgress: [] // ids currently decoded
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

    default:
      return state
  }
}
