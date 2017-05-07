import { startDecode } from '../actions'
import { shouldTriggerDecode, playIdSelector, playedItemSelector } from '../selectors/audio'
import { setAudioTag } from '../audioProvider'

export default ({ dispatch, getState }) => next => action => {
  const ret = next(action)

  const state = getState()

  if (shouldTriggerDecode(state)) {
    dispatch(startDecode(playIdSelector(state)))
  }

  // const decodedBuffer = decodedPlayedSelector(state)
  // if (decodedBuffer) {
  //   // setCurrentPlayBuffer(decodedBuffer)
  // }
  setAudioTag(playedItemSelector(state))

  return ret
}
