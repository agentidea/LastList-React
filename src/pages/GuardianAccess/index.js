import React, { Component } from 'react'
import Button from '../../common/components/Button'
import Textfield from '../../common/components/Textfield'
import styles from './GuardianAccess.module.css'

export class GuardianAccess extends Component {
  constructor(props) {
    super(props)
    this.state = {
      lastlistName: '',
      email: '',
      error: {
        field: null,
        message: null,
      },
    }
  }

  onSubmit = event => {
    event.preventDefault()
    // guardian(this.state.email)
    //   .then(id => {
    //     window.location = '/lastlist'
    //   })
    //   .catch(error => {
    //     this.setState({ error: error.message })
    //   })
  }

  onChange = (field, value) => {
    this.setState({ [field]: value, error: { field: null } })
  }

  render() {
    const { lastlistName, email, error } = this.state
    const errorName = error.field === 'lastlistName' ? error.message : null
    const errorEmail = error.field === 'email' ? error.message : null
    return (
      <form className={styles.content} onSubmit={this.onSubmit}>
        <h3>Guardian Access</h3>
        <p>
          Thanks for being a guardian on Last List. We’re very sorry for your loss. Please enter
          your email address below to access their favorite songs.
        </p>
        <Textfield
          type="text"
          label="LastList's user first and last name"
          value={lastlistName}
          onInput={value => this.onChange('name', value)}
          error={errorName}
          required
        />
        <Textfield
          type="email"
          label="Email Address"
          value={email}
          onInput={value => this.onChange('email', value)}
          error={errorEmail}
          required
        />
        <Button className={styles.submit}>Submit</Button>
      </form>
    )
  }

  onEmailChange = value => {
    this.setState({ email: value, error: null })
  }
}

export default GuardianAccess
