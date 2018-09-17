import React, { Component } from 'react'

import BaseModal from '~base/components/base-modal'
import RoleForm from './form'

class CreateRole extends Component {
  constructor (props) {
    super(props)

    this.state = {}
  }

  render () {
    return (
      <BaseModal
        title='Create Role'
        className={this.props.className}
        hideModal={() => this.props.hideModal()}
      >
        <RoleForm
          baseUrl='/admin/roles'
          url={this.props.url}
          finishUp={(data) => this.props.finishUp(data)}
        />
      </BaseModal>
    )
  }
}

export default CreateRole
