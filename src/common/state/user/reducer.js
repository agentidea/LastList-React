import { getJwt } from './utils/jwt'
import { LOGIN_SUCCESSFULL, SIGN_OUT, SET_CURRENT_USER, GET_CURRENT_USER_API } from './actions'

const initialState = {
  jwt: getJwt(),
  _id: null,
  email: null,
  firstName: null,
  lastName: null,
  dob: null,
  states: null,
  payments: [],
}

export default (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESSFULL:
      return {
        ...state,
        jwt: action.jwt,
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
    default: {
      return state
    }
  }
}
