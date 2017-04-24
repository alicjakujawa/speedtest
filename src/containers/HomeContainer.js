import { connect } from 'react-redux'
import React, { Component, PropTypes } from 'react'
import IndexedDb from '../IndexedDb'
import { onFilesDrop, saveFiles } from '../actions'
import HomeView from '../components/Home'

class HomeContainer extends Component {

  componentDidMount () {
    IndexedDb.init()
    IndexedDb.dbExists((databaseExists) => {
      if (databaseExists) {
        IndexedDb.checkObjectStore((response) => {
          if (response) {
            this.props.saveFiles(response)
          }
        })
      }
    })
  }

  saveFiles (files) {
    const updatedFiles = this.props.files.concat(files)
    IndexedDb.storeContent(updatedFiles, (files) => {
      this.props.saveFiles(files)
    })
  }

  onFilesDrop = (files) => {
    this.saveFiles(files)
    this.props.onFilesDrop(files)
  }

  render () {
    return (
      <HomeView files={this.props.files} onDrop={this.onFilesDrop} />
    )
  }
}

HomeContainer.propTypes = {
  onFilesDrop: PropTypes.func,
  saveFiles: PropTypes.func,
  files: PropTypes.array
}

const mapDispatchToProps = ({
  onFilesDrop,
  saveFiles
})

const mapStateToProps = state => ({
  files: state.audio.files
})

export default connect(mapStateToProps, mapDispatchToProps)(HomeContainer)
