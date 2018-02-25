import { GET_INVOICE_API } from './actions'

const initialState = {
  loading: false,
  error: null,
  data: {
    totalSongs: 0,
    listCost: 0,
    due: 0,
    numPayments: 0,
    totalLists: 0,
  },
}

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_INVOICE_API.REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      }
    case GET_INVOICE_API.SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.data.invoice,
      }
    case GET_INVOICE_API.FAIlURE:
      return {
        ...state,
        error: 'some error',
        loading: false,
      }
    default: {
      return state
    }
  }
}
