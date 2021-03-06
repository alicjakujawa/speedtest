import React from 'react'
import ReactDOM from 'react-dom'
import { Route, IndexRoute } from 'react-router'
import createStore from './store/createStore'
import AppContainer from './containers/AppContainer'
import CoreLayout from './layouts/CoreLayout'
import HomeContainer from './containers/HomeContainer'
import Visualisation from './components/Visualisation'

// ========================================================
// Store Instantiation
// ========================================================
const initialState = window.___INITIAL_STATE__
export const store = createStore(initialState)

// ========================================================
// Render Setup
// ========================================================
const MOUNT_NODE = document.getElementById('root')

const routes = (
  <Route path='/' component={CoreLayout}>
    <IndexRoute component={HomeContainer} />
    <Route path='visualisation' component={Visualisation} />
  </Route>
)

let render = () => {
  // const routes = require('./routes/index').default(store)

  ReactDOM.render(
    <AppContainer store={store} routes={routes} />,
    MOUNT_NODE
  )
}

// This code is excluded from production bundle
if (__DEV__) {
  if (module.hot) {
    // Development render functions
    const renderApp = render
    const renderError = (error) => {
      const RedBox = require('redbox-react').default

      ReactDOM.render(<RedBox error={error} />, MOUNT_NODE)
    }

    // Wrap render in try/catch
    render = () => {
      try {
        renderApp()
      } catch (error) {
        console.error(error)
        renderError(error)
      }
    }

    // Setup hot module replacement
    module.hot.accept('./routes/index', () =>
      setImmediate(() => {
        ReactDOM.unmountComponentAtNode(MOUNT_NODE)
        render()
      })
    )
  }
}

// ========================================================
// Go!
// ========================================================
render()
