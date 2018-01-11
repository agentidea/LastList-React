import { ADD_GUARDIAN_API, GET_GUARDIANS_API } from './actions'

const initialState = {
  loading: false,
  guardians: [],
}

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_GUARDIANS_API.REQUEST:
      return {
        ...state,
        loading: true,
      }
    case GET_GUARDIANS_API.SUCCESS:
      return {
        ...state,
        loading: false,
        guardians: action.data,
      }
    case GET_GUARDIANS_API.FAILURE:
      return {
        ...state,
        loading: false,
      }
    case ADD_GUARDIAN_API.SUCCESS:
      return {
        ...state,
        guardians: action.data,
      }
    default: {
      return state
    }
  }
}
