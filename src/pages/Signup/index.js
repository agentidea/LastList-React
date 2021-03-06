import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as userActionCreators from '../../common/state/user/actions'
import UserError from '../../common/state/user/error'
import Button from '../../common/components/Button'
import Textfield from '../../common/components/Textfield'
import styles from './Signup.module.css'

const mapDispatchToProps = dispatch => ({
  userActions: bindActionCreators(userActionCreators, dispatch),
})

class Signup extends Component {
  state = {
    email: '',
    password: '',
    remember: true,
    successMessage: null,
    creating: false,
    error: {
      field: null,
      message: null,
    },
  }

  componentWillMount() {
    this.props.userActions.signOut()
  }

  onChange = (field, value) => {
    this.setState({ [field]: value, error: { field: null } })
  }

  redirect() {
    const { history } = this.props
    history.push('/signup-confirmation')
  }

  onSubmit = event => {
    event.preventDefault()
    this.setState({ creating: true, successMessage: null, error: { field: null } })

    const { email, password } = this.state
    this.props.userActions
      .signup(email, password)
      .then(resp => this.redirect())
      .catch(error => {
        if (error instanceof UserError) {
          const { field, message } = error
          this.setState({ creating: false, error: { field, message } })
        } else {
          this.setState({ creating: false, error: { field: 'email', message: 'Unknown error' } })
        }
      })
  }

  render() {
    const { successMessage, creating } = this.state
    return (
      <form className={styles.content} onSubmit={this.onSubmit}>
        <h3>Create your account</h3>
        {this.renderInputs()}
        {successMessage && <div className={styles.success}>{successMessage}</div>}
        <div className={styles.buttons}>
          <Button to="/login" nonprimary>
            Sign In
          </Button>
          <Button disabled={creating} className={styles.signupButton}>
            {creating ? 'Creating Account...' : 'Create Account'}
          </Button>
        </div>
      </form>
    )
  }

  renderInputs() {
    const { error, email, password } = this.state
    const errorEmail = error.field === 'email' ? error.message : null
    const errorPw = error.field === 'password' ? error.message : null
    return (
      <div>
        <Textfield
          type="email"
          label="Email Address"
          value={email}
          required
          error={errorEmail}
          placeholder="Email Address"
          onChange={value => this.onChange('email', value)}
        />
        <Textfield
          type="password"
          label="Password"
          value={password}
          error={errorPw}
          placeholder="Password"
          help="Must be between 8 and 20 characters."
          minLength={8}
          maxLength={20}
          required
          onChange={value => this.onChange('password', value)}
        />
      </div>
    )
  }
}

export default connect(null, mapDispatchToProps)(Signup)
