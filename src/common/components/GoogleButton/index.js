import React, { Component } from 'react'
import style from './GoogleButton.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGoogle } from '@fortawesome/free-brands-svg-icons'
import { environment } from '../../../environment/environment'
import GoogleLogin from 'react-google-login'
import Button from '../Button'

class GoogleButton extends Component {
  state = {
    isGoogle: true,
    socialEmail: '',
  }

  failed = e => {
    console.log('Google Auth Error | ', e)
  }

  successful = data => {
    this.setState({ socialEmail: data.profileObj.email })
    this.props.setSocialAuth(this.state)
  }

  render() {
    const GgBtn = (
      <GoogleLogin
        clientId={environment.googleCLIENT_ID}
        render={renderProps => (
          <Button className={style.btn} onClick={renderProps.onClick}>
            <FontAwesomeIcon className={style.faIcon} icon={faGoogle} />Sign in with Google
          </Button>
        )}
        onSuccess={this.successful}
        onFailure={this.failed}
      />
    )

    return GgBtn
  }
}

export default GoogleButton
