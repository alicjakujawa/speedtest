import { startDecode, start } from '../actions'
import { shouldTriggerDecode, playIdSelector, shouldStartPlay } from '../selectors/audio'

export default ({ dispatch, getState }) => next => action => {
  const ret = next(action)

  const state = getState()
  if (shouldTriggerDecode(state)) {
    dispatch(startDecode(playIdSelector(state)))
  }
  // if (shouldRunSong(state)) {
  //   console.log('should run song')
  // }
  if (shouldStartPlay(state)) {
    dispatch(start())
  }
  return ret
}
