import React, {Component} from 'react'

import './style.scss'

class ErrorPage extends Component {
  render () {
    let message = <p>{this.props.message || ''}</p>

    if (this.props.method && this.props.url) {
      message = <p>
        [{this.props.method.toUpperCase()}] {this.props.url} <br />
        <b>{this.props.status}</b> {this.props.message}
      </p>
    }

    return (
      <div className='container-not-found'>
        <div className='boo-wrapper'>
          <div className='boo'>
            <div className='face' />
          </div>
          <div className='shadow' />
          <h1>Oops!</h1>
          {message}
        </div>
      </div>
    )
  }
}

export default ErrorPage
