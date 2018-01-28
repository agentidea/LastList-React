import React, { Component, Fragment } from 'react'

import apiRequest from '../../common/utils/api'
import Loading from '../../common/components/Loading'
import styles from './LastList.module.css'

export class LastList extends Component {
  state = {
    firstName: '',
    lastName: '',
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
      const data = await apiRequest(`/guardian/lastlist/${id}`)

      // merge all lists songs
      const songs = data.lists.reduce((acc, item) => [...acc, ...item], [])
      this.setState({
        songs,
        firstName: data.firstName,
        lastName: data.lastName,
        loading: false,
      })
    } catch (e) {
      let message = 'Unknown error'
      if (e.response && e.response.data && e.response.data.error_type) {
        message = e.response.data.message
      }
      this.setState({ loading: false, error: message })
    }
  }

  render() {
    const { firstName, lastName } = this.state
    return (
      <div>
        <h3>{`${firstName} ${lastName}`} Last list</h3>
        {this.renderLists()}
      </div>
    )
  }

  renderLists() {
    const { songs, firstName, lastName, loading, error } = this.state
    if (loading)
      return (
        <div className={styles.loaderContainer}>
          <Loading />
        </div>
      )
    if (error) return <div className={styles.error}>{error}</div>

    return (
      <Fragment>
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
        {songs && songs.length > 0 ? (
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
        ) : (
          <div className={styles.noSongs}>No songs found.</div>
        )}
      </Fragment>
    )
  }
}

export default LastList
