import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import requireLogin from '../../../common/hocs/requireLogin'
import * as guardiansActionCreators from '../../../common/state/guardians/actions'
import Loading from '../../../common/components/Loading'
import styles from './Guardians.module.css'
import main_styles from '../../../App.module.css'
import GuardiansList from './GuardiansList'
import AddGuardian from './AddGuardian'
import gAnalyticsPageView from '../../../common/utils/googleAnalytics'
import { guardians_dictionary } from '../../../common/dictionaries/GuardiansDictionary'
import Button from '../../../common/components/Button'

const mapStateToProps = state => ({
  guardians: state.guardians.guardians,
  loading: state.guardians.loading,
})
const mapDispatchToProps = dispatch => ({
  guardiansActions: bindActionCreators(guardiansActionCreators, dispatch),
})

class RegGuardians extends Component {
  state = {
    need_to_add_more: false,
  }

  componentDidMount() {
    gAnalyticsPageView()

    this.props.guardiansActions.fetchUserGuardians()

    setTimeout(() => {
      this.user_has_guardians()
    }, 200)
  }

  user_has_guardians = () => {
    const { guardians, user } = this.props
    let status =
      user.states && user.states.find(item => item === 'made_payment') && guardians.length > 0
    this.setState({ need_to_add_more: !status })
  }

  show_add_more = () => {
    this.setState({ need_to_add_more: true })
  }

  goNext = () => {
    const { history } = this.props
    history.push('/reg/pre-payment')
  }

  render() {
    const { loading, guardians, user } = this.props
    const { need_to_add_more } = this.state

    let serverStates = user.states
    let step =
      serverStates && serverStates.find(item => item === 'made_payment') ? 'returning' : 'new'
    const presentation = guardians_dictionary[step]

    return (
      <div className={main_styles.grey_bg}>
        <div style={{ height: need_to_add_more ? 'auto' : '700px' }}>
          <div className={styles.text}>
            <h3>{presentation.heading}</h3>
            <p className={styles.heading_primary}>
              <b>{presentation.heading_primary}</b>
            </p>

            <div
              className={styles.main_text}
              dangerouslySetInnerHTML={{ __html: presentation.main_text }}
            />

            {loading ? (
              <div className={styles.loaderContainer}>
                <Loading />
              </div>
            ) : guardians.length === 0 ? (
              <p />
            ) : (
              <div className="">
                <GuardiansList
                  guardians={guardians}
                  onRemoveGuardian={uuid => this.props.guardiansActions.removeGuardian(uuid)}
                />
                <span
                  className={styles.need_more}
                  style={{ display: need_to_add_more ? 'none' : '' }}
                  onClick={this.show_add_more}
                >
                  Add guardians?
                </span>

                <div
                  className={styles.btn_wrap}
                  style={{ display: need_to_add_more ? 'none' : '' }}
                >
                  <Button className={styles.nextBtn} onClick={this.goNext}>
                    Next: payment
                  </Button>
                </div>
              </div>
            )}

            <div className="" style={{ display: need_to_add_more ? '' : 'none' }}>
              <AddGuardian history={this.props.history} guardians={guardians} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(requireLogin(RegGuardians))
