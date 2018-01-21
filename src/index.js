import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createMuiTheme, MuiThemeProvider } from 'material-ui/styles'

import App from './App'
import createStore from './store'
import registerServiceWorker from './common/utils/registerServiceWorker'
import './global.css'

const store = createStore()


const mainColor = '#3917fe'
const theme = createMuiTheme({
  palette: {
    primary: {
      main: mainColor,
      // we need to use this legacy theme until material-ui-pickers is updated to latest material-ui
      500: mainColor
    }
  }
});

const AppWithProviders = () => (
  <Provider store={store}>
    <MuiThemeProvider theme={theme}>
      <App />
    </MuiThemeProvider>
  </Provider>
)

ReactDOM.render(<AppWithProviders />, document.getElementById('root'))
registerServiceWorker()
