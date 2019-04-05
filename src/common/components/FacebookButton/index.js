import React, { Component } from 'react'
import FacebookLogin from 'react-facebook-login'
import style from './FacebookButton.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebookSquare } from '@fortawesome/free-brands-svg-icons'
import { environment } from '../../../environment/environment'

class FacebookButton extends Component {
  state = {
    isFacebook: true,
    socialEmail: '',
  }

  componentClicked = () => {
    console.log('button clicked')
  }
  responseFacebook = data => {
    this.setState({ socialEmail: data.email })
    this.props.onChange(this.state)
  }

  render() {
    const FbBtn = (
      <FacebookLogin
        appId={environment.facebookKey}
        autoLoad={false}
        fields="name,email,picture"
        onClick={this.componentClicked}
        callback={this.responseFacebook}
        cssClass={style.fbBtn}
        textButton="Sign in with facebook"
        icon={<FontAwesomeIcon className={style.faIcon} icon={faFacebookSquare} />}
      />
    )

    return FbBtn
  }
}

export default FacebookButton
