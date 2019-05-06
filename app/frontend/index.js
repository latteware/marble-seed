import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import Router from './router'
import { addLocaleData, IntlProvider, defineMessages } from 'react-intl'
import './styles/index.scss'
import en from 'react-intl/locale-data/en'
import es from 'react-intl/locale-data/es'
import api from '~base/api'

addLocaleData([...es, ...en])

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      locale: localStorage.getItem('lang') || 'es-MX',
      messages: null
    }
    window.addEventListener('lang', this.changeLanguage);
  }

  changeLanguage = e => {
    this.setState({ locale: e.detail.lang }, this.loadTranslations)
    localStorage.setItem('lang', e.detail.lang)
  }

  async componentWillMount () {
    await this.loadTranslations()
  }

  async loadTranslations () {
    const { locale } = this.state
    const config = await api.get(`/app-config/translations/${locale}`)
    if (config) {
      this.setState({
        messages: config.data
      })
    }
  }

  formatMessages (messages) {
    let format = {}
    if (!messages) return format
    for (let message of messages) {
      for (let module of message.modules) {
        format[`${module}.${message.id}`] = message.content
      }
    }
    return format
  }

  render () {
    let { messages, locale } = this.state
    const { Root } = this.props
    return (
      <IntlProvider
        messages={this.formatMessages(messages)}
        locale={locale}>
        <Root />
      </IntlProvider>
    )
  }
}

if (module.hot) {
  module.hot.accept('./router.js', function (Root) {
    const Router = require('./router')
    ReactDOM.render(
      <App Root={Router.default} />,
      document.getElementById('root')
    );
  });
}

ReactDOM.render(<App Root={Router} />, document.getElementById('root'))
