import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as guardiansActionCreators from '../../../../common/state/guardians/actions'
import UserError from '../../../../common/state/user/error'
import Button from '../../../../common/components/Button'
import Textfield from '../../../../common/components/Textfield'
import styles from './AddGuardian.module.css'
import gAnalyticsPageView from '../../../../common/utils/googleAnalytics'

const mapDispatchToProps = dispatch => ({
  guardiansActions: bindActionCreators(guardiansActionCreators, dispatch),
})

class AddGuardian extends Component {
  state = {
    firstName: '',
    lastName: '',
    email: '',
    adding: false,
    error: null,
    goingnext: false,
  }

  componentDidMount() {
    gAnalyticsPageView()
  }

  goNext = () => {
    //$to do: auto-save / prompt if dirty
    //$to do: why is history undefined here????
    const { history } = this.props
    history.push('/reg/pre-payment')
  }

  goBack = () => {
    const { history } = this.props
    history.goBack()
  }

  shouldShowNextButton = () => {
    //if saved list how do we tell?
    //look in state if num guardian are added
    //return this.state.goingnext
    const { guardians } = this.props
    if (guardians && guardians.length > 0) {
      return true
    }
    return false
  }

  render() {
    const { firstName, lastName, email, adding, goingnext, error } = this.state
    return (
      <div className={styles.content}>
        <h4>Add guardian</h4>

        <form className={styles.addGuardian} onSubmit={this.addGuardian}>
          <div className={styles.inputs}>
            <Textfield
              type="text"
              value={firstName}
              required
              placeholder="First Name"
              onChange={value => this.onInputChange('firstName', value)}
            />
            <Textfield
              type="text"
              value={lastName}
              required
              placeholder="Last Name"
              onChange={value => this.onInputChange('lastName', value)}
            />
          </div>
          <div className={''}>
            <Textfield
              type="email"
              value={email}
              required
              placeholder="Email Address"
              onChange={value => this.onInputChange('email', value)}
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.buttons}>
            <Button className={styles.backBtn} onClick={this.goBack}>
              Back
            </Button>

            <Button className={styles.addGuardianBtn}>
              {adding ? 'Adding...' : 'Add guardian'}
            </Button>

            {this.shouldShowNextButton() && (
              <Button className={styles.nextBtn} onClick={this.goNext}>
                {goingnext ? 'Next: payment' : 'Next: payment'}
              </Button>
            )}
          </div>
        </form>
      </div>
    )
  }

  onInputChange(field, value) {
    this.setState({ [field]: value })
  }

  addGuardian = e => {
    e.preventDefault()
    const { firstName, lastName, email } = this.state
    this.setState({ adding: true, error: null })

    this.props.guardiansActions
      .addGuardian(firstName, lastName, email)
      .then(() => {
        this.setState({
          firstName: '',
          lastName: '',
          email: '',
          adding: false,
          goingnext: true,
        })
      })
      .catch(error => {
        var message = error.response.data.message
        this.setState({ error: message, adding: false })
      })
  }
}

export default connect(null, mapDispatchToProps)(AddGuardian)
