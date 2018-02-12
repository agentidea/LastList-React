import { createAPIActions, doRequest } from '../api/actions'
import { listsForServerSelector } from './selectors'

import { currentUserSelector } from '../user/selectors'
import getListsData from '../mocks/getLists'

export const GET_LISTS_API = createAPIActions('GET_LISTS_API', 'FETCH')
export const SAVE_LIST_API = createAPIActions('SAVE_LIST_API', 'PUT')

//export const INVOICE_LIST_API = createAPIActions('INVOICE_LIST_API', 'GET')

export const ADD_NEW_LIST = 'ADD_NEW_LIST'
export const UPDATE_LIST_FIELD = 'UPDATE_LIST_FIELD'

const fakeRequest = (dispatch, action, user, data) => {
  return new Promise(resolve => {
    dispatch({ type: action.REQUEST, userId: user._id })
    setTimeout(() => {
      dispatch({ type: action.SUCCESS, data })
      resolve()
    }, 500)
  })
}

// export const fetchUserListInvoice = () => async (dispatch, getState) => {
//   const user = currentUserSelector(getState())
//   if (user) {
//     await dispatch(doRequest(INVOICE_LIST_API, `user/invoice/${user._id}`))
//   } else {
//     console.error('User should be logged in to fetch his invoice')
//   }
// }

export const fetchUserLists = () => async (dispatch, getState) => {
  const user = currentUserSelector(getState())
  if (user) {
    // await fakeRequest(dispatch, GET_LISTS_API, user, getListsData)
    await dispatch(doRequest(GET_LISTS_API, `user/getLists/${user._id}`))
  } else {
    console.error('User should be logged in to fetch his lists')
  }
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
