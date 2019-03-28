import React, { Component } from 'react'

import styles from './PaymentSuccess.module.css'
import SongList from '../../common/components/SongList'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as listsActionCreators from '../../common/state/lists/actions'
import requireLogin from '../../common/hocs/requireLogin'
import main_styles from '../../App.module.css'

const mapStateToProps = state => ({
  lists: state.lists.lists,
})
const mapDispatchToProps = dispatch => ({
  listsActions: bindActionCreators(listsActionCreators, dispatch),
})

export class PaymentSuccess extends Component {
  componentDidMount(): void {
    this.props.listsActions.fetchUserLists()
  }

  render() {
    const { lists, user } = this.props
    return (
      <div className={main_styles.grey_bg}>
        <div className={styles.main_content}>
          <div className={styles.content}>
            <h3>Payment Successful!</h3>
          </div>
          <div className={styles.songs}>
            <h4>Last List</h4>
            {lists.map((l, i) => PaymentSuccess.renderList(l, i))}
          </div>
          <span className={styles.paid}>
            Paid: <span>${user.payment}</span>
          </span>
        </div>
      </div>
    )
  }

  static renderList(list, listIndex) {
    return (
      <div key={listIndex} className={styles.list}>
        {list.map((item, index) => <SongList key={index} listItem={item} controls={false} />)}
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(requireLogin(PaymentSuccess))
