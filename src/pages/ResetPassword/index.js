import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as userActionCreators from '../../common/state/user/actions'
import { bindActionCreators } from 'redux'
import style from './ResetPassword.module.css'
import Textfield from '../../common/components/Textfield'
import Button from '../../common/components/Button'
import UserError from '../../common/state/user/error'
import { getJwt } from '../../common/state/user/utils/jwt'
import gAnalyticsPageView from '../../common/utils/googleAnalytics'

const mapDispatchToProps = dispatch => ({
  userActions: bindActionCreators(userActionCreators, dispatch),
})

class ResetPassword extends Component {
  state = {
    loading: false,
    confirmPassword: '',
    password: '',
    resetToken: null,
    error: {
      field: null,
      message: null,
    },
  }

  componentWillMount() {
    if (getJwt()) {
      const { history } = this.props
      history.push('/')
    }
  }

  componentDidMount() {
    gAnalyticsPageView()

    const params = this.props.match.params
    const reset_token = params.token
    this.setResetToken(reset_token)
  }

  redirect = () => {
    const { history } = this.props
    history.push('/login')
  }

  validate = () => {
    const { password, confirmPassword } = this.state

    const regex = /^(?=.*[A-Z])(?=.*[~`%^)(_=+!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,}$/

    if (password !== confirmPassword) {
      this.setState({ error: { field: 'password', message: 'Passwords do not match!' } })
      return false
    }

    if (!regex.test(password)) {
      let pwdCriteria =
        'atleast 8 characters, atleast 1 number, atleast 1 uppercase letter, atleast 1 lowercase letter and atleast 1 special character'
      this.setState({
        error: { field: 'password', message: 'remember password should be: ' + pwdCriteria },
      })
      return false
    }

    return true
  }

  onSubmit = e => {
    e.preventDefault()

    let isValid = this.validate()

    if (!isValid) {
      return
    }

    this.setState({ loading: true })

    let payload = { password: this.state.password, resetToken: this.state.resetToken }

    this.props.userActions
      .resetPassword(payload)
      .then(resp => {
        this.setState({ loading: false, password: '', confirmPassword: '' })
        this.redirect()
      })
      .catch(error => {
        if (error instanceof UserError) {
          const { message } = error
          this.setState({ loading: false, error: { field: 'password', message } })
        } else {
          this.setState({ loading: false, error: { field: 'password', message: 'Unknown error' } })
        }
      })
  }

  onChange = (field, value) => {
    this.setState({ [field]: value, error: { field: null } })
  }

  setResetToken = (reset_token: string) => {
    console.log('reset token is -> ', reset_token)
    this.setState({ resetToken: reset_token })
  }

  render() {
    const { error, password, confirmPassword } = this.state
    const errorPw = error.field === 'password' ? error.message : null

    return (
      <div className={style.allWrap}>
        <div className={style.content}>
          <h3 className={style.h3}>Reset your password</h3>

          <span className={style.infoText}>
            Please create a new password for your Last List account.
          </span>

          <div className={style.formWrap}>
            <form onSubmit={this.onSubmit}>
              <Textfield
                className={style.textfield}
                type="password"
                label="Password"
                value={password}
                error={errorPw}
                placeholder="New Password"
                required
                onChange={value => this.onChange('password', value)}
              />

              <Textfield
                className={style.textfield}
                type="password"
                label="Confirm Password"
                value={confirmPassword}
                error={''}
                placeholder="Confirm password"
                required
                onChange={value => this.onChange('confirmPassword', value)}
              />

              <div className={style.btnWrap}>
                <Button className={style.fpButton}>
                  {this.state.loading ? 'Please wait...' : 'Reset My Password'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(null, mapDispatchToProps)(ResetPassword)
