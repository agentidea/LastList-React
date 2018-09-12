import { getJwt } from './utils/jwt'
import {
  LOGIN_SUCCESSFULL,
  SIGN_OUT,
  SET_CURRENT_USER,
  PAY_API,
  RESET_PASSWORD_SUCCESSFULL,
} from './actions'

const initialState = {
  jwt: getJwt(),
  _id: null,
  email: null,
  firstName: null,
  lastName: null,
  dob: null,
  states: [],
  flow: null,
  payments: [],
  success: null,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESSFULL:
      return {
        ...state,
        jwt: action.jwt,
        ...action.data,
      }
    case SIGN_OUT:
      return {
        ...initialState,
        jwt: null,
      }
    case SET_CURRENT_USER:
      return {
        ...state,
        ...action.data,
      }
    case PAY_API.SUCCESS:
      return {
        ...state,
        states: action.data.user.states,
        payments: action.data.user.payments,
      }
    case RESET_PASSWORD_SUCCESSFULL:
      return {
        ...state,
        success: action.data,
      }
    default: {
      return state
    }
  }
}
