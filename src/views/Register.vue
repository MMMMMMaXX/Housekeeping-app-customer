<template>
  <div class="login">
    <!-- 头部信息展示区 -->
    <div class="header">
      <div class="title">易洁家政</div>
    </div>
    <!-- 登录区域 -->
    <div class="loginArea">
      <div class="loginForm">
        <van-form @submit="onSubmit">
          <van-field
            v-model="username"
            name="用户名"
            label="用户名"
            placeholder="用户名"
            :rules="[{ required: true, message: '请填写用户名' }]"
            size="large"
          />
          <van-field
            v-model="password"
            type="password"
            name="密码"
            label="密码"
            placeholder="密码"
            :rules="[{ required: true, message: '请填写密码' }]"
            size="large"
          />
          <van-field
            v-model="confirmPwd"
            type="password"
            name="确认密码"
            label="确认密码"
            placeholder="确认密码"
            :rules="[{ required: true, message: '请再次输入密码' }]"
            size="large"
          />
          <div style="margin: 16px">
            <van-button
              color="linear-gradient(to right,#ec6f66, #f3a183)"
              round
              block
              type="info"
              native-type="submit"
            >
              注册
            </van-button>
          </div>
          <div class="signUp">
            <span @click="toLogin">已有账号，去登录</span>
          </div>
        </van-form>
      </div>
    </div>
  </div>
</template>

<script>
// 引入辅助函数
import { mapMutations, mapActions } from "vuex";
// 异步加载  引入axios
import { post } from "@/http/axios";
import { Toast } from "vant";

export default {
  data() {
    return {
      username: "",
      password: "",
      confirmPwd: "",
    };
  },
  methods: {
    ...mapActions("register", ["toRegister"]),
    onClickLeft() {
      this.$router.go(-1);
    },
    onSubmit() {
      if (this.password != this.confirmPwd) {
        Toast("两次密码输入不一致,请重新输入！");
      } else {
        // 获取注册参数
        let params = {
          username: this.username,
          password: this.password,
        };
        // 调用注册请求
        this.toRegister(params);
        Toast("注册成功");
        setTimeout(() => {
          this.$router.go(-1);
        }, 1500);
      }
    },
    // 跳转到登录
    toLogin() {
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped>
/* 整体样式 */
.login {
  width: 100%;
  height: 100%;
  background-image: linear-gradient(#ec6f66, #f3a183);
  overflow: hidden;
}
/* 头部样式 */
.header {
  width: 100%;
  position: absolute;
  text-align: center;
  top: 120px;
}
/* 标题样式 */
.header .title {
  font-family: "webfont";
  font-size: 40px;
  color: white;
}
.header .title_bottom {
  color: #fff;
  font-family: "webfont";
  font-size: 20px;
}
@font-face {
  font-family: "webfont";
  font-display: swap;
  src: url("//at.alicdn.com/t/webfont_mtjyk0oq5ef.eot"); /* IE9*/
  src: url("//at.alicdn.com/t/webfont_mtjyk0oq5ef.eot?#iefix")
      format("embedded-opentype"),
    /* IE6-IE8 */ url("//at.alicdn.com/t/webfont_mtjyk0oq5ef.woff2")
      format("woff2"),
    url("//at.alicdn.com/t/webfont_mtjyk0oq5ef.woff") format("woff"),
    /* chrome、firefox */ url("//at.alicdn.com/t/webfont_mtjyk0oq5ef.ttf")
      format("truetype"),
    /* chrome、firefox、opera、Safari, Android, iOS 4.2+*/
      url("//at.alicdn.com/t/webfont_mtjyk0oq5ef.svg#AlibabaPuHuiTiH")
      format("svg"); /* iOS 4.1- */
}
/* 中间登录输入区域 卡片样式 */
.loginArea {
  box-shadow: 0 4px 8px 0 rgba(255, 255, 255, 0.2);
  background-color: white;
  transition: 0.3s;
  width: 90%;
  border-radius: 5px;
  margin: 265px auto;
  height: 300px;
  padding: 10px;
}
.loginArea:hover {
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
}
/* 输入框整体样式 */
.loginForm {
  padding-top: 20px;
}
/* 注册样式 */
.signUp {
  color: #4e95f7;
  text-align: center;
  font-size: 12px;
  letter-spacing: 0.05em;
  cursor: pointer;
}
</style>
