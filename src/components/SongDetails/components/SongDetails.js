import React, { Component, PropTypes } from 'react'
import './SongDetails.scss'

class SongDetails extends Component {
  constructor (props) {
    super(props)
    this.state = {
      album: '',
      artist: '',
      title: ''
    }
  }
  componentWillReceiveProps ({ song }) {
    if (song) {
      const { album, artist, title } = song
      this.setState({
        album,
        artist,
        title
      })
    }
  }
  render () {
    const { album, artist, title } = this.state
    return (
      <div className='song-details'>
        <h4 className='title'>{ album }</h4>
        <p className='subtitle'>{ artist } - { title }</p>
      </div>
    )
  }
}

SongDetails.propTypes = {
  song: PropTypes.object
}

export default SongDetails
