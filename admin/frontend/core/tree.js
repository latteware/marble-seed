import Baobab from 'baobab'

import storage from '~base/storage'

const initialState = {
  jwt: storage.get('jwt'),
  config: {}
}

const tree = new Baobab(initialState, {
  autoCommit: false,
  asynchronous: true,
  immutable: true
})

window.tree = tree

export default tree
