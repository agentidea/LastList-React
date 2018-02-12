import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as guardiansActionCreators from '../../../../common/state/guardians/actions'
import UserError from '../../../../common/state/user/error'
import Button from '../../../../common/components/Button'
import Textfield from '../../../../common/components/Textfield'
import styles from './AddGuardian.module.css'

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

  goNext = () => {
    //$to do: auto-save / prompt if dirty
    //$to do: why is history undefined here????
    const { history } = this.props
    history.push('/reg/pre-payment')
  }

  shouldShowNextButton = () => {
    //if saved list how do we tell?
    //look in state if num guardian are added
    //return this.state.goingnext
    return true
  }

  render() {
    const { firstName, lastName, email, adding, goingnext, error } = this.state
    return (
      <div className={styles.content}>
        <h4>Add Guardians</h4>

        <form className={styles.addGuardian} onSubmit={this.addGuardian}>
          <div className={styles.inputs}>
            <Textfield
              type="text"
              label="First name"
              value={firstName}
              required
              placeholder="First Name"
              onChange={value => this.onInputChange('firstName', value)}
            />
            <Textfield
              type="text"
              label="Last name"
              value={lastName}
              required
              placeholder="Last Name"
              onChange={value => this.onInputChange('lastName', value)}
            />
            <Textfield
              type="email"
              label="Email"
              value={email}
              required
              placeholder="Email Address"
              onChange={value => this.onInputChange('email', value)}
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.buttons}>
            <Button className={styles.addGuardianBtn}>
              {adding ? 'Adding...' : 'Add Another Guardian'}
            </Button>

            {this.shouldShowNextButton() && (
              <Button className={styles.nextBtn} onClick={this.goNext}>
                {goingnext ? 'Next: Payment' : 'Next: Payment'}
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
        if (error instanceof UserError) {
          const { message } = error
          this.setState({ error: message, adding: false })
        } else {
          this.setState({ error: 'Unknown error', adding: false })
        }
      })
  }
}

export default connect(null, mapDispatchToProps)(AddGuardian)
