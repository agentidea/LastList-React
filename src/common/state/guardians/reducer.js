import { ADD_GUARDIAN_API } from './actions'

const initialState = {
  loading: false,
  guardians: [],
}

export default (state = initialState, action) => {
  switch (action.type) {
    default: {
      return state
    }
  }
}
