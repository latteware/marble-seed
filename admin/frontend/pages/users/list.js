import React from 'react'

import env from '~base/env-variables'
import Link from '~base/router/link'
import api from '~base/api'
import ListPageComponent from '~base/list-page-component'
import {loggedIn} from '~base/middlewares/'
import CreateUser from './create'

class UserList extends ListPageComponent {
  async onFirstPageEnter () {
    const organizations = await this.loadOrgs()

    return {organizations}
  }

  async loadOrgs () {
    var url = '/admin/organizations/'
    const body = await api.get(url, {
      start: 0,
      limit: 0
    })

    return body.data
  }

  async deleteObject (row) {
    await api.del('/admin/users/' + row.uuid)
    this.reload()
  }

  finishUp (data) {
    this.props.history.push(env.PREFIX + '/manage/users/' + data.uuid)
  }

  getFilters () {
    const data = {
      schema: {
        type: 'object',
        required: [],
        properties: {
          screenName: {type: 'text', title: 'Por nombre'},
          email: {type: 'text', title: 'Por email'},
          organization: {type: 'text', title: 'Por organización', values: []}
        }
      },
      uiSchema: {
        screenName: {'ui:widget': 'SearchFilter'},
        email: {'ui:widget': 'SearchFilter'},
        organization: {'ui:widget': 'SelectSearchFilter'}
      }
    }

    if (this.state.organizations) {
      data.schema.properties.organization.values = this.state.organizations.map(item => { return {uuid: item.uuid, name: item.name} })
    }

    return data
  }

  exportFormatter (row) {
    return {name: row.name, email: row.email}
  }

  getColumns () {
    return [
      {
        'title': 'Screen name',
        'property': 'screenName',
        'default': 'N/A',
        'sortable': true
      },
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
            <div className='field is-grouped'>
              <div className='control'>
                <Link className='button' to={'/manage/users/' + row.uuid}>
                  Detalle
                </Link>
              </div>
            </div>
          )
        }
      }
    ]
  }
}

UserList.config({
  name: 'user-list',
  path: '/manage/users',
  title: 'Users',
  icon: 'user',
  exact: true,
  validate: loggedIn,

  headerLayout: 'create',
  createComponent: CreateUser,
  createComponentLabel: 'New User',

  apiUrl: '/admin/users'
})

export default UserList
