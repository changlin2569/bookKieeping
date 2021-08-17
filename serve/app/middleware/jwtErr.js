'use strict'

module.exports = secret => {
    return async (ctx, next) => {
        const token = ctx.request.header.authorization

        if (token) {
            try {
                await ctx.app.jwt.verify(token, secret)
                await next()
            } catch (err) {
                console.log(err)
                ctx.status = 200
                ctx.body = {
                    code: 401,
                    msg: 'token过期，重新登陆'
                }
                return
            }
        } else {
            ctx.status = 200
            ctx.body = {
                code: 411,
                msg: '请登录后访问'
            }
            return
        }
    }
}