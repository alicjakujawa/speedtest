import React, { Component, PropTypes } from 'react'
import './PlaylistElement.scss'

class PlaylistElement extends Component {

  runSong (e, id) {
    e.stopPropagation()
    this.props.play(id)
  }

  render () {
    const { id, file: { name } } = this.props.song
    return (
      <div className='element' onClick={(e) => this.runSong(e, id)}>
        <span> { this.props.index } </span>
        <span className='name'> { name } </span>
      </div>
    )
  }
}

PlaylistElement.propTypes = {
  song: PropTypes.object,
  index: PropTypes.number,
  play: PropTypes.func
}

export default PlaylistElement
