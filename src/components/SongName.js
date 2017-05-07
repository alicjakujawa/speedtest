import React, { PropTypes } from 'react'

const SongName = ({ song }) => {
  if (!song) {
    return <span>-</span>
  }

  const { artist, title, file } = song
  const name = artist && title ? `${artist} - ${title}` : file.name
  return <span>{ name }</span>
}

SongName.propTypes = {
  song: PropTypes.object
}

export default SongName
