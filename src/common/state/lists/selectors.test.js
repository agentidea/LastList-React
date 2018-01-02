import * as selectors from './selectors'

describe('Lists selectors', () => {
  test('listsForServerSelector should only keep item with non-empty data', () => {
    const state = {
      lists: {
        lists: [
          [
            { artistName: 'Linkin Park', songName: 'In the end' },
            { artistName: 'Eminem', songName: 'Stan' },
            { artistName: 'Test', songName: '' },
            { artistName: '', songName: '' },
            { artistName: '', songName: '' },
            { artistName: '', songName: '' },
            { artistName: '', songName: '' },
            { artistName: '', songName: '' },
            { artistName: '', songName: '' },
            { artistName: '', songName: '' },
          ],
        ],
      },
    }

    const result = selectors.listsForServerSelector(state)
    expect(result).toEqual([
      [
        { artistName: 'Linkin Park', songName: 'In the end' },
        { artistName: 'Eminem', songName: 'Stan' },
        { artistName: 'Test', songName: '' },
      ],
    ])
  })
})
