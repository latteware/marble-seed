import React from 'react'
import Link from '~base/router/link'
import moment from 'moment'

import env from '~base/env-variables'
import ListPageComponent from '~base/list-page-component'
import { loggedIn } from '~base/middlewares/'
import CreateRole from './create'

class RoleList extends ListPageComponent {
  finishUp (data) {
    this.props.history.push(env.PREFIX + '/manage/roles/' + data.uuid)
  }

  getColumns () {
    return [
      {
        'title': 'Name',
        'property': 'name',
        'default': 'N/A',
        formatter: (row) => {
          return (
            <Link to={'/manage/roles/' + row.uuid}>
              {row.name}
            </Link>
          )
        }
      },
      {
        'title': 'Created',
        'property': 'dateCreated',
        'default': 'N/A',
        formatter: (row) => {
          return (
            moment.utc(row.dateCreated).local().format('DD/MM/YYYY hh:mm a')
          )
        }
      },
      {
        'title': 'Default',
        'property': 'isDefault',
        formatter: (row) => {
          if (row.isDefault) {
            return (
              'Yes'
            )
          }
        }
      },
      {
        'title': 'Actions',
        formatter: (row) => {
          return <Link className='button' to={'/manage/roles/' + row.uuid}>
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
        placeholder: 'By name'
      }
    }

    return schema
  }

  exportFormatter (row) {
    return { name: row.name }
  }
}

RoleList.config({
  name: 'role-list',
  path: '/manage/roles',
  title: 'Roles',
  icon: 'address-book',
  exact: true,
  validate: loggedIn,

  headerLayout: 'create',
  createComponent: CreateRole,
  createComponentLabel: 'New Role',

  apiUrl: '/admin/roles'
})

export default RoleList
