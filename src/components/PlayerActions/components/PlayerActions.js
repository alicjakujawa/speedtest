import React, { Component, PropTypes } from 'react'
import './PlayerActions.scss'

class PlayerActions extends Component {
  render () {
    return (
      <div className='player-actions'>
        <button className='button'><span className='glyphicon glyphicon-step-backward' /></button>
        <button className='button button-play'><span className='glyphicon glyphicon-play-circle' /></button>
        <button className='button'><span className='glyphicon glyphicon-step-forward' /></button>
        <div className='bar-wrapper'>
          <div className='bar' style={{ width: this.props.progress + '%' }} />
        </div>
      </div>
    )
  }
}

PlayerActions.propTypes = {
  progress: PropTypes.string
}

export default PlayerActions
