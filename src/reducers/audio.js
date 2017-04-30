import { AUDIO } from '../constants/ActionTypes'

const initialState = {
  playlist: [], // playlist data
  decodedAudioInfo: {},
  currentPlayedId: null, // id of file
  decodingInProgress: [], // ids currently decoded
  analyser: null,
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
      return {
        ...state,
        decodedAudioInfo: { ...state.decodedAudioInfo, ...newSong }
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
          currentPlayedId: state.playlist[0].id
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

    case AUDIO.SET_ANALYSER:
      return {
        ...state,
        analyser: action.analyser
      }

    default:
      return state
  }
}
