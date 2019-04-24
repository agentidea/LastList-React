import { API_ROOT } from '../../utils/api'
import { getJwt } from '../user/utils/jwt'

/* api dispatch on stripe/paypal payment */
export const doPayment = async token => {
  let userJwt = getJwt()

  if (userJwt && token && token.token) {
    try {
      let response = fetch(API_ROOT + '/payment/payment', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${userJwt}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: token.token,
          user_jwt: userJwt,
          amount: token.amount,
          method: token.method,
        }),
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
      console.log('Error Occurred in Payment | ', e)
    }
  } else {
    console.error('User should be logged in and token should be valid')
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

/* dispatch on coupon code verification */
export const couponVerify = async coupon => {
  let userJwt = getJwt()

  if (!userJwt || !coupon) {
    console.error('User not logged in or coupon invalid')
    return null
  }

  try {
    let response = fetch(API_ROOT + '/payment/coupon', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${userJwt}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_jwt: userJwt,
        coupon: coupon,
      }),
    })
      .then(response => {
        return response.json()
      })
      .then(data => {
        return data
      })

    return response
  } catch (e) {
    console.error('Error Occurred on coupon verify | ', e)
  }
}
