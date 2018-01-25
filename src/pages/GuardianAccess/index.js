import React, { Component, Fragment } from 'react'

import apiRequest from '../../common/utils/api'
import Button from '../../common/components/Button'
import Textfield from '../../common/components/Textfield'
import styles from './GuardianAccess.module.css'

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
        <h3>Guardian Access</h3>
        <p>
          Thanks for being a guardian on Last List. We’re very sorry for your loss. Please enter
          your email address below to access their favorite songs.
        </p>
        {success ? (
          <div className={styles.success}>An email was sent to your inbox.</div>
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
