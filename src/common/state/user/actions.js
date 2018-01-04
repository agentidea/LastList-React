import store from 'store/dist/store.modern'
import { createAPIActions, doRequest } from '../api/actions'
import { resetJwt, setJwt } from './utils/jwt'
import { jwtSelector } from './selectors'
import UserError from './error'

export const LOGIN_SUCCESSFULL = 'LOGIN_SUCCESSFULL'
export const SET_CURRENT_USER = 'SET_CURRENT_USER'
export const SIGN_OUT = 'SIGN_OUT'

export const SIGN_OUT_API = createAPIActions('SIGN_OUT_API', 'DELETE')
export const GET_CURRENT_USER_API = createAPIActions('CURRENT_USER', 'FETCH')
export const LOGIN_API = createAPIActions('LOGIN_API', 'POST')
export const SIGNUP_API = createAPIActions('SIGNUP_API', 'POST')
export const CONFIRM_USER_API = createAPIActions('CONFIRM_USER_API', 'POST')

export const signOut = () => async dispatch => {
  await resetJwt()
  store.set('jwtEmail', null) // temporary until we have real JWT
  dispatch({
    type: SIGN_OUT,
  })
}

export const getCurrentUser = () => async (dispatch, getState) => {
  const jwt = jwtSelector(getState())
  if (jwt) {
    try {
      // const { data } = await dispatch(doRequest(GET_CURRENT_USER_API, `user/current`))
      // this is a fake call to simulate a /user/current while it's not available
      const user = await dispatch(
        doRequest(GET_CURRENT_USER_API, `user/validate`, {
          method: 'POST',
          body: {
            email: store.get('jwtEmail'), // temporary until we have real JWT
            id: jwt,
          },
        })
      )

      dispatch({ type: SET_CURRENT_USER, data: user })
      return user
    } catch (e) {
      if (e.response && e.response.status === 401) {
        await dispatch(signOut())
      } else {
        throw e
      }
    }
  }
  return null
}

export const login = (email, password) => async dispatch => {
  try {
    const user = await dispatch(
      doRequest(LOGIN_API, `user/login`, {
        method: 'POST',
        body: { email, password },
      })
    )
    const jwt = user._id // todo replace this with real JWT
    if (jwt) {
      setJwt(jwt)
      store.set('jwtEmail', email) // temporary until we have real JWT
      dispatch({
        type: LOGIN_SUCCESSFULL,
        jwt,
      })
      return dispatch({ type: SET_CURRENT_USER, data: user })
    }
  } catch (e) {
    if (e.response && e.response.status === 409) {
      const message = e.response.data.message || 'User not found.'
      throw new UserError(message, 'email')
    }
    throw e
  }
}

export const signup = (email, password) => async dispatch => {
  try {
    const result = await dispatch(
      doRequest(SIGNUP_API, `user/signup`, {
        method: 'POST',
        body: { email, password },
      })
    )
    return result
  } catch (e) {
    if (e.response && e.response.data && e.response.data.error_type) {
      const message = e.response.data.message
      throw new UserError(message || 'An error occurred.', 'email')
    }
    throw e
  }
}

export const confirmAccount = confirmationCode => async dispatch => {
  try {
    const user = await dispatch(
      doRequest(CONFIRM_USER_API, `user/confirmEmail/${confirmationCode}`)
    )
    return user
  } catch (e) {
    if (e.response && e.response.data && e.response.data.error_type) {
      const message = e.response.data.message
      throw new UserError(message)
    }
    throw e
  }
}
