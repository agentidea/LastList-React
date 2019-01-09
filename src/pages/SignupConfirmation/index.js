import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import styles from './SignupConfirmation.module.css'
import gAnalyticsPageView from '../../common/utils/googleAnalytics'

export class SignupConfirmation extends Component {
  componentDidMount() {
    gAnalyticsPageView()
  }

  render() {
    return (
      <div className={styles.content}>
        <div className={styles.spaceHack}>&nbsp;</div>
        <h3>Confirm Your Email Address</h3>
        <p>
          Thanks. We’ve sent a confirmation email to your email address. Please click the link to
          activate your account. If you don’t see the email, check your junk or spam folder.
        </p>

        <p>
          Didn’t get the email? Please <Link to="#">click here</Link> to resend.
        </p>
      </div>
    )
  }
}

export default SignupConfirmation
