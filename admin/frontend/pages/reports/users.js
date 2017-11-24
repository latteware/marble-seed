import React, { Component } from 'react'
import { branch } from 'baobab-react/higher-order'
import PropTypes from 'baobab-react/prop-types'
import api from '~base/api'

import Page from '~base/page'
import {loggedIn} from '~base/middlewares/'

import { BaseTable } from '~base/components/base-table'

class Reports extends Component {
  constructor (props) {
    super(props)
    this.state = {
      sortAscending: true,
      sort: 'screenName',
      sortable: true,
      filters: {},
      stats: {
        leads: {
          total: 0,
          partial: 0,
          untouched: 0,
          touched: 0,
          contacted: 0,
          uncontacted: 0,
          affiliated: 0,
          appointments: 0,
          days: []
        }
      }
    }

    this.handleOnFilter = this.handleOnFilter.bind(this)
  }

  componentWillMount () {
    this.context.tree.set('users', {
      page: 1,
      totalItems: 0,
      items: [],
      pageLength: 10
    })
    this.context.tree.commit()
    this.loadOrgs()
  }

  async loadOrgs (sort = this.state.sort) {
    const url = '/admin/users/'
    const params = {
      start: 0,
      limit: 0
    }

    if (this.state.sortable) {
      params.sort = (this.state.sortAscending ? '' : '-') + sort
    }

    const body = await api.get(
      url,
      {
        ...params
      }
    )

    this.setState({
      ...this.state,
      reports: body.data.map(function (item) {
        item.count = parseInt(Math.random() * (40 - 1) + 1)
        return item
      })
    })
  }

  getColumns () {
    return [
      {
        'title': 'Screen name',
        'property': 'screenName',
        'default': 'N/A',
        'sortable': true,
        'totals': false
      },
      {
        'title': 'Name',
        'property': 'name',
        'default': 'N/A',
        'sortable': true,
        'totals': false
      },
      {
        'title': 'Email',
        'property': 'email',
        'default': 'N/A',
        'sortable': true,
        'totals': false
      },
      {
        'title': 'Counts',
        'property': 'count',
        'default': 0,
        'sortable': false,
        'totals': true,
        'editable': true,
        'type': 'number'
      }
    ]
  }

  handleSort (sort) {
    let sortAscending = sort !== this.state.sort ? false : !this.state.sortAscending
    this.setState({sort, sortAscending}, function () {
      this.loadOrgs()
    })
  }

  handleOnFilter (filters) {
    this.setState({filters})
  }

  showModal () {
    this.setState({
      className: ' is-active'
    })
  }

  handleChange (data) {
    const reports = this.state.reports.map((item) => {
      if (data.uuid === item.uuid) {
        return data
      } else {
        return item
      }
    })

    this.setState({reports})
  }

  render () {
    return (
      <div className='columns c-flex-1 is-marginless'>
        <div className='column is-paddingless'>
          <div className='section is-paddingless-top'>
            <h1
              className='is-size-3 is-padding-top-small is-padding-bottom-small'
            >
              Reportes
            </h1>
            <div className='card'>
              <div className='card-content is-paddingless'>
                <BaseTable
                  handleSort={(e) => this.handleSort(e)}
                  data={this.state.reports}
                  className='table is-striped is-fullwidth has-text-centered is-marginless'
                  columns={this.getColumns()}
                  sortAscending={this.state.sortAscending}
                  handleChange={(data) => this.handleChange(data)}
                  sortBy={this.state.sort}
                 />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

Reports.contextTypes = {
  tree: PropTypes.baobab
}

const branchedReports = branch({users: 'users'}, Reports)

export default Page({
  path: '/reports/users',
  title: 'User reports',
  icon: 'users',
  exact: true,
  validate: loggedIn,
  component: branchedReports
})
