import React, { Component, PropTypes } from 'react'
import './PlayerActions.scss'

class PlayerActions extends Component {
  render () {
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
        <div className='bar-wrapper'>
          <div className='bar' style={{ width: this.props.progress + '%' }} />
        </div>
      </div>
    )
  }
}

PlayerActions.propTypes = {
  progress: PropTypes.string,
  audioInProgress: PropTypes.bool.isRequired,
  play: PropTypes.func.isRequired,
  stop: PropTypes.func.isRequired,
  next: PropTypes.func.isRequired,
  prev: PropTypes.func.isRequired
}

export default PlayerActions
