import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import requireLogin from '../../../common/hocs/requireLogin'
import * as guardiansActionCreators from '../../../common/state/guardians/actions'

import Loading from '../../../common/components/Loading'

import apiRequest from '../../../common/utils/api'
import styles from './PrePayment.module.css'
import GuardiansList from './GuardiansList'
import Invoice from './Invoice'
import Button from '../../../common/components/Button'

const mapStateToProps = state => ({
  guardians: state.guardians.guardians,
  loading: state.guardians.loading,
  invoice: state.invoice,
})
const mapDispatchToProps = dispatch => ({
  guardiansActions: bindActionCreators(guardiansActionCreators, dispatch),
})

class RegPrePayment extends Component {
  state = {
    goingnext: false,
    loadingInvoice: false,
    error: null,
  }

  goNext = () => {
    //$to do: auto-save / prompt if dirty
    //$to do: why is history undefined here????
    const { history } = this.props
    history.push('/reg/payment')
  }

  componentDidMount() {
    var jwt = this.props.user.jwt

    this.props.guardiansActions.fetchUserGuardians()
    this.getInvoice(jwt)
  }

  async getInvoice(id) {
    try {
      this.setState({ loadingInvoice: true })
      const data = await apiRequest(`user/invoice/${id}`, id)
      this.setState({ invoice: data.invoice, loadingInvoice: false })
    } catch (e) {
      let message = 'Unknown error ' + e.message
      if (e.response && e.response.data && e.response.data.error_type) {
        message = e.response.data.message
      }
      this.setState({ loadingInvoice: false, error: message })
    }
  }

  render() {
    const { loading, guardians, goingnext } = this.props
    const { loadingInvoice, invoice } = this.state

    return (
      <div className={styles.content}>
        <h3>FINISH UP</h3>
        <p>Checkout with a credit card or Apple Pay and you're done!</p>
        <h4> Your Last List</h4>
        <h4>{loadingInvoice ? 'loading' : <Invoice invoice={invoice} />}</h4>

        {loading ? (
          <div className={styles.loaderContainer}>
            <Loading />
          </div>
        ) : guardians.length === 0 ? (
          <p />
        ) : (
          <GuardiansList guardians={guardians} />
        )}
        <Button className={styles.next} onClick={this.goNext}>
          {goingnext ? 'Next: Payment' : 'Next: Payment'}
        </Button>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(requireLogin(RegPrePayment))
