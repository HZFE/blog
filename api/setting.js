import { setting as Setting } from '../models'
import omit from '../lib/util/omit.js'

const defaultSetting = ['logo', 'url', 'navigation', 'cover', 'title', 'description']

export let GetAll = async () => {
    let data = await Setting.findOne()
    return {
        setting: data
    }
}

export let Put = async (id, data) => {
    data = omit(defaultSetting, data)
    let cbk = await Setting
        .findByIdAndUpdate(id, data, {new: true})
    return {
        message: '修改设置成功',
        data: omit(defaultSetting, cbk)
    }
}
