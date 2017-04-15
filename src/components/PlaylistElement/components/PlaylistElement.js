import React, { Component, PropTypes } from 'react'
import './PlaylistElement.scss'

class PlaylistElement extends Component {
  render () {
    return (
      <div className='element'>
        <span> { this.props.index } </span>
        <span className='title'> { this.props.song.name } </span>
        <span className='duration'> { this.props.song.duration } </span>
      </div>
    )
  }
}

PlaylistElement.propTypes = {
  song: PropTypes.object,
  index: PropTypes.number
}

export default PlaylistElement
