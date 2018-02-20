import React, { Component } from 'react'

import styles from './SignupConfirmation.module.css'

export class SignupConfirmation extends Component {
  render() {
    return (
      <div className={styles.content}>
        <div className={styles.spaceHack}>&nbsp;</div>
        <h3>THANKS!</h3>
        <p>
          Please check your inbox or spam folder. We've sent you an email to confirm your account.
        </p>
      </div>
    )
  }
}

export default SignupConfirmation
