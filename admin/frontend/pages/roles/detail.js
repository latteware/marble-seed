import React from 'react'
import Link from '~base/router/link'
import api from '~base/api'

import PageComponent from '~base/page-component'
import {loggedIn} from '~base/middlewares/'
import Loader from '~base/components/spinner'
import RoleForm from './form'
import { BranchedPaginatedTable } from '~base/components/base-paginated-table'
import ConfirmButton from '~base/components/confirm-button'

class RoleDetail extends PageComponent {
  constructor (props) {
    super(props)
    this.state = {
      loading: true,
      loaded: false,
      role: {}
    }
  }

  async onPageEnter () {
    const role = await this.loadCurrentRole()

    return {
      role
    }
  }

  async loadCurrentRole () {
    var url = '/admin/roles/' + this.props.match.params.uuid
    const body = await api.get(url)

    return body.data
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

  async deleteOnClick () {
    var url = '/admin/roles/' + this.props.match.params.uuid
    const res = await api.del(url)

    return res.data
  }

  deleteSuccessHandler () {
    this.props.history.push('/admin/manage/roles')
  }

  async defaultOnClick () {
    var url = '/admin/roles/' + this.props.match.params.uuid + '/setDefault'
    await api.post(url)
    this.reload()
  }

  render () {
    const {role, loaded} = this.state

    if (!loaded) {
      return <Loader />
    }

    let defaultButton
    if (!role.isDefault) {
      defaultButton = <div className='column'>
        <div className='field is-grouped is-grouped-left'>
          <div className='control'>
            <button
              className='button is-primary'
              type='button'
              onClick={() => this.defaultOnClick()}
              >
                Set as default
              </button>
          </div>
        </div>
      </div>
    }

    let deleteButton
    if (!this.state.role.isDefault) {
      deleteButton = <div className='column has-text-right'>
        <div className='field is-grouped is-grouped-right'>
          <div className='control'>
            <ConfirmButton
              title='Delete Role'
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
    }

    return (
      <div className='columns c-flex-1 is-marginless'>
        <div className='column is-paddingless'>
          <div className='section'>
            <div className='columns'>
              {this.getBreadcrumbs()}
            </div>
            <div className='columns'>
              {defaultButton}
              {deleteButton}
            </div>
            <div className='columns'>
              <div className='column'>
                <div className='card'>
                  <header className='card-header'>
                    <p className='card-header-title'>
                      Role
                    </p>
                  </header>
                  <div className='card-content'>
                    <div className='columns'>
                      <div className='column'>
                        <RoleForm
                          baseUrl='/admin/roles'
                          url={'/admin/roles/' + this.props.match.params.uuid}
                          initialState={role}
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
                        <div className='column'>
                          <BranchedPaginatedTable
                            branchName='users'
                            baseUrl='/admin/users'
                            columns={this.getColumns()}
                            filters={{role: this.props.match.params.uuid}}
                          />
                        </div>
                      </div>
                    </div>
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

RoleDetail.config({
  name: 'roles-details',
  path: '/manage/roles/:uuid',
  title: '<%= role.name %> | Roles details',
  breadcrumbs: [
    {label: 'Dashboard', path: '/'},
    {label: 'Roles', path: '/manage/roles'},
    {label: '<%= role.name %>'}
  ],
  exact: true,
  validate: loggedIn
})

export default RoleDetail
