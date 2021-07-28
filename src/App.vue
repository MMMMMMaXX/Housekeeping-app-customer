<template>
  <div id="app">
    <!-- 全局根组件 -->
    <!-- 只显示一个routerview 即可 -->
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "app",
};
</script>

<style>
/* 获取父元素高度 */
html,body,#app{
 height: 100%;
}
</style>
