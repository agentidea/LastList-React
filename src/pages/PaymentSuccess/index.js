import React, { Component } from 'react'

import styles from './PaymentSuccess.module.css'

export class PaymentSuccess extends Component {
  render() {
    return (
      <div className={styles.content}>
        <h3>Payment Successful!</h3>
      </div>
    )
  }
}

export default PaymentSuccess
