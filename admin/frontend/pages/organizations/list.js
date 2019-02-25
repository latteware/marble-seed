import React from 'react'
import Link from '~base/router/link'
import moment from 'moment'
import env from '~base/env-variables'

import ListPageComponent from '~base/list-page-component'
import { loggedIn } from '~base/middlewares/'
import CreateOrganization from './create'

class OrganizationList extends ListPageComponent {
  finishUp (data) {
    this.props.history.push(env.PREFIX + '/manage/organizations/' + data.uuid)
  }

  getColumns () {
    return [
      {
        'title': 'Name',
        'property': 'name',
        'default': 'N/A',
        'sortable': true,
        formatter: (row) => {
          return (
            <Link to={'/manage/organizations/' + row.uuid}>
              {row.name}
            </Link>
          )
        }
      },
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
          return <Link className='button' to={'/manage/organizations/' + row.uuid}>
            Detalle
          </Link>
        }
      }
    ]
  }

  getFilters () {
    const schema = {
      name: {
        widget: 'TextWidget',
        name: 'name',
        placeholder: 'Por nombre'
      }
    }

    return schema
  }

  exportFormatter (row) {
    return { name: row.name }
  }
}

OrganizationList.config({
  name: 'organization-list',
  path: '/manage/organizations',
  title: 'Organizations',
  icon: 'users',
  exact: true,
  validate: loggedIn,

  headerLayout: 'create',
  createComponent: CreateOrganization,
  createComponentLabel: 'New Organization',

  apiUrl: '/admin/organizations'
})

export default OrganizationList
