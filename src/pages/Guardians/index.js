import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import requireLogin from '../../common/hocs/requireLogin'
import * as guardiansActionCreators from '../../common/state/guardians/actions'
import Button from '../../common/components/Button'
import Textfield from '../../common/components/Textfield'
import styles from './Guardians.module.css'

const mapStateToProps = state => ({
  guardians: state.user.guardians,
})
const mapDispatchToProps = dispatch => ({
  guardiansActions: bindActionCreators(guardiansActionCreators, dispatch),
})

class Guardians extends Component {
  state = {
    firstName: '',
    lastName: '',
    email: '',
    adding: false,
  }

  componentDidMount() {}

  render() {
    const { guardians } = this.props
    return (
      <div className={styles.content}>
        <h4>Step Three</h4>
        <h3>Nominate your guardians</h3>
        <p>
          Your Guardian(s) will be responsible for getting your Last List from us when the time has
          come. We’ll let them know via email that they’ve been chosen by you to fulfill this
          important role. You can add up to 5 Guardians and change them as many times as you want
          to.
        </p>
        <h4>Your guardians</h4>
        {guardians.length === 0 ? (
          <p>You don't have guardians at the moment</p>
        ) : (
          this.renderGuardians(guardians)
        )}
        <h4>Add a guardian</h4>
        {this.renderAddGuardian()}
      </div>
    )
  }

  renderGuardians(guardians) {
    return (
      <ul>
        {guardians.map(g => (
          <li key={g.email}>
            {g.firstName} {g.lastName} ({g.email})
          </li>
        ))}
      </ul>
    )
  }

  renderAddGuardian() {
    const { firstName, lastName, email, adding } = this.state
    return (
      <div className={styles.addGuardian}>
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
        <Button onClick={this.addGuardian}>{adding ? 'Adding...' : 'Add'}</Button>
      </div>
    )
  }

  onInputChange(field, value) {
    this.setState({ [field]: value })
  }

  addGuardian = async () => {
    const { firstName, lastName, email } = this.state
    this.setState({ adding: true })

    this.props.guardiansActions.addGuardian(firstName, lastName, email).then(() => {
      this.setState({
        firstName: '',
        lastName: '',
        email: '',
        adding: false,
      })
    })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(requireLogin(Guardians))
