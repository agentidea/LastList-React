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
    show_add_more: false,
    show_next: false,
  }

  componentDidMount() {
    gAnalyticsPageView()

    this.props.listsActions.fetchUserLists()
    this.setState({ ...this.props.currentProfile, saved: false, loaded: true }) // see if user had previously saved a list ( aka edit_list )
  }

  componentWillReceiveProps(nextProps, nextContext) {
    setTimeout(() => {
      this.shouldShowAddSongs()
      this.shouldShowNextButton()
    }, 100) // delay for obvious react reasons
  }

  shouldShowAddSongs = () => {
    const { lists } = this.props
    if (lists && lists.length > 0) {
      this.setState({ show_add_more: lists[0].length > 0 && lists[0].length % 10 === 0 })
      return
    }
    this.setState({ show_add_more: false })
  }

  goNext = () => {
    const { history } = this.props
    this.props.listsActions.saveUserList().then(data => {
      data === 200 ? history.push('/reg/add-guardian') : null
    })
  }

  goBack = () => {
    const { history } = this.props
    history.goBack()
  }

  static shouldShowBackButton() {
    return false
  }

  shouldShowNextButton() {
    //$to do: have to refresh page here to get the state on save
    //look for previously saved a list
    const { saved, lists } = this.props
    if (saved && saved === true) {
      this.setState({ show_next: true })
      return
    }

    if (lists && lists.length > 0) {
      this.setState({ show_next: lists[0].length > 0 })
      return
    }
    this.setState({ show_next: false })
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

  shouldAddMore = () => {
    this.setState({ show_add_more: false })
  }

  render() {
    const { lists, loading, saving, user } = this.props
    const { show_add_more, show_next } = this.state
    let serverStates = user.states
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
              {CreateFirstLastList.shouldShowBackButton() && (
                <Button className={styles.backBtn} onClick={this.goBack}>
                  Back
                </Button>
              )}

              {show_add_more ? (
                <Button className={styles.addMoreBtn} onClick={this.shouldAddMore}>
                  Add Another 10 Songs
                </Button>
              ) : (
                <div>&nbsp;</div>
              )}

              {show_next ? (
                <Button className={styles.nextBtn} onClick={this.goNext}>
                  {saving ? 'Saving...' : 'Next: Choose Your Guardians'}
                </Button>
              ) : null}
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
