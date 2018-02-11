import React, { Component } from 'react'
import Button from '../../../common/components/Button'

import styles from './PaymentSuccess.module.css'

export class WelcomeMember extends Component {
  render() {
    return (
      <div className={styles.content}>
        <h3>Congratulations!</h3>
        <p>You've created your Last List.</p>
        <Button to="/edit-list" vspace>
          View Your Last List
        </Button>
      </div>
    )
  }
}

export default WelcomeMember
