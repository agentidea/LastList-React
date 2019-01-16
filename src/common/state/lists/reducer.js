import {
  GET_LISTS_API,
  SAVE_LIST_API,
  ADD_NEW_LIST,
  UPDATE_LIST_FIELD,
  REMOVE_LIST_ITEM,
} from './actions'

const initialState = {
  loading: false,
  saving: false,
  lists: [],
}

const emptyList = () => Array(10).fill({ artistName: '', songName: '' })

/* Ensure that each list has exactly 10 items (even empty one)*/
function convertFromServerLists(serverLists) {
  if (!serverLists) {
    serverLists = [[]]
  }
  return serverLists.map(list => {
    return list
  })
}

function updateListField(state, action) {
  let list = state.lists[0]
  list.unshift(action.value)

  return {
    ...state,
    lists: [list],
  }
}

function removeListItem(state, action) {
  let list = state.lists[0]
  let itemIndex = list.indexOf(action.value)
  list.splice(itemIndex, 1)
  return {
    ...state,
    lists: [list],
  }
}

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
        lists: convertFromServerLists(action.data),
      }
    case GET_LISTS_API.FAILURE:
      return {
        ...state,
        loading: false,
      }
    case UPDATE_LIST_FIELD:
      return updateListField(state, action)
    case SAVE_LIST_API.REQUEST:
      return {
        ...state,
        saving: true,
        saved: true,
      }
    case SAVE_LIST_API.SUCCESS:
    case SAVE_LIST_API.FAILURE:
      return {
        ...state,
        saving: false,
      }
    case ADD_NEW_LIST:
      return {
        ...state,
        lists: [...state.lists, emptyList()],
      }
    case REMOVE_LIST_ITEM:
      return removeListItem(state, action)
    default: {
      return state
    }
  }
}
