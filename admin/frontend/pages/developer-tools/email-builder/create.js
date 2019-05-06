import React, { Component } from 'react'

import BaseModal from '~base/components/base-modal'
import EmailForm from './form'

class CreateEmail extends Component {
  constructor (props) {
    super(props)

    this.state = {}
  }

  render () {
    return (
      <BaseModal
        title='New email'
        className={this.props.className}
        hideModal={() => this.props.hideModal()}
      >
        <EmailForm
          baseUrl='/admin/emails'
          url={this.props.url}
          finishUp={(data) => this.props.finishUp(data)}
          label={'Create'}
        />
      </BaseModal>
    )
  }
}

export default CreateEmail
