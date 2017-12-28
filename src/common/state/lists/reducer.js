import { GET_LISTS_API, ADD_NEW_LIST } from './actions'

const initialState = {
  loading: false,
  lists: [],
}

const emptyList = () => ({
  name: '',
  songs: [{ artistName: '', songName: '' }],
})

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_LISTS_API.REQUEST:
      return {
        ...state,
        loading: true,
      }
    case GET_LISTS_API.SUCCESS:
      return {
        ...state,
        loading: false,
        lists: action.data,
      }
    case GET_LISTS_API.FAILURE:
      return {
        ...state,
        loading: false,
      }
    case ADD_NEW_LIST:
      return {
        ...state,
        lists: [...state.lists, emptyList()],
      }
    default: {
      return state
    }
  }
}
