import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import UserError from '../../../common/state/user/error'

import styles from './Payment.module.css'
import Button from '../../../common/components/Button'

import * as userActionCreators from '../../../common/state/user/actions'

const mapDispatchToProps = dispatch => ({
  userActions: bindActionCreators(userActionCreators, dispatch),
})

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
        <p>Checkout with a credit card or Apple Pay and you're done!</p>

        <div className={styles.spaceHack}>&nbsp;</div>
        <Link to="/payment-success">
          <img src="/fake-payment.png" alt="Payment" />
        </Link>

        <div className={styles.spaceHack}>&nbsp;</div>

        <div className={styles.spaceHack}>&nbsp;</div>

        <form className={styles.content} onSubmit={this.onSubmit}>
          <Button className={styles.loginButton}>Submit Payment</Button>
        </form>

        <p className={styles.error}>{error.message}</p>
      </div>
    )
  }
}

//export default RegPayment
export default connect(null, mapDispatchToProps)(RegPayment)
