import nock from 'nock'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as actions from './actions'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

export const ENDPOINT = 'https://yourlastplaylist.com'
nock.disableNetConnect() // we should

describe('Lists actions', () => {
  test('fetchUserLists should fetch and set the existing lists', () => {
    const store = mockStore({ user: { _id: 123 }, lists: [] })
    const serverLists = [
      {
        name: 'My first list',
        songs: [
          { artistName: 'Linkin Park', songName: 'In the end' },
          { artistName: 'Eminem', songName: 'Stan' },
          { artistName: '', songName: '' },
        ],
      },
      {
        name: 'My second list',
        songs: [{ artistName: 'System of a down', songName: 'Chop Suey' }],
      },
    ]

    nock(ENDPOINT)
      .get('/api/user/getLists/123')
      .reply(200, serverLists)

    const action = actions.fetchUserLists()
    return store.dispatch(action).then(() => {
      const expectedAction = { type: actions.GET_LISTS_API.SUCCESS, data: serverLists }
      expect(store.getActions()).toContainEqual(expectedAction)
    })
  })
})
