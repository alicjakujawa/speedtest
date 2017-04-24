import React, { Component, PropTypes } from 'react'
import PlaylistElement from '../../PlaylistElement/components/PlaylistElement'
import Dropzone from 'react-dropzone'
import './PlayerPlaylist.scss'

class PlayerPlaylist extends Component {
  render () {
    return (
      <div>
        <div className='playlist-header'>
          <h4 className='title'>Ghost Stories</h4>
        </div>
        <Dropzone onDrop={this.props.onDrop} className='playlist'>
          { this.props.songs && this.props.songs.map(function (song, i) {
            return <PlaylistElement song={song} index={i + 1} key={i} />
          }) }
        </Dropzone>
      </div>
    )
  }
}

PlayerPlaylist.propTypes = {
  songs: PropTypes.array,
  onDrop: PropTypes.func
}

export default PlayerPlaylist
