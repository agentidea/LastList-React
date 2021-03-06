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
    const { firstName, lastName } = this.state
    return (
      <div>
        <h3>{`${firstName} ${lastName}'s`} Last list</h3>
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
          Here is a list of {`${firstName}`} ’s favorite songs. We’ve emailed you a copy too.
        </p>
        <p className={styles.intro}>
          You now have the very important role of carrying out their musical wishes.
        </p>
        <p className={styles.paraLeft}> Here's how:</p>

        <ul>
          <li>
            <b>Make a playlist of these songs </b>
            <br />
            If you don’t have all of the songs, ask friends or family or use Playlist-converter.net,
            iTunes, Spotify, Pandora or another music streaming service.
          </li>

          <li>
            <b>Save the list onto a thumb drive, smartphone, computer or other digital device </b>
            <br />
            You can even go old school and burn them onto a CD!
          </li>

          <li>
            <b>Make sure that this Last List is played at your loved one's final celebration </b>
            Whether it’s a pizza party, wake, memorial or cremation.{' '}
          </li>
          <li>
            <b>Share this Last List with others.</b>
          </li>
        </ul>

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
