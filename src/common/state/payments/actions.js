import { API_ROOT } from '../../utils/api'
import { getJwt } from '../user/utils/jwt'

/* api dispatch on stripe payment */
export const doStripePayment = async token => {
  let userJwt = getJwt()

  if (userJwt && token) {
    try {
      let response = fetch(API_ROOT + '/payment/payment', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: token, user_id: userJwt, amount: 200 }),
      })
        .then(response => {
          return response.json()
        })
        .then(data => {
          console.log(data)

          return data
        })

      return response
    } catch (e) {
      console.log('Error Occurred in Stripe Payment | ', e)
    }
  } else {
    console.error('User should be logged in and stripe token should be valid')
  }
}

/* render action based on result from payload <Stripe> */
export const stripePay = payload => {
  if (payload.error) {
    /* determine the elementType of the error message */
    let errorMessage = payload.error.message ? payload.error.message : ''
    let element =
      errorMessage.indexOf('card number') !== -1
        ? 'cardNumber'
        : errorMessage.indexOf('expiration date') !== -1
          ? 'cardExpiry'
          : errorMessage.indexOf('security code') !== -1 ? 'cardCvc' : ''

    return { error: true, field: element, message: errorMessage }
  }

  console.log('PAYLOAD RETURNED IS -> ', payload.token)

  return { error: false, token: payload.token ? payload.token.id : null }
}
