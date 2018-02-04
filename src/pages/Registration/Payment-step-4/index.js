import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import UserError from '../../../common/state/user/error'

import styles from './Payment.module.css'
import Button from '../../../common/components/Button'

export class RegPayment extends Component {
  state = {
    amount: 1,
    paymentMethod: 'stripe',
    numberListsPayingFor: 1,
    error: {
      field: null,
      message: null,
    },
  }

  shouldShowNextButton = () => {
    //if saved how do we tell?
    //look in state???+
    return true
  }

  // On successful payment, redirect the user to the welcome page.
  redirect() {
    const { history } = this.props
    history.push('/reg/welcome-member')
  }

  onSubmit = event => {
    event.preventDefault()
    const { amount, paymentMethod, numberListsPayingFor, error } = this.state
    this.props.userActions
      .payForList(amount, paymentMethod, numberListsPayingFor)
      .then(resp => {
        this.redirect()
      })
      .catch(error => {
        if (error instanceof UserError) {
          const { field, message } = error
          this.setState({ error: { field, message } })
        } else {
          this.setState({ error: { field: 'email', message: 'Unknown error' } })
        }
      })
  }

  render() {
    const { error } = this.state
    return (
      <div className={styles.content}>
        <h3>Finish up</h3>
        <Link to="/payment-success">
          <img src="/fake-payment.png" alt="Payment" />
        </Link>

        <form className={styles.content} onSubmit={this.onSubmit}>
          <Button className={styles.loginButton}>Pay</Button>
        </form>

        <p className={styles.error}>{error.message}</p>
      </div>
    )
  }
}

export default RegPayment
