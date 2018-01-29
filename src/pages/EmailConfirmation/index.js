import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as userActionCreators from '../../common/state/user/actions'
import UserError from '../../common/state/user/error'
import Loading from '../../common/components/Loading'
import Button from '../../common/components/Button'
import styles from './EmailConfirmation.module.css'

const mapDispatchToProps = dispatch => ({
  userActions: bindActionCreators(userActionCreators, dispatch),
})

class EmailConfirmation extends Component {
  state = {
    confirming: true,
    error: null,
  }

  componentDidMount() {
    const { match } = this.props
    const { code } = match.params
    this.props.userActions
      .confirmAccount(code)
      .then(() => this.setState({ confirming: false, error: null }))
      .catch(e => {
        let message = 'Unknown error'
        if (e instanceof UserError) {
          message = e.message
        }
        this.setState({ confirming: false, error: { message } })
      })
  }

  render() {
    const { confirming, error } = this.state
    return (
      <div className={styles.content}>
        <h3>Confirmation</h3>
        {confirming ? (
          <Loading />
        ) : error ? (
          <p className={styles.error}>{error.message}</p>
        ) : (
          <div>
            <p className={styles.success}>
              Your account is now confirmed. You can login and start creating your list.
            </p>
            <Button to="/login">Go to Login</Button>
          </div>
        )}
      </div>
    )
  }
}

export default connect(null, mapDispatchToProps)(EmailConfirmation)
