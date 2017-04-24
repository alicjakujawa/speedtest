import React, { Component, PropTypes } from 'react'
import SongDetails from '../../SongDetails/components/SongDetails'
import PlayerActions from '../../PlayerActions/components/PlayerActions'
import PlayerPlaylist from '../../PlayerPlaylist/components/PlayerPlaylist'
import Visualisation from '../../Visualisation'
import './HomeView.scss'

const songs = [
  {
    name: 'Always In My Head',
    duration: 360 // seconds
  },
  {
    name: 'Magic',
    duration: 285 // seconds
  },
  {
    name: 'True Love',
    duration: 345 // seconds
  },
  {
    name: 'Midnight',
    duration: 420 // seconds
  },
  {
    name: 'Oceans',
    duration: 360 // seconds
  }
]

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
            {this.state.show ?
              <Visualisation
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
          { this.props.files.length > 1 ?
            <PlayerPlaylist onDrop={this.props.onDrop} songs={this.props.files} />
            : null
          }
        </div>
      </div>
    )
  }
}

HomeView.propTypes = {
  onDrop: PropTypes.func,
  files: PropTypes.array
}

export default HomeView
