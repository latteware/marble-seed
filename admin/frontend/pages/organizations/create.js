import React, { Component } from 'react'

import BaseModal from '~base/components/base-modal'
import OrganizationForm from './form'

class CreateOrganization extends Component {
  constructor (props) {
    super(props)

    this.state = {}
  }

  render () {
    return (
      <BaseModal
        title='Create Organization'
        className={this.props.className}
        hideModal={() => this.props.hideModal()}
      >
        <OrganizationForm
          baseUrl='/admin/organizations'
          url={this.props.url}
          finishUp={(data) => this.props.finishUp(data)}
          label='Create'
        />
      </BaseModal>
    )
  }
}

export default CreateOrganization
