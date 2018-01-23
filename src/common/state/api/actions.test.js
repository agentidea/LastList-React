import nock from 'nock'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as actions from './actions'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

export const ENDPOINT = 'https://lastlist.com'
nock.disableNetConnect() // we should not access a real endpoint

describe('Api actions ', () => {
  test('createAPIActions should create the correct action object', () => {
    const action = actions.createAPIActions('TEST', 'GET')
    expect(action).toEqual({
      FAILURE: 'TEST/GET_FAILURE',
      REQUEST: 'TEST/GET_REQUEST',
      SUCCESS: 'TEST/GET_SUCCESS',
    })
  })

  describe('doRequest ', () => {
    test('should send correct request with default method and dispatch REQUEST and SUCCESS actions on server success', () => {
      const data = { payload: { ok: true } }
      nock(ENDPOINT)
        .get('/api/test-endpoint?content=123')
        .reply(200, data)
      const store = mockStore({ user: { jwt: null } })

      const requestActions = {
        FAILURE: 'TEST/GET_FAILURE',
        REQUEST: 'TEST/GET_REQUEST',
        SUCCESS: 'TEST/GET_SUCCESS',
      }

      const action = actions.doRequest(requestActions, 'test-endpoint', {
        body: { content: '123' },
      })

      return store.dispatch(action).then(() => {
        expect(store.getActions()).toEqual([
          {
            body: { body: { content: '123' } },
            endpoint: 'test-endpoint',
            jwt: null,
            meta: { content: '123' },
            type: 'TEST/GET_REQUEST',
          },
          { data: { payload: { ok: true } }, meta: { content: '123' }, type: 'TEST/GET_SUCCESS' },
        ])
      })
    })

    test('should send correct request with POST method and dispatch REQUEST and SUCCESS actions on server success', () => {
      const data = { payload: { ok: true } }
      nock(ENDPOINT)
        .post('/api/test-endpoint', {
          content: '123',
        })
        .reply(200, data)
      const store = mockStore({ user: { jwt: 'ABC' } })

      const requestActions = {
        FAILURE: 'TEST/POST_FAILURE',
        REQUEST: 'TEST/POST_REQUEST',
        SUCCESS: 'TEST/POST_SUCCESS',
      }

      const action = actions.doRequest(requestActions, 'test-endpoint', {
        method: 'POST',
        body: { content: '123' },
      })

      return store.dispatch(action).then(() => {
        expect(store.getActions()).toEqual([
          {
            body: { body: { content: '123' }, method: 'POST' },
            endpoint: 'test-endpoint',
            jwt: 'ABC',
            meta: { content: '123' },
            type: 'TEST/POST_REQUEST',
          },
          { data: { payload: { ok: true } }, meta: { content: '123' }, type: 'TEST/POST_SUCCESS' },
        ])
      })
    })

    test('should send correct request and dispatch REQUEST and FAILURE actions on server error', () => {
      nock(ENDPOINT)
        .post('/api/test-endpoint', {
          content: '123',
        })
        .reply(401, { message: 'error' })
      const store = mockStore({ user: { jwt: 'ABC' } })

      const requestActions = {
        FAILURE: 'TEST/POST_FAILURE',
        REQUEST: 'TEST/POST_REQUEST',
        SUCCESS: 'TEST/POST_SUCCESS',
      }

      const action = actions.doRequest(requestActions, 'test-endpoint', {
        method: 'POST',
        body: { content: '123' },
      })

      return store.dispatch(action).catch(() => {
        expect(store.getActions()).toEqual([
          {
            body: { body: { content: '123' }, method: 'POST' },
            endpoint: 'test-endpoint',
            jwt: 'ABC',
            meta: { content: '123' },
            type: 'TEST/POST_REQUEST',
          },
          {
            error: expect.any(Error),
            meta: { content: '123' },
            type: 'TEST/POST_FAILURE',
          },
        ])
      })
    })
  })
})
