export const currentUserSelector = state => state.user
export const jwtSelector = state => state.user.jwt
export const loggedInSelector = state => !!jwtSelector(state)

export const profileSelector = state => {
  if (state.user && state.user._id) {
    return {
      firstName: state.user.firstName,
      lastName: state.user.lastName,
      staytz: state.user.states,
      dob: state.user.dob ? new Date(state.user.dob) : new Date(),
    }
  }
  return null
}

export const registeredSelector = state => {
  if (state.user && state.user._id) {
    let userStates = state.user.states

    if (userStates && userStates.find(item => item === 'registration_complete')) {
      return true
    } else {
      if (userStates && userStates.find(item => item === 'registration_started')) {
        return false
      }
    }
  }
  return null
}
