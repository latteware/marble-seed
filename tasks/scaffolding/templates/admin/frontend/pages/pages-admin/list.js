import React from 'react'
import Link from '~base/router/link'
import moment from 'moment'

import env from '~base/env-variables'
import ListPageComponent from '~base/list-page-component'
import {loggedIn} from '~base/middlewares/'
import Create{{ name | capitalize }} from './components/create-button'

class {{ name | capitalize }}List extends ListPageComponent {
  finishUp (data) {
    this.setState({
      className: ''
    })

    this.props.history.push(env.PREFIX + '/{{ name | lower }}s/' + data.uuid)
  }

  getColumns () {
    return [
      {% for item in fields -%}
        {
          title: '{{ item.name | capitalize }}',
          property: '{{ item.name | lower }}',
          default: 'N/A'
        },
      {% endfor -%}
      {
        'title': 'Created',
        'property': 'createdAt',
        'default': 'N/A',
        'sortable': true,
        formatter: (row) => {
          return (
            moment.utc(row.createdAt).local().format('DD/MM/YYYY hh:mm a')
          )
        }
      },
      {
        'title': 'Actions',
        'sortable': false,
        formatter: (row) => {
          return <Link className='button' to={'/{{ name | lower }}s/' + row.uuid}>
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
          {% for item in fields -%}
            {{ item.name | lower }} : {type: 'text', title: '{{ item.name | capitalize }}'},
          {% endfor -%}
        }
      },
      uiSchema: {
        {% for item in fields -%}
          {{ item.name | lower }} : {'ui:widget': 'SearchFilter'},
        {% endfor -%}
      }
    }

    return data
  }

  exportFormatter (row) {
    return {
    {%- for item in fields -%}
        {{ item.name | lower }}: row.{{ item.name | lower }},
      {% endfor -%}
    }
  }
}

{{ name | capitalize }}List.config({
  name: '{{ name | lower }}s-list',
  path: '/{{ name | lower }}s',
  title: '{{ name | capitalize }}s',
  icon: 'clipboard',
  exact: true,
  validate: loggedIn,

  headerLayout: 'create',
  createComponent: Create{{ name | capitalize }},
  createComponentLabel: 'New {{ name | capitalize }}',

  apiUrl: '/admin/{{ name | lower }}s'
})

export default {{ name | capitalize }}List
