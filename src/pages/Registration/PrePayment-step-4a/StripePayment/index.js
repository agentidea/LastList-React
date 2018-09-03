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
import styles from '../StripePayment/StripePayment.module.css'
import { environment } from '../../../../environment/environment'
import React from 'react'
import * as paymentsActions from '../../../../common/state/payments/actions'

const createOptions = (fontSize: string, padding: ?string) => {
  return {
    style: {
      base: {
        fontSize,
        color: '#424770',
        letterSpacing: '0.025em',
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

class _SplitForm extends Component<InjectedProps & { fontSize: string }> {
  state = {
    email: '',
    error: {
      field: null,
      message: null,
    },
    loading: false,
    paymentResponse: null,
  }

  /* handle change for stripe specific components */
  handleChange = change => {
    console.log('[change]', change)

    this.setState({
      error: {
        field: null,
        message: null,
      },
    })

    this.setState({
      error: {
        field: change.elementType,
        message: change.error ? change.error.message : '',
      },
    })
  }

  /* handle change for other non-stripe components */
  onChange = (field, value) => {
    this.setState({ [field]: value, error: { field: null } })
  }

  /* on form submit */
  handleSubmit = ev => {
    ev.preventDefault()

    this.setState({ loading: true })

    if (this.props.stripe) {
      this.props.stripe.createToken().then(payload => {
        let result = paymentsActions.stripePay(payload)

        if (result.error) {
          this.setState({
            error: {
              field: result.field,
              message: result.message,
            },
          })

          return
        }

        paymentsActions.doStripePayment(result.token).then(data => {
          let message = data.code === 200 ? data.message : 'Something went wrong'
          this.setState({ loading: false, paymentResponse: message })
        })
      })
    } else {
      this.setState({ loading: false })
      console.log("Stripe.js hasn't loaded yet.")
    }
  }

  render() {
    const { email, error } = this.state
    const errorEmail = error.field === 'email' ? error.message : null

    return (
      <form onSubmit={this.handleSubmit} className="stripeForm">
        <div className="emailStripeContainer">
          <label>
            Email
            <Textfield
              type="email"
              value={email}
              required
              error={errorEmail}
              placeholder="email@emailaddy.com"
              onChange={value => this.onChange('email', value)}
            />
          </label>
        </div>
        <label>
          Card Number
          <CardNumberElement
            onChange={this.handleChange}
            {...createOptions(this.props.fontSize)}
            className="cardInputContainer"
          />
          {error.field === 'cardNumber' ? (
            <span className={styles.errors}>{error.message}</span>
          ) : (
            ''
          )}
        </label>
        <div className="yearCvcContainer">
          <div className="yearContainer">
            <label>
              MM / YY
              <CardExpiryElement
                onChange={this.handleChange}
                {...createOptions(this.props.fontSize)}
              />
              {error.field === 'cardExpiry' ? (
                <span className={styles.errors}>{error.message}</span>
              ) : (
                ''
              )}
            </label>
          </div>
          <div className="cvcContainer">
            <label>
              CVC
              <CardCVCElement
                onChange={this.handleChange}
                {...createOptions(this.props.fontSize)}
              />
              {error.field === 'cardCvc' ? (
                <span className={styles.errors}>{error.message}</span>
              ) : (
                ''
              )}
            </label>
          </div>
        </div>

        <div className={styles.noticeWrapper}>
          {this.state.loading ? <span className="">PLEASE WAIT...</span> : ''}
          {this.state.paymentResponse ? <span className="">{this.state.paymentResponse}</span> : ''}
        </div>
        <Button className={styles.payBtn} type="submit">
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
      <StripeProvider
        apiKey={environment.mode === 'dev' ? environment.devStripeKey : environment.prodStripeKey}
      >
        <Elements>
          <SplitForm />
        </Elements>
      </StripeProvider>
    )
  }
}

export default StripeCardForm
