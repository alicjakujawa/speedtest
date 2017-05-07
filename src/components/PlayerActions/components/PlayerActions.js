import React, { Component, PropTypes } from 'react'
import './PlayerActions.scss'
import moment from 'moment'

class PlayerActions extends Component {
  render () {
    const { song } = this.props
    const audioTime = song
      ? moment.utc(song.duration * 1000).format('mm:ss')
      : '00:00'

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
          <span>00:00</span>
          <span>{ audioTime }</span>
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
