import { user } from '../models'
import md5 from 'md5'
import validator from 'validator'
import jwt from 'jsonwebtoken'

export default {
    logon: async (req, res) => {
        let name = req.body.name
        let password = req.body.password
        let email = req.body.email

        if (!name || name === '') {
            return res.json({
                success: false,
                message: '没有填写名字',
            })
        }
        if (!password || password === '') {
            return res.json({
                success: false,
                message: '没有填写密码',
            })
        }
        if (!email || email === '') {
            return res.json({
                success: false,
                message: '没有填写email',
            })
        } else if (!validator.isEmail(email)) {
            return res.json({
                success: false,
                message: 'email格式不正确',
            })
        }

        let userInfo = {
            name: name,
            password: md5(md5(password)),
            email: email
        }

        await user.findOne({name: userInfo.name})
            .then(data => {
                if (data) {
                    return res.json({
                        success: true,
                        message: '用户名已存在',
                    })
                }
            })

        await user.findOne({email: userInfo.email})
            .then(data => {
                if (data) {
                    return res.json({
                        success: true,
                        message: '邮箱已注册',
                    })
                }
            })

        await user.create(userInfo)
            .then(() => {
                return res.json({
                    success: true,
                    message: '注册成功',
                })
            })
            .catch(() => {
                return res.json({
                    success: false,
                    message: '注册失败',
                })
            })
    },
    login: async (req, res) => {
        let name = req.body.name
        let password = req.body.password
        if (!password || password === '') {
            return res.json({
                success: false,
                message: '没有填写名字',
            })
        }
        if (!password || password === '') {
            return res.json({
                success: false,
                message: '没有填写密码',
            })
        }
        let userInfo = {
            name: name,
            password: md5(md5(password))
        }
        await user.findOne({name: userInfo.name})
            .then(response => {
                if (response !== null) {
                    if (response.password !== userInfo.password) {
                        return res.json({
                            success: false,
                            message: '密码错误',
                        })
                    } else {
                        let token = jwt.sign(response.name, 'wanan')
                        req.session.token = token
                        return res.json({
                            success: true,
                            message: '登录成功',
                            token: token
                        })
                    }
                } else {
                    return res.json({
                        success: false,
                        message: '没有此账号',
                    })
                }
            })
    },
    verify: async (req) => {
        let token = req.session.token || null
        if (token) {
            try {
                var decoded = jwt.verify(token, 'wanan')
            } catch (err) {
                return Promise.reject('token验证失败')
            }
            try {
                let e = await user.findOne({name: decoded})
                    .select({password: 0})
                    .exec()
                if (e) {
                    return Promise.resolve()
                } else {
                    return Promise.reject('token验证失败')
                }
            } catch (err) {
                return Promise.reject('token验证失败')
            }
        } else {
            return Promise.reject('token验证失败')
        }
    }
}