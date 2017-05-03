import { draw } from '../visualisationPlasma'
import VisualisationPerPixelBase from './VisualisationPerPixelBase'

class VisualisationViewPlasma extends VisualisationPerPixelBase {
  getDrawMethod () {
    return draw
  }
}

VisualisationViewPlasma.propTypes = VisualisationPerPixelBase.propTypes

export default VisualisationViewPlasma
