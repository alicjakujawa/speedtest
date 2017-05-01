import { connect } from 'react-redux'
import React, { Component, PropTypes } from 'react'
import { addFiles, streamFiles } from '../fileStore'
import { updatePlaylist, play, stop } from '../actions'
import HomeView from '../components/Home'

class HomeContainer extends Component {

  componentDidMount () {
    this.unregisterStream = streamFiles(files => {
      this.props.updatePlaylist(files)
      // FIXME: "HMR"
      this.props.play()
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
        audioInProgress={this.props.audioInProgress}
      />
    )
  }
}

HomeContainer.propTypes = {
  updatePlaylist: PropTypes.func.isRequired,
  play: PropTypes.func.isRequired,
  stop: PropTypes.func.isRequired,
  playlist: PropTypes.array.isRequired,
  currentPlayedId: PropTypes.string,
  audioInProgress: PropTypes.bool.isRequired
}

const mapDispatchToProps = ({
  updatePlaylist,
  play,
  stop
})

const mapStateToProps = state => ({
  playlist: state.audio.playlist,
  currentPlayedId: state.audio.currentPlayedId,
  audioInProgress: state.audio.audioInProgress
})

export default connect(mapStateToProps, mapDispatchToProps)(HomeContainer)
