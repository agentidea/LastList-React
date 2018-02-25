import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import requireLogin from '../../../common/hocs/requireLogin'
import Loading from '../../../common/components/Loading'
import * as invoiceActionCreators from '../../../common/state/invoice/actions'

import styles from './PrePayment.module.css'
import GuardiansList from './GuardiansList'
import Invoice from './Invoice'
import Button from '../../../common/components/Button'

const mapStateToProps = state => ({
  guardians: state.guardians.guardians,
  invoice: state.invoice.data,
  loadingInvoice: state.invoice.loading,
})
const mapDispatchToProps = dispatch => ({
  invoiceActions: bindActionCreators(invoiceActionCreators, dispatch),
})

class RegPrePayment extends Component {
  state = {
    goingnext: false,
  }

  goNext = () => {
    //$to do: auto-save / prompt if dirty
    //$to do: why is history undefined here????
    const { history } = this.props
    history.push('/reg/payment')
  }

  componentDidMount() {
    this.props.invoiceActions.getInvoice()
  }

  render() {
    // same as const guardians = this.props.guardians
    const { guardians, goingnext, invoice, loadingInvoice } = this.props

    return (
      <div className={styles.content}>
        <h3>STEP 4: SUMMARY</h3>

        <h4> Your Last List</h4>
        <h4>{loadingInvoice ? <Loading /> : <Invoice invoice={invoice} />}</h4>

        <GuardiansList guardians={guardians} />

        <div className={styles.buttons}>
          <Button className={styles.nextBtn} onClick={this.goNext}>
            {goingnext ? 'Next: Finish Up' : 'Next: Finish Up'}
          </Button>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(requireLogin(RegPrePayment))
