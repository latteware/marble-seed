import React, { Component } from 'react'

import Page from '~base/page'
import {loggedIn} from '~base/middlewares/'

import UpdateProfileForm from '~base/components/update-profile'
import UpdatePasswordForm from '~base/components/update-password'
import TokensList from '~base/components/token-list'

export default Page({
  path: '/profile',
  exact: true,
  title: 'Profile',
  validate: loggedIn,
  component: class extends Component {
    render () {
      return (<div className='section'>
        <section className='is-fullwidth'>
          <div className='columns is-multiline'>
            <div className='column is-full is-one-third-desktop'>

              <div className='panel is-bg-white'>
                <p className='panel-heading'>
                  Perfil
                </p>
                <div className='panel-block panel-body'>
                  <UpdateProfileForm />
                </div>
              </div>

              <div className='panel is-bg-white'>
                <p className='panel-heading'>
                  Perfil
                </p>
                <div className='panel-block panel-body'>
                  <UpdatePasswordForm />
                </div>
              </div>
            </div>

            <div className='column is-full is-two-thirds-desktop'>
              <TokensList />
            </div>
          </div>
        </section>
      </div>)
    }
  }
})
