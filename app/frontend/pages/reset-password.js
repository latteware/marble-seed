import React, { Component } from 'react'

import Page from '~base/page'
import api from '~base/api'
import MarbleForm from '~base/components/marble-form'

const schema = {
  'email': {
    'widget': 'EmailWidget',
    'label': 'Email',
    'required': true
  }
}

class ResetPassword extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false,
      formData: {
        email: ''
      },
      apiCallMessage: 'is-hidden',
      apiCallErrorMessage: 'is-hidden'
    }
  }

  async submitHandler (formData) {
    await api.post('/user/reset-password', formData)

    setTimeout(() => {
      this.props.history.push('/log-in', {})
    }, 2000)
  }

  render () {
    return (
      <div className='LogIn single-form'>
        <div className='card'>
          <header className='card-header'>
            <p className='card-header-title'>
              Reset Password
            </p>
            <a className='card-header-icon'>
              <span className='icon'>
                <i className='fa fa-angle-down' />
              </span>
            </a>
          </header>
          <div className='card-content'>
            <div className='content'>
              <p>
                We need your email address for us to send you a password reset
                link:
              </p>
              <MarbleForm
                schema={schema}
                formData={this.state.formData}
                onSubmit={(data) => this.submitHandler(data)}
                buttonLabel='Send reset password link'
                defaultSuccessMessage='Reset password email sent!'
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Page({
  path: '/password/forgotten',
  title: 'Reset Password',
  exact: true,
  component: ResetPassword
})
