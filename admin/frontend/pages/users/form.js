import React, { Component } from 'react'

import MarbleForm from '~base/components/marble-form'
import api from '~base/api'

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

class UserForm extends Component {
  constructor (props) {
    super(props)

    const initialState = this.props.initialState || {}

    const formData = {}
    formData.name = initialState.name || ''
    formData.email = initialState.email || ''
    formData.screenName = initialState.screenName || ''
    formData.isAdmin = initialState.isAdmin || false
    formData.role = initialState.role || ''

    this.state = {
      formData,
      errorMessage: '',
      successMessage: ''
    }
  }

  errorHandler (e) {}

  changeHandler ({formData}) {
    this.setState({
      formData
    })
  }

  async submitHandler (formData) {
    var data = await api.post(this.props.url, formData)
    await this.props.load()

    if (this.props.finishUp) {
      this.props.finishUp(data.data)
    }
  }

  render () {
    schema.role.options = this.props.roles.map(item => {
      return {label: item.name, value: item.uuid}
    })

    return (
      <div>
        <MarbleForm
          schema={schema}
          formData={this.state.formData}
          onSubmit={async (data) => { await this.submitHandler(data) }}
          defaultSuccessMessage={'User was updated correctly'}
        >
          {this.props.children}
        </MarbleForm>
      </div>
    )
  }
}

export default UserForm
