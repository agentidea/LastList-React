import React, { Component } from 'react'
import style from './SpotifyButton.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpotify } from '@fortawesome/free-brands-svg-icons'
import { environment } from '../../../environment/environment'
import Button from '../Button'
import { OAuth } from '../../utils/spotifyApi'

class SpotifyButton extends Component {
  state = {
    isFacebook: true,
    socialEmail: '',
  }

  componentDidMount() {
    this.authenticate()
  }

  authenticate = () => {
    let params_list = new URLSearchParams(window.location.hash.substr(1))
    if (
      !(
        params_list.has('access_token') &&
        params_list.has('token_type') &&
        params_list.get('token_type') === 'Bearer'
      )
    ) {
      return
    }

    let token = params_list.get('access_token')
    OAuth(token).then(result => {
      console.log(result)
      if (result === 400) {
        return
      }
      this.props.setSocialAuth({ socialEmail: result })
    })
  }

  handleClick = () => {
    const client_id = encodeURIComponent(environment.spotifyCLIENT_ID)
    const redirect_uri = encodeURIComponent(environment.spotifyREDIRECT_URI)
    const scope = encodeURIComponent('user-read-private user-read-email')
    const state = encodeURIComponent('generateRandomString(12)')

    const url = `https://accounts.spotify.com/authorize?response_type=token&client_id=${client_id}&scope=${scope}&redirect_uri=${redirect_uri}&state=${state}`

    window.location = url
  }

  render() {
    const SfyBtn = (
      <Button className={style.btn} onClick={this.handleClick}>
        <FontAwesomeIcon className={style.faIcon} icon={faSpotify} />Sign in with Spotify
      </Button>
    )

    return SfyBtn
  }
}

export default SpotifyButton
