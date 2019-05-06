import React from 'react'
import PageComponent from '~base/page-component'
import api from '~base/api'
import { Redirect } from 'react-router-dom'
import LabelForm from './form'
import { loggedIn } from '~base/middlewares/'
import { BaseTable } from '~base/components/base-table'
import BaseModal from '~base/components/base-modal'
import { success } from '~base/components/toast'
import ConfirmButton from '~base/components/confirm-button'
import TreeMenu from 'react-simple-tree-menu'


const treeData = [
  {
    key: 'first-level-node-1',
    label: 'Node 1 at the first level',
    nodes: [
      {
        key: 'second-level-node-1',
        label: 'Node 1 at the second level',
        nodes: [
          {
            key: 'third-level-node-1',
            label: 'Last node of the branch',
            nodes: [] // you can remove the nodes property or leave it as an empty array
          },
        ],
      },
    ],
  },
  {
    key: 'first-level-node-2',
    label: 'Node 2 at the first level',
  },
];

class Translations extends PageComponent {
  constructor (props) {
    super(props)
    this.state = {
      labels: [],
      classNameModal: '',
      lang: null,
      modules: [],
      module: null,
      currentLabel: null,
      node: null,
      depth: null,
      data: []
    }
  }

  async onPageEnter () {
    let data = await this.load()
    data = data.map(l => {
      return {
        key: l,
        label: l,
        nodes : []
      }
    })

    return {
      modules: data,
      data: [
        {
          key: 'es-MX',
          label: 'es-MX',
          nodes: data
        },
        {
          key: 'en-US',
          label: 'en-US',
          nodes: data
        }
      ]
    }
  }

  async load () {
    var url = '/admin/translations/'
    const body = await api.get(url)

    return body.data
  }

  getColumns () {
    return [
      {
        'title': 'Id',
        'property': 'id',
        'default': 'N/A'
      },
      {
        'title': 'Modules',
        'property': 'modules',
        'default': 'N/A',
        formatter: (row) => {
          return (
            <div>
              {
                row.modules.join(', ')
              }
            </div>
          )
        }
      },
      {
        'title': 'Content',
        'property': 'content',
        'default': 'N/A'
      },
      {
        'title': 'Actions',
        formatter: (row) => {
          return (<div className='columns'>
            <div className='column'>
              <button className='button' onClick={() => this.setObject(row)}>
                <i className='fa fa-eye' />
              </button>
            </div>
            <div className='column'>
              <ConfirmButton
                title='Delete translation'
                className='button is-danger'
                classNameButton='button is-danger'
                onConfirm={() => this.handleRemove(row)}
              >
                <i className='fa fa-trash-o' />
              </ConfirmButton>
            </div>
          </div>)
        }
      }
    ]
  }

  async setNode (node) {
    let { lang } = this.state
    let url

    if (node.level > 0) {
      url = `/admin/translations/${lang}/${node.key}`
      this.setState({
        module: node.key
      })
    } else {
      this.setState({
        lang: node.key
      })
      url = `/admin/translations/${node.key}`
    }
    url = `/admin/translations/${node.key}`

    const body = await api.get(url)

    this.setState({
      labels: body.data
    })
  }

  hideModal () {
    this.setState({
      classNameModal: false,
      currentLabel: null
    })
  }

  finish () {
    this.setState({
      classNameModal: false,
      currentLabel: null
    }, this.getLabels)
  }

  getModal () {
    let { currentLabel, lang, modules, module } = this.state

    currentLabel.modules = currentLabel.modules.map(l => {
      return {
        value: l,
        label: l
      }
    })
    return (<BaseModal
      title={'Translation'}
      className={'is-active'}
      hideModal={() => this.hideModal()}
    >
      <LabelForm initialState={currentLabel}
        lang={lang}
        module={module}
        finish={() => this.finish()}
        modules={modules}
        url='/admin/translations' />
    </BaseModal>)
  }

  setObject (row) {
    this.setState({
      currentLabel: row,
      classNameModal: true,
      module: row.module,
      lang: row.lang
    })
  }

  async handleBackup () {
    await api.post(`/admin/translations/backup`)
    success()
  }

  async handleSynchronize () {
    await api.post(`/admin/translations/synchronize`)
    success()
  }

  async handleRemove (row) {
    await api.del(`/admin/translations/${row.uuid}`)
    success()
    this.getLabels()
  }

  render () {
    const { labels, lang } = this.state

    if (this.state.redirect) {
      return <Redirect to='/log-in' />
    }

    return (<div className='section'>
      <div className='columns'>



        <div className='column has-text-right'>
          {
            lang && (<button
              className={'button'}
              onClick={() => this.setState({ classNameModal: true, currentLabel: null })}
            >
              <span className='icon'>
                <i className='fa fa-plus' />
              </span>
              <span>New translation</span>
            </button>)
          }

          <button
            className={'button'}
            onClick={e => this.handleBackup()}
          >
            <span className='icon'>
              <i className='fa fa-download' />
            </span>
            <span>Backup (db => json)</span>
          </button>
          <button
            className={'button'}
            onClick={e => this.handleSynchronize()}
          >
            <span className='icon'>
              <i className='fa fa-file' />
            </span>
            <span>Sync (json => db)</span>
          </button>
        </div>
      </div>

      <div className='columns'>
        <div className='column is-4'>
          <div className='card'>
            <div className='card-header'>
              <p className='card-header-title'>
                Translations
              </p>
            </div>
            <div className='card-content'>
              <TreeMenu data={this.state.data} onClickItem={(e) => this.setNode(e)} />

              {/* <SuperTreeview
                isDeletable={(node, depth) => { return false; }}
                isCheckable={(node, depth) => {
                  return false
                }}
                onExpandToggleCb={(node, depth) => {
                  this.setNode(node, depth)
                }}
                noChildrenAvailableMessage='***'
                data={this.state.data}
                onUpdateCb={(updatedData) => {
                  this.setState({ data: updatedData })
                }} /> */}
            </div>
          </div>
        </div>
        <div className='column'>
          <div className='card'>
            <div className='card-content'>
              <BaseTable
                handleSort={(e) => this.handleSort(e)}
                data={labels}
                columns={this.getColumns()}
                sortAscending={this.state.sortAscending}
                sortBy={this.state.sort} />
            </div>
          </div>
        </div>
      </div>
      {
        this.state.classNameModal && this.getModal()
      }
    </div>)
  }
}

Translations.config({
  path: '/devtools/translations',
  exact: true,
  title: 'Translations',
  icon: 'list',
  validate: loggedIn
})

export default Translations
