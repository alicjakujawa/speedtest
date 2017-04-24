import { startDecode } from '../actions'
import { shouldTriggerDecode, playIdSelector } from '../selectors/audio'

export default ({ dispatch, getState }) => next => action => {
  const ret = next(action)

  const state = getState()
  console.log('shouldTriggerDecode', shouldTriggerDecode(state))
  if (shouldTriggerDecode(state)) {
    dispatch(startDecode(playIdSelector(state)))
  }
  return ret
}
