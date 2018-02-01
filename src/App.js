import React, { Component } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { loggedInSelector } from './common/state/user/selectors'
import * as userActionCreators from './common/state/user/actions'
import ScrollToTop from './common/components/ScrollToTop'
import Background from './common/components/Background'
import Header from './common/components/Header'
import Footer from './common/components/Footer'
import Home from './pages/Home'
import Contact from './pages/Contact'
import EditLastList from './pages/EditLastList'
import EditProfile from './pages/EditProfile'
import EmailConfirmation from './pages/EmailConfirmation'
import Faq from './pages/Faq'
import GuardianAccess from './pages/GuardianAccess'
import Guardians from './pages/Guardians'
import LastList from './pages/LastList'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Payment from './pages/Payment'
import PaymentSuccess from './pages/PaymentSuccess'
import Four04 from './pages/Four04'
import styles from './App.module.css'

import RegLogin from '/pages/Registration/Login-step-0'
import NewProfile from '/pages/Registration/CreateNewProfile-step-1'
import CreateFirstLastList from '/pages/Registration/CreateLastList-step-2'
import RegAddGuardian from '/pages/Registration/AddGuardian-step-3'
import RegPayment from '/pages/Registration/Payment-step-4'
import RegWelcome from '/pages/registration/WelcomeMember-step-5' 



const mapStateToProps = state => ({
  isLoggedIn: loggedInSelector(state),
})
const mapDispatchToProps = dispatch => ({
  userActions: bindActionCreators(userActionCreators, dispatch),
})

class App extends Component {
  componentDidMount() {
    if (this.props.isLoggedIn) {
      this.props.userActions.getCurrentUser()
    }
  }

  render() {
    const { isLoggedIn } = this.props
    return <Router>
        <ScrollToTop>
          <div className={styles.app}>
            <Background />
            <div className={styles.main}>
              <Header isLoggedIn={isLoggedIn} />
              <div className={styles.content}>
                <Switch>
                  <Route exact path="/" component={Home} />
                  <Route path="/confirmation/:code" component={EmailConfirmation} />
                  <Route path="/contact" component={Contact} />
                  <Route path="/edit-list" component={EditLastList} />
                  <Route path="/edit-profile" component={EditProfile} />
                  <Route path="/faq" component={Faq} />
                  <Route path="/guardian" component={GuardianAccess} />
                  <Route path="/guardians" component={Guardians} />
                  <Route path="/lastlist/:id" component={LastList} />
                  <Route path="/login" component={Login} />
                  <Route path="/payment" component={Payment} />
                  <Route path="/payment-success" component={PaymentSuccess} />
                  <Route path="/signup" component={Signup} />

                  <Route path="/reg/login" component={RegLogin} />
                  <Route path="/reg/create-profile" component={NewProfile} />
                  <Route path="/reg/create-list" component={CreateFirstLastList} />
                  <Route path="/reg/add-guardian" component={RegAddGuardian} />
                  <Route path="/reg/payment" component={RegPayment} />

                  <Route default component={Four04} />
                </Switch>
              </div>
              <Footer />
            </div>
          </div>
        </ScrollToTop>
      </Router>
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
