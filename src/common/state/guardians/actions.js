import { createAPIActions, doRequest } from '../api/actions'
import { currentUserSelector } from '../user/selectors'

export const GET_GUARDIANS_API = createAPIActions('GET_GUARDIANS_API', 'FETCH')
export const ADD_GUARDIAN_API = createAPIActions('ADD_GUARDIAN_API', 'POST')

export const fetchUserGuardians = () => async (dispatch, getState) => {
  const user = currentUserSelector(getState())
  if (user) {
    await dispatch(doRequest(GET_GUARDIANS_API, `user/getGuaridans/${user._id}`))
  } else {
    console.error('User should be logged in to fetch his guardians')
  }
}

export const addGuardian = (firstName, lastName, email) => async (dispatch, getState) => {
  const user = currentUserSelector(getState())
  if (user) {
    await dispatch(
      doRequest(ADD_GUARDIAN_API, `user/guardian/${user._id}`, {
        method: 'POST',
        body: {
          firstName,
          lastName,
          email,
        },
      })
    )
  } else {
    console.error('User should be logged in to add a guardian')
  }
}
