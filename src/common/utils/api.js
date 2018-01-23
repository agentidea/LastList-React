import axios from 'axios'

export const API_ROOT = 'https://api.lastlist.com/api'

function getUrl(endpoint) {
  // if it's an external call
  if (endpoint.startsWith('http')) {
    return endpoint
  }

  return `${API_ROOT}/${endpoint}`
}

export const optionsToParameterizedUrl = options => {
  const keyValues = Object.keys(options)
    .sort()
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(options[key])}`)
    .join('&')

  return keyValues ? `?${keyValues}` : ''
}

/**
 * Sends a request to the API and returns a promise with camelized response
 */
export default (async function callApi(endpoint, jwt, { method = 'GET', body = null } = {}) {
  if (!endpoint) throw new Error('No endpoint is given')

  // If it is an absolute url.
  const url = getUrl(endpoint)

  const options = { url, method }

  if (jwt) {
    options.headers = {
      Authorization: `Bearer ${jwt}`,
    }
  }

  if (body) {
    if (method === 'GET' && body != null) {
      // Convert body to ?x=y&b=a format
      options.url += optionsToParameterizedUrl(body)
    } else {
      options.data = body
    }
  }

  const result = await axios(options)
  return result.data
})
