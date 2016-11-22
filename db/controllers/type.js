"use strict";
let mongoose = require("mongoose");
let type = require("../models/type");
let article = require("./article")
const moment = require('moment')
moment.locale('zh-cn');

const {isEmail, isEmpty, isLength} = require('validator');

const { wrap: async } = require('co');

// 添加标签
exports.add = async(function *(req, res){
    if(isEmpty(req.body.name)){
        return res.json({
            status:"fail",
            msg:"请输入内容"
        }) 
    }
    
    if(isEmpty(req.body.profile)){
        return res.json({
            status:"fail",
            msg:"请输入内容"
        }) 
    }
    
    type.create(req.body, (err, data)=>{
        if(err){
            return res.json({
                "status":"fail",
                "msg":"发布失败"
            })
        }else {
            return res.json({
                "status":"success",
            })
        }
    });
})
exports.finds = async(function *(req, res){
    if(req.query.type == "length"){
        type.num((data)=>{
            res.json({
                status:"success",
                data:data
            })
        })
    }else {
        type.all((err, data)=>{
            if(err){
                return res.json({
                    "status":"fail",
                    "msg":"发布失败"
                })
            }else {
                return res.json({
                    "status":"success",
                    "data":data
                })
            }
        });
    }
})

exports.one = async(function *(req, res){
    let id = req.params.id
    let data= yield type.allArticle(id)
    if(data.article.length != 0){
        for(let article of data.article){
            article.create_time = [moment(article.create_time).format('L'), moment(article.create_time).fromNow()]
        }
    }
    res.json({
        status:"success",
        data: data
    })
})
// 添加标签文章
exports.addArt = (tag,id,callback) => {
    type.update({"_id":tag},{"$addToSet":{"article":id}},callback)
}
// 删除type里的文章 
exports.delArt = (types, id, callback) => {
    type.update({"_id":types}, {"$pull":{"article":id}}, callback)
}