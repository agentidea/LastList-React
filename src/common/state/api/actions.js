import apiRequest from '../../utils/api'
import { jwtSelector } from '../user/selectors'

export function createAPIActions(prefix, suffix) {
  const PREFIX = prefix.toUpperCase()
  const SUFFIX = suffix.toUpperCase()
  return {
    REQUEST: `${PREFIX}/${SUFFIX}_REQUEST`,
    SUCCESS: `${PREFIX}/${SUFFIX}_SUCCESS`,
    FAILURE: `${PREFIX}/${SUFFIX}_FAILURE`,
  }
}

export function doRequest(actions, endpoint, body) {
  return async (dispatch, getState) => {
    const jwt = jwtSelector(getState())
    dispatch({
      type: actions.REQUEST,
      endpoint,
      body,
      jwt,
      meta: body ? body.body : null,
    })

    try {
      const data = await apiRequest(endpoint, jwt, body)

      dispatch({
        type: actions.SUCCESS,
        data,
        meta: body ? body.body : null,
      })

      return data
    } catch (error) {
      dispatch({
        type: actions.FAILURE,
        error,
        meta: body ? body.body : null,
      })

      throw error
    }
  }
}
