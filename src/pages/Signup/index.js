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

  // On successful Signup, redirect the user to the intended page.
  redirect() {
    const { location, history } = this.props
    const match = location.pathname.match(/[?|&]fwd=\/?([-%\d\w]+)/)
    const fwd = (match && match[1]) || ''
    history.push(`/${fwd}`)
  }

  onSubmit = event => {
    event.preventDefault()
    this.setState({ successMessage: null })

    const { email, password } = this.state
    this.props.userActions
      .signup(email, password)
      .then(resp => {
        this.setState({ successMessage: resp })
      })
      .catch(error => {
        if (error instanceof UserError) {
          const { field, message } = error
          this.setState({ error: { field, message } })
        } else {
          this.setState({ error: { field: 'email', message: 'Unknown error' } })
        }
      })
  }

  render() {
    return (
      <form className={styles.content} onSubmit={this.onSubmit}>
        <h3>Create your account</h3>
        {this.renderInputs()}
        <div className={styles.buttons}>
          <Button to="/Signup" className={styles.SignupButton} nonprimary>
            Sign In
          </Button>
          <Button>Create Account</Button>
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
          placeholder="Your email address"
          onInput={value => this.onChange('email', value)}
        />
        <Textfield
          type="password"
          label="Password"
          value={password}
          error={errorPw}
          placeholder="Your password"
          help="Must be between 8 and 20 characters."
          minLength={8}
          maxLength={20}
          required
          onInput={value => this.onChange('password', value)}
        />
      </div>
    )
  }
}

export default connect(null, mapDispatchToProps)(Signup)
