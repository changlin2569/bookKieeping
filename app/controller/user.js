'use strict'

const Controller = require('egg').Controller
// 默认头像
const defaultAvatar = 'http://s.yezgea02.com/1615973940679/WeChat77d6d2ac093e247c361f0b8a7aeb6c2a.png'

class UserController extends Controller {
    async register() {
        const { ctx } = this
        const { username, password } = ctx.request.body
        if (!username || !password) {
            ctx.body = {
                code: 411,
                msg: '用户名或密码不能为空'
            }
            return
        }

        // 检测用户名是否已经被注册
        const userInfo = await ctx.service.user.getUserByName(username)
        console.log(userInfo);
        if (userInfo && userInfo.id) {
            ctx.body = {
                code: 411,
                msg: '用户名已被注册'
            }
            return
        }

        // 注册
        const result = await ctx.service.user.register({
            username,
            password,
            signature: '天降正义',
            avatar: defaultAvatar
        })
        if (!result) {
            ctx.body = {
                code: 411,
                msg: '注册失败'
            }
        } else {
            ctx.body = {
                code: 200,
                msg: '注册成功'
            }
        }
    }
    // 登录
    async login() {
        const { ctx, app } = this
        const { username, password } = ctx.request.body

        const userInfo = await ctx.service.user.getUserByName(username)
        if (!userInfo || !userInfo.id) {
            ctx.body = {
                code: 411,
                msg: '用户不存在'
            }
            return
        } else if (userInfo && password !== userInfo.password) {
            ctx.body = {
                code: 411,
                msg: '密码错误'
            }
            return
        }

        // 生成token
        const token = app.jwt.sign({
            id: userInfo.id,
            username: userInfo.username,
            // token有效时间  24小时
            exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60)
        }, app.config.jwt.secret)

        ctx.body = {
            code: 200,
            msg: '登录成功',
            data: {
                token
            }
        }
    }
    // 验证token解析
    async test() {
        const { ctx, app } = this
        const token = ctx.request.header.authorization
        const result = await app.jwt.verify(token, app.config.jwt.secret)

        ctx.body = {
            code: 200,
            msg: 'test',
            data: {
                ...result
            }
        }
    }
    // 获取用户信息
    async getUserInfo() {
        const { ctx, app } = this
        const token = ctx.request.header.authorization
        const { username } = await app.jwt.verify(token, app.config.secret)
        const userInfo = await ctx.service.user.getUserByName(username)

        ctx.status = 200
        ctx.body = {
            code: 200,
            msg: '获取个人信息成功',
            data: {
                username: userInfo.username,
                signature: userInfo.signature,
                id: userInfo.id,
                avatar: userInfo.avatar || defaultAvatar,
            }
        }
    }
}

module.exports = UserController