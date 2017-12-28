import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import App from './App'
import createStore from './store'
import registerServiceWorker from './common/utils/registerServiceWorker'
import './global.css'

const store = createStore()

const AppWithProviders = () => (
  <Provider store={store}>
    <App />
  </Provider>
)

ReactDOM.render(<AppWithProviders />, document.getElementById('root'))
registerServiceWorker()
