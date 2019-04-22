import React from 'react'

import request from '~core/request'
import PageComponent from '~base/page-component'
import { loggedIn } from '~base/middlewares/'

class App extends PageComponent {
  constructor (props) {
    super(props)
    this.state = {
      ...this.baseState,
      posts: []
    }
  }

  async onPageEnter () {
    const body = await request('get', null, 'https://old.reddit.com/r/all.json')

    return {
      loading: false,
      posts: body.data.children.map(item => item.data)
    }
  }

  render () {
    const basicStates = super.getBasicStates()
    if (basicStates) { return basicStates }

    const { posts } = this.state

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

App.config({
  path: '/app',
  title: 'App',
  exact: true,
  validate: loggedIn
})

export default App
