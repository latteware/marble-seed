import Baobab from 'baobab'

const initialState = {
  jwt: window.localStorage.getItem('jwt'),
  config: {}
}

const tree = new Baobab(initialState, {
  autoCommit: false,
  asynchronous: true,
  immutable: true
})

window.tree = tree

export default tree
