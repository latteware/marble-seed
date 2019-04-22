import React, { Component } from 'react'

import MarbleForm from '~base/components/marble-form'
import api from '~base/api'

class UserForm extends Component {
  constructor (props) {
    super(props)

    const schema = {
      'name': {
        'label': 'Name',
        'default': '',
        'id': 'name',
        'name': 'name',
        'widget': 'TextWidget',
        'required': true
      },
      'email': {
        'widget': 'EmailWidget',
        'name': 'email',
        'label': 'Email',
        'required': true
      },
      'screenName': {
        'widget': 'TextWidget',
        'name': 'screenname',
        'label': 'Screen name',
        'required': true
      },
      'isAdmin': {
        'widget': 'CheckboxWidget',
        'name': 'isAdmin',
        'label': 'Is Admin?'
      },
      'role': {
        'widget': 'SelectWidget',
        'name': 'role',
        'label': 'Role',
        'allowEmpty': true,
        'options': []
      }
    }

    const initialState = this.props.initialState || {}

    const formData = {}
    formData.name = initialState.name || ''
    formData.email = initialState.email || ''
    formData.screenName = initialState.screenName || ''
    formData.isAdmin = initialState.isAdmin || false
    formData.role = initialState.role || ''

    this.state = {
      formData,
      schema,
      errors: {}
    }
  }

  errorHandler (e) {}

  changeHandler (formData) {
    let errors = {}
    if (formData.password && formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords don\'t match'
    }

    this.setState({
      formData,
      errors
    })
  }

  async submitHandler (formData) {
    const res = await api.post(this.props.url, formData)

    if (this.props.load) {
      await this.props.load()
    }

    return res.data
  }

  successHandler (data) {
    if (this.props.finishUp) { this.props.finishUp(data) }
  }

  render () {
    const { schema } = this.state
    schema.role.options = this.props.roles.map(item => {
      return { label: item.name, value: item.uuid }
    })

    let successMessage, formData

    let buttonLabel = 'Update'
    if (this.props.mode === 'invite') {
      schema.sendInvite = {
        type: 'Boolean',
        widget: 'HiddenWidget',
        default: true
      }
      successMessage = 'User was invited correctly'
      buttonLabel = 'Invite'
    } else if (this.props.mode === 'password') {
      schema.password = {
        type: 'String',
        widget: 'PasswordWidget',
        label: 'Password',
        required: true
      }

      schema.confirmPassword = {
        type: 'String',
        widget: 'PasswordWidget',
        label: 'Confirm password',
        required: true
      }

      buttonLabel = 'Create'
    } else if (this.props.mode === 'update') {
      formData = this.state.formData
      successMessage = 'User was updated correctly'
    }

    return (
      <div>
        <MarbleForm
          schema={schema}
          formData={formData}
          buttonLabel={buttonLabel}
          onChange={(data) => this.changeHandler(data)}
          onSuccess={(data) => this.successHandler(data)}
          onSubmit={(data) => this.submitHandler(data)}
          defaultSuccessMessage={successMessage}
          errors={this.state.errors}
        />
      </div>
    )
  }
}

export default UserForm
