import React, { Component, PropTypes } from 'react'
import './PlayerActions.scss'
import Time from '../../Time'

class PlayerActions extends Component {
  render () {
    const { song } = this.props

    return (
      <div className='player-actions'>
        <button className='button' onClick={this.props.prev}>
          <span className='glyphicon glyphicon-step-backward' />
        </button>
        {this.props.audioInProgress
          ? <button onClick={this.props.stop} className='button button-play'>
            <span className='glyphicon glyphicon-pause' />
          </button>
          : <button onClick={() => this.props.play(false)} className='button button-play'>
            <span className='glyphicon glyphicon-play-circle' />
          </button>
        }
        <button className='button' onClick={this.props.next}>
          <span className='glyphicon glyphicon-step-forward' />
        </button>
        <div className='time-bar'>
          <div className='bar-wrapper'>
            <div className='bar' style={{ width: this.props.progress * 100 + '%' }} />
          </div>
          <Time time={song ? song.duration * this.props.progress : 0} />
          <Time time={song ? song.duration : 0} />
        </div>
      </div>
    )
  }
}

PlayerActions.propTypes = {
  progress: PropTypes.number.isRequired,
  audioInProgress: PropTypes.bool.isRequired,
  play: PropTypes.func.isRequired,
  stop: PropTypes.func.isRequired,
  next: PropTypes.func.isRequired,
  prev: PropTypes.func.isRequired,
  audioTime: PropTypes.string,
  song: PropTypes.object
}

export default PlayerActions
