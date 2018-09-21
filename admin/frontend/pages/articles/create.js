import React, { Component } from 'react'
import { branch } from 'baobab-react/higher-order'
import PropTypes from 'baobab-react/prop-types'
import api from '~base/api'

import BaseModal from '~base/components/base-modal'
import ArticleForm from './form'

var initialState = {
  title: '',
  description: ''
}

class CreateArticle extends Component {
  constructor (props) {
    super(props)
    this.hideModal = this.props.hideModal.bind(this)
  }

  componentWillMount () {
    this.cursor = this.context.tree.select(this.props.branchName)
  }

  async load () {
    const body = await api.get('/admin/groups', {
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
        title='Crear artículo'
        className={this.props.className}
        hideModal={this.hideModal}
      >
        <ArticleForm
          baseUrl='/articles'
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
        </ArticleForm>
      </BaseModal>
    )
  }
}

CreateArticle.contextTypes = {
  tree: PropTypes.baobab
}

const BranchedCreateArticle = branch((props, context) => {
  return {
    data: props.branchName
  }
}, CreateArticle)

export default BranchedCreateArticle
