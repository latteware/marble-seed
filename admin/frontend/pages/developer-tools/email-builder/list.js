import React from 'react'
import Link from '~base/router/link'
import moment from 'moment'

import ListPageComponent from '~base/list-page-component'
import { loggedIn } from '~base/middlewares/'
import CreateEmail from './create'

class EmailList extends ListPageComponent {
  getColumns () {
    return [
      {
        'title': 'Name',
        'property': 'name',
        'default': 'N/A',
        'sortable': true,
        formatter: (row) => {
          return (
            <Link to={'/devtools/email-builder/' + row.uuid}>
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
        'sortable': false,
        formatter: (row) => {
          return <Link className='button' to={'/devtools/email-builder/' + row.uuid}>
            Detalle
          </Link>
        }
      }
    ]
  }

  getFilters () {
    const data = {
      schema: {
        type: 'object',
        required: [],
        properties: {
          name: { type: 'text', title: 'Por nombre' }
        }
      },
      uiSchema: {
        name: { 'ui:widget': 'SearchFilter' }
      }
    }

    return data
  }

  exportFormatter (row) {
    return { name: row.name }
  }
}

EmailList.config({
  name: 'email-builder',
  path: '/devtools/email-builder',
  icon: 'envelope-open',
  title: 'Email Builder',
  breadcrumbs: [
    { label: 'Dashboard', path: '/' },
    { label: 'Developer tools' },
    { label: 'Email builder' }
  ],
  exact: true,
  validate: loggedIn,
  apiUrl: '/admin/emails',
  headerLayout: 'create',
  createComponent: CreateEmail,
  createComponentLabel: 'New email'
})

export default EmailList
