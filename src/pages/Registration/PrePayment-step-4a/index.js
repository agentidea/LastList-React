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
import ReactModal from 'react-modal'
import logo from '../../../common/components/Header/logo.png'
import StripeCardForm from './StripePayment'
import PayPalButton from '../../../common/components/PayPalButton'
import gAnalyticsPageView from '../../../common/utils/googleAnalytics'
import * as listsActionCreators from '../../../common/state/lists/actions'
import main_styles from '../../../App.module.css'

const mapStateToProps = state => ({
  guardians: state.guardians.guardians,
  invoice: state.invoice.data,
  loadingInvoice: state.invoice.loading,
  lists: state.lists.lists,
})
const mapDispatchToProps = dispatch => ({
  invoiceActions: bindActionCreators(invoiceActionCreators, dispatch),
  listsActions: bindActionCreators(listsActionCreators, dispatch),
})

class RegPrePayment extends Component {
  state = {
    goingnext: false,
    showModal: false,
  }

  /* handle modal open */
  handleOpenModal() {
    this.setState({ showModal: true })
  }

  /* handle modal close */
  handleCloseModal() {
    this.setState({ showModal: false })
  }

  /* action pay with card / stripe */
  openPayment = () => {
    this.handleOpenModal()
  }

  goBack = () => {
    const { history } = this.props
    history.goBack()
  }

  componentDidMount() {
    gAnalyticsPageView()

    this.props.invoiceActions.getInvoice()
    this.props.listsActions.fetchUserLists()
    this.handleOpenModal = this.handleOpenModal.bind(this)
    this.handleCloseModal = this.handleCloseModal.bind(this)
  }

  render() {
    const { guardians, goingnext, invoice, loadingInvoice, user } = this.props
    let serverStates = user.states
    let heading =
      serverStates && serverStates.find(item => item === 'made_payment')
        ? 'Summary & Payment'
        : 'Step 4: Finish up'

    return (
      <div className={main_styles.grey_bg}>
        <div className={styles.content}>
          <h3>{heading}</h3>

          <h4 className={styles.mini_header}> Your Last List</h4>
          <h4 className={styles.invoice}>
            {loadingInvoice ? <Loading /> : <Invoice invoice={invoice} />}
          </h4>

          <GuardiansList guardians={guardians} />

          <div className={styles.buttons}>
            <Button className={styles.backBtn} onClick={this.goBack}>
              Back
            </Button>
            {invoice.due === 0 ? (
              <div style={{ fontWeight: 'bold' }}>Payment already done!</div>
            ) : null}

            {invoice.due === 0 ? null : (
              <div className={styles.payButtonsWrap}>
                <PayPalButton elements={{ amount: invoice }} />
                <Button
                  disabled={invoice.due === 0}
                  className={styles.nextBtn}
                  onClick={this.openPayment}
                >
                  {goingnext ? 'Pay via Stripe' : 'Pay via Stripe'}
                </Button>
              </div>
            )}
          </div>
        </div>

        <ReactModal
          isOpen={this.state.showModal}
          contentLabel="onRequestClose Example"
          onRequestClose={this.handleCloseModal}
          className="Modal"
          overlayClassName="Overlay"
        >
          <div className={styles.stripeTopHeader}>
            <span className="modalCloseContainer" onClick={this.handleCloseModal}>
              &times;
            </span>
            <div className="logoContainer">
              <img src={logo} alt="Last List" width="106" height="109" />
            </div>
          </div>
          <StripeCardForm elements={{ handleCloseModal: this.handleCloseModal, amount: invoice }} />
        </ReactModal>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(requireLogin(RegPrePayment))
