import React from 'react'
import Link from '~base/router/link'
import api from '~base/api'
import Loader from '~base/components/spinner'

import PageComponent from '~base/page-component'
import {loggedIn} from '~base/middlewares/'
import { BranchedPaginatedTable } from '~base/components/base-paginated-table'
import OrganizationForm from './form'
import ConfirmButton from '~base/components/confirm-button'

class OrganizationDetail extends PageComponent {
  constructor (props) {
    super(props)
    this.state = {
      loading: true,
      loaded: false,
      organization: {}
    }
  }

  async onPageEnter () {
    const organizations = await this.loadCurrentOrganization()

    return {
      organizations
    }
  }

  async loadCurrentOrganization () {
    var url = '/admin/organizations/' + this.props.match.params.uuid
    const body = await api.get(url)

    this.setState({
      loading: false,
      loaded: true,
      organization: body.data
    })
  }

  async deleteOnClick () {
    var url = '/admin/organizations/' + this.props.match.params.uuid
    await api.del(url)
    this.props.history.push('/admin/manage/organizations')
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
    const {organization, loaded} = this.state

    if (!loaded) {
      return <Loader />
    }

    return (
      <div className='columns c-flex-1 is-marginless'>
        <div className='column is-paddingless'>
          <div className='section'>
            <div className='columns'>
              {this.getBreadcrumbs()}
              <div className='column has-text-right'>
                <div className='field is-grouped is-grouped-right'>
                  <div className='control'>
                    <ConfirmButton
                      title='Delete Organization'
                      className='button is-danger'
                      classNameButton='button is-danger'
                      onConfirm={() => this.deleteOnClick()}
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
                      Organization
                    </p>
                  </header>
                  <div className='card-content'>
                    <div className='columns'>
                      <div className='column'>
                        <OrganizationForm
                          baseUrl='/admin/organizations'
                          url={'/admin/organizations/' + this.props.match.params.uuid}
                          initialState={organization}
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
                          filters={{organization: this.props.match.params.uuid}}
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
    )
  }
}

OrganizationDetail.config({
  name: 'organization-details',
  path: '/manage/organizations/:uuid',
  title: '<%= organization.name %> | Organization details',
  breadcrumbs: [
    {label: 'Dashboard', path: '/'},
    {label: 'Organizations', path: '/manage/organizations'},
    {label: '<%= organization.name %>'}
  ],
  exact: true,
  validate: loggedIn
})

export default OrganizationDetail
