import React, { Component } from 'react'
import Page from '~base/page'

import tree from '~core/tree'
import api from '~base/api'

import MarbleForm from '~base/components/marble-form'

const schema = {
  'password_1': {
    'widget': 'PasswordWidget',
    'name': 'password',
    'required': true,
    'label': 'Password'
  },
  'password_2': {
    'widget': 'PasswordWidget',
    'name': 'password',
    'required': true,
    'label': 'Confirm Password'
  }
}

class EmailResetLanding extends Component {
  constructor (props) {
    super(props)
    this.state = {
      formData: {},
      user: {}
    }
  }

  componentWillMount () {
    this.verifyToken()
  }

  async verifyToken () {
    var search = decodeURIComponent(this.props.location.search)
      .substring(1)
      .split('&')
    let tokenData = {}

    for (var param of search) {
      var spl = param.split('=')
      tokenData[spl[0]] = spl[1]
    }

    var data
    try {
      data = await api.post('/emails/reset/validate', tokenData)
    } catch (e) {
      return this.setState({
        ...this.state,
        error: e.message,
        bigError: true,
        apiCallErrorMessage: 'message is-danger'
      })
    }

    this.setState({
      ...this.state,
      token: tokenData.token,
      user: data.user
    })
  }

  changeHandler (formData) {
    if (formData.password_2 && formData.password_1 !== formData.password_2) {
      this.setState({
        errors: {
          password_2: 'Passwords don\'t match'
        }
      })
    } else {
      this.setState({
        errors: {}
      })
    }
  }

  async submitHandler (formData) {
    const postData = {
      uuid: this.state.token,
      password: formData.password_1
    }

    const data = await api.post('/user/set-password', postData)

    window.localStorage.setItem('jwt', data.jwt)
    tree.set('jwt', data.jwt)
    tree.set('user', data.user)
    tree.set('loggedIn', true)
    tree.commit()

    setTimeout(() => {
      this.props.history.push('/app', {})
    }, 4000)
  }

  render () {
    const {errors} = this.state

    return (
      <div className='Reset single-form'>
        <div className='card'>
          <header className='card-header'>
            <p className='card-header-title'>
              Hi {this.state.user.screenName}!
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
                Don't worry, you can create a new password here.
              </p>
              <MarbleForm
                schema={schema}
                formData={this.state.formData}
                errors={errors}
                onSubmit={(data) => this.submitHandler(data)}
                onChange={(data) => this.changeHandler(data)}
                defaultSuccessMessage={'User was updated correctly'}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Page({
  path: '/emails/reset',
  title: 'Email reset',
  exact: true,
  component: EmailResetLanding
})
