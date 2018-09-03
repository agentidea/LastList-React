import { PAY_WITH_STRIPE } from './actions'

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
    case PAY_WITH_STRIPE.REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      }
    case PAY_WITH_STRIPE.SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.data.invoice,
      }
    case PAY_WITH_STRIPE.FAILURE:
      return {
        ...state,
        error: 'error occurred',
        loading: false,
      }
    default: {
      return state
    }
  }
}
