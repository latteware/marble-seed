import React, { Component } from 'react'
import api from '~base/api'
import tree from '~core/tree'
import Page from '~base/page'
import {forcePublic} from '~base/middlewares/'

import {BaseForm, PasswordWidget, EmailWidget, TextWidget} from '~components/base-form'

const schema = {
  type: 'object',
  required: ['email', 'password', 'screenName', 'name'],
  properties: {
    name: {type: 'string', title: 'Name'},
    screenName: {type: 'string', title: 'ScreenName'},
    email: {type: 'string', title: 'Email'},
    password: {type: 'string', title: 'Password'}
  }
}

const uiSchema = {
  name: { 'ui:widget': TextWidget },
  screenName: { 'ui:widget': TextWidget },
  email: { 'ui:widget': EmailWidget },
  password: { 'ui:widget': PasswordWidget }
}

class SignUp extends Component {
  constructor (props) {
    super(props)
    this.state = {
      formData: {
        name: '',
        screenName: '',
        email: '',
        password: ''
      },
      apiCallErrorMessage: 'is-hidden',
      error: ''
    }
  }

  errorHandler (e) {}

  changeHandler ({formData}) {
    this.setState({
      formData,
      apiCallErrorMessage: 'is-hidden',
      error: ''
    })
  }

  async submitHandler ({formData}) {
    let data

    try {
      data = await api.post('/user/', formData)
    } catch (e) {
      return this.setState({
        error: e.message,
        apiCallErrorMessage: 'message is-danger',
        loading: false
      })
    }

    window.localStorage.setItem('jwt', data.jwt)
    tree.set('jwt', data.jwt)
    tree.set('user', data.user)
    tree.set('loggedIn', true)
    tree.commit()

    this.props.history.push('/app', {})
    this.setState({
      formData: {}
    })
  }

  render () {
    var error
    if (this.state.error) {
      error = <div>
        Error: {this.state.error}
      </div>
    }

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
              <BaseForm schema={schema}
                uiSchema={uiSchema}
                formData={this.state.formData}
                onSubmit={(e) => { this.submitHandler(e) }}
                onError={(e) => { this.errorHandler(e) }}
                onChange={(e) => { this.changeHandler(e) }}>
                <div>
                  <div className={this.state.apiCallErrorMessage}>
                    <div className='message-body is-size-7 has-text-centered'>
                      {error}
                    </div>
                  </div>
                  <button
                    className='button is-primary is-fullwidth'
                    type='submit'
                    disabled={!!error}
                  >
                    Sign up
                  </button>
                </div>
              </BaseForm>
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
