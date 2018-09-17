import React, { Component } from 'react'
import request from '~core/request'
import { Redirect } from 'react-router-dom'
import Loader from '~base/components/spinner'
import Page from '~base/page'
import {loggedIn} from '~base/middlewares/'

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      posts: [],
      loading: true
    }
  }

  componentWillMount () {
    this.load()
  }

  async load () {
    const body = await request('get', null, 'https://old.reddit.com/r/all.json')

    this.setState({
      loading: false,
      posts: body.data.children.map(item => item.data)
    })
  }

  render () {
    const {loading, posts} = this.state

    if (loading) {
      return <div className='is-flex is-flex-1'><Loader /></div>
    }

    if (this.state.redirect) {
      return <Redirect to='/log-in' />
    }

    const postsList = posts.map(post => {
      return <div key={post.id}>
        <h4>{post.title}</h4>
        <a href={'http://reddit.com' + post.permalink} target='_blank'>{post.domain}</a>
      </div>
    })

    return (
      <div className='App'>
        <div className='App-header'>
          <h2>Post list</h2>
        </div>
        {postsList}
      </div>
    )
  }
}

export default Page({
  path: '/app',
  title: 'App',
  exact: true,
  validate: loggedIn,
  component: App
})
