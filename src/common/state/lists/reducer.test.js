import reducer from './reducer.js'
import * as actions from './actions'

describe('List reducer ', () => {
  test('GET_LISTS_API.SUCCESS should set the lists and complete the list to 10 items', () => {
    const lists = [
      [
        { artistName: 'Linkin Park', songName: 'In the end' },
        { artistName: 'Eminem', songName: 'Stan' },
      ],
    ]
    const action = {
      type: actions.GET_LISTS_API.SUCCESS,
      data: lists,
    }
    const state = reducer({ loading: true, lists: [] }, action)
    expect(state).toEqual({
      loading: false,
      lists: [
        [
          { artistName: 'Linkin Park', songName: 'In the end' },
          { artistName: 'Eminem', songName: 'Stan' },
          { artistName: '', songName: '' },
          { artistName: '', songName: '' },
          { artistName: '', songName: '' },
          { artistName: '', songName: '' },
          { artistName: '', songName: '' },
          { artistName: '', songName: '' },
          { artistName: '', songName: '' },
          { artistName: '', songName: '' },
        ],
      ],
    })
  })

  test('GET_LISTS_API.SUCCESS should set the lists as-is when it has already 10 items', () => {
    const lists = [
      [
        { artistName: 'Linkin Park', songName: 'In the end' },
        { artistName: 'Eminem', songName: 'Stan' },
        { artistName: 'Example', songName: 'Song' },
        { artistName: 'Example', songName: 'Song' },
        { artistName: 'Example', songName: 'Song' },
        { artistName: 'Example', songName: 'Song' },
        { artistName: 'Example', songName: 'Song' },
        { artistName: 'Example', songName: 'Song' },
        { artistName: 'Example', songName: 'Song' },
        { artistName: 'Example', songName: 'Song' },
      ],
    ]
    const action = {
      type: actions.GET_LISTS_API.SUCCESS,
      data: lists,
    }
    const state = reducer({ loading: true, lists: [] }, action)
    expect(state).toEqual({
      loading: false,
      lists: [
        [
          { artistName: 'Linkin Park', songName: 'In the end' },
          { artistName: 'Eminem', songName: 'Stan' },
          { artistName: 'Example', songName: 'Song' },
          { artistName: 'Example', songName: 'Song' },
          { artistName: 'Example', songName: 'Song' },
          { artistName: 'Example', songName: 'Song' },
          { artistName: 'Example', songName: 'Song' },
          { artistName: 'Example', songName: 'Song' },
          { artistName: 'Example', songName: 'Song' },
          { artistName: 'Example', songName: 'Song' },
        ],
      ],
    })
  })

  test('UPDATE_LIST_FIELD should set the matching field correctly for songName', () => {
    const lists = [
      [
        { artistName: 'Linkin Park', songName: 'In the end' },
        { artistName: 'Eminem', songName: 'Stan' },
      ],
      [{ artistName: 'System of a down', songName: 'Chop Suey' }],
    ]
    const action = {
      type: actions.UPDATE_LIST_FIELD,
      field: 'songName',
      listIndex: 1,
      itemIndex: 0,
      value: 'New value',
    }
    const state = reducer({ lists: lists }, action)
    expect(state).toEqual({
      lists: [
        [
          { artistName: 'Linkin Park', songName: 'In the end' },
          { artistName: 'Eminem', songName: 'Stan' },
        ],
        [{ artistName: 'System of a down', songName: 'New value' }],
      ],
    })
  })

  test('UPDATE_LIST_FIELD should set the matching field correctly for artistName', () => {
    const lists = [
      [
        { artistName: 'Linkin Park', songName: 'In the end' },
        { artistName: 'Eminem', songName: 'Stan' },
      ],
      [{ artistName: 'System of a down', songName: 'Chop Suey' }],
    ]
    const action = {
      type: actions.UPDATE_LIST_FIELD,
      field: 'artistName',
      listIndex: 0,
      itemIndex: 1,
      value: 'New artist',
    }
    const state = reducer({ lists: lists }, action)
    expect(state).toEqual({
      lists: [
        [
          { artistName: 'Linkin Park', songName: 'In the end' },
          { artistName: 'New artist', songName: 'Stan' },
        ],
        [{ artistName: 'System of a down', songName: 'Chop Suey' }],
      ],
    })
  })

  test('SAVE_LIST_API.REQUEST should set the saving flag to true', () => {
    const action = { type: actions.SAVE_LIST_API.REQUEST }
    const state = reducer({ saving: false }, action)
    expect(state).toEqual({ saving: true })
  })

  test('SAVE_LIST_API.SUCCESS should set the saving flag to false', () => {
    const action = { type: actions.SAVE_LIST_API.SUCCESS }
    const state = reducer({ saving: true }, action)
    expect(state).toEqual({ saving: false })
  })

  test('SAVE_LIST_API.FAILURE should set the saving flag to false', () => {
    const action = { type: actions.SAVE_LIST_API.FAILURE }
    const state = reducer({ saving: true }, action)
    expect(state).toEqual({ saving: false })
  })
})
