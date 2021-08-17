'use strict';

const moment = require('moment')

const Controller = require('egg').Controller

class BillController extends Controller {
    async add() {
        const { ctx, app } = this
        const token = ctx.request.header.authorization
        const { pay_type, amount, date, type_id, type_name, remark = '' } = ctx.request.body

        if (!pay_type || !amount || !date || !type_id || !type_name) {
            ctx.body = {
                code: 411,
                msg: '账单参数缺少'
            }
        }

        try {
            const { id: user_id } = await app.jwt.verify(token, app.config.jwt.secret)
            await ctx.service.bill.add({
                pay_type,
                amount,
                date,
                type_id,
                type_name,
                remark,
                user_id
            })

            ctx.body = {
                code: 200,
                msg: '添加成功'
            }
        } catch (e) {
            console.log(e)
            ctx.body = {
                code: 500,
                msg: '系统错误'
            }
        }

    }
    async list() {
        const { ctx, app } = this
        const { date, page = 1, pageSize = 5, type_id = 'all' } = ctx.query

        try {
            const token = ctx.request.header.authorization
            const { id: user_id } = await app.jwt.verify(token, app.config.jwt.secret)
            // 获取当前用户的所有账单
            const list = await ctx.service.bill.list(user_id)
            // 过滤月份和类型
            const _list = list.filter(item => {
                if (type_id === 'all') {
                    console.log(moment(Number(item.date)).format('YYYY-MM'));
                    return moment(Number(item.date)).format('YYYY-MM') === date
                }
                return moment(Number(item.date)).format('YYYY-MM') === date && item.type_id === type_id
            })
            // 格式化
            // console.log(list);
            const listMap = _list.reduce((prev, item) => {
                const date = moment(Number(item.date)).format('YYYY-MM-DD')
                const index = prev.findIndex(item => item.date === date)
                if (~index) {
                    prev[index].bills.push(item)
                } else {
                    prev.push({
                        date,
                        bills: [item]
                    })
                }
                return prev
            }, [])
            // 分页
            const listMapPage = listMap.slice((page - 1) * pageSize, page * pageSize)
            // 取出当月所有类型账单
            const allTypeList = list.filter(item => moment(Number(item.date)).format('YYYY-MM') === date)
            // 总支出
            const totalOutput = allTypeList.reduce((prev, item) => {
                if (item.pay_type === 1) {
                    prev += (+item.amount)
                }
                return prev
            }, 0)
            // 总收入
            const totalInput = allTypeList.reduce((prev, item) => {
                if (item.pay_type === 2) {
                    prev += (+item.amount)
                }
                return prev
            }, 0)

            ctx.body = {
                code: 200,
                msg: '获取成功',
                data: {
                    totalOutput,
                    totalInput,
                    totalPage: Math.ceil(listMap.length / pageSize),
                    list: listMapPage
                }
            }
        } catch (e) {
            console.log(e)
            ctx.body = {
                code: 411,
                msg: '获取失败'
            }
        }
    }
    // 获取账单详情
    async detail() {
        const { ctx, app } = this
        const { id = '' } = ctx.query
        const token = ctx.request.header.authorization
        if (!id) {
            ctx.body = {
                code: 411,
                msg: '订单id不能为空'
            }
            return
        }
        try {
            const { id: user_id } = await app.jwt.verify(token, app.config.jwt.secret)
            const detail = await ctx.service.bill.detail(id, user_id)
            ctx.body = {
                code: 200,
                msg: '成功',
                data: detail
            }
        } catch (e) {
            console.log(e)
            ctx.body = {
                code: 500,
                msg: '发生错误'
            }
        }
    }
    // 修改账单
    async update() {
        const { ctx, app } = this
        const { id, amount, type_id, type_name, date, pay_type, remark = '' } = ctx.request.body
        if (!id || !amount || !type_id || !type_name || !date || !pay_type) {
            ctx.body = {
                code: 411,
                msg: '  缺少参数'
            }
            return
        }
        try {
            const token = ctx.request.header.authorization
            const { id: user_id } = await app.jwt.verify(token, app.config.jwt.secret)

            await ctx.service.bill.update({
                id,
                amount,
                type_id,
                type_name,
                date,
                pay_type,
                remark,
                user_id
            })

            ctx.body = {
                code: 200,
                msg: '成功'
            }
        } catch (e) {
            console.log(e)
            ctx.body = {
                code: 500,
                msg: '失败'
            }
        }
    }
    // 删除账单
    async delete() {
        const { ctx, app } = this
        const { id = '' } = ctx.request.body
        const token = ctx.request.header.authorization

        if (!id) {
            ctx.body = {
                code: 411,
                msg: '缺少id参数'
            }
            return
        }

        try {
            const { id: user_id } = await app.jwt.verify(token, app.config.jwt.secret)

            await ctx.service.bill.update(
                id,
                user_id
            )

            ctx.body = {
                code: 200,
                msg: '删除成功'
            }
        } catch (e) {
            console.log(e)
            ctx.body = {
                code: 500,
                msg: '发生错误失败'
            }
        }
    }
    // 数据
    async data() {
        const { app, ctx } = this
        const { date = '' } = ctx.query
        const token = ctx.request.header.authorization

        try {
            const { id: user_id } = await app.jwt.verify(token, app.config.jwt.secret)
            const list = await ctx.service.bill.list(user_id)
            // 根据时间参数，筛选出当月所有的账单数据
            const start = moment(date).startOf('month').unix() * 1000; // 选择月份，月初时间
            const end = moment(date).endOf('month').unix() * 1000; // 选择月份，月末时间
            const _data = list.filter(item => (Number(item.date) > start && Number(item.date) < end))
            // 计算总支出
            const totalOutput = _data.reduce((prev, item) => {
                if (item.pay_type === 1) {
                    prev += (+item.amount)
                }
                return prev
            }, 0)
            // 计算总收入
            const totalInput = _data.reduce((prev, item) => {
                if (item.pay_type === 2) {
                    prev += (+item.amount)
                }
                return prev
            })
            // 获取收支构成
            const total_data = _data.reduce((prev, item) => {
                const index = prev.findIndex(current => item.type_id === current.type_id)
                if (~index) {
                    prev[index].number += (+item.amount)
                } else {
                    prev.push({
                        type_id: item.type_id,
                        type_name: item.type_name,
                        pay_type: item.pay_type,
                        number: +item.amount
                    })
                }
            }, []).map(item => +(+(item.number).toFixed(2)))

            ctx.body = {
                code: 200,
                msg: '成功',
                data: {
                    totalOutput: +(totalOutput).toFixed(2),
                    totalInput: +(totalInput).toFixed(2),
                    total_data: total_data || [],
                }
            }
        } catch (e) {
            console.log(e)
            ctx.body = {
                code: 500,
                msg: '发生错误'
            }
        }
    }
}

module.exports = BillController