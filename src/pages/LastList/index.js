import React, { Component, Fragment } from 'react'

import apiRequest from '../../common/utils/api'
import Loading from '../../common/components/Loading'
import styles from './LastList.module.css'
import gAnalytics from '../../common/utils/googleAnalytics'

export class LastList extends Component {
  state = {
    firstName: '',
    lastName: '',
    songs: null,
    loading: false,
    error: null,
  }

  componentDidMount() {
    gAnalytics.gAnalyticsPageView()

    const { match } = this.props
    const { id } = match.params
    this.loadLastList(id)
  }

  async loadLastList(id) {
    try {
      this.setState({ loading: true })
      const data = await apiRequest(`guardian/lastlist/${id}`)

      // merge all lists songs
      const songs = data.lists.reduce((acc, item) => [...acc, ...item], [])
      this.setState({
        songs,
        firstName: data.firstName,
        lastName: data.lastName,
        loading: false,
      })
    } catch (e) {
      let message = 'Unknown error ' + e.message
      if (e.response && e.response.data && e.response.data.error_type) {
        message = e.response.data.message
      }
      this.setState({ loading: false, error: message })
    }
  }

  render() {
    const { firstName, lastName, loading } = this.state
    return (
      <div className={styles.all_wrap}>
        <div className={styles.content}>
          {!loading ? <h3>{`${firstName} ${lastName}'s`} Last List</h3> : null}
          {this.renderLists()}
        </div>
      </div>
    )
  }

  renderLists() {
    const { songs, firstName, loading, error } = this.state
    if (loading)
      return (
        <div className={styles.loaderContainer}>
          <Loading />
        </div>
      )
    if (error) return <div className={styles.error}>{error}</div>

    return (
      <Fragment>
        <div className={styles.introWrap}>
          <p className={styles.intro}>
            Here is a list of songs that {firstName} made for you and all the other people they
            loved. We’ve emailed you a copy. If you don’t have specific instructions, here’s what
            you need to do.
          </p>

          <ol>
            <li>Make a playlist of these songs</li>
            <li>Play it at your loved one’s end-of-life celebration</li>
            <li>Share it with the people they love</li>
          </ol>

          <p>
            How you do this is up to you. If you can’t find all of their songs, use
            Playlist-converter.net iTunes, Spotify, Pandora or another music streaming service. You
            can save the list onto a thumb drive, smartphone or other digital device (Or even go old
            school and burn them onto a CD)
          </p>
        </div>

        <div className={styles.headerWrapper}>
          <h4>Last List</h4>
          {songs && (
            <span className={styles.songsCount}>
              &nbsp; ( {songs.length} {songs.length === 1 ? 'song' : 'songs'} )
            </span>
          )}
        </div>
        {songs && songs.length > 0 ? (
          <table className={styles.songsTable}>
            <thead>
              <tr>
                <th>Artist</th>
                <th>Song Title</th>
                <th>Reason Why</th>
              </tr>
            </thead>
            <tbody>
              {songs.map((song, songIndex) => (
                <tr key={songIndex}>
                  <td>{song.artistName}</td>
                  <td>{song.songName}</td>
                  <td>{song.note ? song.note : '-'}</td>
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
