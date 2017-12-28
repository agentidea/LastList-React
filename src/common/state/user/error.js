export default class UserError extends Error {
  constructor(message, field = null) {
    super(message)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, UserError)
    }
    this.constructor = UserError
    // workaround to make this work when using babel
    this.__proto__ = UserError.prototype // eslint-disable-line no-proto
    this.name = 'UserError'
    this.message = message
    this.field = field
  }
}
