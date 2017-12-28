import { Component } from 'react'
import { withRouter } from 'react-router-dom'

/* THis component's goal is just to scroll to top when displaying a new page */
class ScrollToTop extends Component {
  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      window.scrollTo(0, 0)
    }
  }

  render() {
    return this.props.children
  }
}

export default withRouter(ScrollToTop)
