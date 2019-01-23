import React, { Component, Fragment } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import requireLogin from '../../../common/hocs/requireLogin'
import * as listsActionCreators from '../../../common/state/lists/actions'
import Loading from '../../../common/components/Loading'
import Button from '../../../common/components/Button'
import styles from './EditLastList.module.css'
import gAnalyticsPageView from '../../../common/utils/googleAnalytics'
import SongAdd from '../../../common/components/SongAdd'
import SongList from '../../../common/components/SongList'
import SongApiSearch from '../../../common/components/SongApiSearch'

const mapStateToProps = state => ({
  lists: state.lists.lists,
  loading: state.lists.loading,
  saving: state.lists.saving,
  saved: state.lists.saved,
})
const mapDispatchToProps = dispatch => ({
  listsActions: bindActionCreators(listsActionCreators, dispatch),
})
export class CreateFirstLastList extends Component {
  state = {
    openSearch: false,
    artist: '',
    song: '',
    note: '',
  }

  componentDidMount() {
    gAnalyticsPageView()

    this.props.listsActions.fetchUserLists()
    this.setState({ ...this.props.currentProfile, saved: false, loaded: true }) // see if user had previously saved a list ( aka edit_list )
  }

  shouldShowAddSongs = () => {
    const { lists } = this.props
    if (lists && lists.length > 0) {
      const lastList = lists[lists.length - 1]
      const nonEmptySongs = lastList.filter(item => item.artistName !== '' || item.songName !== '')
      return nonEmptySongs.length === 10
    }
    return false
  }

  goNext = () => {
    //$to do: auto-save / prompt if dirty
    const { history } = this.props
    this.props.listsActions.saveUserList() // save first then continue
    history.push('/reg/add-guardian')
  }

  goBack = () => {
    const { history } = this.props
    history.goBack()
  }

  shouldShowBackButton() {
    return false
  }

  saveButtonClicked = () => {
    //pass dispatch getState() ?????
    this.props.listsActions.saveUserList()
  }

  shouldShowNextButton() {
    //$to do: have to refresh page here to get the state on save
    //look for previously saved a list
    const { saved } = this.props
    if (saved && saved === true) return true

    let serverStates = this.props.user.states
    if (serverStates && serverStates.length > 0) {
      const hasList = serverStates.find(item => item === 'edit_list')
      return hasList === 'edit_list'
    }
    return false
  }

  toggleSearch = () => {
    let { openSearch } = this.state
    this.setState({ openSearch: !openSearch })
  }

  fromSearchAddSong = item => {
    this.setState({
      artist: item === null ? '' : item.artist,
      song: item === null ? '' : item.title,
      note: item === null ? '' : item.note,
      openSearch: false,
    })
  }

  render() {
    const { lists, loading, saving } = this.props
    let serverStates = this.props.user.states
    let heading =
      serverStates && serverStates.find(item => item === 'made_payment')
        ? 'ADD YOUR SONGS'
        : 'STEP 2: CREATE YOUR LAST LIST'

    return (
      <div className={styles.content}>
        <h3>{heading}</h3>
        <div className={styles.text}>
          <p>Add a set of 10 songs for $1. </p>
          <p>
            Got more than 10 favorite songs? No problem. You can add as many sets as you want and
            change them whenever you feel like it.
          </p>
        </div>
        {loading ? (
          <div className={styles.loaderContainer}>
            <Loading />
          </div>
        ) : (
          <Fragment>
            <SongAdd
              onSongAdd={this.props.listsActions.setListItem}
              toggleSearch={this.toggleSearch}
              {...this.state}
              {...this.props}
            />

            <div className={styles.buttons}>
              {this.shouldShowBackButton() && (
                <Button className={styles.backBtn} onClick={this.goBack}>
                  Back
                </Button>
              )}

              {this.shouldShowAddSongs() && (
                <Button className={styles.addMoreBtn} onClick={this.props.listsActions.addNewList}>
                  Add Another 10 Songs
                </Button>
              )}

              <Button className={styles.saveBtn} onClick={this.saveButtonClicked} disabled={saving}>
                {saving ? 'Saving...' : 'Save'}
              </Button>

              {this.shouldShowNextButton() && (
                <Button className={styles.nextBtn} onClick={this.goNext}>
                  Next: Choose Your Guardians
                </Button>
              )}
            </div>

            <div>{lists.map((l, i) => this.renderList(l, i))}</div>
          </Fragment>
        )}
        <SongApiSearch
          {...this.state}
          toggleSearch={this.toggleSearch}
          fromSearchAddSong={this.fromSearchAddSong}
        />
      </div>
    )
  }

  renderList(list, listIndex) {
    return (
      <div key={listIndex} className={styles.list}>
        {list.map((item, index) => (
          <SongList
            key={index}
            listItem={item}
            fromSearchAddSong={this.fromSearchAddSong}
            removeSong={this.props.listsActions.removeListItem}
            controls={true}
          />
        ))}
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(requireLogin(CreateFirstLastList))
