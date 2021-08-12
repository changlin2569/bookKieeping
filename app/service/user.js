'use strict'

const Service = require('egg').Service

class UserService extends Service {
    async getUserByName(username) {
        const { app } = this
        try {
            const result = await app.mysql.get('user', { username })
            return result
        } catch (err) {
            console.log(err)
            return null
        }
    }
    // 注册
    async register(userInfo) {
        const { app } = this
        try {
            const result = await app.mysql.insert('user', userInfo)
            return result
        } catch (err) {
            console.log(err)
            return null
        }
    }
}

module.exports = UserService