import { get, post, post_json } from '@/http/axios'
export default {
  namespaced: true,
  state: {
    // token存储
    token: localStorage.getItem('token') ? localStorage.getItem('token') : '',
    userInfo: {}
  },
  mutations: {
    //存储token
    setToken(state, token) {
      state.token = token;
      localStorage.setItem("token", token.token);
    },
    //删除token
    delToken(state) {
      state.token = '';
      localStorage.removeItem("token");
    },
    SET_UserInfo(state, userInfo) {
      state.userInfo = userInfo
    }
  },
  actions: {
    // 获取用户信息
    async getUserInfo({ commit }, params) {
      let res = await get('/user/info?token=' + localStorage.getItem('token'))
      commit('SET_UserInfo', res.data.data)
      // console.log(res);
    }
  }
}