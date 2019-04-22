import React from 'react'

import PageComponent from '~base/page-component'
import api from '~base/api'
import { loggedIn } from '~base/middlewares/'
import MarbleForm from '~base/components/marble-form'

const schema = {
  'file': {
    'widget': 'FileWidget',
    'name': 'file',
    'type': 'csv'
  }
}

class ImportUsers extends PageComponent {
  constructor (props) {
    super(props)

    this.state = {
      formData: {
        file: undefined
      }
    }
  }

  changeHandler (formData) {
    this.setState({ formData })
  }

  async submitHandler (formData) {
    await api.post('/admin/users/import/', formData)
  }

  render () {
    return (
      <div className='columns c-flex-1 is-marginless'>
        <div className='column is-paddingless'>
          <div className='section is-paddingless-top'>
            <h1
              className='is-size-3 is-padding-top-small is-padding-bottom-small'
            >
              Load users
            </h1>
            <div className='card'>
              <div className='card-content'>
                <div className='columns'>
                  <div className='column' style={{ maxWidth: 560, margin: '0 auto' }}>
                    <MarbleForm
                      schema={schema}
                      formData={this.state.formData}
                      onChange={(data) => { this.changeHandler(data) }}
                      onSubmit={async (data) => { await this.submitHandler(data) }}
                      defaultSuccessMessage='Users imported correctly'
                      buttonLabel='Import'
                    />
                  </div>
                </div>
                <h4>The <strong>.csv</strong> file should have the same format
                  as the example below:
                </h4>
                <pre style={{ marginTore: '1em' }}>
                  "name","screenName","email","password"<br />
                  "Juan Perez","Juan","juan@coporation.com","password"
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

ImportUsers.config({
  name: 'import-users',
  path: '/import/users',
  icon: 'user',
  title: 'Import Users',
  breadcrumbs: [
    { label: 'Dashboard', path: '/' },
    { label: 'Import' },
    { label: 'Users' }
  ],
  exact: true,
  validate: loggedIn
})

export default ImportUsers
