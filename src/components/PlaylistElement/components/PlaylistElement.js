import React, { Component, PropTypes } from 'react'
import './PlaylistElement.scss'
import Time from '../../Time'

class PlaylistElement extends Component {

  runSong (e, id) {
    e.stopPropagation()
    this.props.play(id)
  }

  render () {
    const { id, artist, title, duration } = this.props.song
    return (
      <div className='element' onClick={(e) => this.runSong(e, id)}>
        <span> { this.props.index } </span>
        <span className='name'> { artist } - { title } </span>
        <span className='duration'>
          <Time time={duration} />
        </span>
      </div>
    )
  }
}

PlaylistElement.propTypes = {
  song: PropTypes.object.isRequired,
  index: PropTypes.number,
  play: PropTypes.func
}

export default PlaylistElement
