import React, { Component } from 'react'

import styles from './PaymentSuccess.module.css'
import SongList from '../../common/components/SongList'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as listsActionCreators from '../../common/state/lists/actions'
import requireLogin from '../../common/hocs/requireLogin'

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
      <div>
        <div className={styles.content}>
          <h3>Payment Successful!</h3>
        </div>
        <div>{lists.map((l, i) => PaymentSuccess.renderList(l, i))}</div>
        <h4 className={styles.paid}>
          Paid: <span>${user.payment}</span>
        </h4>
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
