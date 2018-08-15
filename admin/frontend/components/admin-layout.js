import {isEmpty} from 'lodash'
import React, { Component } from 'react'
import { root } from 'baobab-react/higher-order'

import api from '~base/api'
import tree from '~core/tree'

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
      menuCollapse: false
    }
  }

  toggleBurguer () {
    this.setState({burger: !this.state.burger})
  }

  toggleSidebarCollapse () {
    this.setState({menuCollapse: !this.state.menuCollapse})
  }

  async componentWillMount () {
    const userCursor = tree.select('user')

    userCursor.on('update', ({data}) => {
      const user = data.currentData
      this.setState({user})
    })

    var me
    if (tree.get('jwt')) {
      try {
        me = await api.get('/user/me')
      } catch (err) {
        if (err.status === 401) {
          window.localStorage.removeItem('jwt')
          tree.set('jwt', null)
          tree.commit()
        }

        this.setState({loaded: true})
        return
      }

      if (!me.user.isAdmin) {
        const {history} = this.props

        window.localStorage.removeItem('jwt')
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

    this.setState({loaded: true})
  }

  render () {
    if (!this.state.loaded) {
      return <div>Loading...</div>
    }

    if (!isEmpty(this.state.user)) {
      return (<div className='columns wrap is-gapless c-flex-1 is-flex'>
        <div className='is-flex is-flex-column'>
          <Sidebar burgerState={this.state.burger} handleBurguer={() => this.toggleBurguer()} />
        </div>
        <div className='column is-flex is-flex-column'>
          <AdminNavBar burgerState={this.state.burger} handleBurguer={() => this.toggleBurguer()} />
          <div className='main-wrapper'>
            <section className='c-flex-1 is-flex'>
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

export default root(tree, AdminLayout)
