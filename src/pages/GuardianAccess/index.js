import React, { Component, Fragment } from 'react'

import apiRequest from '../../common/utils/api'
import Button from '../../common/components/Button'
import Textfield from '../../common/components/Textfield'
import styles from './GuardianAccess.module.css'
import gAnalyticsPageView from '../../common/utils/googleAnalytics'

export class GuardianAccess extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      error: null,
      success: false,
      submitting: false,
    }
  }

  componentDidMount() {
    gAnalyticsPageView()
  }

  onSubmit = async event => {
    event.preventDefault()
    try {
      this.setState({ submitting: true })
      await apiRequest('guardian/login', null, {
        method: 'POST',
        body: {
          email: this.state.email,
        },
      })
      this.setState({ submitting: false, success: true })
    } catch (e) {
      let message = 'Unknown error'
      if (e.response && e.response.data && e.response.data.error_type) {
        message = e.response.data.message
      }
      this.setState({ submitting: false, error: message })
    }
  }

  onEmailChange = value => {
    this.setState({ email: value, error: null })
  }

  render() {
    const { success } = this.state
    return (
      <form className={styles.content} onSubmit={this.onSubmit}>
        <h3>YOUR LOVED ONE'S LAST LIST</h3>
        <p>Thanks for being a Last List Guardian. We’re so sorry for your loss. </p>

        <p>Please enter your email address below to access your loved one’s favorite songs.</p>

        <div className={styles.spaceHack}>&nbsp;</div>

        {success ? (
          <div className={styles.success}>
            Check your inbox or spam folder for an email from us.
          </div>
        ) : (
          this.renderForm()
        )}
      </form>
    )
  }

  renderForm() {
    const { email, error, submitting } = this.state
    return (
      <Fragment>
        <Textfield
          type="email"
          label="Email Address"
          placeholder="Email Address"
          value={email}
          onChange={this.onEmailChange}
          error={error}
          required
        />
        <Button className={styles.submit}>{submitting ? 'Submitting...' : 'Submit'}</Button>
      </Fragment>
    )
  }
}

export default GuardianAccess
