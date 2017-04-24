import React, { Component, PropTypes } from 'react'
import SongDetails from '../../SongDetails/components/SongDetails'
import PlayerActions from '../../PlayerActions/components/PlayerActions'
import PlayerPlaylist from '../../PlayerPlaylist/components/PlayerPlaylist'
import Visualisation from '../../Visualisation'
import './HomeView.scss'

class HomeView extends Component {
  constructor (props) {
    super(props)
    this.state = {
      offsetWidth: 0,
      offsetHeight: 0,
      show: false
    }
  }

  componentDidMount () {
    const { offsetWidth, offsetHeight } = this.refs.visualisation
    this.setState({ offsetWidth, offsetHeight, show: true })
  }

  render () {
    return (
      <div className='wrapper'>
        <div className='column column-left'>
          <div className='visualisation' ref='visualisation'>
            {this.state.show
              ? <Visualisation
                width={this.state.offsetWidth}
                height={this.state.offsetHeight}
              />
              : null
            }
          </div>
          <SongDetails />
          <PlayerActions progress='40' />
        </div>
        <div className='column'>
          <PlayerPlaylist runSong={this.props.runSong} onDrop={this.props.onDrop} playlist={this.props.playlist} />
        </div>
      </div>
    )
  }
}

HomeView.propTypes = {
  onDrop: PropTypes.func.isRequired,
  playlist: PropTypes.array.isRequired,
  runSong: PropTypes.func.isRequired
}

export default HomeView
