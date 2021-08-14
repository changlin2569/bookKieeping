'use strict'
const fs = require('fs')
const moment = require('moment')
const mkdirp = require('mkdirp')
const path = require('path')

const Controller = require('egg').Controller

class UploadController extends Controller {
    async upload() {
        const { ctx } = this
        const file = ctx.request.files[0]
        let uploadDir = ''
        try {
            // 读取文件数据
            const fileInfo = fs.readFileSync(file.filepath)
            // 获取当前日期
            const now = moment(new Date()).format('YYYYMMDD')
            // 创建文件保存路径
            const dir = path.join(this.config.uploadDir, now)
            const date = Date.now()
            // 有无此目录，没有则创建
            await mkdirp(dir)
            // 返回文件保存路径  path.extname获取文件后缀
            uploadDir = path.join(dir, date + path.extname(file.filename))
            // 写入文件
            fs.writeFileSync(uploadDir, fileInfo)
        } catch (e) {
            console.log(e)
            ctx.body = {
                code: 411,
                msg: '上传失败'
            }
        } finally {
            ctx.cleanupRequestFiles()
        }

        ctx.body = {
            code: 200,
            msg: '上传成功',
            data: uploadDir.replace(/app/g, '')
        }
    }
}

module.exports = UploadController