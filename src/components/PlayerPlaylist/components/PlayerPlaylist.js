import React, { Component, PropTypes } from 'react'
import PlaylistElement from '../../PlaylistElement/components/PlaylistElement'
import Dropzone from 'react-dropzone'
import './PlayerPlaylist.scss'

class PlayerPlaylist extends Component {
  render () {
    return (
      <div>
        <div className='playlist-header'>
          <h4 className='title'>Playlist</h4>
        </div>
        <Dropzone onDrop={this.props.onDrop} className='playlist'>
          { this.props.playlist.map((song, i) => (
            <PlaylistElement
              removeFile={this.props.removeFile}
              song={song} index={i + 1}
              play={this.props.play}
              key={i}
            />
          )) }
        </Dropzone>
      </div>
    )
  }
}

PlayerPlaylist.propTypes = {
  playlist: PropTypes.array.isRequired,
  onDrop: PropTypes.func.isRequired,
  removeFile: PropTypes.func.isRequired,
  play: PropTypes.func.isRequired
}

export default PlayerPlaylist
