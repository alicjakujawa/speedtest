import { playedItemSelector } from '../selectors/audio'
import { setAudioTag } from '../audioProvider'

export default ({ dispatch, getState }) => next => action => {
  const ret = next(action)

  const state = getState()

  setAudioTag(playedItemSelector(state))

  return ret
}
