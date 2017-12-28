import reducer from './reducer.js'
import { LOGIN_SUCCESSFULL, SIGN_OUT, SET_CURRENT_USER } from './actions'

describe('User reducer ', () => {
  test('default state should contain correct data', () => {
    const state = reducer(undefined, { type: '' })
    expect(state).toMatchSnapshot()
  })
  test('LOGIN_SUCCESSFULL should set JWT', () => {
    const state = reducer({ jwt: null }, { type: LOGIN_SUCCESSFULL, jwt: 'abc' })
    expect(state).toMatchSnapshot()
  })
  test('SIGN_OUT should unset the JWT and reset the user data', () => {
    const state = reducer({ jwt: 'def' }, { type: SIGN_OUT })
    expect(state).toMatchSnapshot()
  })
  test('SET_CURRENT_USER should unset the JWT and reset the user data', () => {
    const user = {
      _id: 'XYZ',
      email: 'jon.snow@gmail.com',
      firstName: 'Jon',
      lastName: 'Snow',
    }
    const state = reducer({ jwt: 'abc' }, { type: SET_CURRENT_USER, data: user })
    expect(state).toMatchSnapshot()
  })
})
