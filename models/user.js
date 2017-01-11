import mongoose from 'mongoose'

import userPwdMd5 from '../util/plugin/userPwdMd5'
import plugins from '../util/plugin'
plugins(mongoose)


let Schema = mongoose.Schema

let userSchema = new Schema({
    slug: {
        type: String,
        unique: true
    },
    name: {
        type: String,
        unique: true,
        index: true
    },
    password: {
        type: String
    },
    email: {
        type: String,
        unique: true,
    },
    profile: {      // 简介
        type: String,
        default: '这个人很懒，啥也没留下。。。'
    },
    image: {
        type: String,
        default: ''
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: String,
        default: Date.now
    },
    website: {
        type: Date,
        default: null
    },
    location: {
        type: String,
        default: null
    }
})

userSchema.plugin(userPwdMd5)

let user = mongoose.model('user', userSchema)


export default user