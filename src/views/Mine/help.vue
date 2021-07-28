<template>
  <div>
    <van-nav-bar
      title="使用帮助"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
    />
    <div class="contect">
      <div class="titel van-hairline--bottom">
        <van-icon class="icon" :name="icon" /><span>常见问题</span>
      </div>

      <div class="contect_tip van-hairline--bottom">
        <span>1.优惠卷如何使用？</span>
      </div>
      <div class="contect_tip van-hairline--bottom">
        <span>2.取消订单后，钱什么时候到账？</span>
      </div>
      <div class="contect_tip van-hairline--bottom">
        <span>3.可以固定同一个阿姨服务吗？</span>
      </div>
      <div class="contect_tip van-hairline--bottom">
        <span>4.充值不到账？</span>
      </div>
      <div class="contect_tip van-hairline--bottom">
        <span>5.如果更改服务地址？</span>
      </div>

      <div class="titel van-hairline--bottom">
        <van-icon class="icon" :name="icon2" /><span>更多问题</span>
        <div style="margin-top: 30px; margin-left: -20px">
          <van-grid :gutter="10">
            <van-grid-item
              v-for="(value, index) in list"
              :key="index"
              :icon="value.icon"
              :text="value.name"
            />
          </van-grid>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import icon from "../../assets/tip.png";
import icon2 from "../../assets/提示.png";
import icon3 from "../../assets/订单.png";
import icon4 from "../../assets/客户端.png";
import icon5 from "../../assets/优惠卷.png";
import icon6 from "../../assets/支付.png";
export default {
  data() {
    return {
      icon,
      icon2,
      icon3,
      icon4,
      icon5,
      icon6,
      list: [
        { name: "订单相关", icon: icon3 },
        { name: "客户端使用", icon: icon4 },
        { name: "优惠卷与活动", icon: icon5 },
        { name: "支付与费用", icon: icon6 },
      ],
    };
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
  },
};
</script>

<style scoped>
.titel {
  height: 45px;
  padding-top: 10px;
  padding-left: 20px;
}
.icon {
  font-size: 25px;
}
.titel span {
  font-size: 20px;
}
.contect_tip {
  height: 40px;
  padding-top: 10px;
  padding-left: 20px;
}
</style>