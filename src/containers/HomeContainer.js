import { connect } from 'react-redux'
import React, { Component, PropTypes } from 'react'
import { addFiles, streamFiles } from '../fileStore'
import { updatePlaylist, runSong } from '../actions'
import HomeView from '../components/Home'

class HomeContainer extends Component {

  componentDidMount () {
    this.unregisterStream = streamFiles(files => {
      this.props.updatePlaylist(files)
    })
  }

  componentWillUnmount () {
    this.unregisterStream()
  }

  render () {
    return (
      <HomeView playlist={this.props.playlist} onDrop={addFiles} runSong={this.props.runSong} />
    )
  }
}

HomeContainer.propTypes = {
  updatePlaylist: PropTypes.func.isRequired,
  runSong: PropTypes.func.isRequired,
  playlist: PropTypes.array.isRequired
}

const mapDispatchToProps = ({
  updatePlaylist,
  runSong
})

const mapStateToProps = state => ({
  playlist: state.audio.playlist
})

export default connect(mapStateToProps, mapDispatchToProps)(HomeContainer)
