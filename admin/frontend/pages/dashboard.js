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
      let today = new Date()
      let month = today.toLocaleString('es-ES', { month: 'long' })
      this.setState({
        ...this.state,
        orgsCount: body.orgsCount,
        usersCount: body.usersCount,
        rolesCount: body.rolesCount,
        groupsCount: body.groupsCount,
        loading: false,
        todayIs: today.getDay() + ' - ' + month + ' - ' + today.getFullYear()
      })
    }

    render () {
      const {loading, orgsCount, usersCount, rolesCount, groupsCount, todayIs} = this.state

      if (loading) {
        return <Loader />
      }

      if (this.state.redirect) {
        return <Redirect to='/log-in' />
      }

      return (<div className='section'>
        <div className='Dashboard'>
          <div className='columns'>
            <div className='column'>
              <h1 className='Dashboard-title'>Tu organización</h1>
              <h2 className='Dashboard-subtitle'>Revisa el estatus de tu organización</h2>
            </div>
            <div className='column Dashboard-welcome'>
              <p>¡Bienvenido!</p>
              <p>{todayIs}</p>
            </div>
          </div>
          <div className='tile is-ancestor'>
            <div className='tile is-vertical is-3'>
              <div className='tile'>
                <div className='tile is-parent'>
                  <article className='tile is-child has-text-centered'>
                    <p className='title'>{orgsCount}</p>
                    <p className='subtitle'>Organizaciones</p>
                  </article>
                </div>
              </div>
            </div>
            <div className='tile is-vertical is-3'>
              <div className='tile'>
                <div className='tile is-parent'>
                  <article className='tile is-child has-text-centered'>
                    <p className='title'>{usersCount}</p>
                    <p className='subtitle'>Usuarios</p>
                  </article>
                </div>
              </div>
            </div>
            <div className='tile is-vertical is-3'>
              <div className='tile'>
                <div className='tile is-parent'>
                  <article className='tile is-child has-text-centered'>
                    <p className='title'>{rolesCount}</p>
                    <p className='subtitle'>Roles</p>
                  </article>
                </div>
              </div>
            </div>
            <div className='tile is-vertical is-3'>
              <div className='tile'>
                <div className='tile is-parent'>
                  <article className='tile is-child has-text-centered'>
                    <p className='title'>{groupsCount}</p>
                    <p className='subtitle'>Grupos</p>
                  </article>
                </div>
              </div>
            </div>
          </div>
          <div className='columns'>
            <div className='column'>
              <div className='quickActions'>
                <table className='table is-fullwidth'>
                  <thead>
                    <tr>
                      <th>Acciones rápidas</th>
                      <th>
                        <span>Agrega, edita o visualiza</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <div className='icon-list'>
                          <a className='button icon-button is-link is-rounded is-small'><i className='fa fa-sitemap' /></a>
                          <span className='icon-list-right'>Organización</span>
                        </div>
                      </td>
                      <td className='quickActions-list'>
                        <div>
                          <div className='icon-list-items'>
                            <i className='fa fa-plus' />
                            <i className='fa fa-edit' />
                            <i className='fa fa-eye' />
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div className='icon-list'>
                          <a className='button icon-button is-link is-rounded is-small'><i className='fa fa-user' /></a>
                          <span className='icon-list-right'>Usuarios</span>
                        </div>
                      </td>
                      <td className='quickActions-list'>
                        <div>
                          <div className='icon-list-items'>
                            <i className='fa fa-plus' />
                            <i className='fa fa-edit' />
                            <i className='fa fa-eye' />
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div className='icon-list'>
                          <a className='button icon-button is-link is-rounded is-small'><i className='fa fa-puzzle-piece' /></a>
                          <span className='icon-list-right'>Roles</span>
                        </div>
                      </td>
                      <td className='quickActions-list'>
                        <div>
                          <div className='icon-list-items'>
                            <i className='fa fa-plus' />
                            <i className='fa fa-edit' />
                            <i className='fa fa-eye' />
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div className='icon-list'>
                          <a className='button icon-button is-link is-rounded is-small'><i className='fa fa-users' /></a>
                          <span className='icon-list-right'>Grupos</span>
                        </div>
                      </td>
                      <td className='quickActions-list'>
                        <div className='icon-list'>
                          <div className='icon-list-items'>
                            <i className='fa fa-plus' />
                            <i className='fa fa-edit' />
                            <i className='fa fa-eye' />
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>)
    }
  }
})
