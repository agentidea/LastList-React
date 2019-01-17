import React, { Component } from 'react'
import FacebookLogin from 'react-facebook-login'
import style from './GoogleButton.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebookSquare } from '@fortawesome/free-brands-svg-icons'
import { environment } from '../../../environment/environment'
import GoogleLogin from 'react-google-login'

class GoogleButton extends Component {
  state = {
    isFacebook: true,
    socialEmail: '',
  }

  componentClicked = () => {
    console.log('button clicked')
  }

  failed = e => {
    console.log('Google Auth Error | ', e)
  }

  successful = data => {
    //this.setState({ socialEmail: data.email })
    //this.props.onChange(this.state)
    console.log(data)
  }

  render() {
    const GgBtn = (
      <GoogleLogin
        clientId={environment.googleCLIENT_ID}
        buttonText="Sign in with Google"
        onSuccess={this.successful}
        onFailure={this.failed}
      />
    )

    return GgBtn
  }
}

export default GoogleButton
