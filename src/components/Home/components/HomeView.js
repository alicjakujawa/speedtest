import React, { Component, PropTypes } from 'react'
import SongDetails from '../../SongDetails/components/SongDetails'
import PlayerActions from '../../PlayerActions/components/PlayerActions'
import PlayerPlaylist from '../../PlayerPlaylist/components/PlayerPlaylist'
import { visualisations } from '../../Visualisation'
import './HomeView.scss'

class HomeView extends Component {
  constructor (props) {
    super(props)
    this.state = {
      offsetWidth: 0,
      offsetHeight: 0,
      show: false,
      visId: 0
    }

    this.changeVisualisation = this.changeVisualisation.bind(this)
  }

  changeVisualisation () {
    this.setState({
      visId: (this.state.visId + 1) % visualisations.length
    })
  }

  componentDidMount () {
    const { offsetWidth, offsetHeight } = this.refs.visualisation
    this.setState({ offsetWidth, offsetHeight, show: true })
  }

  render () {
    const Visualisation = visualisations[this.state.visId]
    return (
      <div className='wrapper'>
        <div className='column column-left'>
          <div className='visualisation' ref='visualisation' onClick={this.changeVisualisation}>
            {this.state.show
              ? <Visualisation
                width={this.state.offsetWidth}
                height={this.state.offsetHeight}
                audioInProgress={this.props.audioInProgress}
              />
              : null
            }
          </div>
          <SongDetails song={this.props.song} />
          <PlayerActions
            play={this.props.play}
            stop={this.props.stop}
            next={this.props.next}
            prev={this.props.prev}
            audioInProgress={this.props.audioInProgress}
            song={this.props.song}
            playlist={this.props.playlist}
            progress={this.props.progress} />
        </div>
        <div className='column'>
          <PlayerPlaylist
            play={this.props.play}
            onDrop={this.props.onDrop}
            removeFile={this.props.removeFile}
            playlist={this.props.playlist}
          />
        </div>
      </div>
    )
  }
}

HomeView.propTypes = {
  onDrop: PropTypes.func.isRequired,
  removeFile: PropTypes.func.isRequired,
  playlist: PropTypes.array.isRequired,
  play: PropTypes.func.isRequired,
  stop: PropTypes.func.isRequired,
  next: PropTypes.func.isRequired,
  prev: PropTypes.func.isRequired,
  audioInProgress: PropTypes.bool.isRequired,
  progress: PropTypes.number.isRequired,
  song: PropTypes.object
}

export default HomeView
