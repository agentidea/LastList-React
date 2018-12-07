import ReactDOM from 'react-dom'
import React, { Component } from 'react'
import { environment } from '../../../environment/environment'
import styles from './PayPalButton.module.css'
import Button from '../Button'
import { faPaypal } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import gAnalyticsPageView from '../../utils/googleAnalytics'
import * as paymentsActions from '../../state/payments/actions'

const client = {
  sandbox: environment.payPalSandbox,
  production: environment.payPalProduction,
}
const env = environment.mode === 'prod' ? 'production' : 'sandbox'
const style = {
  label: 'paypal',
  size: 'responsive', // small | medium | large | responsive
  shape: 'pill', // pill | rect
  color: 'white', // gold | blue | silver | black
  tagline: false,
}

class PayPalButton extends Component {
  state = {
    currency: 'USD',
    info: null,
  }

  onAuthorize = (data, actions) => {
    return actions.payment
      .execute()
      .then(() => {
        paymentsActions
          .doPayment({ token: true, amount: this.props.elements.amount.due, method: 'paypal' })
          .then(data => {
            console.log(data)
          })
      })
      .then(() => {
        this.setState({ info: 'Payment Complete!' })

        setTimeout(() => {
          const { history } = this.props
          history.push('/payment-success')
        }, 500)
      })
  }

  payment = (data, actions) => {
    gAnalyticsPageView('paypal payment')

    let total = this.props.elements.amount.due
    const paypal = window.PAYPAL
    const { currency } = this.state

    return paypal.rest.payment.create(env, client, {
      transactions: [{ amount: { total, currency } }],
    })
  }

  onSuccess = success => {
    console.log(success)
  }

  onError = error => {
    console.log(error)
    this.setState({ info: 'An unknown error occurred on payment' })
  }

  onCancel = cancel => {
    console.log(cancel)
    this.setState({ info: 'Payment Canceled!' })
  }

  render() {
    const { info } = this.state
    const paypal = window.PAYPAL
    let PayPalButton = paypal.Button.driver('react', { React, ReactDOM })

    const PayBtn = (
      <div className={styles.btnAllWrap}>
        <Button className={styles.payBtn}>
          <FontAwesomeIcon className={style.faIcon} icon={faPaypal} /> PayPal
        </Button>
        <div
          className={styles.payBtn2}
          style={{ display: this.props.elements.amount.due === 0 ? 'none' : '' }}
        >
          <PayPalButton
            style={style}
            env={env}
            client={client}
            payment={this.payment}
            commit={true}
            onAuthorize={this.onAuthorize}
            onSuccess={this.onSuccess}
            onError={this.onError}
            onCancel={this.onCancel}
            ref="PayPalButton"
          />
        </div>
        <span>{info}</span>
      </div>
    )

    return PayBtn
  }
}

export default PayPalButton
