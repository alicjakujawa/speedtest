import React, { Component, PropTypes } from 'react'
import './PlaylistElement.scss'
import SongName from '../../SongName'
import Time from '../../Time'

class PlaylistElement extends Component {

  runSong (e, id) {
    e.stopPropagation()
    this.props.play(id)
  }

  removeFile (e, id) {
    e.stopPropagation()
    this.props.removeFile(id)
  }

  render () {
    const { id, duration } = this.props.song

    return (
      <div className='element' onClick={(e) => this.runSong(e, id)}>
        <span> { this.props.index } </span>
        <span className='name'>
          <SongName song={this.props.song} />
        </span>
        <span className='duration'>
          <Time time={duration} />
        </span>
        <button className='button remove' onClick={(e) => this.removeFile(e, id)}>
          <span className='glyphicon glyphicon-remove' />
        </button>
      </div>
    )
  }
}

PlaylistElement.propTypes = {
  song: PropTypes.object.isRequired,
  index: PropTypes.number,
  play: PropTypes.func,
  removeFile: PropTypes.func.isRequired
}

export default PlaylistElement
