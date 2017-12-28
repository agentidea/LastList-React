import reducer from './reducer.js'
import { GET_LISTS_API } from './actions'

describe('List reducer ', () => {
  test('GET_LISTS_API.SUCCESS should set the lists', () => {
    const lists = [
      {
        setId: 0,
        name: 'My first list',
        songs: [
          { artistName: 'Linkin Park', songName: 'In the end' },
          { artistName: 'Eminem', songName: 'Stan' },
        ],
      },
      {
        setId: 1,
        name: 'My second list',
        songs: [{ artistName: 'System of a down', songName: 'Chop Suey' }],
      },
    ]
    const action = {
      type: GET_LISTS_API.SUCCESS,
      data: lists,
    }
    const state = reducer({ loading: true, lists: [] }, action)
    expect(state).toEqual({ loading: false, lists })
  })
})
