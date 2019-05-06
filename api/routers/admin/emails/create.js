const Route = require('lib/router/route')
const lov = require('lov')
const { Email } = require('models')

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
  <div class="wrapper">
    <center>
      <table class="container">
  <tbody>
    <tr>
      <td class="header">
        <a href="https://github.com/latteware/marble-seeds/" class="logo" target="_blank">
          <img src="http://bulma.io/images/bulma-logo.png" width="295" height="75" alt="marble-seeds">
        </a>
      </td>
    </tr>
    <tr>
      <td colspan="2" class="body">
        <p class="main">Invitacion para acceder a Marble Seeds</p>
        <p class="label">Haz click en el botón:</p>
        <p>
          <a class="btn" href="{{ url }}" target="_blank">Acceder</a>
        </p>
        <p>o copia esta url: <a class="link" href="{{ url }}">{{ url }}</a></p>
      </td>
    </tr>
    <tr>
      <td colspan="2" class="footer">
        Para preguntas de suporte visita <br/><a class="link" href="https://github.com/latteware/marble-seeds/" target="_blank">https://github.com/latteware/marble-seeds/</a> y crea un issue.
      </td>
    </tr>
  </tbody>
</table>
    </center>
  </div>
</body>
`

module.exports = new Route({
  method: 'post',
  path: '/',
  validator: lov.object().keys({
    name: lov.string().required()
  }),
  handler: async function (ctx) {
    let { body: data } = ctx.request
    data.content = defaultContent

    const email = await Email.create(data)

    ctx.body = {
      data: email.toAdmin()
    }
  }
})
