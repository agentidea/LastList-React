import { Component } from 'react'
import type { InjectedProps } from 'react-stripe-elements/src/components/inject'
import Textfield from '../../../../common/components/Textfield'
import {
  CardCVCElement,
  CardExpiryElement,
  CardNumberElement,
  Elements,
  injectStripe,
  StripeProvider,
} from 'react-stripe-elements'
import Button from '../../../../common/components/Button'
import styles from '../PrePayment.module.css'
import { environment } from '../../../../environment/environment'
import React from 'react'

const createOptions = (fontSize: string, padding: ?string) => {
  return {
    style: {
      base: {
        fontSize,
        color: '#424770',
        letterSpacing: '0.025em',
        fontFamily: 'Source Code Pro, monospace',
        '::placeholder': {
          color: '#aab7c4',
        },
        ...(padding ? { padding } : {}),
      },
      invalid: {
        color: '#9e2146',
      },
    },
  }
}

const handleBlur = () => {
  console.log('[blur]')
}
const handleChange = change => {
  console.log('[change]', change)
}
const handleClick = () => {
  console.log('[click]')
}
const handleFocus = () => {
  console.log('[focus]')
}
const handleReady = () => {
  console.log('[ready]')
}

class _SplitForm extends Component<InjectedProps & { fontSize: string }> {
  handleSubmit = ev => {
    ev.preventDefault()
    if (this.props.stripe) {
      this.props.stripe.createToken().then(payload => console.log('[token]', payload))
    } else {
      console.log("Stripe.js hasn't loaded yet.")
    }
  }

  onChange = (field, value) => {
    this.setState({ [field]: value, error: { field: null } })
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit} className="stripeForm">
        <div className="emailStripeContainer">
          <label>
            Email
            <Textfield
              type="email"
              value=""
              required
              placeholder="email@emailaddy.com"
              onChange={value => this.onChange('email', value)}
            />
          </label>
        </div>
        <label>
          Card Number
          <CardNumberElement
            onBlur={handleBlur}
            onChange={handleChange}
            onFocus={handleFocus}
            onReady={handleReady}
            {...createOptions(this.props.fontSize)}
            className="cardInputContainer"
          />
        </label>
        <div className="yearCvcContainer">
          <div className="yearContainer">
            <label>
              MM / YY
              <CardExpiryElement
                onBlur={handleBlur}
                onChange={handleChange}
                onFocus={handleFocus}
                onReady={handleReady}
                {...createOptions(this.props.fontSize)}
              />
            </label>
          </div>
          <div className="cvcContainer">
            <label>
              CVC
              <CardCVCElement
                onBlur={handleBlur}
                onChange={handleChange}
                onFocus={handleFocus}
                onReady={handleReady}
                {...createOptions(this.props.fontSize)}
              />
            </label>
          </div>
        </div>
        <Button className={styles.nextBtn} onClick={this.goNext}>
          Pay ${environment.payAmount}
        </Button>
      </form>
    )
  }
}

const SplitForm = injectStripe(_SplitForm)

class StripeCardForm extends Component {
  render() {
    return (
      <StripeProvider apiKey="pk_test_6pRNASCoBOKtIshFeQd4XMUh">
        <Elements>
          <SplitForm />
        </Elements>
      </StripeProvider>
    )
  }
}

export default StripeCardForm
