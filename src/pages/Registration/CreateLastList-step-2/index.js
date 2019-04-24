import React, { Component, Fragment } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import requireLogin from '../../../common/hocs/requireLogin'
import * as listsActionCreators from '../../../common/state/lists/actions'
import Loading from '../../../common/components/Loading'
import Button from '../../../common/components/Button'
import styles from './EditLastList.module.css'
import gAnalytics from '../../../common/utils/googleAnalytics'
import SongAdd from '../../../common/components/SongAdd'
import SongList from '../../../common/components/SongList'
import main_styles from '../../../App.module.css'

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
    need_to_add_more: false,
  }

  componentDidMount() {
    gAnalytics.gAnalyticsPageView()

    this.props.listsActions.fetchUserLists()
    this.setState({ ...this.props.currentProfile, saved: false, loaded: true }) // see if user had previously saved a list ( aka edit_list )

    setTimeout(() => {
      this.user_has_songs()
    }, 100)
  }

  componentWillReceiveProps(nextProps, nextContext) {
    setTimeout(() => {
      this.shouldShowAddSongs()
      this.shouldShowNextButton()
    }, 100) // delay for obvious react reasons
  }

  user_has_songs = () => {
    const { lists, user } = this.props
    let status =
      user.states &&
      user.states.find(item => item === 'made_payment') &&
      (lists && lists.length > 0)
    this.setState({ need_to_add_more: !status })
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
    })
  }

  shouldAddMore = () => {
    this.setState({ show_add_more: false })
  }

  actionRemoveSong = track => {
    const { lists } = this.props
    this.props.listsActions.removeListItem(track)

    //on remove last item, save deletion
    if (lists && lists.length > 0 && lists[0].length === 0) {
      this.props.listsActions.saveUserList().then(() => {
        setTimeout(() => {
          this.setState({ show_next: false })
        }, 100)
      })
    }
  }

  show_add_more = () => {
    this.setState({ need_to_add_more: true })
  }

  render() {
    const { lists, loading, saving, user } = this.props
    const { show_add_more, show_next, need_to_add_more } = this.state
    let serverStates = user.states
    let heading = 'Create your Last List'
    let info_text =
      "Add up to 10 songs for $1.<br />You can add more songs and sets, and change them, whenever you feel like it. If you can't find a song in the database, just type it in."

    if (serverStates && serverStates.find(item => item === 'made_payment')) {
      heading = 'Add or change your songs'
      info_text = ''
    }

    return (
      <div className={main_styles.grey_bg}>
        <div className={styles.content}>
          <h3>{heading}</h3>
          <div className={styles.text} style={{ display: info_text === '' ? 'none' : '' }}>
            <p dangerouslySetInnerHTML={{ __html: info_text }} />
          </div>
          {loading ? (
            <div className={styles.loaderContainer}>
              <Loading />
            </div>
          ) : (
            <Fragment>
              <div className={styles.mini_container}>
                <div className="" style={{ display: need_to_add_more ? '' : 'none' }}>
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
                        Add another 10 songs
                      </Button>
                    ) : (
                      <div>&nbsp;</div>
                    )}

                    {show_next ? (
                      <Button className={styles.nextBtn} onClick={this.goNext}>
                        {saving ? 'Saving...' : 'Next: choose your guardians'}
                      </Button>
                    ) : null}
                  </div>
                </div>

                <div className={styles.song_list}>
                  {show_next ? <h4>Your Last List</h4> : null}

                  {lists.map((l, i) => this.renderList(l, i))}
                  <span
                    className={styles.need_more}
                    style={{ display: need_to_add_more ? 'none' : '' }}
                    onClick={this.show_add_more}
                  >
                    Add more songs?
                  </span>
                </div>
              </div>
            </Fragment>
          )}
        </div>
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
            removeSong={this.actionRemoveSong}
            controls={true}
          />
        ))}
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(requireLogin(CreateFirstLastList))
