import { isEmpty } from 'lodash'
import React, { Component } from 'react'
import { root } from 'baobab-react/higher-order'
import { withRouter } from 'react-router'

import env from '~base/env-variables'
import storage from '~base/storage'
import api from '~base/api'
import tree from '~core/tree'
import ErrorPage from '~base/components/error-page'
import Loader from '~base/components/spinner'

import Sidebar from '~components/sidebar'
import Footer from '~components/footer'
import AdminNavBar from '~components/admin-navbar'

class AdminLayout extends Component {
  constructor (props) {
    super(props)
    this.state = {
      user: {},
      loaded: false,
      burger: false,
      menuCollapse: false,
      hasLoadError: false,
      error: ''
    }
  }

  toggleBurguer () {
    this.setState({ burger: !this.state.burger })
  }

  toggleSidebarCollapse () {
    this.setState({ menuCollapse: !this.state.menuCollapse })
  }

  async componentWillMount () {
    const userCursor = tree.select('user')

    userCursor.on('update', ({ data }) => {
      const user = data.currentData
      this.setState({ user })
    })

    var me
    if (tree.get('jwt')) {
      try {
        me = await api.get('/user/me')
      } catch (err) {
        if (err.status === 401) {
          storage.remove('jwt')
          tree.set('jwt', null)
          tree.set('expiredSession', true)
          tree.commit()

          this.props.history.push(env.PREFIX + '/log-in')
        } else {
          // Loaded and has errors
          return this.setState({
            loaded: true,
            hasLoadError: true,
            error: err.message
          })
        }
      }

      if (me) {
        if (!me.user.isAdmin) {
          const { history } = this.props

          storage.remove('jwt')
          tree.set('jwt', null)
          tree.set('user', null)
          tree.set('loggedIn', false)
          tree.commit()

          history.push('/')
        }

        tree.set('user', me.user)
        tree.set('loggedIn', me.loggedIn)

        tree.commit()
      }
    }

    const config = await api.get('/app-config')
    tree.set('config', config)
    tree.commit()

    this.setState({ loaded: true })
  }

  render () {
    if (!this.state.loaded) {
      return <Loader className='loader-wrapper' />
    }

    if (this.state.hasLoadError) {
      return <ErrorPage message={this.state.error} />
    }

    if (!isEmpty(this.state.user)) {
      return (<div className='columns wrap is-gapless c-flex-1 is-flex'>
        <Sidebar burgerState={this.state.burger} handleBurguer={() => this.toggleBurguer()} />
        <div className='column is-flex is-flex-column'>
          <AdminNavBar burgerState={this.state.burger} handleBurguer={() => this.toggleBurguer()} />
          <div className='column is-flex-column is-paddingless main-wrapper'>
            <section className='c-flex-1 is-flex main-section'>
              {this.props.children}
            </section>
            <Footer />
          </div>
        </div>
      </div>)
    } else {
      return (<div>
        {this.props.children}
      </div>)
    }
  }
}

export default root(tree, withRouter(AdminLayout))
