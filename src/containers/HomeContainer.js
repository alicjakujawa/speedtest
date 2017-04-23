import { connect } from 'react-redux'
import React, { Component, PropTypes } from 'react'
import IndexedDb from '../IndexedDb'
import { onFilesDrop } from '../actions'
import HomeView from '../components/Home'

class HomeContainer extends Component {
  constructor (props) {
    super(props)
    this.state = {
      files: []
    }
  }
  componentDidMount () {
    IndexedDb.init()
    IndexedDb.dbExists((databaseExists) => {
      console.log('dbexist' + databaseExists)
      if (databaseExists) {
        IndexedDb.checkObjectStore((response) => {
          if (response) {
            this.setState({ files: this.state.files.concat(response) })
          }
        })
      }
    })
  }

  saveFiles (files) {
    console.log(this.state, 'state')
    const updatedFiles = this.state.files.concat(files)
    IndexedDb.storeContent(updatedFiles, (files) => {
      console.log(`data stored for ${files}`)
    })
  }

  onFilesDrop = (files) => {
    this.saveFiles(files)
    this.props.onFilesDrop(files)
  }
  render () {
    return (
      <HomeView files={this.state.files} onDrop={this.onFilesDrop} />
    )
  }
}

HomeContainer.propTypes = {
  onFilesDrop: PropTypes.func
}

const mapDispatchToProps = ({
  onFilesDrop
})

export default connect(null, mapDispatchToProps)(HomeContainer)
