import Vue from "vue"
import Vuex from "vuex"

import login from './modules/login'
import index from './modules/index'

import * as actions from './actions'
import * as getters from './getters'

Vue.use(Vuex)

export default new Vuex.Store({
    modules:{
        login,
        index
    },
    actions,
    getters,
})