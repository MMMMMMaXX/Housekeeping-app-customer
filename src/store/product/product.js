import { get, post, post_json } from '@/http/axios'

export default {
    namespaced: true,
    state: {
        productData: [],
        detailData: []
    },
    mutations: {
        SET_PRODUCTDATA(state, payload) {
            state.productData = payload
        },
        SET_DETAILDATA(state, payload) {
            state.detailData = payload
        }
    },
    actions: {
        //获取栏目的数据
        async getAllProductData({ commit }, payload) {
            let res = await get('/product/pageQuery', payload)
            // console.log(res);
            commit('SET_PRODUCTDATA', res.data.data.list)

        },
        //获取详情的数据
        async getDetailData({ commit }, payload) {
            let res = await get('/product/pageQuery', payload)
            commit('SET_DETAILDATA', res.data.data.list)
            // console.log(res.data.data);
        }
    },

}
