import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as guardiansActionCreators from '../../../common/state/guardians/actions'
import UserError from '../../../common/state/user/error'
import Button from '../../../common/components/Button'
import Textfield from '../../../common/components/Textfield'
import styles from './AddGuardian.module.css'
import gAnalytics from '../../../common/utils/googleAnalytics'

const mapDispatchToProps = dispatch => ({
  guardiansActions: bindActionCreators(guardiansActionCreators, dispatch),
})

class AddGuardian extends Component {
  state = {
    firstName: '',
    lastName: '',
    email: '',
    adding: false,
    error: null,
  }

  componentDidMount() {
    gAnalytics.gAnalyticsPageView()
  }

  render() {
    const { firstName, lastName, email, adding, error } = this.state
    return (
      <div className={styles.content}>
        <form className={styles.addGuardian} onSubmit={this.addGuardian}>
          <div className={styles.inputs}>
            <Textfield
              type="text"
              label="First name"
              value={firstName}
              required
              placeholder="First Name"
              onChange={value => this.onInputChange('firstName', value)}
            />
            <Textfield
              type="text"
              label="Last name"
              value={lastName}
              required
              placeholder="Last Name"
              onChange={value => this.onInputChange('lastName', value)}
            />
            <Textfield
              type="email"
              label="Email"
              value={email}
              required
              placeholder="Email Address"
              onChange={value => this.onInputChange('email', value)}
            />
          </div>
          {error && <div className={styles.error}>{error}</div>}
          <Button>{adding ? 'Adding...' : 'Add guardian'}</Button>
        </form>
      </div>
    )
  }

  onInputChange(field, value) {
    this.setState({ [field]: value })
  }

  addGuardian = e => {
    e.preventDefault()
    const { firstName, lastName, email } = this.state
    this.setState({ adding: true, error: null })

    this.props.guardiansActions
      .addGuardian(firstName, lastName, email)
      .then(() => {
        this.setState({
          firstName: '',
          lastName: '',
          email: '',
          adding: false,
        })
      })
      .catch(error => {
        var message = error.response.data.message
        this.setState({ error: message, adding: false })
      })
  }
}

export default connect(null, mapDispatchToProps)(AddGuardian)
