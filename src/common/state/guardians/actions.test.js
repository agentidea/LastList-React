import nock from 'nock'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as actions from './actions'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

export const ENDPOINT = 'https://yourlastplaylist.com'
nock.disableNetConnect() // we should

describe('Guardians actions', () => {
  test('saveUserList should send a PUT request with correct data', () => {
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
})
