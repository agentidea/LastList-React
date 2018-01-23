import nock from 'nock'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as actions from './actions'
import * as jwt from './utils/jwt'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

export const ENDPOINT = 'https://lastlist.com'
nock.disableNetConnect() // we should not access a real endpoint

describe('User actions', () => {
  test('signOut should reset the JWT and dispatch SIGN_OUT', () => {
    const store = mockStore({ user: {} })
    jwt.resetJwt = jest.fn()

    const action = actions.signOut()
    return store.dispatch(action).then(() => {
      expect(jwt.resetJwt).toHaveBeenCalled()
      const expectedActions = [{ type: actions.SIGN_OUT }]
      expect(store.getActions()).toEqual(expectedActions)
    })
  })

  describe('getCurrentUser', () => {
    test('should return null if no JWT', async () => {
      const store = mockStore({ user: {} })

      const action = actions.getCurrentUser()
      return store.dispatch(action).then(user => {
        expect(user).toEqual(null)
        expect(store.getActions()).toEqual([])
      })
    })

    test('should return the user fetched from the API and set the user in the store if the JWT is set', async () => {
      const user = { id: '5', firstName: 'Jon', lastName: 'Snow' }
      nock(ENDPOINT)
        .post('/api/user/validate')
        .reply(200, user)
      const store = mockStore({ user: { jwt: 'abc' } })

      const action = actions.getCurrentUser()
      return store.dispatch(action).then(data => {
        expect(data).toEqual(user)
        expect(store.getActions()).toContainEqual({
          data: user,
          type: actions.SET_CURRENT_USER,
        })
      })
    })

    test('should return null and signout if the JWT is set but the server returns forbidden', async () => {
      nock(ENDPOINT)
        .post('/api/user/validate')
        .reply(401, {})
      const store = mockStore({ user: { jwt: 'abc' } })

      const action = actions.getCurrentUser()
      return store.dispatch(action).then(user => {
        expect(user).toEqual(null)
        expect(store.getActions()).toContainEqual({ type: actions.SIGN_OUT })
      })
    })
  })

  describe('login', () => {
    test('should set the JWT and the user state if credentials are accepted by the server', async () => {
      jwt.setJwt = jest.fn()
      const user = { _id: 'abc', firstName: 'Jon', lastName: 'Snow' }
      nock(ENDPOINT)
        .post('/api/user/login', {
          email: 'jon.snow@gmail.com',
          password: 'Test1234',
        })
        .reply(200, user)
      const store = mockStore({ user: { jwt: null } })

      const action = actions.login('jon.snow@gmail.com', 'Test1234')
      return store.dispatch(action).then(() => {
        expect(jwt.setJwt).toHaveBeenCalledWith('abc')
        expect(store.getActions()).toContainEqual({
          type: actions.LOGIN_SUCCESSFULL,
          jwt: 'abc',
        })
        expect(store.getActions()).toContainEqual({
          type: actions.SET_CURRENT_USER,
          data: user,
        })
      })
    })

    test('should return an error with a custom message if the server returns a 409 error', async () => {
      nock(ENDPOINT)
        .post('/api/user/login')
        .reply(409, { message: 'Custom message' })
      const store = mockStore({ user: { jwt: null } })

      const action = actions.login('jon.snow@gmail.com', 'Test1234')
      return store.dispatch(action).catch(e => {
        expect(e.field).toEqual('email')
        expect(e.message).toEqual('Custom message')
      })
    })
  })

  describe('signup', () => {
    test('should return the payload of the API if signup succeeds', async () => {
      const user = { name: 'Jon' }
      nock(ENDPOINT)
        .post('/api/user/signup', {
          email: 'jon.snow@gmail.com',
          password: 'Test1234',
        })
        .reply(200, user)
      const store = mockStore({ user: { jwt: null } })

      const action = actions.signup('jon.snow@gmail.com', 'Test1234')
      return store.dispatch(action).then(data => {
        expect(data).toEqual(user)
      })
    })

    test('should return an error with a custom message if the server returns an error with an error_type', async () => {
      nock(ENDPOINT)
        .post('/api/user/signup')
        .reply(401, { error_type: 'whatever', message: 'Custom message' })
      const store = mockStore({ user: { jwt: null } })

      const action = actions.signup('jon.snow@gmail.com', 'Test1234')
      return store.dispatch(action).catch(e => {
        expect(e.field).toEqual('email')
        expect(e.message).toEqual('Custom message')
      })
    })
  })

  describe('confirmAccount', () => {
    test('should return the payload of the API if confirmAccount succeeds', async () => {
      const user = { name: 'Jon' }
      nock(ENDPOINT)
        .get('/api/user/confirmEmail/ABCD')
        .reply(200, user)
      const store = mockStore({ user: { jwt: null } })

      const action = actions.confirmAccount('ABCD')
      return store.dispatch(action).then(data => {
        expect(data).toEqual(user)
      })
    })

    test('should return an error with a custom message if the server returns an error with an error_type', async () => {
      nock(ENDPOINT)
        .get('/api/user/confirmEmail/ABCD')
        .reply(401, { error_type: 'whatever', message: 'Custom message' })
      const store = mockStore({ user: { jwt: null } })

      const action = actions.confirmAccount('ABCD')
      return store.dispatch(action).catch(e => {
        expect(e.message).toEqual('Custom message')
      })
    })
  })
})
