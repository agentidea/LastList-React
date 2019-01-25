import { createAPIActions, doRequest } from '../api/actions'
import { listsForServerSelector } from './selectors'

import { currentUserSelector } from '../user/selectors'
import { setListCost } from '../user/utils/listCost'

export const GET_LISTS_API = createAPIActions('GET_LISTS_API', 'FETCH')
export const SAVE_LIST_API = createAPIActions('SAVE_LIST_API', 'PUT')

export const ADD_NEW_LIST = 'ADD_NEW_LIST'
export const UPDATE_LIST_ITEM = 'UPDATE_LIST_ITEM'
export const UPDATE_LIST_FIELD = 'UPDATE_LIST_FIELD'
export const REMOVE_LIST_ITEM = 'REMOVE_LIST_ITEM'

export const fetchUserLists = () => async (dispatch, getState) => {
  const user = currentUserSelector(getState())
  if (user) {
    await dispatch(doRequest(GET_LISTS_API, `user/getLists/${user._id}`))
  } else {
    console.error('User should be logged in to fetch his lists')
  }
}

export const setListItem = item => async dispatch => {
  dispatch(setListItemObj(item))
}

export const removeListItem = item => async dispatch => {
  dispatch(removeListItemObj(item))
}

export const removeListItemObj = value => ({
  type: REMOVE_LIST_ITEM,
  field: 'track',
  value,
})

export const setListItemObj = value => ({
  type: UPDATE_LIST_FIELD,
  field: 'track',
  value,
})

export const setListItemSong = (listIndex, itemIndex, value) => ({
  type: UPDATE_LIST_FIELD,
  field: 'songName',
  listIndex,
  itemIndex,
  value,
})

export const saveUserList = () => async (dispatch, getState) => {
  const user = currentUserSelector(getState())
  let res = 404
  if (user) {
    await dispatch(
      doRequest(SAVE_LIST_API, `user/addList/${user._id}`, {
        method: 'PUT',
        body: {
          sets: listsForServerSelector(getState()),
        },
      })
    ).then(data => {
      setListCost(data['cost'])
      res = 200
    })
  } else {
    console.error('User should be logged in to save their lists')
  }
  return res
}

export const addNewList = () => ({
  type: ADD_NEW_LIST,
})
