import store from 'store/dist/store.modern'
import * as jwt from './jwt.js'

describe('JWT ', () => {
  test('getJwt should return the stored jwt', () => {
    store.get = jest.fn(() => 'abcde')
    expect(jwt.getJwt()).toEqual('abcde')
  })
  test('resetJwt should remove the stored jwt', () => {
    store.set = jest.fn()
    jwt.resetJwt()
    expect(store.set).toHaveBeenCalledWith('jwt', null)
  })
  test('setJwt should set the jwt on the store', () => {
    store.set = jest.fn()
    jwt.setJwt('abc')
    expect(store.set).toHaveBeenCalledWith('jwt', 'abc')
  })
})
