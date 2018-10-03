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
    return (
      <div className={styles.content}>
        <h3>STEP 3: NOMINATE YOUR GUARDIANS</h3>
        <p>
          <b>Your Guardians are a very important part of the process.</b> They’re the people you
          trust to step up and get your Last List from us when you head into the great beyond.
        </p>
        <p>
          <b>You can add up to 5 Guardians and change them whenever you feel like it.</b> (You never
          know, your best friend might decide to renounce technology.)
        </p>
        <p>
          <b>
            We’ll send your Guardians an email telling them they've been chosen and exactly what
            they have to do to get your Last List from us.
          </b>
          We can’t stop them from taking a sneak peak, and you probably won’t mind, but we'll cc you
          on the email anyway so you can chat to them about it.
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
