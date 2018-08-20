import React, { Component } from 'react'
import Page from '~base/page'
import api from '~base/api'
import { Redirect } from 'react-router-dom'
import Loader from '~base/components/spinner'

import {loggedIn} from '~base/middlewares/'

export default Page({
  path: '/',
  exact: true,
  title: 'Dashboard',
  icon: 'github',
  validate: loggedIn,
  component: class extends Component {
    constructor (props) {
      super(props)
      this.state = {
        orgsCount: 0,
        usersCount: 0,
        rolesCount: 0,
        groupsCount: 0,
        loading: true
      }
    }

    componentWillMount () {
      this.load()
    }

    async load () {
      var url = '/admin/dashboard/'
      const body = await api.get(url)

      this.setState({
        ...this.state,
        orgsCount: body.orgsCount,
        usersCount: body.usersCount,
        rolesCount: body.rolesCount,
        groupsCount: body.groupsCount,
        loading: false
      })
    }

    render () {
      const {loading, orgsCount, usersCount, rolesCount, groupsCount} = this.state

      if (loading) {
        return <Loader />
      }

      if (this.state.redirect) {
        return <Redirect to='/log-in' />
      }

      return (<div className='section'>
        <div className='Dashboard'>
          <h1 className='Dashboard-title'>Tu organizacion</h1>
          <h2 className='Dashboard-subtitle'>Revisa el estatus de tu organizacion</h2>
          <nav className='level Dashboard-info'>
            <div className='level-item has-text-centered'>
              <div>
                <p className='title'>0</p>
                <p className='heading'>Organizaciones</p>
              </div>
            </div>
            <div className='level-item has-text-centered'>
              <div>
                <p className='title'>4</p>
                <p className='heading'>Usuarios</p>
              </div>
            </div>
            <div className='level-item has-text-centered'>
              <div>
                <p className='title'>2</p>
                <p className='heading'>Roles</p>
              </div>
            </div>
            <div className='level-item has-text-centered'>
              <div>
                <p className='title'>0</p>
                <p className='heading'>Grupos</p>
              </div>
            </div>
          </nav>
        </div>
      </div>)
    }
  }
})
