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
    default:
      return state
  }
}
