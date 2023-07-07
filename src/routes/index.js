const router = require('koa-router')()
const { ENV } = require('../utils/env')
const packageInfo = require('../../package.json')
const testMysqlConn = require('../db/mysql2')
const { WorkModel } = require('../models/WorkModel')
const { cacheGet, cacheSet } = require('../cache/index')
const loginCheck = require('../middlewares/loginCheck')

// router.get('/', async (ctx, next) => {
//   await ctx.render('index', {
//     title: 'Hello Koa 2!'
//   })
// })

// router.get('/string', async (ctx, next) => {
//   ctx.body = 'koa2 string'
// })

// router.get('/json', async (ctx, next) => {
//   ctx.body = {
//     title: 'koa2 json'
//   }
// })

// 测试数据库连接
router.get('/api/db-check', async ctx => {
    // 测试 mysql 连接
    const mysqlRes = await testMysqlConn()

    // 测试 mongodb 连接
    let mongodbConn
    try {
        mongodbConn = true
        await WorkModel.findOne()
    } catch (ex) {
        mongodbConn = false
    }

    // 测试 redis 连接
    cacheSet('name', 'biz water sever OK - by redis')
    const redisTestVal = await cacheGet('name')

    ctx.body = {
        errno: 0,
        data: {
            name: 'bi3 water sever',
            version: packageInfo.version,
            ENV,
            mysqlConn: mysqlRes.length > 0,
            mongodbConn,
            redisConn: redisTestVal != null,
        },
    }
})

// router.get('/getUserInfo', loginCheck, async ctx => {
//     // 经过了 loginCheck ，用户信息在 ctx.userInfo 中
//     ctx.body = new SuccessRes(ctx.userInfo)
// })

module.exports = router
