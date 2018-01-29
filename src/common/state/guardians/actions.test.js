import nock from 'nock'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as actions from './actions'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

export const ENDPOINT = 'https://api.lastlist.com'
nock.disableNetConnect() // we should

describe('Guardians actions', () => {
  test('fetchUserGuardians should fetch and set the existing guardians', () => {
    const store = mockStore({ user: { _id: 123 }, guardians: { guardians: [] } })
    const serverGuardians = [
      { firstName: 'Arya', lastName: 'Stark', email: 'arya.stark@gmail.com' },
    ]

    nock(ENDPOINT)
      .get('/api/user/getGuaridans/123')
      .reply(200, serverGuardians)

    const action = actions.fetchUserGuardians()
    return store.dispatch(action).then(() => {
      const expectedAction = {
        type: actions.GET_GUARDIANS_API.SUCCESS,
        data: serverGuardians,
        meta: null,
      }
      expect(store.getActions()).toContainEqual(expectedAction)
    })
  })

  test('addGuardian should send a PUT request with correct data', () => {
    const store = mockStore({
      user: { _id: 123 },
      guardians: {
        loading: false,
        guardians: [],
      },
    })

    nock(ENDPOINT)
      .post('/api/user/guardian/123')
      .reply(200, { success: true })

    const action = actions.addGuardian('Jon', 'Snow', 'jon.snow@gmail.com')
    return store.dispatch(action).then(() => {
      const expectedAction = {
        type: actions.ADD_GUARDIAN_API.SUCCESS,
        data: { success: true },
        meta: {
          firstName: 'Jon',
          lastName: 'Snow',
          email: 'jon.snow@gmail.com',
        },
      }
      expect(store.getActions()).toContainEqual(expectedAction)
    })
  })

  test('removeGuardian should send a PUT request with correct data', () => {
    const store = mockStore({
      user: { _id: 123 },
      guardians: {
        loading: false,
        guardians: [{ firstName: 'Jon', lastName: 'Snow', uuid: 12 }],
      },
    })

    nock(ENDPOINT)
      .delete('/api/user/guardian/123', { uuid: 12 })
      .reply(200, { success: true })

    const action = actions.removeGuardian(12)
    return store.dispatch(action).then(() => {
      const expectedAction = {
        type: actions.REMOVE_GUARDIAN_API.SUCCESS,
        data: { success: true },
        meta: {
          uuid: 12,
        },
      }
      expect(store.getActions()).toContainEqual(expectedAction)
    })
  })
})
