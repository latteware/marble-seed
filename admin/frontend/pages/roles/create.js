import React, { Component } from 'react'
import { branch } from 'baobab-react/higher-order'
import PropTypes from 'baobab-react/prop-types'
import api from '~base/api'

import BaseModal from '~base/components/base-modal'
import RoleForm from './form'

var initialState = {
  name: '',
  description: ''
}

class CreateRole extends Component {
  constructor (props) {
    super(props)
    this.hideModal = this.props.hideModal.bind(this)
  }

  componentWillMount () {
    this.cursor = this.context.tree.select(this.props.branchName)
  }

  async load () {
    const body = await api.get('/admin/roles', {
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

  render () {
    return (
      <BaseModal
        title='Create Role'
        className={this.props.className}
        hideModal={this.hideModal}
      >
        <RoleForm
          baseUrl='/admin/roles'
          url={this.props.url}
          finishUp={this.props.finishUp}
          initialState={initialState}
          load={this.load.bind(this)}
        >
          <div className='field is-grouped'>
            <div className='control'>
              <button className='button is-primary'>Create</button>
            </div>
            <div className='control'>
              <button className='button' onClick={this.hideModal}>Cancel</button>
            </div>
          </div>
        </RoleForm>
      </BaseModal>
    )
  }
}

CreateRole.contextTypes = {
  tree: PropTypes.baobab
}

const BranchedCreateRole = branch((props, context) => {
  return {
    data: props.branchName
  }
}, CreateRole)

export default BranchedCreateRole
