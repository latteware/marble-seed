import React, { Component } from 'react'

import env from '~base/env-variables'
import api from '~base/api'
import ListPageComponent from '~base/list-page-component'
import { loggedIn } from '~base/middlewares/'

class Header extends Component {
  constructor (props) {
    super(props)

    this.state = {
      loaded: false,
      currentCustomersHappiness: ''
    }
  }

  async restoreMultiple () {
    const { selectedRows } = this.props

    for (const row of selectedRows) {
      var url = '/admin/users/deleted/' + row.uuid
      await api.post(url)
    }

    this.props.reload()
  }

  render () {
    const { selectedRows } = this.props

    return <header className='card-header'>
      <p className='card-header-title'>
        Restore users
      </p>
      <div className='card-header-select'>
        <button
          className='button is-primary'
          onClick={() => this.restoreMultiple()}
          disabled={selectedRows.length === 0}
        >
          Restore multiple users
        </button>
      </div>
    </header>
  }
}

class UserDeletedList extends ListPageComponent {
  async onFirstPageEnter () {
    const organizations = await this.loadOrgs()

    return { organizations }
  }

  async loadOrgs () {
    var url = '/admin/organizations/'
    const body = await api.get(url, {
      start: 0,
      limit: 0
    })

    return body.data
  }

  async restoreOnClick (uuid) {
    var url = '/admin/users/deleted/' + uuid
    await api.post(url)
    this.props.history.push(env.PREFIX + '/manage/users/' + uuid)
  }

  getFilters () {
    const schema = {
      name: {
        widget: 'TextWidget',
        name: 'name',
        placeholder: 'By name'
      },
      email: {
        widget: 'TextWidget',
        name: 'email',
        placeholder: 'By email'
      },
      organization: {
        widget: 'SelectWidget',
        name: 'organization',
        placeholder: 'By organization',
        options: []
      }
    }

    if (this.state.organizations) {
      schema.organization.options = this.state.organizations.map(item => {
        return { value: item.uuid, label: item.name }
      })
    }

    return schema
  }

  getColumns () {
    return [
      {
        'title': 'Name',
        'property': 'name',
        'default': 'N/A',
        'sortable': true
      },
      {
        'title': 'Email',
        'property': 'email',
        'default': 'N/A',
        'sortable': true
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
}

UserDeletedList.config({
  // Basic values
  name: 'user-deleted-list',
  path: '/manage/users/deleted',
  title: 'Deactivated users',
  icon: 'user',
  exact: true,
  validate: loggedIn,

  // Selectable and custom header
  selectable: true,
  headerLayout: 'custom',
  headerComponent: Header,

  // default filters
  defaultFilters: {
    isDeleted: true
  },

  // Api url to fetch from
  apiUrl: '/admin/users'
})

export default UserDeletedList
