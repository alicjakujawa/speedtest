import React, { Component, PropTypes } from 'react'
import PlaylistElement from '../../PlaylistElement/components/PlaylistElement'
import './PlayerPlaylist.scss'

class PlayerPlaylist extends Component {
  render () {
    return (
      <div>
        <div className='playlist-header'>
          <h4 className='title'>Ghost Stories</h4>
        </div>
        <div className='playlist'>
          { this.props.songs.map(function (song, i) {
            return <PlaylistElement song={song} index={i + 1} key={i} />
          }) }
        </div>
      </div>
    )
  }
}

PlayerPlaylist.propTypes = {
  songs: PropTypes.array
}

export default PlayerPlaylist
