import React, { Component } from 'react'
import { branch } from 'baobab-react/higher-order'
import PropTypes from 'baobab-react/prop-types'
import moment from 'moment'
import api from '~base/api'

import Page from '~base/page'
import {loggedIn} from '~base/middlewares/'
import { BranchedPaginatedTable } from '~base/components/base-paginatedTable'

class Deleted{{ name | pluralize | capitalize }} extends Component {
  constructor (props) {
    super(props)
  }

  componentWillMount () {
    this.context.tree.set('deleted{{ name | pluralize | capitalize }}', {
      page: 1,
      totalItems: 0,
      items: [],
      pageLength: 10
    })
    this.context.tree.commit()
  }

  getColumns () {
    return [
      {% for item in fields %}
      {
        'title': '{{ item.name | capitalize }}',
        'property': '{{ item.name }}',
        'default': 'N/A',
        'sortable': true
      },
      {% endfor %}
      {
        'title': 'Created',
        'property': 'dateCreated',
        'default': 'N/A',
        'sortable': true,
        formatter: (row) => {
          return (
            moment.utc(row.dateCreated).local().format('DD/MM/YYYY hh:mm a')
          )
        }
      },
      {
        'title': 'Actions',
        formatter: (row) => {
          return (
            <button className='button' onClick={e => { this.restoreOnClick(row.uuid) }}>
              Restore
            </button>
          )
        }
      }
    ]
  }

  async restoreOnClick (uuid) {
    var url = '/admin/{{ name | pluralize | lower }}/restore/' + uuid
    const {{ name | lower }} = await api.post(url)

    this.props.history.push('/admin/{{ name | pluralize | lower }}/detail/' + uuid)
  }

  render () {
    return (
      <div className='columns c-flex-1 is-marginless'>
        <div className='column is-paddingless'>
          <div className='section is-paddingless-top'>
            <h1 className='is-size-3 is-padding-top-small is-padding-bottom-small'>Deleted {{ name | pluralize | capitalize }}</h1>
            <div className='card'>
              <div className='card-content'>
                <div className='columns'>
                  <div className='column'>
                    <BranchedPaginatedTable
                      branchName='deleted{{ name | pluralize | lower }}'
                      baseUrl='/admin/{{ name | pluralize | lower }}/deleted'
                      columns={this.getColumns()}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

Deleted{{ name | pluralize | capitalize }}.contextTypes = {
  tree: PropTypes.baobab
}

const branchedDeleted{{ name | pluralize | capitalize }} = branch({deleted{{ name | pluralize | capitalize }}: 'deleted{{ name | pluralize | capitalize }}'}, Deleted{{ name | pluralize | capitalize }})

export default Page({
  path: '/{{ name | pluralize | lower }}/deleted',
  title: 'Deleted {{ name | pluralize | capitalize }}',
  icon: 'trash',
  exact: true,
  validate: loggedIn,
  component: branchedDeleted{{ name | pluralize | capitalize }}
})
