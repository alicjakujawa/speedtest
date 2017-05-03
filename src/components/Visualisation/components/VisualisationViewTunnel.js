import { draw } from '../visualisationTunnel'
import VisualisationPerPixelBase from './VisualisationPerPixelBase'

class VisualisationViewTunnel extends VisualisationPerPixelBase {
  getDrawMethod () {
    return draw
  }
}

VisualisationViewTunnel.propTypes = VisualisationPerPixelBase.propTypes

export default VisualisationViewTunnel
