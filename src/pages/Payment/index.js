import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import styles from './Payment.module.css'

export class Payment extends Component {
  render() {
    return (
      <div className={styles.content}>
        <h3>Finish up</h3>
        <Link to="/payment-success">
          <img src="/fake-payment.png" alt="Payment" />
        </Link>
      </div>
    )
  }
}

export default Payment
