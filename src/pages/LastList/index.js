import React, { Component } from 'react'

import apiRequest from '../../common/utils/api'
import Loading from '../../common/components/Loading'
import styles from './LastList.module.css'

export class LastList extends Component {
  state = {
    firstName: 'Jane',
    lastName: 'Doe',
    songs: null,
    loading: false,
    error: null,
  }

  componentDidMount() {
    const { match } = this.props
    const { id } = match.params
    this.loadLastList(id)
  }

  async loadLastList(id) {
    try {
      this.setState({ loading: true })
      const data = await apiRequest(`user/getLists/${id}`)

      // merge all lists songs
      const songs = data.reduce((acc, item) => [...acc, ...item], [])
      this.setState({ songs, loading: false })
    } catch (e) {
      let message = 'Unknown error'
      if (e.response && e.response.data && e.response.data.error_type) {
        message = e.response.data.message
      }
      this.setState({ loading: false, error: message })
    }
  }

  render() {
    const { firstName, lastName, songs } = this.state
    return (
      <div>
        <h3>{`${firstName} ${lastName}`} Last list</h3>
        <p className={styles.intro}>
          Here are the songs {`${firstName} ${lastName}`} has chosen to have played at their
          memorial, wake or funeral, and share with their loved ones. We've emailed you a copy for
          your records.
        </p>
        <div className={styles.headerWrapper}>
          <h4>Last List</h4>
          {songs && (
            <div className={styles.songsCount}>
              {songs.length} {songs.length === 1 ? 'song' : 'songs'}
            </div>
          )}
        </div>
        {this.renderLists()}
      </div>
    )
  }

  renderLists() {
    const { songs, loading, error } = this.state
    if (loading)
      return (
        <div className={styles.loaderContainer}>
          <Loading />
        </div>
      )
    if (error) return <div className={styles.error}>{error}</div>
    if (!songs || songs.length === 0) return 'No songs found.'

    return (
      <table className={styles.songsTable}>
        <thead>
          <tr>
            <th>Artist</th>
            <th>Song Title</th>
          </tr>
        </thead>
        <tbody>
          {songs.map((song, songIndex) => (
            <tr key={songIndex}>
              <td>{song.artistName}</td>
              <td>{song.songName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }
}

export default LastList
