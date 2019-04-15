const Route = require('lib/router/route')
const lov = require('lov')
const { Email } = require('models')

module.exports = new Route({
  method: 'post',
  path: '/:uuid',
  validator: lov.object().keys({
    name: lov.string().required()
  }),
  handler: async function (ctx) {
    var { uuid } = ctx.params
    var data = ctx.request.body

    let defaultContent = `
<head>
<style>
.wrapper{
  background-color:#fff;
  margin:0 auto 0 auto;
  padding:30px 0 30px 0;
  color:#4f565d;
  font-size:13px;
  line-height:20px;
  font-family:'Helvetica Neue',Arial,sans-serif;
  text-align:left;
}

.container{
  width:550px;
  text-align:center;
}

.header{
  padding:0 0 20px 0;
  border-bottom:1px solid #e9edee;
}

.logo{
  display:block;
  margin:0 auto;
}

.logo img{
  border: 0px;
}

.body{
  padding:30px 0;
}

.main{
  color:#1d2227;
  line-height:28px;
  font-size:22px;
  margin:12px 10px 20px 10px;
  font-weight:400;
}

.label{
  margin:0 10px 10px 10px;
  padding:0;
}

.footer{
  padding:30px 0 0 0;
  border-top:1px solid #e9edee;
  color:#9b9fa5
}

.btn{
  display:inline-block;
  text-decoration:none;
  padding:15px 20px;
  background-color:#2baaed;
  border:1px solid #2baaed;
  border-radius:3px;
  color:#FFF;
  font-weight:bold;
}

.link{
  color:#2baaed;
  text-decoration:none;
}
</style>
</head>

<body>
${data.content}
</body>
`
    data.content = defaultContent

    const email = await Email.findOne({ 'uuid': uuid })
    ctx.assert(email, 404, 'Email not found')

    email.set(data)
    await email.save()

    ctx.body = {
      data: email.toAdmin()
    }
  }
})
