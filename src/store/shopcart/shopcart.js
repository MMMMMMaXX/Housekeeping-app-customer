// 需要安装 lodash
import _ from 'lodash'
export default {
  namespaced: true,
  state: {
    // 通过productId --> {productId,productName,price,number}
    orderLines: new Map()
  },
  getters: {
    // 计算总金额
    total(state) {
      let result = 0;
      for (let orderLine of state.orderLines.values()) {
        result += orderLine.price * orderLine.number;
      }
      return result;
    }
  },
  mutations: {
    // 添加购物车
    addShopcart(state, orderLine) {
      // map.set("key",value) 通过key 保存 value
      state.orderLines.set(orderLine.productId, orderLine);
      //    console.log(state.orderLines);
      // 克隆对象改变引用地址，让监听机制监听到orderLines的变化
      state.orderLines = _.clone(state.orderLines)
    },
    // 清空购物车
    clearShopcart(state) {
      state.orderLines.clear();
      state.orderLines = _.clone(state.orderLines)
    }
  },
  actions: {

  }
}