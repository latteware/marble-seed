import React, { Component } from 'react'
import { branch } from 'baobab-react/higher-order'
import PropTypes from 'baobab-react/prop-types'
import api from '~base/api'

import Page from '~base/page'
import {loggedIn} from '~base/middlewares/'
import Loader from '~base/components/spinner'
import {{ name | capitalize }}Form from './create-form'

class {{ name | capitalize }}Detail extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: true,
      loaded: false,
      {{ name | lower }}: {}
    }
  }

  componentWillMount () {
    this.load()
  }

  async load () {
    var url = '/admin/{{ name | pluralize | lower }}/' + this.props.match.params.uuid
    const body = await api.get(url)

    this.setState({
      loading: false,
      loaded: true,
      {{ name | lower }}: body.data
    })
  }

  async deleteOnClick () {
    var url = '/admin/{{ name | pluralize | lower }}/' + this.props.match.params.uuid
    const body = await api.del(url)
    this.props.history.push('/admin/{{ name | pluralize | lower }}')
  }


  render () {
    const { {{ name | lower }} } = this.state

    if (!this.state.loaded) {
      return <Loader />
    }

    return (
      <div className='columns c-flex-1 is-marginless'>
        <div className='column is-paddingless'>
          <div className='section'>
            <div className='columns'>
              <div className='column has-text-right'>
                <div className='field is-grouped is-grouped-right'>
                  <div className='control'>
                    <button
                      className='button is-danger'
                      type='button'
                      onClick={() => this.deleteOnClick()}
                        >
                          Delete
                        </button>
                  </div>
                </div>
              </div>
            </div>
            <div className='columns'>
              <div className='column'>
                <div className='card'>
                  <header className='card-header'>
                    <p className='card-header-title'>
                      {{ name | capitalize }}
                    </p>
                  </header>
                  <div className='card-content'>
                    <div className='columns'>
                      <div className='column'>
                        <{{ name | capitalize }}Form
                          baseUrl='/admin/{{ name | pluralize | lower }}'
                          url={'/admin/{{ name | pluralize | lower }}/' + this.props.match.params.uuid}
                          initialState={ {{ name | lower }} }
                          load={this.load.bind(this)}
                        >
                          <div className='field is-grouped'>
                            <div className='control'>
                              <button className='button is-primary'>Save</button>
                            </div>
                          </div>
                        </{{ name | capitalize }}Form>
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

{{ name | capitalize }}Detail.contextTypes = {
  tree: PropTypes.baobab
}

const branched{{ name | capitalize }}Details = branch({ {{ name | pluralize | lower }}: '{{ name | pluralize | lower }}'}, {{ name | capitalize }}Detail)

export default Page({
  path: '/{{ name | pluralize | lower }}/:uuid',
  title: '{{ name | capitalize }} details',
  exact: true,
  validate: loggedIn,
  component: branched{{ name | capitalize }}Details
})
