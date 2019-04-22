import React, { Component } from 'react'
import FileSaver from 'file-saver'
import api from '~base/api'
import Loader from '~base/components/spinner'
import moment from 'moment'
import classNames from 'classnames'

import PageComponent from '~base/page-component'
import { loggedIn } from '~base/middlewares/'

class RequestLog extends Component {
  constructor (props) {
    super(props)

    this.state = {
      toggled: true,
      log: undefined,
      jsonString: undefined,
      isDownloading: '',
      isReplaying: ''
    }
  }

  async loadLog (uuid) {
    if (this.state.log) return

    const body = await api.get('/admin/request-logs/' + uuid)

    var jsonString = JSON.stringify(body.data, null, 2)
    this.setState({ log: body.data, jsonString: jsonString })
  }

  async showLog () {
    this.setState({ toggled: !this.state.toggled })
    await this.loadLog(this.props.log.uuid)
  }

  getBody () {
    if (this.state.log && this.state.jsonString) {
      return (<pre className='json'>{this.state.jsonString}</pre>)
    }

    return (<Loader />)
  }

  async replayRequest () {
    this.setState({ isReplaying: ' is-loading' })

    const url = `/admin/request-logs/${this.props.log.uuid}/replay`
    try {
      let res = await api.post(url)

      this.setState({ isReplaying: '' })

      this.props.handleReplayRequest({
        uuid: this.props.log.uuid,
        replayUuid: res.requestLog.uuid
      })
    } catch (e) {
      this.setState({
        isReplaying: ''
      })
    }
  }

  async downloadRequest () {
    this.setState({ isDownloading: ' is-loading' })

    const url = `/admin/request-logs/export/${this.props.log.uuid}`

    try {
      let res = await api.get(url)
      var blob = new window.Blob([JSON.stringify(res, null, '  ')], { type: 'application/json;charset=utf-8' })
      FileSaver.saveAs(blob, `${this.props.log.path}.json`)
      this.setState({ isDownloading: '' })
    } catch (e) {
      this.setState({
        isDownloading: ''
      })
    }
  }

  render () {
    const { log } = this.props
    const { toggled } = this.state

    const className = classNames('request-log message ', {
      'is-danger': log.status >= 500,
      'is-warning': log.status >= 400 && log.status < 500,
      'is-success': log.status >= 200 && log.status < 400,
      'highlight': this.props.highlight
    })

    const classNameBody = classNames('message-body is-paddingless', {
      'hide-log': toggled,
      'show-log': !toggled
    })

    return (
      <article className={className}>
        <div className='message-header' onClick={e => this.showLog(e)}>
          <p>
            <strong>{log.status}</strong> - <strong>{log.method}</strong> {log.path}
          </p>
          <p className='is-pulledright'>
            {moment(log.createdAt).format()}
          </p>
        </div>
        <div className={classNameBody}>
          <div className='columns controls'>
            <div className='column has-text-right'>
              <button
                className={'button' + this.state.isReplaying}
                disabled={!!this.state.isReplaying}
                onClick={e => this.replayRequest()}
              >
                <span className='icon'>
                  <i className='fa fa-reply' />
                </span>
                <span>Replay</span>
              </button>
              <button
                className={'button' + this.state.isDownloading}
                disabled={!!this.state.isDownloading}
                onClick={e => this.downloadRequest()}
              >
                <span className='icon'>
                  <i className='fa fa-download' />
                </span>
                <span>Postman</span>
              </button>
            </div>
          </div>
          <div className='columns'>
            <div className='column' style={{ paddingTop: '0px' }}>
              {this.getBody()}
            </div>
          </div>
        </div>
      </article>
    )
  }
}

class RequestLogs extends PageComponent {
  constructor (props) {
    super(props)

    this.state = {
      ...this.baseState,
      loadingLogs: false,
      logsPerPage: 20,
      filters: {},
      metadata: {
        pathnames: [],
        methods: []
      },
      currentUuid: '',
      newReplay: ''
    }
  }

  async onFirstPageEnter () {
    const metadata = await api.get('/admin/request-logs/metadata')
    const filters = this.getDefaultFilterValues()

    this.setState({ filters })
    return { metadata }
  }

  async onPageEnter () {
    const logs = await api.get('/admin/request-logs', {
      start: 0,
      limit: this.state.logsPerPage
    })

    return { logs }
  }

  async load (filters) {
    try {
      const logs = await api.get('/admin/request-logs', {
        ...filters,
        start: 0,
        limit: this.state.logsPerPage
      })

      this.setState({
        page: 0,
        loadingLogs: false,
        filters,
        logs
      })
    } catch (e) {
      this.setState({
        page: 0,
        loadingLogs: false,
        filters,
        error: e.message,
        logs: { data: [], total: 0 }
      })
    }
  }

  async loadMore () {
    this.setState({
      loadingLogs: true
    })

    const page = this.state.page + 1

    const body = await api.get('/admin/request-logs', {
      ...this.state.filters,
      start: page * this.state.logsPerPage,
      limit: this.state.logsPerPage
    })

    this.setState({
      page,
      loadingLogs: false,
      logs: {
        data: this.state.logs.data.concat(body.data)
      }
    })
  }

  setStatusFilter (status) {
    this.setState({
      loadingLogs: true
    })

    this.load({
      ...this.state.filters,
      status
    })
  }

  async setReplayRequest (data) {
    this.setState({
      newReplay: data.replayUuid,
      currentUuid: data.replayUuid,
      loadingLogs: true
    })

    const filters = {
      ...this.state.filters,
      uuid: data.uuid
    }

    this.load(filters)
  }

  async handleUuuiChange (e) {
    if (e.which === 13) {
      this.setState({
        loadingLogs: true
      })

      this.load({
        ...this.state.filters,
        uuid: e.currentTarget.value
      })
    }
  }

  getDefaultFilterValues () {
    return {
      status: '',
      pathname: '',
      uuid: '',
      type: ''
    }
  }

  reload () {
    this.setState({
      loadingLogs: true
    })

    this.load(this.state.filters)
  }

  clear () {
    const filters = this.getDefaultFilterValues()

    this.setState({
      currentUuid: '',
      error: '',
      filters
    }, () => {
      this.reload()
    })
  }

  handleSelectChange (type, e) {
    this.setState({
      loadingLogs: true
    })

    const value = e.currentTarget.value

    const filter = {}
    filter[type] = value

    this.load({
      ...this.state.filters,
      ...filter
    })
  }

  handleInputChange (type, e) {
    const newState = {}
    newState[type] = e.currentTarget.value

    this.setState(newState)
  }

  list () {
    const { logs, newReplay } = this.state

    return logs.data.map(log => {
      return <RequestLog
        key={'log-' + log.uuid}
        highlight={log.uuid === newReplay}
        log={log}
        handleReplayRequest={(data) => this.setReplayRequest(data)} />
    })
  }

  isActiveBtn (value) {
    return 'control ' + ((value === this.state.filters.status) ? 'is-active is-active-btn' : '')
  }

  render () {
    const basicStates = super.getBasicStates()
    if (basicStates) { return basicStates }

    const { metadata, logs, error } = this.state
    const { pathnames } = metadata

    const loading = this.state.loadingLogs
    const more = (logs.total / logs.data.length) > 1
    const classNameLoadLink = classNames('button is-white is-small', {
      'is-loading': this.state.loadingLogs
    })

    const classNameStatusBtn = classNames('button', {
      'is-transparent': this.state.filters.status
    })

    let errorElement
    if (error) {
      errorElement = (<div>{error}</div>)
    }

    return (
      <div className='columns c-flex-1 is-marginless'>
        <div className='column is-paddingless'>
          <div className='section'>
            <div className='columns'>
              {this.getBreadcrumbs()}
            </div>
            <div className='header columns'>
              <div className='column is-narrow'>
                <div className='field has-addons is-padding-bottom-small'>
                  <div className='control'>
                    <a className='button is-white' onClick={() => this.reload()}>
                      <span className='icon'>
                        <i className='fa fa-refresh' />
                      </span>
                      <span>Reload</span>
                    </a>
                  </div>
                </div>
              </div>
              <div className='column is-narrow'>
                <div className='field has-addons is-padding-bottom-small'>
                  <div className='control'>
                    <a className='button is-white' onClick={() => this.clear()}>
                      <span className='icon'>
                        <i className='fa fa-eraser' />
                      </span>
                      <span>Clear</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className='header columns'>
              <div className='column is-narrow'>
                <p className='subtitle is-marginless'>Status codes</p>
                <div className='field has-addons is-padding-bottom-small'>
                  <div className={this.isActiveBtn('')}>
                    <a
                      className={classNameStatusBtn + ' is-white '}
                      onClick={() => this.setStatusFilter('')}>ALL</a>
                  </div>
                  <div className={this.isActiveBtn('success')}>
                    <a
                      className={classNameStatusBtn + ' is-success '}
                      onClick={() => this.setStatusFilter('success')}>200</a>
                  </div>
                  <div className={this.isActiveBtn('warning')}>
                    <a
                      className={classNameStatusBtn + ' is-warning '}
                      onClick={() => this.setStatusFilter('warning')}>400</a>
                  </div>
                  <div className={this.isActiveBtn('error')}>
                    <a
                      className={classNameStatusBtn + ' is-danger '}
                      onClick={() => this.setStatusFilter('error')}>500</a>
                  </div>
                </div>
              </div>

              <div className='column is-narrow'>
                <p className='subtitle is-marginless'>Type</p>
                <div className='select'>
                  <select onChange={e => this.handleSelectChange('type', e)} value={this.state.filters.type}>
                    <option />
                    <option value='inbound'>Inbound</option>
                    <option value='outbound'>Oubound</option>
                  </select>
                </div>
              </div>

              <div className='column is-narrow'>
                <p className='subtitle is-marginless'>Path</p>
                <div className='select'>
                  <select onChange={e => this.handleSelectChange('pathname', e)} value={this.state.filters.pathname}>
                    <option key='empty' />
                    {pathnames.map((pathname, key) => <option key={key} value={pathname}>{pathname}</option>)}
                  </select>
                </div>
              </div>

              <div className='column is-narrow'>
                <p className='subtitle is-marginless'>Log UUID</p>
                <div className=''>
                  <input
                    className='input'
                    type='text'
                    placeholder=''
                    value={this.state.currentUuid}
                    onChange={e => this.handleInputChange('currentUuid', e)}
                    onKeyUp={e => this.handleUuuiChange(e)} />
                </div>
              </div>
            </div>

            {loading && <Loader />}

            {errorElement}

            {this.list()}

            {more && <a className={classNameLoadLink} onClick={() => this.loadMore()}>more</a>}
          </div>
        </div>
      </div>
    )
  }
}

RequestLogs.config({
  path: '/devtools/request-logs',
  title: 'Request Logs',
  icon: 'history',
  exact: true,
  validate: loggedIn,
  breadcrumbs: [
    { label: 'Dashboard', path: '/' },
    { label: 'Developer tools' },
    { label: 'Request logs' }
  ]
})

export default RequestLogs
