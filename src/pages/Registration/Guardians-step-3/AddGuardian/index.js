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
    const { history } = this.props
    history.push('/reg/payment')
  }

  shouldShowNextButton = () => {
    //if saved how do we tell?
    //look in state???+
    return state.goingnext
  }

  render() {
    const { firstName, lastName, email, adding, goingnext, error } = this.state
    return (
      <div className={styles.content}>
        <h3>Add Guardians</h3>

        <form className={styles.addGuardian} onSubmit={this.addGuardian}>
          <div className={styles.inputs}>
            <Textfield
              type="text"
              label="First name"
              value={firstName}
              required
              placeholder="Her first name"
              onChange={value => this.onInputChange('firstName', value)}
            />
            <Textfield
              type="text"
              label="Last name"
              value={lastName}
              required
              placeholder="Her last name"
              onChange={value => this.onInputChange('lastName', value)}
            />
            <Textfield
              type="email"
              label="Email"
              value={email}
              required
              placeholder="Her email address"
              onChange={value => this.onInputChange('email', value)}
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.buttons}>
            <Button>{adding ? 'Adding...' : 'Add'}</Button>

            {this.shouldShowNextButton() && (
              <Button className={styles.saveBtn} onClick={this.goNext} disabled={goingnext}>
                {goingnext ? 'next...' : 'Next Step Pay'}
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
