module.exports = {
  createModel: {
    file: 'create-model',
    command: 'tasks/scaffolding/create-model'
  },
  admin: {
    api: {
      index: {
        file: 'admin-api-index',
        command: 'tasks/scaffolding/admin/admin-api-index'
      },
      list: {
        file: 'admin-api-list',
        command: 'tasks/scaffolding/admin/admin-api-list'
      },
      create: {
        file: 'admin-api-create',
        command: 'tasks/scaffolding/admin/admin-api-create'
      },
      delete: {
        file: 'admin-api-delete',
        command: 'tasks/scaffolding/admin/admin-api-delete'
      },
      update: {
        file: 'admin-api-update',
        command: 'tasks/scaffolding/admin/admin-api-update'
      },
      restore: {
        file: 'admin-api-restore',
        command: 'tasks/scaffolding/admin/admin-api-restore'
      },
      detail: {
        file: 'admin-api-detail',
        command: 'tasks/scaffolding/admin/admin-api-detail'
      }
    },
    frontend: {
      list: {
        file: 'admin-frontend-list',
        command: 'tasks/scaffolding/admin/admin-frontend-list'
      },
      create: {
        file: 'admin-frontend-create',
        command: 'tasks/scaffolding/admin/admin-frontend-create'
      },
      deletedlist: {
        file: 'admin-frontend-deletedlist',
        command: 'tasks/scaffolding/admin/admin-frontend-deletedlist'
      },
      detail: {
        file: 'admin-frontend-detail',
        command: 'tasks/scaffolding/admin/admin-frontend-detail'
      }
    }
  }

}
