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
import classnames from 'classnames'
import gAnalyticsPageView from '../../../../common/utils/googleAnalytics'

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
    buttonInfo: {
      text: null,
      action: null,
    },
    viewForm: true,
  }

  componentDidMount() {
    gAnalyticsPageView('stripe payment')
  }

  /* handle change for stripe specific components */
  handleChange = change => {
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
            loading: false,
            error: {
              field: result.field,
              message: result.message,
            },
          })

          return
        }

        paymentsActions
          .doPayment({
            token: result.token,
            amount: this.props.elements.amount.due,
            method: 'stripe',
          })
          .then(data => {
            let message =
              data.code === 200 ? data.message : 'Something went wrong, payment was unsuccessful'
            this.handleAfterPayButtons(data.code)
            this.setState({ loading: false, viewForm: false, paymentResponse: message })

            if (data.code === 200) {
              setTimeout(() => {
                window.location = '/payment-success'
              }, 500)
            }
          })
      })
    } else {
      this.setState({ loading: false })
      console.log("Stripe.js hasn't loaded yet.")
    }
  }

  /* return to pay view on try-again action OR close modal on close action */
  handleNextAction = action => {
    if (action === 'close') {
      this.props.elements.handleCloseModal()
      return
    }

    this._cardNumber.clear()
    this._cardYear.clear()
    this._cardCvc.clear()
    this.setState({ viewForm: true, paymentResponse: null })
  }

  /* handle button of success / try again view */
  handleAfterPayButtons = paymentResponse => {
    this.setState({
      buttonInfo: {
        text: paymentResponse === 200 ? 'Done' : 'Try Again',
        action: paymentResponse === 200 ? 'close' : 'try-again',
      },
    })
  }

  render() {
    const { email, error } = this.state
    const errorEmail = error.field === 'email' ? error.message : null

    return (
      <form onSubmit={this.handleSubmit} className="stripeForm">
        <div style={!this.state.viewForm ? { display: 'none' } : {}}>
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
              onReady={c => (this._cardNumber = c)}
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
                  onReady={c => (this._cardYear = c)}
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
                  onReady={c => (this._cardCvc = c)}
                />
                {error.field === 'cardCvc' ? (
                  <span className={styles.errors}>{error.message}</span>
                ) : (
                  ''
                )}
              </label>
            </div>
          </div>
        </div>

        <div className={styles.noticeWrapper}>
          {this.state.loading ? <span className="">{environment.waitMessage}</span> : ''}

          <div
            className={styles.noticeWrapperInner}
            style={!this.state.paymentResponse ? { display: 'none' } : {}}
          >
            <span className="">{this.state.paymentResponse}</span>
            <Button
              className={classnames(styles.afterPayBtn)}
              type="button"
              onClick={() => this.handleNextAction(this.state.buttonInfo.action)}
            >
              {this.state.buttonInfo.text}
            </Button>
          </div>
        </div>

        <Button
          className={styles.payBtn}
          style={this.state.paymentResponse ? { display: 'none' } : {}}
        >
          Pay ${this.props.elements.amount.due}
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
          <SplitForm elements={this.props.elements} />
        </Elements>
      </StripeProvider>
    )
  }
}

export default StripeCardForm
