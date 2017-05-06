import React, { Component, PropTypes } from 'react'
import './PlayerActions.scss'
import moment from 'moment'
// import { getAudioContext } from '../../../audioProvider'

class PlayerActions extends Component {
  // componentDidMount () {
  //   this.currentTimeInterval = null
  //   const audioContext = getAudioContext()
  //   // TODO HOW -.-
  //   if (this.props.audioInProgress) {
  //     this.currentTimeInterval = setInterval(() => {
  //       console.log(audioContext.currentTime)
  //     }, 500)
  //   } else {
  //     clearInterval(this.currentTimeInterval)
  //   }
  // }

  render () {
    const { decodedAudioInfo, currentPlayedId } = this.props
    const decodedBuffer = decodedAudioInfo[currentPlayedId]
    let audioTime = '00:00'

    if (this.props.audioInProgress) {
      audioTime = moment.utc(decodedBuffer && decodedBuffer.duration * 1000).format('mm:ss')
    }

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
            <div className='bar' style={{ width: this.props.progress + '%' }} />
          </div>
          <span>00:00</span>
          <span>{ audioTime }</span>
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
  prev: PropTypes.func.isRequired,
  audioTime: PropTypes.string,
  decodedAudioInfo: PropTypes.object,
  currentPlayedId: PropTypes.string,
  progressTemp: PropTypes.number.isRequired
}

export default PlayerActions
