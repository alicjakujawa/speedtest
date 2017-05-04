import { connect } from 'react-redux'
import React, { Component, PropTypes } from 'react'
import { addFiles, streamFiles } from '../fileStore'
import { updatePlaylist, play, stop, next, prev } from '../actions'
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
      <HomeView
        playlist={this.props.playlist}
        onDrop={addFiles}
        play={this.props.play}
        stop={this.props.stop}
        next={this.props.next}
        prev={this.props.prev}
        audioInProgress={this.props.audioInProgress}
      />
    )
  }
}

HomeContainer.propTypes = {
  updatePlaylist: PropTypes.func.isRequired,
  play: PropTypes.func.isRequired,
  stop: PropTypes.func.isRequired,
  next: PropTypes.func.isRequired,
  prev: PropTypes.func.isRequired,
  playlist: PropTypes.array.isRequired,
  currentPlayedId: PropTypes.string,
  audioInProgress: PropTypes.bool.isRequired
}

const mapDispatchToProps = ({
  updatePlaylist,
  play,
  stop,
  next,
  prev
})

const mapStateToProps = state => ({
  playlist: state.audio.playlist,
  currentPlayedId: state.audio.currentPlayedId,
  audioInProgress: state.audio.audioInProgress
})

export default connect(mapStateToProps, mapDispatchToProps)(HomeContainer)
