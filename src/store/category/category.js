import { get, post, post_json } from '@/http/axios'

export default {
    namespaced: true,
    state: {
        categroyData: []
    },
    mutations: {
        SET_CATEGORYDATA(state, payload) {
            state.categroyData = payload
        }
    },
    actions: {
        //获取栏目的数据
        async getAllCategoryData({ commit }, payload) {
            let res = await get('/productCategory/pageQuery', payload)
            //console.log(res.data.data.list[0].id);
            commit('SET_CATEGORYDATA', res.data.data.list)
            return res.data.data.list[0].id
        }
    },

}
