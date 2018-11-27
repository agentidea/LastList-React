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
import { getJwt } from '../../common/state/user/utils/jwt'
import FacebookButton from '../../common/components/FacebookButton'
import gAnalyticsPageView from '../../common/utils/googleAnalytics'

const mapStateToProps = state => ({
  success: state.user.success,
})

const mapDispatchToProps = dispatch => ({
  userActions: bindActionCreators(userActionCreators, dispatch),
})

class Login extends Component {
  state = {
    email: '',
    password: '',
    remember: true,
    creating: false,
    user: null,
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
      history.push('/')
    }
  }

  onChange = (field, value) => {
    this.setState({ [field]: value, error: { field: null } })
  }

  // On successful login, redirect the user to the intended page.
  redirect(flow) {
    const { location, history } = this.props

    switch (flow) {
      case 'registering':
        history.push('/reg/create-profile')
        break
      case 'registered':
        const match = location.search.match(/[?|&]fwd=\/?([-%\d\w]+)/)
        const newRoute = (match && match[1]) || '/reg/create-profile'
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
        this.setState({ creating: false })
        this.redirect(flow)
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
    this.setState({ creating: true })

    const { email, password } = this.state
    let route =
      this.state.nextAction === 'login'
        ? this.props.userActions.login(email, password)
        : this.props.userActions.signup(email, password)

    route
      .then(resp => {
        let flow = this.state.nextAction === 'create-account' ? 'creating-account' : resp.data.flow
        this.redirect(flow)
      })
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
    const success = this.props.success
    const { creating, nextAction } = this.state

    return (
      <form className={styles.content} onSubmit={this.onSubmit}>
        {success ? <p className={styles.infoText}>{success}</p> : null}

        <h3>Sign In To Your Last List</h3>
        {this.renderSocialAuth()}
        <h3>OR</h3>
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
          <Button disabled={creating} onClick={() => this.setNextAction('create-account')}>
            {creating && nextAction === 'create-account' ? 'Creating Account...' : 'Create Account'}
          </Button>
          <Button disabled={creating} className={''} onClick={() => this.setNextAction('login')}>
            {creating && nextAction === 'login' ? 'Please wait...' : 'Sign In'}
          </Button>
        </div>
        <p>
          <Link to="/forgot">Forgot password?</Link>
        </p>
      </form>
    )
  }

  renderSocialAuth = () => {
    return (
      <div className={styles.socialLoginWrapper}>
        <FacebookButton onChange={this.setFacebookAuth} />
        <div className={styles.belowBtnInfo}>
          We won’t share any of your information with Facebook.
        </div>
      </div>
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
          required
          onChange={value => this.onChange('password', value)}
        />
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)
