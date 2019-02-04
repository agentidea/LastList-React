import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import requireLogin from '../../../common/hocs/requireLogin'
import * as guardiansActionCreators from '../../../common/state/guardians/actions'
import Loading from '../../../common/components/Loading'
import styles from './Guardians.module.css'
import GuardiansList from './GuardiansList'
import AddGuardian from './AddGuardian'
import gAnalyticsPageView from '../../../common/utils/googleAnalytics'
import { guardians_dictionary } from '../../../common/dictionaries/GuardiansDictionary'

const mapStateToProps = state => ({
  guardians: state.guardians.guardians,
  loading: state.guardians.loading,
})
const mapDispatchToProps = dispatch => ({
  guardiansActions: bindActionCreators(guardiansActionCreators, dispatch),
})

class RegGuardians extends Component {
  componentDidMount() {
    gAnalyticsPageView()

    this.props.guardiansActions.fetchUserGuardians()
  }

  render() {
    const { loading, guardians } = this.props
    let serverStates = this.props.user.states
    let step =
      serverStates && serverStates.find(item => item === 'made_payment') ? 'returning' : 'new'
    const presentation = guardians_dictionary[step]

    return (
      <div className={styles.text}>
        <h3>{presentation.heading}</h3>
        <p>
          <b>{presentation.heading_primary}</b>
        </p>

        <div dangerouslySetInnerHTML={{ __html: presentation.main_text }} />

        {loading ? (
          <div className={styles.loaderContainer}>
            <Loading />
          </div>
        ) : guardians.length === 0 ? (
          <p />
        ) : (
          <GuardiansList
            guardians={guardians}
            onRemoveGuardian={uuid => this.props.guardiansActions.removeGuardian(uuid)}
          />
        )}

        <AddGuardian history={this.props.history} guardians={guardians} />
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(requireLogin(RegGuardians))
