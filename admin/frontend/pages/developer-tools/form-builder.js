import React, { Component } from 'react'
import Page from '~base/page'
import {loggedIn} from '~base/middlewares/'
import FormBuilder from './components/builder'

import 'react-select/scss/default.scss'
import 'react-datepicker/src/stylesheets/datepicker.scss'

import MarbleForm from '~base/components/marble-form'

class FormBuilderContainer extends Component {
  constructor () {
    super(...arguments)
    this.state = {
      schema: {},
      formData: {},
      result: null,
      currentDisplay: 'form'
    }
  }

  onChange (schema) {
    this.setState({ schema })
  }

  handleChange (data) {
    this.setState({formData: data})
  }

  setCurrentDisplay (currentDisplay) {
    this.setState({currentDisplay})
  }

  setResult (result) {
    this.setState({
      formData: {},
      result
    })
  }

  render () {
    const { schema, currentDisplay, result, formData } = this.state

    const formEl = <div>
      <MarbleForm
        schema={schema}
        formData={formData}
        onChange={(data) => this.handleChange(data)}
        onSubmit={(data) => this.setResult(data)}
      />
      <div style={{maxWidth: 500, overflowX: 'scroll'}}>
        {result && <pre style={{marginTop: 20}}>{JSON.stringify(result, null, 2)}</pre>}
      </div>
    </div>

    return (
      <div className='columns c-flex-1 is-marginless'>
        <div className='column is-paddingless'>
          <div className='section'>
            <div className='columns'>
              <div className='column'>
                <div className='card'>
                  <header className='card-header'>
                    <p className='card-header-title'>
                      Form Builder
                    </p>
                  </header>
                  <div className='card-content'>
                    <FormBuilder
                      initialSchema={schema}
                      onChange={schema => this.onChange(schema)}
                    />
                  </div>
                </div>
              </div>
              <div className='column'>
                <div className='card'>
                  <header className='card-header'>
                    <p className='card-header-title'>
                      Form Schema
                    </p>
                    <div className='tabs'>
                      <ul>
                        <li onClick={() => this.setCurrentDisplay('form')} className={currentDisplay === 'form' ? 'is-active' : ''}><a>Form</a></li>
                        <li onClick={() => this.setCurrentDisplay('schema')} className={currentDisplay === 'schema' ? 'is-active' : ''}><a>Schema</a></li>
                      </ul>
                    </div>
                  </header>
                  <div className='card-content'>
                    { currentDisplay === 'form' && formEl }
                    { currentDisplay === 'schema' && <pre>{JSON.stringify(schema, null, 2)}</pre> }
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

export default Page({
  path: '/devtools/form-builder',
  icon: 'file',
  title: 'Form Builder',
  exact: true,
  validate: loggedIn,
  component: FormBuilderContainer
})
