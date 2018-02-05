import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { FormControlLabel } from 'material-ui/Form'
import Checkbox from 'material-ui/Checkbox'

import * as userActionCreators from '../../common/state/user/actions'
import UserError from '../../common/state/user/error'
import Button from '../../common/components/Button'
import Textfield from '../../common/components/Textfield'
import styles from './Login.module.css'
import { registeredSelector } from '../.././common/state/user/selectors'

const mapStateToProps = state => ({
  isRegistered: registeredSelector(state),
})

const mapDispatchToProps = dispatch => ({
  userActions: bindActionCreators(userActionCreators, dispatch),
})

class Login extends Component {
  state = {
    email: '',
    password: '',
    remember: true,
    flow: null,
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

  // On successful login, redirect the user to the intended page.
  redirect() {
    const { location, history, isRegistered } = this.props

    if (!isRegistered) {
      const match = location.search.match(/[?|&]fwd=\/?([-%\d\w]+)/)
      const newRoute = (match && match[1]) || '/'
      history.push(newRoute)
    } else {
      history.push('/reg/create-profile')
    }
  }

  onSubmit = event => {
    event.preventDefault()
    const { email, password } = this.state
    this.props.userActions
      .login(email, password)
      .then(resp => {
        this.redirect()
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
        <h3>Sign In To Your Last List</h3>
        {this.renderInputs()}
        <FormControlLabel
          control={
            <Checkbox
              checked={this.state.remember}
              onChange={(e, checked) => this.setState({ remember: checked })}
            />
          }
          label="Remember me"
        />
        <div className={styles.buttons}>
          <Button to="/signup" nonprimary>
            Create Account
          </Button>
          <Button className={styles.loginButton}>Sign In</Button>
        </div>
        <p>
          <Link to="/forgot">Forgot password?</Link>
        </p>
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
          onChange={value => this.onChange('email', value)}
        />
        <Textfield
          type="password"
          label="Password"
          value={password}
          error={errorPw}
          placeholder="Your password"
          required
          onChange={value => this.onChange('password', value)}
        />
      </div>
    )
  }
}

export default connect(null, mapDispatchToProps)(Login)
