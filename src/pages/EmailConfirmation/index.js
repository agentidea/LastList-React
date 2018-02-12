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
        let message = 'Unknown error ' + e.message
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
        <div className={styles.spaceHack}>&nbsp;</div>

        <h3>GREAT! YOU'RE ALL SET</h3>
        {confirming ? (
          <Loading />
        ) : error ? (
          <p className={styles.error}>{error.message}</p>
        ) : (
          <div>
            <div className={styles.spaceHack}>&nbsp;</div>
            <p className={styles.success}>
              Your email address and Last List account are confirmed. Get Started on creating your
              Last List
            </p>
            <Button to="/reg/login">Create Your Last List</Button>
          </div>
        )}
      </div>
    )
  }
}

export default connect(null, mapDispatchToProps)(EmailConfirmation)
