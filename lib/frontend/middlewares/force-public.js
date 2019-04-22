import tree from '~core/tree'

const forcePublic = function (ctx) {
  if (tree.get('loggedIn')) {
    ctx.redirect('/app')
  }

  return true
}

module.exports = forcePublic
