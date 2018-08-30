import React, { Component } from 'react'
import { branch } from 'baobab-react/higher-order'
import PropTypes from 'baobab-react/prop-types'

import env from '~base/env-variables'
import api from '~base/api'
import BaseModal from '~base/components/base-modal'
import UserForm from './form'

class CreateUser extends Component {
  constructor (props) {
    super(props)

    this.hideModal = this.props.hideModal.bind(this)
    this.state = {
      roles: []
    }
  }

  componentWillMount () {
    this.cursor = this.context.tree.select(this.props.branchName)
    this.loadRoles()
  }

  async load () {
    const body = await api.get('/admin/users', {
      start: 0,
      limit: this.cursor.get('pageLength') || 10
    })

    this.cursor.set({
      page: 1,
      totalItems: body.total,
      items: body.data,
      pageLength: this.cursor.get('pageLength') || 10
    })

    this.context.tree.commit()
  }

  async loadRoles () {
    var url = '/admin/roles/'
    const body = await api.get(url, {
      start: 0,
      limit: 0
    })

    this.setState({
      ...this.state,
      roles: body.data
    })
  }

  render () {
    let mode, title
    if (env.EMAIL_SEND) {
      title = 'Invite user'
      mode = 'invite'
    } else {
      mode = 'password'
      title = 'Create user'
    }

    let modalContent = <UserForm
      baseUrl='/admin/users'
      url={'/admin/users/'}
      mode={mode}
      finishUp={(data) => this.props.finishUp(data)}
      roles={this.state.roles || []}
    />

    return (
      <BaseModal
        title={title}
        className={this.props.className}
        hideModal={this.hideModal}
      >
        {modalContent}
      </BaseModal>
    )
  }
}

CreateUser.contextTypes = {
  tree: PropTypes.baobab
}

const BranchedCreateUser = branch((props, context) => {
  return {
    data: props.branchName
  }
}, CreateUser)

export default BranchedCreateUser
