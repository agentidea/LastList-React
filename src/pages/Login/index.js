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
import SpotifyButton from '../../common/components/SpotifyButton'
import GoogleButton from '../../common/components/GoogleButton'

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
    social_auth: false,
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

  triggered_social_auth = (status = true) => {
    this.setState({ social_auth: status })
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

  setSocialAuth = user_data => {
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
    const { creating, nextAction, social_auth } = this.state

    return (
      <div className={styles.all_wrap}>
        <form className={styles.content} onSubmit={this.onSubmit}>
          {success ? <p className={styles.infoText}>{success}</p> : null}

          <h3 className={styles.h3}>Sign In</h3>
          {this.renderSocialAuth()}
          <h3>OR</h3>
          {this.renderInputs()}
          <div className={styles.buttons}>
            <Button disabled={creating} className={''} onClick={() => this.setNextAction('login')}>
              {creating && nextAction === 'login' ? 'Please wait...' : 'Sign in'}
            </Button>
            <p className={styles.fgtPwd}>
              <Link to="/forgot">Forgot password?</Link>
            </p>
            <FormControlLabel
              className={styles.checkbox}
              control={
                <Checkbox
                  checked={this.state.remember}
                  onChange={(e, checked) => this.setState({ remember: checked })}
                />
              }
              label="Remember me"
            />
          </div>
        </form>
        <div className={`${social_auth ? styles.pop_auth : styles.hide}`}>
          <h3 className={styles.h3}>Please Wait ...</h3>
          <p>
            <span onClick={() => this.triggered_social_auth(false)}>BACK</span>
          </p>
        </div>
      </div>
    )
  }

  renderSocialAuth = () => {
    return (
      <div className={styles.socialLoginWrapper}>
        <div className={styles.each_btn_wrap} onClick={this.triggered_social_auth}>
          <FacebookButton onChange={this.setSocialAuth} />
        </div>

        <div className={styles.each_btn_wrap} onClick={this.triggered_social_auth}>
          <SpotifyButton setSocialAuth={this.setSocialAuth} />
        </div>

        <div className={styles.each_btn_wrap} onClick={this.triggered_social_auth}>
          <GoogleButton setSocialAuth={this.setSocialAuth} />
        </div>

        <div className={styles.belowBtnInfo}>
          We won’t share any of your information with Google, Spotify or Facebook.
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
          placeholder="Make it memorable"
          required
          onChange={value => this.onChange('password', value)}
        />
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)
