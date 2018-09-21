import React from 'react'
import Link from '~base/router/link'
import api from '~base/api'
import Loader from '~base/components/spinner'

import PageComponent from '~base/page-component'
import {loggedIn} from '~base/middlewares/'
import { BranchedPaginatedTable } from '~base/components/base-paginated-table'
import GroupForm from './form'
import ConfirmButton from '~base/components/confirm-button'
class GroupDetail extends PageComponent {
  constructor (props) {
    super(props)
    this.state = {
      loading: true,
      loaded: false,
      group: {}
    }
  }

  async onPageEnter () {
    const group = await this.loadCurrentGroup()

    return {
      group
    }
  }

  async loadCurrentGroup () {
    var url = '/admin/groups/' + this.props.match.params.uuid
    const body = await api.get(url)

    return body.data
  }

  async deleteOnClick () {
    var url = '/admin/groups/' + this.props.match.params.uuid
    const res = await api.del(url)

    return res.data
  }

  deleteSuccessHandler () {
    this.props.history.push('/admin/manage/groups')
  }

  getColumns () {
    return [
      {
        'title': 'Screen name',
        'property': 'screenName',
        'default': 'N/A'
      },
      {
        'title': 'Email',
        'property': 'email',
        'default': 'N/A'
      },
      {
        'title': 'Actions',
        formatter: (row) => {
          return <Link className='button' to={'/manage/users/' + row.uuid}>
            Detalle
          </Link>
        }
      }
    ]
  }

  render () {
    const {group, loaded} = this.state

    if (!loaded) {
      return <Loader />
    }

    return (<div className='columns c-flex-1 is-marginless'>
      <div className='column is-paddingless'>
        <div className='section'>
          <div className='columns'>
            {this.getBreadcrumbs()}
            <div className='column has-text-right'>
              <div className='field is-grouped is-grouped-right'>
                <div className='control'>
                  <ConfirmButton
                    title='Delete Group'
                    className='button is-danger'
                    classNameButton='button is-danger'
                    onConfirm={() => this.deleteOnClick()}
                    onSuccess={() => this.deleteSuccessHandler()}
                  >
                    Delete
                  </ConfirmButton>
                </div>
              </div>
            </div>
          </div>
          <div className='columns'>
            <div className='column'>
              <div className='card'>
                <header className='card-header'>
                  <p className='card-header-title'>
                    Group
                  </p>
                </header>
                <div className='card-content'>
                  <div className='columns'>
                    <div className='column'>
                      <GroupForm
                        baseUrl='/admin/groups'
                        url={'/admin/groups/' + this.props.match.params.uuid}
                        initialState={group}
                        load={() => this.reload()}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='column'>
              <div className='card'>
                <header className='card-header'>
                  <p className='card-header-title'>
                    Users
                  </p>
                </header>
                <div className='card-content'>
                  <div className='columns'>
                    <div className='column'>
                      <BranchedPaginatedTable
                        branchName='users'
                        baseUrl='/admin/users'
                        columns={this.getColumns()}
                        filters={{group: this.props.match.params.uuid}}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>)
  }
}

GroupDetail.config({
  name: 'group-details',
  path: '/manage/groups/:uuid',
  title: '<%= group.name %> | Group details',
  breadcrumbs: [
    {label: 'Dashboard', path: '/'},
    {label: 'Groups', path: '/manage/groups'},
    {label: '<%= group.name %>'}
  ],
  exact: true,
  validate: loggedIn
})

export default GroupDetail
