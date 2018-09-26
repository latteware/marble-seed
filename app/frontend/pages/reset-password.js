import React from 'react'
import PageComponent from '~base/page-component'

import api from '~base/api'
import MarbleForm from '~base/components/marble-form'

const schema = {
  'email': {
    'widget': 'EmailWidget',
    'label': 'Email',
    'required': true
  }
}

class ResetPassword extends PageComponent {
  constructor (props) {
    super(props)
    this.state = {
      ...this.baseState
    }
  }

  async submitHandler (formData) {
    await api.post('/user/reset-password', formData)
  }

  successHandler () {
    setTimeout(() => {
      this.props.history.push('/log-in', {})
    }, 2000)
  }

  render () {
    const basicStates = super.getBasicStates()
    if (basicStates) { return basicStates }

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
                onSuccess={(data) => this.successHandler(data)}
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

ResetPassword.config({
  path: '/password/forgotten',
  title: 'Reset Password',
  exact: true,
  component: ResetPassword
})

export default ResetPassword
