import { createSelector } from 'reselect'

const scoped = fn => createSelector(state => state.audio, fn)

export const playIdSelector = scoped(scope => scope.currentPlayedId)
const playlistSelector = scoped(scope => scope.playlist)
const decodedSelector = scoped(scope => scope.decodedAudioInfo)
const decodingInProgressSelector = scoped(scope => scope.decodingInProgress)

export const playedItemSelector = createSelector(
  playIdSelector,
  playlistSelector,
  (id, playlist) => playlist.find(i => i.id === id) || null
)

export const decodedPlayedSelector = createSelector(
  playIdSelector,
  decodedSelector,
  (id, decoded) => decoded[id] || null
)

const decodingPlayedInProgressSelector = createSelector(
  playIdSelector,
  decodingInProgressSelector,
  (id, decoding) => id === null ? false : decoding.indexOf(id) >= 0
)

export const shouldTriggerDecode = createSelector(
  playedItemSelector,
  decodedPlayedSelector,
  decodingPlayedInProgressSelector,
  (played, decoded, decodingInProgress) => !decoded && !!played && !decodingInProgress
)
