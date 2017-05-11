import { connect } from 'react-redux'
import React, { Component, PropTypes } from 'react'
import { addFiles, streamFiles, removeFile } from '../fileStore'
import { updatePlaylist, play, stop, next, prev } from '../actions'
import { playedItemSelector } from '../selectors/audio'
import HomeView from '../components/Home'

class HomeContainer extends Component {

  componentDidMount () {
    this.unregisterStream = streamFiles(files => {
      this.props.updatePlaylist(files)
    })
  }

  removeFileFromList (id) {
    this.props.updatePlaylist(removeFile(id))
  }

  componentWillUnmount () {
    this.unregisterStream()
  }

  render () {
    const { audioInProgress, playlist, song, progress } = this.props
    return (
      <HomeView
        playlist={playlist}
        onDrop={addFiles}
        removeFile={id => this.removeFileFromList(id)}
        play={this.props.play}
        stop={this.props.stop}
        next={this.props.next}
        prev={this.props.prev}
        audioInProgress={audioInProgress}
        progress={progress}
        song={song}
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
  song: PropTypes.object,
  progress: PropTypes.number.isRequired
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
  currentPlayedTime: state.audio.currentPlayedTime,
  progress: state.audio.progress,
  song: playedItemSelector(state)
})

export default connect(mapStateToProps, mapDispatchToProps)(HomeContainer)
