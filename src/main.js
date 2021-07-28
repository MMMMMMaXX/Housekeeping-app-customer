import Vue from 'vue'
// @ts-ignore
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/vant.js'

// 引入暴露的防抖节流函数
import { inputDebounceThrot, buttonThrot } from './utils/mx'
// 自定义指令v-inputDebounceThrot input搜索框输入搜索时防抖+回车键节流
// 参数：  func    事件回调函数
//         wait    输入事件防抖时间，默认为1000ms
//         enterWait   回车事件节流时间，默认为1000ms
Vue.directive('searchDebounceAndThrotFromMx', {
  bind(el, binding) {
    const inputFunc = inputDebounceThrot(binding.value, 500, 1000)
    el.addEventListener('keyup', inputFunc)
  }
})
// 自定义指令v-buttonThrotFromMx  搜索按钮节流
// 参数：  func    事件回调函数
//         wait    点击事件节流时间，默认为1000ms
Vue.directive('buttonThrotFromMx', {
  bind(el, binding) {
    const btnFunc = buttonThrot(binding.value, 1000)
    el.addEventListener('click', btnFunc)
  }
})

Vue.config.productionTip = false
// 时间戳过滤器
Vue.filter('dateFormat', (dataStr) => {
  var time = new Date(dataStr)

  function timeAdd0(str) {
    if (str < 10) {
      str = '0' + str
    }
    return str
  }
  var y = time.getFullYear()
  var m = time.getMonth() + 1
  var d = time.getDate()
  var h = time.getHours()
  var mm = time.getMinutes()
  var s = time.getSeconds()
  return y + '-' + timeAdd0(m) + '-' + timeAdd0(d) + ' ' + timeAdd0(h) + ':' + timeAdd0(mm) + ':' + timeAdd0(s)
})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
