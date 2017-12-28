export const currentUserSelector = state => state.user
export const jwtSelector = state => state.user.jwt
export const loggedInSelector = state => !!jwtSelector(state)
