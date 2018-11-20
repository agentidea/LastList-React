import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as userActionCreators from '../../common/state/user/actions'
import { bindActionCreators } from 'redux'
import style from './ForgotPassword.module.css'
import Textfield from '../../common/components/Textfield'
import Button from '../../common/components/Button'
import UserError from '../../common/state/user/error'
import { getJwt } from '../../common/state/user/utils/jwt'
import gAnalyticsPageView from '../../common/utils/googleAnalytics'

const mapDispatchToProps = dispatch => ({
  userActions: bindActionCreators(userActionCreators, dispatch),
})

class ForgotPassword extends Component {
  state = {
    loading: false,
    success: null,
    email: '',
    error: {
      field: null,
      message: null,
    },
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

  onSubmit = e => {
    e.preventDefault()
    this.setState({ loading: true })
    this.props.userActions
      .forgotPassword(this.state.email)
      .then(resp => {
        this.setState({
          loading: false,
          email: '',
          success: 200,
        })
      })
      .catch(error => {
        if (error instanceof UserError) {
          const { field, message } = error
          this.setState({ loading: false, error: { field, message } })
        } else {
          this.setState({ loading: false, error: { field: 'email', message: 'Unknown error' } })
        }
      })
  }

  onChange = (field, value) => {
    this.setState({ [field]: value, error: { field: null } })
  }

  render() {
    const { error, email, success, loading } = this.state
    const errorEmail = error.field === 'email' ? error.message : null
    let result = ''

    if (success) {
      result = <span>Please check your email spam or inbox for further instructions</span>
    } else {
      result = (
        <div>
          <h3 className={style.h3}>Forgot your password?</h3>

          <span className={style.infoText}>
            If you’ve forgotten your password, please enter your email below and we’ll send you an
            email with instructions on how to reset it.
          </span>

          <div className={style.formWrap}>
            <form onSubmit={this.onSubmit}>
              <Textfield
                className={style.textfield}
                type="email"
                label="Email Address"
                value={email}
                required
                error={errorEmail}
                placeholder="Email Address"
                onChange={value => this.onChange('email', value)}
              />

              <div className={style.btnWrap}>
                <Button className={style.fpButton}>
                  {loading ? 'Please wait...' : 'Reset My Password'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )
    }

    return <div className={style.allWrap}>{result}</div>
  }
}

export default connect(null, mapDispatchToProps)(ForgotPassword)
