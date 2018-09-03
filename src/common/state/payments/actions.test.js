import * as actions from './actions'

describe('Payments actions', () => {
  test('stripePay should return a true value if an empty object is received', () => {
    let mockPayload = {}
    const action = actions.stripePay(mockPayload)
    expect(action.error).toBeFalsy()
  })

  test('stripePay should return an object with empty message and empty field if error.message is undefined', () => {
    let mockPayload = { error: {} }
    const action = actions.stripePay(mockPayload)
    expect(action.error).toBeTruthy()
    expect(action.field).toBe('')
    expect(action.message).toBe('')
  })

  test('stripePay should always return an object with result.error true if payload has error', () => {
    let mockPayload = { error: {} }
    const action = actions.stripePay(mockPayload)
    expect(action.error).toBeTruthy()
  })

  test('stripePay should return field as cardNumber if message error message is card number related', () => {
    let mockPayload = {
      error: {
        message: 'your card number is incomplete',
      },
    }
    const action = actions.stripePay(mockPayload)
    expect(action.error).toBeTruthy()
    expect(action.field).toBe('cardNumber')
    expect(action.message).toMatch(/your card number is incomplete/)
  })

  test('stripePay should return field as cardExpiry if message error message is card expiration date related', () => {
    let mockPayload = {
      error: {
        message: 'your card expiration date is incomplete',
      },
    }
    const action = actions.stripePay(mockPayload)
    expect(action.error).toBeTruthy()
    expect(action.field).toBe('cardExpiry')
    expect(action.message).toMatch(/your card expiration date is incomplete/)
  })

  test('stripePay should return field as cardCvc if message error message is card CVC code related', () => {
    let mockPayload = {
      error: {
        message: 'your card security code is incomplete',
      },
    }
    const action = actions.stripePay(mockPayload)
    expect(action.error).toBeTruthy()
    expect(action.field).toBe('cardCvc')
    expect(action.message).toMatch(/your card security code is incomplete/)
  })

  test('stripePay should return field as empty string if message not related to any elementType', () => {
    let mockPayload = {
      error: {
        message: 'your card has been suspended',
      },
    }
    const action = actions.stripePay(mockPayload)
    expect(action.error).toBeTruthy()
    expect(action.field).toBe('')
    expect(action.message).toMatch(/your card has been suspended/)
  })
})
