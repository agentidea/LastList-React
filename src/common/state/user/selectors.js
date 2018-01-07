export const currentUserSelector = state => state.user
export const jwtSelector = state => state.user.jwt
export const loggedInSelector = state => !!jwtSelector(state)

export const profileSelector = state => {
  if (state.user && state.user._id) {
    return {
      firstName: state.user.firstName,
      lastName: state.user.lastName,
      dob: state.user.dob ? new Date(state.user.dob) : new Date(),
    }
  }
  return null
}
