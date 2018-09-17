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

class EmailInviteLanding extends Component {
  constructor (props) {
    super(props)
    this.state = {
      errors: {},
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

    const data = await api.post('/emails/invite/validate', tokenData)

    this.setState({
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

    return data
  }

  successHandler (data) {
    window.localStorage.setItem('jwt', data.jwt)
    tree.set('jwt', data.jwt)
    tree.set('user', data.user)
    tree.set('loggedIn', true)
    tree.commit()

    setTimeout(() => {
      this.props.history.push('/app', {})
    }, 2000)
  }

  render () {
    return (
      <div className='Invited single-form'>
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
                You need to create a password
                before you can log in.
              </p>
              <MarbleForm
                schema={schema}
                onChange={(data) => this.changeHandler(data)}
                onSubmit={(data) => this.submitHandler(data)}
                onSucess={(data) => this.successHandler(data)}
                errors={this.state.errors}
                buttonLabel='Create password'
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Page({
  path: '/emails/invite',
  title: 'Email invite',
  exact: true,
  component: EmailInviteLanding
})
