/**
 * 创建者：满鑫Max
 * 创建时间：2021.7.1 14.24
 * inputDebounceThrot：搜索框输入搜索时防抖+回车键节流
 * 参数：   func    事件回调函数
 *          wait    输入事件防抖时间，默认为1000ms
 *          enterWait   回车事件节流时间,默认为1000ms
 * buttonThrot：搜索按钮节流
 * 参数：   func    事件回调函数
 *          wait    点击事件节流时间，默认为1000ms
 */
export function inputDebounceThrot(func, wait, enterWait) {
  let imputTime
  let enterTime
  const waitTime = wait || 1000
  const enterWaitTime = enterWait || 1000
  return function(event) {
    // console.log(event.keyCode);
    if (event.keyCode === 13) {
      if (!enterTime) {
        func()
        enterTime = setTimeout(() => {
          enterTime = null
        }, enterWaitTime)
      }
    } else {
      clearTimeout(imputTime)
      imputTime = setTimeout(() => {
        func()
      }, waitTime)
    }
  }
}
export function buttonThrot(func, wait) {
  let ButtonTime
  const waitTime = wait || 1000
  return function() {
    if (!ButtonTime) {
      func()
      ButtonTime = setTimeout(function() {
        ButtonTime = null
      }, waitTime)
    }
  }
}
