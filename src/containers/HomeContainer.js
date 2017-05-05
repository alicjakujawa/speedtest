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
    const { audioInProgress, playlist, currentPlayedTime } = this.props
    return (
      <HomeView
        playlist={playlist}
        onDrop={addFiles}
        play={this.props.play}
        stop={this.props.stop}
        next={this.props.next}
        prev={this.props.prev}
        audioInProgress={audioInProgress}
        audioTime={currentPlayedTime}
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
  audioInProgress: PropTypes.bool.isRequired,
  decodedAudioInfo: PropTypes.object,
  currentPlayedTime: PropTypes.number.isRequired
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
  audioInProgress: state.audio.audioInProgress,
  decodedAudioInfo: state.audio.decodedAudioInfo,
  currentPlayedTime: state.audio.currentPlayedTime
})

export default connect(mapStateToProps, mapDispatchToProps)(HomeContainer)
