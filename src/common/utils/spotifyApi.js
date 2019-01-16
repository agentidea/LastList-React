import { environment } from '../../environment/environment'

export const authToken = () => {
  return fetch('https://accounts.spotify.com/api/token', {
    mode: 'no-cors',
    body: 'grant_type=client_credentials',
    headers: {
      Authorization:
        'Basic ' +
        window.btoa(environment.spotifyCLIENT_ID + ':' + environment.spotifyCLIENT_SECRET),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    method: 'POST',
  })
    .then(response => {
      return response.json()
    })
    .then(body => {
      return body.access_token
    })
}

export const search = async search => {
  const token = await authToken().then(token => {
    return token
  })

  try {
    const searchOptions = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    return fetch('https://api.spotify.com/v1/search?q=' + search + '&type=track', searchOptions)
      .then(res => {
        return res.json()
      })
      .then(tracks => {
        return tracks
      })
  } catch (e) {
    console.log('Search Failure | ', e)
    return []
  }
}

/**
 * authenticate via Spotify
 * @param token
 * @returns {Promise<any | never>}
 * @constructor
 */
export const OAuth = token => {
  try {
    return fetch('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => {
        return response.json()
      })
      .then(body => {
        return body.email
      })
  } catch (e) {
    console.log('ERROR | ', e)
  }
}
