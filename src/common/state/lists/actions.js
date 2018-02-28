import { createAPIActions, doRequest } from '../api/actions'
import { listsForServerSelector } from './selectors'

import { currentUserSelector } from '../user/selectors'

export const GET_LISTS_API = createAPIActions('GET_LISTS_API', 'FETCH')
export const SAVE_LIST_API = createAPIActions('SAVE_LIST_API', 'PUT')

export const ADD_NEW_LIST = 'ADD_NEW_LIST'
export const UPDATE_LIST_ITEM = 'UPDATE_LIST_ITEM'
export const UPDATE_LIST_FIELD = 'UPDATE_LIST_FIELD'

export const fetchUserLists = () => async (dispatch, getState) => {
  const user = currentUserSelector(getState())
  if (user) {
    await dispatch(doRequest(GET_LISTS_API, `user/getLists/${user._id}`))
  } else {
    console.error('User should be logged in to fetch his lists')
  }
}

export const setListItem = (listIndex, itemIndex, item) => async dispatch => {
  dispatch(setListItemArtist(listIndex, itemIndex, item.artist))
  dispatch(setListItemSong(listIndex, itemIndex, item.song))
}

export const setListItemArtist = (listIndex, itemIndex, value) => ({
  type: UPDATE_LIST_FIELD,
  field: 'artistName',
  listIndex,
  itemIndex,
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
  if (user) {
    await dispatch(
      doRequest(SAVE_LIST_API, `user/addList/${user._id}`, {
        method: 'PUT',
        body: {
          sets: listsForServerSelector(getState()),
        },
      })
    )
  } else {
    console.error('User should be logged in to save his lists')
  }
}

export const addNewList = () => ({
  type: ADD_NEW_LIST,
})
