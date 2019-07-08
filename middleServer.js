const Koa = require('koa')
const app = new Koa()
const axios = require('axios')
const cors = require('@koa/cors')
const Router = require('koa-router')
const router = new Router()

router.get(
  '/mock/75680/api/deepexi-permission/api/v1/users/currentUser',
  async (ctx, next) => {
    ctx.body = {}
  }
)
router.get(
  '/mock/75680/api/deepexi-permission/api/v2/apps/service/userResource',
  async (ctx, next) => {
    ctx.body = {}
  }
)
router.get('/mock/75680/api/list', async (ctx, next) => {
  const res = await axios.get(`http://yapi.demo.qunar.com${ctx.path}`)
  ctx.body = res.data
})

app.use(
  cors({
    'Access-Control-Allow-Origin': 'http://localhost:3000'
  })
)

app.use(router.routes()).use(router.allowedMethods())

app.listen(4000)
