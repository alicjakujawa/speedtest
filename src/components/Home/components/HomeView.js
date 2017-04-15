import React, { Component } from 'react'
import SongDetails from '../../SongDetails/components/SongDetails'
import PlayerActions from '../../PlayerActions/components/PlayerActions'
import PlayerPlaylist from '../../PlayerPlaylist/components/PlayerPlaylist'
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
  render () {
    return (
      <div className='wrapper'>
        <div className='column'>
          <SongDetails />
          <PlayerActions progress='40' />
        </div>
        <div className='column'>
          <PlayerPlaylist songs={songs} />
        </div>
      </div>
    )
  }
}

export default HomeView
