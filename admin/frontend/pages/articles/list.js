import React from 'react'
import Link from '~base/router/link'
import moment from 'moment'
import env from '~base/env-variables'
import ListPageComponent from '~base/list-page-component'
import {loggedIn} from '~base/middlewares/'
import CreateArticle from './create'
import DeleteButton from '~base/components/base-deleteButton'
import api from '~base/api'

class ArticlesList extends ListPageComponent {
  finishUp (data) {
    this.setState({
      className: ''
    })

    this.props.history.push(env.PREFIX + '/articles/' + data.data.uuid)
  }

  async deleteObject (row) {
    await api.del('/admin/articles/' + row.uuid)
    this.reload()
  }

  getColumns () {
    return [
      {
        title: 'Título',
        property: 'title',
        default: 'N/A'
      },
      {
        title: 'Descripción',
        property: 'description',
        default: 'N/A',
        formatter: (row) => {
          return row.description.length > 150 ? row.description.substring(0, 100) + '...' : row.description
        }
      },
      {
        title: 'Tags',
        property: 'tags',
        default: 'N/A'
      },
      {
        'title': 'Status',
        'property': 'status',
        'default': 'N/A',
        'sortable': true
      },
      {
        'title': 'Creado',
        'property': 'createdAt',
        'default': 'N/A',
        'sortable': true,
        formatter: (row) => {
          return (
            moment.utc(row.createdAt).local().format('DD/MM/YYYY hh:mm a')
          )
        }
      },
      {
        'title': 'Acciones',
        'sortable': false,
        formatter: (row) => {
          return (
            <div className='field is-grouped'>
              <div className='control'>
                <Link className='button' to={'/articles/' + row.uuid}>
                  Detalle
                </Link>
              </div>
              <div className='control'>
                <DeleteButton
                  iconOnly
                  icon='fa fa-trash'
                  objectName='Producto'
                  objectDelete={() => this.deleteObject(row)}
                  message={`¿Estás seguro de querer eliminar a ${row.title} ?`}
                />
              </div>
            </div>
          )
        }
      }
    ]
  }

  getFilters () {
    const data = {
      schema: {
        type: 'object',
        required: [],
        properties: {
          status: {type: 'text',
            title: 'Por estatus',
            values: [
              {uuid: 'draft', name: 'Editando'},
              {uuid: 'review', name: 'Revisión'},
              {uuid: 'published', name: 'Publicados'}
            ]
          }
        }
      },
      uiSchema: {
        status: {'ui:widget': 'SelectSearchFilter'}
      }
    }
    return data
  }

  exportFormatter (row) {
    return {name: row.name,
      email: row.email,
      addresses: row.addresses,
      role: row.role,
      status: row.status,
      industry: row.industry,
      updatedat: row.updatedat,
      createdat: row.createdat
    }
  }
}

ArticlesList.config({
  name: 'articles-list',
  path: '/articles',
  title: 'Artículos',
  icon: 'file',
  exact: true,
  validate: loggedIn,
  headerLayout: 'create',
  createComponent: CreateArticle,
  createComponentLabel: 'Nuevo artículo',
  apiUrl: '/admin/articles'
})

export default ArticlesList
