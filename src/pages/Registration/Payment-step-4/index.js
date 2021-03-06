import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import UserError from '../../../common/state/user/error'
import requireLogin from '../../../common/hocs/requireLogin'
import styles from './Payment.module.css'
import Button from '../../../common/components/Button'

import * as userActionCreators from '../../../common/state/user/actions'

const mapDispatchToProps = dispatch => ({
  userActions: bindActionCreators(userActionCreators, dispatch),
})

const mapStateToProps = state => ({
  invoice: state.invoice.data,
})

export class RegPayment extends Component {
  state = {
    amount: -1,
    paymentMethod: 'stripe',
    numberListsPayingFor: -1,
    error: { field: null, message: null },
  }

  goBack = () => {
    const { history } = this.props
    history.goBack()
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

  payForList = () => {
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
    const { invoice } = this.props
    const { error } = this.state

    if (invoice === undefined) {
      return <div>no invoice</div>
    } else {
      return (
        <div className={styles.content}>
          <h3>Step 5: Finish up</h3>
          <p>Checkout with a credit card or Apple Pay and you're done!</p>

          <div className={styles.spaceHack}>&nbsp;</div>

          <div className={styles.containerCenter}>
            <div className={styles.circle}> ${invoice.due}</div>
          </div>
          <div className={styles.spaceHack}>&nbsp;</div>
          <img src="/fake-payment.png" alt="Payment" />
          <div className={styles.spaceHack}>&nbsp;</div>

          <div className={styles.buttons}>
            <Button className={styles.backBtn} onClick={this.goBack}>
              Back
            </Button>
            <Button className={styles.paymentBtn} onClick={this.payForList}>
              Submit Payment
            </Button>
          </div>

          <p className={styles.error}>{error.message}</p>
        </div>
      )
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(requireLogin(RegPayment))
