import store from 'store/dist/store.modern'
import { createAPIActions, doRequest } from '../api/actions'
import { resetJwt, setJwt } from './utils/jwt'
import { jwtSelector, currentUserSelector } from './selectors'
import UserError from './error'

export const LOGIN_REG_SUCCESSFULL = 'LOGIN_REGISTRATION_SUCCESSFULL'
export const LOGIN_SUCCESSFULL = 'LOGIN_SUCCESSFULL'
export const RESET_PASSWORD_SUCCESSFULL = 'RESET_PASSWORD_SUCCESSFULL'
export const SET_CURRENT_USER = 'SET_CURRENT_USER'
export const SIGN_OUT = 'SIGN_OUT'

export const SIGN_OUT_API = createAPIActions('SIGN_OUT_API', 'DELETE')
export const GET_CURRENT_USER_API = createAPIActions('CURRENT_USER', 'FETCH')
export const LOGIN_API = createAPIActions('LOGIN_API', 'POST')
export const SIGNUP_API = createAPIActions('SIGNUP_API', 'POST')
export const CONFIRM_USER_API = createAPIActions('CONFIRM_USER_API', 'POST')
export const FORGOT_PASSWORD_API = createAPIActions('FORGOT_PASSWORD_API', 'POST')
export const RESET_PASSWORD_API = createAPIActions('RESET_PASSWORD_API', 'POST')
export const SAVE_PROFILE_API = createAPIActions('SAVE_PROFILE_API', 'PUT')
export const PAY_API = createAPIActions('PAY_API', 'POST')

export const signOut = () => async dispatch => {
  await resetJwt()
  store.set('jwtEmail', null)
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
            email: store.get('jwtEmail'),
            jwt: jwt,
          },
        })
      )

      dispatch({ type: SET_CURRENT_USER, data: user })
    } catch (e) {
      if (e.response && e.response.status === 401) {
        await dispatch(signOut())
      } else {
        throw e
      }
    }
  }
}

export const login = (email, password) => async dispatch => {
  try {
    const user = await dispatch(
      doRequest(LOGIN_API, `user/login`, {
        method: 'POST',
        body: { email, password },
      })
    )
    const jwt = user.jwt
    if (jwt) {
      setJwt(jwt)
      store.set('jwtEmail', email)
      dispatch({
        type: LOGIN_SUCCESSFULL,
        jwt,
        data: user,
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
    if (e.response && e.response.data) {
      const message = e.response.data.message
      throw new UserError(message || 'An error occurred.', 'email')
    }
    throw e
  }
}

// export const confirmAccount = confirmationCode => async dispatch => {
//   try {
//     const user = await dispatch(
//       doRequest(CONFIRM_USER_API, `user/confirmEmail/${confirmationCode}`)
//     )
//     return user
//   } catch (e) {
//     if (e.response && e.response.data) {
//       const message = e.response.data.message
//       throw new UserError(message)
//     }
//     throw e
//   }
// }
export const confirmAccount = confirmationCode => async dispatch => {
  try {
    const user = await dispatch(
      doRequest(CONFIRM_USER_API, `user/confirmEmail/${confirmationCode}`)
    )
    const jwt = user._id // todo replace this with real JWT
    const email = user.email //temp solution for now
    if (jwt) {
      setJwt(jwt)
      store.set('jwtEmail', email) // temporary until we have real JWT
      dispatch({ type: LOGIN_SUCCESSFULL, jwt, data: user })
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

export const saveUserProfile = (firstName, lastName, dob) => async (dispatch, getState) => {
  const user = currentUserSelector(getState())
  if (user) {
    try {
      const result = await dispatch(
        doRequest(SAVE_PROFILE_API, `user/profile/${user._id}`, {
          method: 'PUT',
          body: {
            firstName,
            lastName,
            dob: dob.toISOString(),
          },
        })
      )
      return result
    } catch (e) {
      if (e.response && e.response.status === 409) {
        const message = e.response.data.message || 'Unknown error'
        const field = e.response.data.field
        throw new UserError(message, field)
      }
      throw e
    }
  } else {
    console.error('User should be logged in to save his profile')
  }
}

export const payForList = (amount, paymentMethod, numberListsPayingFor) => async (
  dispatch,
  getState
) => {
  const user = currentUserSelector(getState())
  if (user) {
    await dispatch(
      doRequest(PAY_API, `user/payment/${user._id}`, {
        method: 'POST',
        body: {
          amount,
          paymentMethod,
          numberListsPayingFor,
        },
      })
    )
    return true
  } else {
    console.error('User should be logged in to pay for lists')
  }
}

export const forgotPassword = resetToken => async dispatch => {
  try {
    const user = await dispatch(
      doRequest(FORGOT_PASSWORD_API, `user/forgot-password`, {
        method: 'POST',
        resetToken: resetToken,
      })
    )
    const code = user.code
    if (code === 200) {
      return true
    }
  } catch (e) {
    if (e.response) {
      const message = e.response.data.message || 'Email provided can not be found!'
      throw new UserError(message, 'email')
    }
    throw e
  }
}

export const resetPassword = password => async dispatch => {
  try {
    const user = await dispatch(
      doRequest(RESET_PASSWORD_API, `user/reset-password`, {
        method: 'POST',
        resetToken: password,
      })
    )
    const code = user.code
    if (code === 200) {
      let success = 'Your Password was successfully reset, now you can login with your new one'
      dispatch({ type: RESET_PASSWORD_SUCCESSFULL, data: success })
      return true
    }
  } catch (e) {
    if (e.response) {
      const message = e.response.data.message || 'Something went wrong!'
      throw new UserError(message, 'email')
    }
    throw e
  }
}
