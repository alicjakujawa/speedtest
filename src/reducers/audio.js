import { AUDIO } from '../constants/ActionTypes'

const initialState = {
  files: []
}

export default function counter (state = initialState, action) {
  switch (action.type) {
    case AUDIO.ADD_FILES:
      return {
        ...state,
        ...state.files
      }
    case AUDIO.FILES_ADDED:
      return {
        ...state,
        files: state.files.concat(action.files)
      }

    default:
      return state
  }
}
