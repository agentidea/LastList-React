import { API_ROOT } from './api'

/*TODO: SAVE TOKEN FOR 3600s THEN FLUSH IT FOR A NEW ONE (BYPASS THIS UNTIL 3600s)*/
export const authToken = () => {
  return fetch(API_ROOT + '/spotify/')
    .then(response => {
      return response.json()
    })
    .then(body => {
      return body.data
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
