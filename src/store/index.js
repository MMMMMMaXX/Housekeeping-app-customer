import Vue from 'vue'
import Vuex from 'vuex'
// 引入注册模块
import register from './register/register'
// 引入用户模块
import user from './user/user'

import category from './category/category'
import product from "./product/product"
import shopcart from "./shopcart/shopcart"
// 引入订单模块
import order from './order/order'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    // 注册模块
    register,
    // 用户模块
    user,

    category,
    product,
    shopcart,
    // 订单模块
    order,
  }
})
