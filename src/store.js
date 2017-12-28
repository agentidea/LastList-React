import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from './root-reducer'

function getComposeEnhancers() {
  if (
    process.env.NODE_ENV !== 'production' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ // eslint-disable-line
  ) {
    return window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ // eslint-disable-line
  }
  return compose
}

export default () => {
  const composeEnhancers = getComposeEnhancers()
  const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)))

  return store
}
