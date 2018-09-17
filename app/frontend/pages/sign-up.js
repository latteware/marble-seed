import React, { Component } from 'react'
import api from '~base/api'
import tree from '~core/tree'
import Page from '~base/page'
import {forcePublic} from '~base/middlewares/'

import MarbleForm from '~base/components/marble-form'

const schema = {
  name: {
    widget: 'TextWidget',
    label: 'Name',
    required: true
  },
  screenName: {
    widget: 'TextWidget',
    label: 'Screen name',
    required: true
  },
  email: {
    widget: 'EmailWidget',
    label: 'Email',
    required: true
  },
  password: {
    widget: 'PasswordWidget',
    required: true,
    label: 'Password'
  }
}

class SignUp extends Component {
  constructor (props) {
    super(props)
    this.state = {
      formData: {}
    }
  }

  async submitHandler (formData) {
    const data = await api.post('/user/', formData)

    window.localStorage.setItem('jwt', data.jwt)
    tree.set('jwt', data.jwt)
    tree.set('user', data.user)
    tree.set('loggedIn', true)
    tree.commit()

    this.props.history.push('/app', {})
  }

  render () {
    return (
      <div className='SignUp single-form'>
        <div className='card'>
          <header className='card-header'>
            <p className='card-header-title'>
              SignUp
            </p>
            <a className='card-header-icon'>
              <span className='icon'>
                <i className='fa fa-angle-down' />
              </span>
            </a>
          </header>
          <div className='card-content'>
            <div className='content'>
              <MarbleForm
                schema={schema}
                onSubmit={(e) => { this.submitHandler(e) }}
                buttonLabel='Sign up'
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Page({
  path: '/sign-up',
  title: 'Sign Up',
  exact: true,
  validate: forcePublic,
  component: SignUp
})
