import apiRequest from './api'

const API_KEY = '044cef0d4f360d8a13a6bbb40e7e91b9'

export const search = async query => {
  const data = await apiRequest('https://ws.audioscrobbler.com/2.0/', null, {
    body: {
      method: 'track.search',
      api_key: API_KEY,
      format: 'json',
      track: query,
      page: 1,
      limit: 10,
    },
  })
  if (!data || !data.results) return []
  return data.results.trackmatches.track.map(t => ({
    artist: t.artist,
    title: t.name,
  }))
}
