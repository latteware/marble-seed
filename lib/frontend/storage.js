import env from './env-variables'

const storage = {
  get: function (name) {
    if (env.STORAGE_PREFIX) {
      name = `${env.STORAGE_PREFIX}:${name}`
    }

    return window.localStorage.getItem(name)
  },
  set: function (name, value) {
    if (env.STORAGE_PREFIX) {
      name = `${env.STORAGE_PREFIX}:${name}`
    }

    return window.localStorage.setItem(name, value)
  },
  remove: function (name) {
    if (env.STORAGE_PREFIX) {
      name = `${env.STORAGE_PREFIX}:${name}`
    }

    return window.localStorage.removeItem(name)
  }
}

export default storage
