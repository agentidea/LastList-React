import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createMuiTheme, MuiThemeProvider } from 'material-ui/styles'
import ReactModal from 'react-modal'

import App from './App'
import createStore from './store'
import './global.css'

const store = createStore()

ReactModal.setAppElement('#root')

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#3917fe',
      light: '#168cff',
    },
  },
})

const AppWithProviders = () => (
  <Provider store={store}>
    <MuiThemeProvider theme={theme}>
      <App />
    </MuiThemeProvider>
  </Provider>
)

ReactDOM.render(<AppWithProviders />, document.getElementById('root'))
