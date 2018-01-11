import reducer from './reducer.js'
import * as actions from './actions'

describe('Guardians reducer ', () => {
  test('GET_GUARDIANS_API.SUCCESS should set the guardians', () => {
    const guardians = [{ firstName: 'Arya', lastName: 'Stark', email: 'arya.stark@gmail.com' }]
    const action = {
      type: actions.GET_GUARDIANS_API.SUCCESS,
      data: guardians,
    }
    const state = reducer({ loading: true, guardians: [] }, action)
    expect(state).toEqual({
      loading: false,
      guardians: [{ firstName: 'Arya', lastName: 'Stark', email: 'arya.stark@gmail.com' }],
    })
  })

  test('ADD_GUARDIAN_API.SUCCESS should set the new list of guardians', () => {
    const action = {
      type: actions.ADD_GUARDIAN_API.SUCCESS,
      data: [{ firstName: 'Arya', lastName: 'Stark', email: 'arya.stark@gmail.com' }],
    }
    const state = reducer({ loading: false, guardians: [] }, action)
    expect(state).toEqual({
      loading: false,
      guardians: [{ firstName: 'Arya', lastName: 'Stark', email: 'arya.stark@gmail.com' }],
    })
  })
})
