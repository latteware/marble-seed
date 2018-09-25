import React from 'react'
import api from '~base/api'
import Loader from '~base/components/spinner'

import PageComponent from '~base/page-component'
import {loggedIn} from '~base/middlewares/'
import {{ name | capitalize }}Form from './form'
import ConfirmButton from '~base/components/confirm-button'

class {{ name | capitalize }}Detail extends PageComponent {
  constructor (props) {
    super(props)

    this.state = {
      loading: true,
      loaded: false,
      {{ name }}: {}
    }
  }

  async onPageEnter () {
    const {{ name }} = await this.load()

    return {
      {{ name }}
    }
  }

  async load () {
    var url = '/admin/{{ name | lower }}s/' + this.props.match.params.uuid
    const body = await api.get(url)

    return body.data
  }

  async deleteOnClick () {
    var url = '/admin/{{ name | lower }}s/' + this.props.match.params.uuid
    const res = await api.del(url)

    return res.data
  }
  
  deleteSuccessHandler () {
    this.props.history.push('/admin/{{ name | lower }}s')
  }

  render () {
    const { {{ name | lower }}, loaded } = this.state

    if (!loaded) {
      return <Loader />
    }

    return (<div className='columns c-flex-1 is-marginless'>
      <div className='column is-paddingless'>
        <div className='section'>
          <div className='columns'>
            {this.getBreadcrumbs()}
            <div className='column has-text-right'>
              <div className='field is-grouped is-grouped-right'>
                <div className='control'>
                  <ConfirmButton
                    title='Delete {{ name | capitalize }}'
                    className='button is-danger'
                    classNameButton='button is-danger'
                    onConfirm={() => this.deleteOnClick()}
                    onSuccess={() => this.deleteSuccessHandler()}
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
                    {{ name | capitalize }}
                  </p>
                </header>
                <div className='card-content'>
                  <div className='columns'>
                    <div className='column'>
                      <{{ name | capitalize }}Form
                        url={'/admin/{{ name | lower }}s/' + this.props.match.params.uuid}
                        formData={ {{ name | lower }} }
                        load={() => this.reload()}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>)
  }
}

{{ name | capitalize }}Detail.config({
  name: '{{ name | lower }}-details',
  path: '/{{ name | lower }}s/:uuid',
  title: '<%= {{ name }}.name %> | {{ name | capitalize }} details',
  breadcrumbs: [
    {label: 'Dashboard', path: '/'},
    {label: '{{ name | capitalize }}s', path: '/{{ name | lower }}s'},
    {label: '<%= {{ name | lower }}.name %>'}
  ],
  exact: true,
  validate: loggedIn
})

export default {{ name | capitalize }}Detail
