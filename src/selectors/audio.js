import { createSelector } from 'reselect'

const scoped = fn => createSelector(state => state.audio, fn)

export const playIdSelector = scoped(scope => scope.currentPlayedId)
const playlistSelector = scoped(scope => scope.playlist)

export const playedItemSelector = createSelector(
  playIdSelector,
  playlistSelector,
  (id, playlist) => playlist.find(i => i.id === id) || null
)
