import React, {Component} from 'react'

import './style.scss'

class ErrorPage extends Component {
  render () {
    return (
      <div className='container-not-found'>
        <div className='boo-wrapper'>
          <div className='boo'>
            <div className='face' />
          </div>
          <div className='shadow' />
          <h1>Oops!</h1>
          <p>{this.props.message || ''}</p>
        </div>
      </div>
    )
  }
}

export default ErrorPage
