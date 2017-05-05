import { startDecode, setCurrentPlayTime } from '../actions'
import { shouldTriggerDecode, decodedPlayedSelector, playIdSelector } from '../selectors/audio'
import { setCurrentPlayBuffer } from '../audioProvider'

export default ({ dispatch, getState }) => next => action => {
  const ret = next(action)

  const state = getState()

  if (shouldTriggerDecode(state)) {
    dispatch(startDecode(playIdSelector(state)))
  }

  const decodedBuffer = decodedPlayedSelector(state)
  if (decodedBuffer) {
    setCurrentPlayBuffer(decodedBuffer)
    dispatch(setCurrentPlayTime(decodedBuffer.duration))
  }

  return ret
}
