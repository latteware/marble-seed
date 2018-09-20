import React, { Component } from 'react'

import BaseModal from '~base/components/base-modal'
import {{ name | capitalize }}Form from './form'

class Create{{ name | capitalize }} extends Component {
  constructor (props) {
    super(props)

    this.state = {}
  }

  render () {
    return (
      <BaseModal
        title='Create {{ name | capitalize }}'
        className={this.props.className}
        hideModal={() => this.hideModal()}
      >
        <{{ name | capitalize }}Form
          baseUrl='/admin/{{ name }}s'
          url={this.props.url}
          finishUp={(data) => this.props.finishUp(data)}
          label='Create'
        />
      </BaseModal>
    )
  }
}

export default Create{{ name | capitalize }}
