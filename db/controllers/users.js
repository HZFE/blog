"use strict";
const mongoose = require("mongoose");
const users = require("../models/users")
const { wrap: async } = require('co');
const md5 = require("md5");

exports.login = async( function*(req, res) {
    let name = req.body.name;
    let password = md5(req.body.password);
    let data = yield users
    .findOne({"name":name})
    .exec()
    if(data == null){
        res.json({
            "status":"fail",
            "msg":"账号错误"
        })
    }else {
        if(name == data.name &&  password == data.password){
            req.session.name = data.name;
            req.session._id = data._id;
            req.session.sign = "true";
            res.json({
                "status":"success",
            })
        }else if (password != data.password){
            res.json({
                "status":"fail",
                "msg":"密码错误"
            })
        }
    }
})

exports.logon = async(function* (req, res) {
    req.body.password = md5(req.body.password);
    req.body.emailmd5 = md5(req.body.email)
    users.create(req.body)
    .then(data=>{
        res.json({
            "status":"success",
            "data":data
        })
    })
    .catch(err=>{
        res.json({
            "status":"fail"
        })
    })
})
exports.checkLogin = async(function* (req, res, next){
    if(req.session.sign == "true") {
        let data = yield users.finds(req.session._id)

        res.json({
            "status":"success",
            "data":data
        })
    } else {
        res.json({
            "status":"fail",
            "msg":"没有登陆"
        })
        return false;
    }
})
exports.requiresLogin = async(function* (req, res, next){
    if(req.session.sign == "true") {
        next()
    } else {
        res.json({
            "status":"fail",
            "msg":"请登录！！！！"
        })
    }
})
exports.logout = async(function* (req, res){
    req.session.destroy(function(err, data){
        req.session = null
        if(!err){
            res.json({
                "status":"success"
            })
        }
    })
})