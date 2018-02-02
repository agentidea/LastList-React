import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import requireLogin from '../../common/hocs/requireLogin'
import * as guardiansActionCreators from '../../common/state/guardians/actions'
import Loading from '../../common/components/Loading'
import styles from './Guardians.module.css'
import GuardiansList from './GuardiansList'
import AddGuardian from './AddGuardian'

const mapStateToProps = state => ({
  guardians: state.guardians.guardians,
  loading: state.guardians.loading,
})
const mapDispatchToProps = dispatch => ({
  guardiansActions: bindActionCreators(guardiansActionCreators, dispatch),
})

class Guardians extends Component {
  componentDidMount() {
    this.props.guardiansActions.fetchUserGuardians()
  }

  render() {
    const { loading, guardians } = this.props
    return (
      <div className={styles.content}>
        <h3>Manage your guardians</h3>
        <p>
          Your Guardian(s) will be responsible for getting your Last List from us when the time has
          come. We’ll let them know via email that they’ve been chosen by you to fulfill this
          important role. You can add up to 5 Guardians and change them as many times as you want
          to.
        </p>
        <h4>Your guardians</h4>
        {loading ? (
          <div className={styles.loaderContainer}>
            <Loading />
          </div>
        ) : guardians.length === 0 ? (
          <p>You don't have guardians at the moment</p>
        ) : (
          <GuardiansList
            guardians={guardians}
            onRemoveGuardian={uuid => this.props.guardiansActions.removeGuardian(uuid)}
          />
        )}
        <h4>Add a guardian</h4>
        <AddGuardian />
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(requireLogin(Guardians))
