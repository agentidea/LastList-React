import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as guardiansActionCreators from '../../../common/state/guardians/actions'
import UserError from '../../../common/state/user/error'
import Button from '../../../common/components/Button'
import Textfield from '../../../common/components/Textfield'
import styles from './AddGuardian.module.css'

const mapDispatchToProps = dispatch => ({
  guardiansActions: bindActionCreators(guardiansActionCreators, dispatch),
})

class RegAddGuardian extends Component {
  state = {
    firstName: '',
    lastName: '',
    email: '',
    adding: false,
    error: null,
    pay: false,
  }

  render() {
    const { firstName, lastName, email, adding, error } = this.state
    return <form className={styles.addGuardian} onSubmit={this.addGuardian}>
        <div className={styles.inputs}>
          <Textfield type="text" label="First name" value={firstName} required placeholder="Her first name" onChange={value => this.onInputChange('firstName', value)} />
          <Textfield type="text" label="Last name" value={lastName} required placeholder="Her last name" onChange={value => this.onInputChange('lastName', value)} />
          <Textfield type="email" label="Email" value={email} required placeholder="Her email address" onChange={value => this.onInputChange('email', value)} />
        </div>
        {error && <div className={styles.error}>{error}</div>}
        <Button>{adding ? 'Adding...' : 'Add'}</Button>
        <Button>{pay ? 'Paying...' : 'Pay'}</Button>
      </form>
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
          pay: false,
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

export default connect(null, mapDispatchToProps)(RegAddGuardian)
