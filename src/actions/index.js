import { AUDIO } from '../constants/ActionTypes'
// import axios from 'axios'

// export function uploadSuccess ({ data }) {
//   return {
//     type: 'UPLOAD_FILE_SUCCESS',
//     data
//   }
// }
//
// export function uploadFail (error) {
//   return {
//     type: 'UPLOAD_FILE_FAIL',
//     error
//   }
// }

export function onFilesDrop (files) {
  return {
    type: AUDIO.ADD_FILES,
    files
  }
}
