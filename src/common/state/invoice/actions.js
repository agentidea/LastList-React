import { createAPIActions, doRequest } from '../api/actions'
import { currentUserSelector } from '../user/selectors'

export const GET_INVOICE_API = createAPIActions('GET_INVOICE_API', 'FETCH')

export const getInvoice = () => async (dispatch, getState) => {
  const user = currentUserSelector(getState())
  if (user) {
    dispatch(doRequest(GET_INVOICE_API, `user/invoice/${user._id}`))
  } else {
    console.error('User should be logged in to get the invoice')
  }
}
