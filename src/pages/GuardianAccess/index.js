import React, { Component } from 'react'

import apiRequest from '../../common/utils/api'
import Button from '../../common/components/Button'
import Textfield from '../../common/components/Textfield'
import styles from './GuardianAccess.module.css'
import gAnalytics from '../../common/utils/googleAnalytics'

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
    gAnalytics.gAnalyticsPageView()
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
        message = e.response.data.error
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
      <div className={styles.all_wrap}>
        <form className={styles.content} onSubmit={this.onSubmit}>
          {success ? (
            <div>
              <h3>Thanks!</h3>
              <p>
                Please check your inbox or spam folder. We’ve sent you a link to confirm your email
                address.
              </p>
            </div>
          ) : (
            <div>
              <h3>Access your loved one's Last List</h3>
              <p>
                Thanks for being a Last List Guardian. We’re very sorry for your loss. <br />
                Please enter your email address below to access your loved one's favorite songs.
              </p>
            </div>
          )}

          <div className={styles.spaceHack}>&nbsp;</div>

          {success ? null : this.renderForm()}
        </form>
      </div>
    )
  }

  renderForm() {
    const { email, error, submitting } = this.state
    return (
      <div className={styles.inputWrap}>
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
      </div>
    )
  }
}

export default GuardianAccess
