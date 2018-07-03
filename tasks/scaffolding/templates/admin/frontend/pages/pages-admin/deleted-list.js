import React, {Component} from 'react'

import env from '~base/env-variables'
import api from '~base/api'
import ListPageComponent from '~base/list-page-component'
import {loggedIn} from '~base/middlewares/'

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
      const url = `/admin/{{ name | lower }}s/${row.uuid}/restore`
      await api.post(url)
    }

    this.props.reload()
  }

  render () {
    const { selectedRows } = this.props

    return <header className='card-header'>
      <p className='card-header-title'>
        Restore {{ name | lower }}s
      </p>
      <div className='card-header-select'>
        <button
          className='button is-primary'
          onClick={() => this.restoreMultiple()}
          disabled={selectedRows.length === 0}
          >
          Restore multiple {{ name | lower }}s
        </button>
      </div>
    </header>
  }
}

class {{ name | capitalize }}sDeletedList extends ListPageComponent {
  async restoreOnClick (uuid) {
    const url = `/admin/{{ name | lower }}s/${uuid}/restore`
    await api.post(url)
    this.props.history.push(env.PREFIX + '/{{ name | lower }}s/' + uuid)
  }

  getFilters () {
    const data = {
      schema: {
        type: 'object',
        required: [],
        properties: {
          {% for item in fields -%}
            {{ item.name | lower }}: {type: 'text', title: '{{ item.name | capitalize }}'},
          {% endfor -%}
        }
      },
      uiSchema: {
        {% for item in fields -%}
          {{ item.name | lower }}: {'ui:widget': 'SearchFilter'},
        {% endfor -%}
      }
    }

    return data
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

{{ name | capitalize }}sDeletedList.config({
  // Basic values
  name: '{{ name | lower }}-deleted-list',
  path: '/{{ name | lower }}s/deleted',
  title: 'Deactivated {{ name | lower }}s',
  icon: 'clipboard',
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
  apiUrl: '/admin/{{ name | lower }}s'
})

export default {{ name | capitalize }}sDeletedList
