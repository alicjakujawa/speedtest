import React, { Component, PropTypes } from 'react'
import SongDetails from '../../SongDetails/components/SongDetails'
import PlayerActions from '../../PlayerActions/components/PlayerActions'
import PlayerPlaylist from '../../PlayerPlaylist/components/PlayerPlaylist'
import { visualisations } from '../../Visualisation'
import './HomeView.scss'
console.log('visualisations', visualisations)

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
          <SongDetails />
          <PlayerActions play={this.props.play} stop={this.props.stop} progress='40' />
        </div>
        <div className='column'>
          <PlayerPlaylist play={this.props.play} onDrop={this.props.onDrop} playlist={this.props.playlist} />
        </div>
      </div>
    )
  }
}

HomeView.propTypes = {
  onDrop: PropTypes.func.isRequired,
  playlist: PropTypes.array.isRequired,
  play: PropTypes.func.isRequired,
  stop: PropTypes.func.isRequired,
  audioInProgress: PropTypes.bool.isRequired
}

export default HomeView
