export const currentUserSelector = state => state.user
export const jwtSelector = state => state.user.jwt
export const loggedInSelector = state => !!jwtSelector(state)

export const profileSelector = state => {
  if (state.user && state.user._id) {
    const dobParts = state.user.dob.split('/')
    return {
      firstName: state.user.firstName,
      lastName: state.user.lastName,
      dobDay: parseInt(dobParts[0], 10),
      dobMonth: parseInt(dobParts[1], 10),
      dobYear: parseInt(dobParts[2], 10),
    }
  }
  return null
}
