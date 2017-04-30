import React, { Component, PropTypes } from 'react'
import './PlayerActions.scss'

class PlayerActions extends Component {
  render () {
    return (
      <div className='player-actions'>
        <button className='button'><span className='glyphicon glyphicon-step-backward' /></button>
        <button onClick={this.props.play} className='button button-play'>
          <span className='glyphicon glyphicon-play-circle' />
        </button>
        <button onClick={this.props.stop} className='button button-play'>
          <span className='glyphicon glyphicon-stop' />
        </button>
        <button className='button'><span className='glyphicon glyphicon-step-forward' /></button>
        <div className='bar-wrapper'>
          <div className='bar' style={{ width: this.props.progress + '%' }} />
        </div>
      </div>
    )
  }
}

PlayerActions.propTypes = {
  progress: PropTypes.string,
  play: PropTypes.func.isRequired,
  stop: PropTypes.func.isRequired
}

export default PlayerActions
