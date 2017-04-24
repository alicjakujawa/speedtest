import React, { Component, PropTypes } from 'react'
import './PlaylistElement.scss'

class PlaylistElement extends Component {

  runSong (e, id) {
    e.stopPropagation()
    this.props.runSong(id)
  }

  render () {
    const { id, file: { name, duration } } = this.props.song
    const minutes = Math.floor(duration / 60)
    const seconds = duration - minutes * 60
    const preSec = seconds.toString().length < 2 ? '0' : ''
    return (
      <div className='element' onClick={(e) => this.runSong(e, id)}>
        <span> { this.props.index } </span>
        <span className='name'> { name } </span>
        <span className='duration'> { `${minutes}:${preSec}${seconds}` } </span>
      </div>
    )
  }
}

PlaylistElement.propTypes = {
  song: PropTypes.object,
  index: PropTypes.number,
  runSong: PropTypes.func
}

export default PlaylistElement
