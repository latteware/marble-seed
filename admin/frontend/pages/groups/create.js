import React, { Component } from 'react'

import BaseModal from '~base/components/base-modal'
import GroupForm from './form'

class CreateGroup extends Component {
  constructor (props) {
    super(props)

    this.state = {}
  }

  render () {
    return (
      <BaseModal
        title='Create Group'
        className={this.props.className}
        hideModal={() => this.props.hideModal()}
      >
        <GroupForm
          baseUrl='/admin/groups'
          url={this.props.url}
          finishUp={(data) => this.props.finishUp(data)}
          label={'Create'}
        />
      </BaseModal>
    )
  }
}

export default CreateGroup
