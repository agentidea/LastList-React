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
      [
        { artistName: 'Linkin Park', songName: 'In the end' },
        { artistName: 'Eminem', songName: 'Stan' },
        { artistName: '', songName: '' },
      ],
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

  test('setListItemArtist should create an action with correct fields', () => {
    const action = actions.setListItemArtist(0, 1, 'Hello')
    expect(action).toEqual({
      field: 'artistName',
      itemIndex: 1,
      listIndex: 0,
      type: 'UPDATE_LIST_FIELD',
      value: 'Hello',
    })
  })

  test('setListItemSong should create an action with correct fields', () => {
    const action = actions.setListItemSong(1, 4, 'Hello')
    expect(action).toEqual({
      field: 'songName',
      itemIndex: 4,
      listIndex: 1,
      type: 'UPDATE_LIST_FIELD',
      value: 'Hello',
    })
  })
})
