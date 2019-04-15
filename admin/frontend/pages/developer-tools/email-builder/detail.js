import React from 'react'
import PageComponent from '~base/page-component'
import { loggedIn } from '~base/middlewares/'
import { Editor } from '@tinymce/tinymce-react'
import api from '~base/api'
import MarbleForm from '~base/components/marble-form'
import BaseModal from '~base/components/base-modal'

class EmailBuilderContainer extends PageComponent {
  constructor (props) {
    super(props)
    this.state = {
      ...this.baseState,
      classNameModal: '',
      email: {},
      schema: {},
      formData: {},
      variables: {},
      isAvailableTry: true
    }
  }

  async onPageEnter () {
    await this.loadCurrentEmail()
  }

  changeHandler (formData) {
    this.setState({
      formData,
      isAvailableTry: false
    })
  }

  async submitHandler (formData) {
    let { content } = this.state

    try {
      let { data } = await api.post('/admin/emails/' + this.props.match.params.uuid, {
        name: formData.name,
        description: formData.description,
        variables: formData.variables.map(l => l.value).join(','),
        content: content
      })
      this.setState({
        isAvailableTry: true,
        email: {
          name: data.name,
          title: data.title,
          content: data.content,
          variables: data.variables !== '' ? data.variables.split(',').map(l => {
            return {
              value: l,
              label: l
            }
          }) : []
        },
        content: data.content
      })
    } catch (error) {
      console.error(error)
    }
  }

  tryEmail () {
    this.setState({
      classNameModal: 'is-active'
    })
  }

  async loadCurrentEmail () {
    let { match: { params: { uuid } } } = this.props
    var url = '/admin/emails/' + uuid
    let { data } = await api.get(url)

    this.setState({
      email: {
        name: data.name,
        title: data.title,
        content: data.content,
        variables: data.variables !== '' ? data.variables.split(',').map(l => {
          return {
            value: l,
            label: l
          }
        }) : []
      },
      content: data.content
    })
  }

  handleEditorChange (e) {
    this.setState({
      content: e.target.getContent(),
      isAvailableTry: false
    })
  }

  successHandler (data) {
    if (this.props.finishUp) { this.props.finishUp(data) }
  }

  hideModal () {
    this.setState({
      classNameModal: ''
    })
  }

  changeHandlerVariables (formData) {
    this.setState({ variables: formData })
  }

  successHandlerVaribales (formData) {
    this.setState({
      classNameModal: ''
    })
  }

  async submitHandlerVaribales (formData) {
    let { match: { params: { uuid } } } = this.props
    try {
      await api.post('/admin/emails/' + uuid + '/try',
        this.state.variables)
    } catch (error) {
      console.error(error)
    }
  }

  render () {
    const basicStates = super.getBasicStates()
    if (basicStates) { return basicStates }

    let { content, email, isAvailableTry } = this.state

    const schemaVariables = {}

    for (let variable of email.variables) {
      schemaVariables[variable.value] = {
        'widget': 'TextWidget',
        'name': variable.value,
        'label': variable.value,
        'required': true
      }
    }

    const schema = {
      'name': {
        'widget': 'TextWidget',
        'name': 'name',
        'label': 'Name',
        'required': true
      },
      'title': {
        'name': 'title',
        'label': 'Title',
        'widget': 'TextareaWidget',
        'required': true
      },
      'variables': {
        'name': 'variables',
        'label': 'Variables',
        'widget': 'MultipleSelectWidget',
        'addable': true,
        options: [
          'url',
          'username',
          'nameCompany',
          'email',
          'emailContact',
          'urlRedirect',
          'total',
          'title',
          'description'
        ]
      }
    }

    return (
      <div className='columns c-flex-1 is-marginless'>
        <div className='column is-paddingless'>
          <div className='section'>
            {this.getBreadcrumbs()}

            <div className='columns'>

              <div className='column'>
                <div className='card'>
                  <header className='card-header'>
                    <p className='card-header-title'>
                      Email Builder
                    </p>
                    <a className='card-header-icon' aria-label='more options'>
                      <button
                        disabled={!isAvailableTry}
                        className='button icon' onClick={() => this.tryEmail()}>
                        <i className='fa fa-paper-plane' aria-hidden='true' />
                      </button>
                    </a>
                  </header>
                  <div className='card-content'>
                    <Editor
                      initialValue={content}
                      init={{
                        plugins: [
                          'advlist autolink autosave lists link image charmap print preview hr anchor pagebreak',
                          'searchreplace wordcount visualblocks visualchars code fullscreen',
                          'insertdatetime media nonbreaking save table contextmenu directionality',
                          'emoticons template paste textcolor colorpicker textpattern code imagetools codesample toc help'],
                        toolbar1: 'code | undo redo | insert | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
                        toolbar2: 'print preview media | forecolor backcolor emoticons | codesample help',
                        image_advtab: true,
                        file_browser_callback_types: 'image',
                        height: 600
                      }}
                      onChange={(e) => this.handleEditorChange(e)}
                    />
                  </div>
                </div>
              </div>
              <div className='column is-3'>
                <div className='card'>
                  <div className='card-content'>
                    <MarbleForm
                      schema={schema}
                      formData={this.state.email}
                      onChange={(data) => this.changeHandler(data)}
                      onSuccess={(data) => this.successHandler(data)}
                      onSubmit={(data) => this.submitHandler(data)}
                      buttonLabel={this.props.label || 'Save'} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <BaseModal
          title={'Varibles test'}
          className={this.state.classNameModal}
          hideModal={() => this.hideModal()}
        >

          <MarbleForm
            schema={schemaVariables}
            formData={this.state.variables}
            onChange={(data) => this.changeHandlerVariables(data)}
            onSuccess={(data) => this.successHandlerVaribales(data)}
            onSubmit={(data) => this.submitHandlerVaribales(data)}
            buttonLabel={'Test email'} />
        </BaseModal>
      </div>
    )
  }
}

EmailBuilderContainer.config({
  name: 'email-builder',
  path: '/devtools/email-builder/:uuid',
  icon: 'envelope-open',
  title: 'Email Builder',
  breadcrumbs: [
    { label: 'Dashboard', path: '/' },
    { label: 'Developer tools', path: '/devtools' },
    { label: 'Email builder', path: '/devtools/email-builder' },
    { label: '<%= email.name %>' }

  ],
  exact: true,
  validate: loggedIn
})

export default EmailBuilderContainer
