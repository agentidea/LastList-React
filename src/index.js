import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Background from './common/components/Background'
import Header from './common/components/Header'
import Footer from './common/components/Footer'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import registerServiceWorker from './registerServiceWorker'
import './global.css'
import styles from './App.module.css'

const App = () => (
  <Router>
    <div className={styles.app}>
      <Background />
      <div className={styles.main}>
        <Header />
        <div className={styles.content}>
          <Route exact path="/" component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Signup} />
        </div>
        <Footer />
      </div>
    </div>
  </Router>
)

ReactDOM.render(<App />, document.getElementById('root'))
registerServiceWorker()
