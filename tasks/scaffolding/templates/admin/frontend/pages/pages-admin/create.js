import React, { Component } from 'react'
import { branch } from 'baobab-react/higher-order'
import PropTypes from 'baobab-react/prop-types'

import BaseModal from '~base/components/base-modal'
import {{ name | capitalize }}Form from './create-form'

var initialState = {
  {% for item in fields -%}
    {{ item.name }}: '',
  {% endfor -%}
}

class Create{{ name | capitalize }} extends Component {
  constructor (props) {
    super(props)
    this.hideModal = this.props.hideModal.bind(this)
  }

  componentWillMount () {
    this.cursor = this.context.tree.select(this.props.branchName)
  }

  render () {
    return (
      <BaseModal
        title='Create {{ name | capitalize }}'
        className={this.props.className}
        hideModal={this.hideModal}
      >
        <{{ name | capitalize }}Form
          baseUrl='/admin/{{ name | pluralize | lower }}'
          url={this.props.url}
          finishUp={this.props.finishUp}
          initialState={initialState}

        >
          <div className='field is-grouped'>
            <div className='control'>
              <button className='button is-primary'>Create</button>
            </div>
            <div className='control'>
              <button className='button' onClick={this.hideModal}>Cancel</button>
            </div>
          </div>
        </{{ name | capitalize }}Form>
      </BaseModal>
    )
  }
}

Create{{ name | capitalize }}.contextTypes = {
  tree: PropTypes.baobab
}

const BranchedCreate{{ name | capitalize }} = branch((props, context) => {
  return {
    data: props.branchName
  }
}, Create{{ name | capitalize }})

export default BranchedCreate{{ name | capitalize }}
