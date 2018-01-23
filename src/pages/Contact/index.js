import React from 'react'
import { Link } from 'react-router-dom'

const Contact = () => {
  return (
    <div>
      <h3>Contact Us</h3>
      <p>
        If you have any questions, please take a look at our <Link to="/faq">FAQs</Link> or email us
        at <a href="mailto:grantsteinfeld@gmail.com">@lastlist</a>.
      </p>
    </div>
  )
}

export default Contact
