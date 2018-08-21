import React, { Component } from 'react'
import {Route, Redirect} from 'react-router-dom'
import uuid from 'uuid'
import _ from 'lodash'

import tree from '~core/tree'
import env from '~base/env-variables'
import Breadcrumbs from '~base/components/breadcrumbs'

class Context {
  throw (status, message) {
    this.hasError = true
    this.error = {status, message}
  }

  redirect (uri) {
    this.hasRedirect = true
    this.redirectTo = uri
  }
}

class PageComponent extends Component {
  static config (config) {
    this.config = config
  }

  static asSidebarItem () {
    const ctx = new Context()
    const config = this.config

    if (config.validate) {
      if (_.isArray(config.validate)) {
        for (var validate of config.validate) {
          if (!ctx.hasError || !ctx.hasRedirect) {
            validate(ctx, config)
          }
        }
      } else {
        config.validate(ctx, config)
      }
    }

    if (ctx.hasError || ctx.hasRedirect) {
      return null
    }

    return {
      title: config.title,
      icon: config.icon,
      to: config.path
    }
  }

  static asRouterItem (props) {
    const config = this.config

    return <Route exact={config.exact} path={env.PREFIX + config.path} render={props => {
      const ctx = new Context()

      if (config.validate) {
        if (_.isArray(config.validate)) {
          for (var validate of config.validate) {
            if (!ctx.hasError || !ctx.hasRedirect) {
              validate(ctx, config)
            }
          }
        } else {
          config.validate(ctx, config)
        }
      }

      if (ctx.hasError) {
        return <div>Has error {ctx.error.status}</div>
      }

      if (ctx.hasRedirect) {
        return <Redirect to={{pathname: env.PREFIX + ctx.redirectTo}} />
      }

      return React.createElement(this, props)
    }} />
  }

  constructor (props) {
    super(props)

    this.baseState = {loaded: false}
    this.config = this.constructor.config || {}

    this.state = this.baseState

    if (!this.config.name) {
      this.config.name = uuid.v4()
    }

    this.config.cursorName = `page:${this.config.name}`
    if (!tree.get(this.config.cursorName)) {
      tree.set(this.config.cursorName, {})
    }
  }

  async componentWillMount () {
    const pageCursor = tree.select(this.config.cursorName)

    if (pageCursor.get('initialDataLoaded')) {
      this.setState(pageCursor.get('initialData'))
    } else if (this.onFirstPageEnter) {
      const firstPageEnterData = await this.onFirstPageEnter()

      this.setState(firstPageEnterData)
      pageCursor.set('initialData', firstPageEnterData)
      pageCursor.set('initialDataLoaded', true)
      tree.commit()
    }

    if (this.onPageEnter) {
      const pageEnterData = await this.onPageEnter()

      this.setState(pageEnterData)
    }

    this.setState({loaded: true})
    this.setTitle()
  }

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)

    if (nextProps.match.params && this.props.match.params && !_.isEqual(nextProps.match.params, this.props.match.params)) {
      this.setState({loaded: false})
      setTimeout(() => {
        this.reload()
      }, 10)
    }
  }

  componentWillUnmount () {}

  setTitle () {
    try {
      let templateString
      if (this.config.title) {
        templateString = `${this.config.title} | ${env.BASE_TITLE}`
      } else {
        templateString = `${env.BASE_TITLE}`
      }

      const compiled = _.template(templateString)
      document.title = compiled(this.state)
    } catch (e) {
      console.error('Couldn\'t update title', e.message)
    }
  }

  getBreadcrumbs () {
    if (!this.config.breadcrumbs) {
      return null
    }

    const breadcrumbs = this.config.breadcrumbs.map(item => {
      const compiled = _.template(item.label)

      return {
        path: item.path,
        label: compiled(this.state)
      }
    })

    return <Breadcrumbs breadcrumbs={breadcrumbs} />
  }

  async reload () {
    if (this.onPageEnter) {
      const pageEnterData = await this.onPageEnter()

      this.setState(pageEnterData)
    }

    this.setState({loaded: true})
  }
}

export default PageComponent
