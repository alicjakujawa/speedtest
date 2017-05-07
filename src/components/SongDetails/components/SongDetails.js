import React, { PropTypes } from 'react'
import './SongDetails.scss'
import SongName from '../../SongName'

const SongDetails = ({ song }) => {
  const album = song && song.album || '-'
  return (
    <div className='song-details'>
      <h4 className='title'>{ album }</h4>
      <p className='subtitle'>
        <SongName song={song} />
      </p>
    </div>
  )
}

SongDetails.propTypes = {
  song: PropTypes.object
}

export default SongDetails
