import React, { PropTypes } from 'react'

const pad2 = x => x >= 10 ? '' + x : '0' + x

const Time = ({ time }) => {
  const sec = Math.floor((time) % 60)
  const min = Math.floor((time / 60))

  return <span>{ pad2(min) }:{ pad2(sec) }</span>
}

Time.propTypes = {
  time: PropTypes.number.isRequired
}

export default Time
