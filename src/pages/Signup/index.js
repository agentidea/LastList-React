import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as userActionCreators from '../../common/state/user/actions'
import UserError from '../../common/state/user/error'
import Button from '../../common/components/Button'
import Textfield from '../../common/components/Textfield'
import styles from './Signup.module.css'
import FacebookButton from '../../common/components/FacebookButton'
import { getJwt } from '../../common/state/user/utils/jwt'
import gAnalyticsPageView from '../../common/utils/googleAnalytics'

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
    nextAction: null,
  }

  componentDidMount() {
    gAnalyticsPageView()
  }

  componentWillMount() {
    if (getJwt()) {
      const { history } = this.props
      history.push('/reg/create-profile')
    }
  }

  onChange = (field, value) => {
    this.setState({ [field]: value, error: { field: null } })
  }

  redirect() {
    const { history } = this.props
    let got_to = this.state.nextAction === 'login' ? '/reg/create-profile' : '/signup-confirmation'
    history.push(got_to)
  }

  // On successful login, redirect the user to the intended page.
  redirectTo(flow) {
    const { location, history } = this.props

    switch (flow) {
      case 'registering':
        history.push('/reg/create-profile')
        break
      case 'registered':
        const match = location.search.match(/[?|&]fwd=\/?([-%\d\w]+)/)
        const newRoute = (match && match[1]) || '/'
        history.push(newRoute)
        break
      case 'creating-account':
        history.push('/signup-confirmation')
        break
      default:
        console.error('unknown flow ' + flow)
        break
    }
  }

  setNextAction(action: string) {
    this.setState({ nextAction: action })
  }

  setFacebookAuth = user_data => {
    console.log(user_data)

    let route = this.props.userActions.sociallogin(user_data)

    route
      .then(resp => {
        let flow = resp.data.flow
        this.redirectTo(flow)
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

  onSubmit = event => {
    event.preventDefault()
    this.setState({ creating: true, successMessage: null, error: { field: null } })

    const { email, password } = this.state
    console.log('NEXT ACTION IS -> ', this.state.nextAction)

    let route =
      this.state.nextAction === 'login'
        ? this.props.userActions.login(email, password)
        : this.props.userActions.signup(email, password)

    route.then(resp => this.redirect()).catch(error => {
      if (error instanceof UserError) {
        const { field, message } = error
        this.setState({ creating: false, error: { field, message } })
      } else {
        this.setState({ creating: false, error: { field: 'email', message: 'Unknown error' } })
      }
    })
  }

  render() {
    const { successMessage, creating, nextAction } = this.state
    return (
      <form className={styles.content} onSubmit={this.onSubmit}>
        <h3>Create your account</h3>
        {this.renderSocialAuth()}
        <h3>OR</h3>
        {this.renderInputs()}
        {successMessage && <div className={styles.success}>{successMessage}</div>}
        <div className={styles.buttons}>
          <Button onClick={() => this.setNextAction('login')}>
            {creating && nextAction === 'login' ? 'Please wait...' : 'Sign In'}
          </Button>
          <Button
            disabled={creating}
            className={styles.signupButton}
            onClick={() => this.setNextAction('create-account')}
          >
            {creating && nextAction === 'create-account' ? 'Creating Account...' : 'Create Account'}
          </Button>
        </div>
      </form>
    )
  }

  renderSocialAuth = () => {
    const facebook = (
      <div className={styles.socialLoginWrapper}>
        <FacebookButton onChange={this.setFacebookAuth} />
        <div className={styles.belowBtnInfo}>
          We won’t share any of your information with Facebook.
        </div>
      </div>
    )

    return facebook
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
