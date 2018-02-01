import React, { Component, Fragment } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import requireLogin from '../../common/hocs/requireLogin'
import * as listsActionCreators from '../../common/state/lists/actions'
import Loading from '../../common/components/Loading'
import Textfield from '../../common/components/Textfield'
import Button from '../../common/components/Button'
import styles from './EditLastList.module.css'

const mapStateToProps = state => ({
  lists: state.lists.lists,
  loading: state.lists.loading,
  saving: state.lists.saving,
})
const mapDispatchToProps = dispatch => ({
  listsActions: bindActionCreators(listsActionCreators, dispatch),
})
export class CreateFirstLastList extends Component {
  componentDidMount() {
    this.props.listsActions.fetchUserLists()
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

  render() {
    const { lists, loading, saving } = this.props
    return (
      <div className={styles.content}>
        <h4>Step Two</h4>
        <h3>Create Your Last List</h3>
        <p>
          Get started by curating a set of 10 songs for 99&#162;. You might have loads of songs that
          you love, so your Last List can include as many sets as you like and you can edit it
          whenever you want to.
        </p>
        {loading ? (
          <div className={styles.loaderContainer}>
            <Loading />
          </div>
        ) : (
          <Fragment>
            <div>{lists.map((l, i) => this.renderList(l, i))}</div>
            <div className={styles.buttons}>
              {this.shouldShowAddSongs() && (
                <Button className={styles.addMoreBtn} onClick={this.props.listsActions.addNewList}>
                  Add another 10 songs
                </Button>
              )}
              <Button
                className={styles.saveBtn}
                onClick={this.props.listsActions.saveUserList}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </Fragment>
        )}
      </div>
    )
  }

  renderList(list, listIndex) {
    return (
      <div key={listIndex} className={styles.list}>
        {list.map((item, index) => (
          <div key={index} className={styles.listRow}>
            <Textfield
              label={index === 0 ? 'Artist Name' : null}
              placeholder="Artist Name"
              value={item.artistName}
              onChange={value => this.props.listsActions.setListItemArtist(listIndex, index, value)}
            />
            <Textfield
              label={index === 0 ? 'Song Title' : null}
              placeholder="Song Title"
              value={item.songName}
              onChange={value => this.props.listsActions.setListItemSong(listIndex, index, value)}
            />
          </div>
        ))}
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(requireLogin(EditLastList))
