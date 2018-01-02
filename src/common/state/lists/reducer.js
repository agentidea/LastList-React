import { GET_LISTS_API, ADD_NEW_LIST, UPDATE_LIST_FIELD } from './actions'

const initialState = {
  loading: false,
  lists: [],
}

const emptyList = () => [{ artistName: '', songName: '' }]

/* Ensure that each list has exactly 10 items (even empty one)*/
function convertFromServerLists(serverLists) {
  if (!serverLists) {
    serverLists = [[]]
  }
  return serverLists.map(list => {
    if (list.length > 10) {
      return list.slice(0, 10)
    }
    while (list.length < 10) {
      list.push({ artistName: '', songName: '' })
    }
    return list
  })
}

function updateListField(state, action) {
  const newLists = state.lists.map((list, listIndex) => {
    if (listIndex !== action.listIndex) return list
    return list.map((item, itemIndex) => {
      if (itemIndex !== action.itemIndex) return item
      return {
        ...item,
        [action.field]: action.value,
      }
    })
  })

  return {
    ...state,
    lists: newLists,
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
