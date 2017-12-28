import * as selectors from './selectors'

describe('User selectors ', () => {
  test('currentUserSelector should return the user data', () => {
    const state = {
      user: { firstName: 'Jon', lastName: 'Snow' },
    }
    expect(selectors.currentUserSelector(state)).toEqual({ firstName: 'Jon', lastName: 'Snow' })
  })
  test('jwtSelector should return the jwt', () => {
    const state = {
      user: { firstName: 'Jon', lastName: 'Snow', jwt: 'abc' },
    }
    expect(selectors.jwtSelector(state)).toEqual('abc')
  })
  test('loggedInSelector should return true if jwt is set', () => {
    const state = {
      user: { firstName: 'Jon', lastName: 'Snow', jwt: 'abc' },
    }
    expect(selectors.loggedInSelector(state)).toEqual(true)
  })
  test('loggedInSelector should return false if jwt is not set', () => {
    const state = {
      user: { jwt: null },
    }
    expect(selectors.loggedInSelector(state)).toEqual(false)
  })
})
