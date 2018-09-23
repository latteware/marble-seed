import React from 'react'
import moment from 'moment'

import tree from '~core/tree'
import PageComponent from '~base/page-component'
import api from '~base/api'
import env from '~base/env-variables'
import FontAwesome from 'react-fontawesome'

import {loggedIn} from '~base/middlewares/'
import UserForm from './form'
import Multiselect from '~base/components/base-multiselect'
import ConfirmButton from '~base/components/confirm-button'

class UserDetail extends PageComponent {
  constructor (props) {
    super(props)

    this.state = {
      ...this.baseState,
      user: {},
      roles: [],
      orgs: [],
      groups: [],
      selectedGroups: [],
      savingGroup: false,
      savedGroup: false,
      selectedOrgs: [],
      savingOrg: false,
      savedOrg: false
    }
  }

  async onFirstPageEnter () {
    const roles = await this.loadRoles()
    const orgs = await this.loadOrgs()
    const groups = await this.loadGroups()

    return {roles, orgs, groups}
  }

  async onPageEnter () {
    const data = await this.loadCurrentUser()

    return {
      user: data,
      selectedGroups: data.groups,
      selectedOrgs: data.organizations
    }
  }

  async loadCurrentUser () {
    var url = '/admin/users/' + this.props.match.params.uuid
    const body = await api.get(url)

    return body.data
  }

  async loadRoles () {
    var url = '/admin/roles/'
    const body = await api.get(url, {
      start: 0,
      limit: 0
    })

    return body.data
  }

  async loadOrgs () {
    var url = '/admin/organizations/'
    const body = await api.get(url, {
      start: 0,
      limit: 0
    })

    return body.data
  }

  async loadGroups () {
    var url = '/admin/groups/'
    const body = await api.get(url, {
      start: 0,
      limit: 0
    })

    return body.data
  }

  async availableOrgOnClick (uuid) {
    this.setState({
      savingOrg: true
    })

    var selected = this.state.selectedOrgs
    var group = this.state.orgs.find(item => { return item.uuid === uuid })

    if (selected.findIndex(item => { return item.uuid === uuid }) !== -1) {
      return
    }

    selected.push(group)

    this.setState({
      selectedOrgs: selected
    })

    var url = '/admin/users/' + this.props.match.params.uuid + '/add/organization'
    await api.post(url,
      {
        organization: uuid
      }
    )

    setTimeout(() => {
      this.setState({
        savingOrg: false,
        savedOrg: true
      })
    }, 300)
  }

  async assignedOrgOnClick (uuid) {
    this.setState({
      savingOrg: true
    })

    var index = this.state.selectedOrgs.findIndex(item => { return item.uuid === uuid })
    var selected = this.state.selectedOrgs

    if (index === -1) {
      return
    }

    selected.splice(index, 1)

    this.setState({
      selectedOrgs: selected
    })

    var url = '/admin/users/' + this.props.match.params.uuid + '/remove/organization'
    await api.post(url,
      {
        organization: uuid
      }
    )

    setTimeout(() => {
      this.setState({
        savingOrg: false,
        savedOrg: true
      })
    }, 300)
  }

  async availableGroupOnClick (uuid) {
    this.setState({
      savingGroup: true
    })

    var selected = this.state.selectedGroups
    var group = this.state.groups.find(item => { return item.uuid === uuid })

    if (selected.findIndex(item => { return item.uuid === uuid }) !== -1) {
      return
    }

    selected.push(group)

    this.setState({
      selectedGroups: selected
    })

    var url = '/admin/users/' + this.props.match.params.uuid + '/add/group'
    await api.post(url,
      {
        group: uuid
      }
    )

    setTimeout(() => {
      this.setState({
        savingGroup: false,
        savedGroup: true
      })
    }, 300)
  }

  async assignedGroupOnClick (uuid) {
    this.setState({
      savingGroup: true
    })

    var index = this.state.selectedGroups.findIndex(item => { return item.uuid === uuid })
    var selected = this.state.selectedGroups

    if (index === -1) {
      return
    }

    selected.splice(index, 1)

    this.setState({
      selectedGroups: selected
    })

    var url = '/admin/users/' + this.props.match.params.uuid + '/remove/group'
    await api.post(url,
      {
        group: uuid
      }
    )

    setTimeout(() => {
      this.setState({
        savingGroup: false,
        savedGroup: true
      })
    }, 300)
  }

  async resetOnClick () {
    var url = '/user/reset-password'
    const res = await api.post(url, {email: this.state.user.email})

    return res.data
  }

  async deleteOnClick () {
    var url = '/admin/users/' + this.props.match.params.uuid
    const res = await api.del(url)

    return res.data
  }

  deleteSuccessHandler () {
    this.props.history.push('/admin/manage/users')
  }

  getDateCreated () {
    if (this.state.user.dateCreated) {
      return moment.utc(
        this.state.user.dateCreated
      ).format('DD/MM/YYYY hh:mm a')
    }

    return 'N/A'
  }

  getSavingMessage (saving, saved) {
    if (saving) {
      return (
        <p className='card-header-title' style={{fontWeight: '200', color: 'grey'}}>
          Saving <span style={{paddingLeft: '5px'}}><FontAwesome className='fa-spin' name='spinner' /></span>
        </p>
      )
    }

    if (saved) {
      return (
        <p className='card-header-title' style={{fontWeight: '200', color: 'grey'}}>
          Saved
        </p>
      )
    }
  }

  getSavingGroupMessage () {
    let { savingGroup, savedGroup } = this.state

    if (savedGroup) {
      if (this.savedGroupTimeout) {
        clearTimeout(this.savedGroupTimeout)
      }

      this.savedGroupTimeout = setTimeout(() => {
        this.setState({
          savedGroup: false
        })
      }, 500)
    }

    return this.getSavingMessage(savingGroup, savedGroup)
  }

  getSavingOrgMessage () {
    let { savingOrg, savedOrg } = this.state

    if (savedOrg) {
      if (this.savedOrgTimeout) {
        clearTimeout(this.savedOrgTimeout)
      }

      this.savedOrgTimeout = setTimeout(() => {
        this.setState({
          savedOrg: false
        })
      }, 500)
    }

    return this.getSavingMessage(savingOrg, savedOrg)
  }

  render () {
    const basicStates = super.getBasicStates()
    if (basicStates) { return basicStates }

    const {user} = this.state
    const currentUser = tree.get('user')

    const availableGroupsList = this.state.groups.filter(item => {
      return (this.state.selectedGroups.findIndex(group => {
        return group.uuid === item.uuid
      }) === -1)
    })

    const availableOrgsList = this.state.orgs.filter(item => {
      return (this.state.selectedOrgs.findIndex(org => {
        return org.uuid === item.uuid
      }) === -1)
    })

    let resetButton
    if (env.EMAIL_SEND) {
      resetButton = <div className='control'>
        <ConfirmButton
          title='Send reset password email'
          className='button is-link'
          classNameButton='button is-link'
          onConfirm={() => this.resetOnClick()}
        >
          Reset password
        </ConfirmButton>
      </div>
    }

    let deleteButton
    if (currentUser.uuid !== user.uuid) {
      deleteButton = <div className='control'>
        <ConfirmButton
          title='Delete User'
          className='button is-danger'
          classNameButton='button is-danger'
          onConfirm={() => this.deleteOnClick()}
          onSuccess={() => this.deleteSuccessHandler()}
        >
          Delete
        </ConfirmButton>
      </div>
    }

    return (
      <div className='columns c-flex-1 is-marginless'>
        <div className='column is-paddingless'>
          <div className='section'>
            <div className='columns'>
              {this.getBreadcrumbs()}
              <div className='column has-text-right'>
                <div className='field is-grouped is-grouped-right'>
                  {resetButton}
                  {deleteButton}
                </div>
              </div>
            </div>
            <div className='columns is-multiline'>
              <div className='column is-full is-half-desktop'>
                <div className='card'>
                  <header className='card-header'>
                    <p className='card-header-title'>
                      { user.screenName }
                    </p>
                  </header>
                  <div className='card-content'>
                    <div className='columns'>
                      <div className='column'>
                        <UserForm
                          mode='update'
                          baseUrl='/admin/users'
                          url={'/admin/users/' + this.props.match.params.uuid}
                          initialState={this.state.user}
                          load={() => this.reload()}
                          roles={this.state.roles || []}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='column is-full is-half-desktop'>
                <div className='columns'>
                  <div className='column'>
                    <div className='card'>
                      <header className='card-header'>
                        <p className='card-header-title'>
                          Organizations
                        </p>
                        <div>
                          {this.getSavingOrgMessage()}
                        </div>
                      </header>
                      <div className='card-content'>
                        <Multiselect
                          assignedList={this.state.selectedOrgs}
                          availableList={availableOrgsList}
                          dataFormatter={(item) => { return item.name || 'N/A' }}
                          availableClickHandler={this.availableOrgOnClick.bind(this)}
                          assignedClickHandler={this.assignedOrgOnClick.bind(this)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className='columns'>
                  <div className='column'>
                    <div className='card'>
                      <header className='card-header'>
                        <p className='card-header-title'>
                          Groups
                        </p>
                        <div>
                          {this.getSavingGroupMessage()}
                        </div>
                      </header>
                      <div className='card-content'>
                        <Multiselect
                          assignedList={this.state.selectedGroups}
                          availableList={availableGroupsList}
                          dataFormatter={(item) => { return item.name || 'N/A' }}
                          availableClickHandler={this.availableGroupOnClick.bind(this)}
                          assignedClickHandler={this.assignedGroupOnClick.bind(this)}
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

UserDetail.config({
  name: 'user-details',
  path: '/manage/users/:uuid',
  title: '<%= user.name %> | User details',
  breadcrumbs: [
    {label: 'Dashboard', path: '/'},
    {label: 'Users', path: '/manage/users'},
    {label: '<%= user.name %>'}
  ],
  exact: true,
  validate: loggedIn
})

export default UserDetail
