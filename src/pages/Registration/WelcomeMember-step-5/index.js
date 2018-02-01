import React, { Component } from 'react'
import Button from '../../common/components/Button'

import styles from './PaymentSuccess.module.css'

export class PaymentSuccess extends Component {
  render() {
    return (
      <div className={styles.content}>
        <h3>All set!</h3>
        <p>Congratulations! You've created your Last List.</p>
        <Button to="/edit-list" vspace>
          View Your Last List
        </Button>
      </div>
    )
  }
}

export default PaymentSuccess
