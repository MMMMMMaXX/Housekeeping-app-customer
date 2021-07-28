import { get, post_json } from '@/http/axios'
export default {
    namespaced: true,
    state: {
    },
    mutations: {
    },
    actions: {
        // 获取全部订单的数据
        getAllorderData({ commit }, payload) {
            let res = get('/order/pageQuery', payload);
            return res
        }
    }
}