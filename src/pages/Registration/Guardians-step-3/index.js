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
    let heading =
      serverStates && serverStates.find(item => item === 'made_payment')
        ? 'NOMINATE YOUR GUARDIANS'
        : 'STEP 3: CHOOSE YOUR GUARDIANS'

    return (
      <div className={styles.text}>
        <h3>{heading}</h3>
        <p>
          <b>Who do you trust with your tunes?</b>
        </p>
        <p>
          You can choose up to five Guardians of your Last List. They’ll be responsible for getting
          it from us when you die. We’ll send them a message telling them all about it and cc you so
          you’re in the loop.
        </p>
        <p>
          You can change your Guardians whenever you feel like it. We won’t share any of your or
          their information.
        </p>

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
