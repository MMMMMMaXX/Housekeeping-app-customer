<template>
  <div class="orderDetail">
    <van-sticky>
      <van-nav-bar
        title="订单详情"
        left-text="返回"
        left-arrow
        @click-left="onClickLeft"
      />
    </van-sticky>
    <div class="Detailcontent">
      <van-card
        class="OrderWrap"
        v-for="(order, index) in orderData"
        :key="index"
        :price="order.price + '.00'"
        :num="order.number"
        :desc="order.product.description"
        :title="order.product.name"
        :thumb="order.product.photo"
      >
      </van-card>
      <van-cell-group border v-if="orderData != ''">
        <van-cell>
          <div class="Sum">
            总计:
            <span class="money">￥{{ this.sum }}</span>
          </div>
        </van-cell>
      </van-cell-group>
      <van-sticky>
        <div class="d_content">
          <span
            v-if="status === '待接单'"
            style="color: red; margin-right: 20px; font-size: 13px"
          >
            {{ status }}
          </span>
          <span
            v-else-if="status === '待派单'"
            style="color: purple; margin-right: 20px; font-size: 13px"
          >
            {{ status }}
          </span>
          <span
            v-else-if="status === '待确认'"
            style="color: orange; margin-right: 20px; font-size: 13px"
          >
            {{ status }}
          </span>
          <span
            v-else-if="status === '待服务'"
            style="color: orange; margin-right: 20px; font-size: 13px"
          >
            {{ status }}
          </span>
          <span
            v-else-if="status === '待支付'"
            style="color: red; margin-right: 20px; font-size: 13px"
          >
            {{ status }}
          </span>
          <span
            v-else
            style="color: green; margin-right: 20px; font-size: 13px"
          >
            {{ status }}
          </span>
          <p>
            服务地址：{{
              orderAddress.province +
              orderAddress.city +
              orderAddress.area +
              orderAddress.address
            }}
          </p>
          <p>
            联系方式：{{ orderCustomer.username }}&nbsp;({{
              orderCustomer.telephone
            }})
          </p>
          <p>
            下单时间：
            {{ moment(Number(orderTime)).format("YYYY/MM/DD HH:mm:ss a") }}
          </p>
          <p>
            服务时间：
            {{ moment(serveTime).format("YYYY/MM/DD HH:mm:ss a") }}
          </p>
        </div>
        <van-button
          class="cancelButton"
          @click="cancelOrder(orderid)"
          color="linear-gradient(to right,#ec6f66, #f3a183)"
          v-if="this.status != '待确认' && this.status != '已完成'"
        >
          取消订单
        </van-button>
        <van-button
          class="cancelButton"
          @click="OklOrder(orderid)"
          color="linear-gradient(to right,#ec6f66, #f3a183)"
          v-if="this.status == '待确认'"
        >
          完成服务
        </van-button>
      </van-sticky>

      <van-empty description="该订单无数据" v-if="orderData == ''"></van-empty>
      <div style="height: 100px"></div>
    </div>
  </div>
</template>

<script>
import { get } from "@/http/axios";
import { mapActions } from "vuex";
let moment = require("moment");
export default {
  data() {
    return {
      moment,
      sum: this.$route.query.total,
      orderid: this.$route.query.orderId,
      orderData: [],
      orderAddress: {},
      orderCustomer: {},
      serveTime: "",
      orderTime: this.$route.query.orderTime,
      status: this.$route.query.status,
    };
  },
  methods: {
    ...mapActions("order", ["getAllorderData"]),
    // 返回上一个页面
    onClickLeft() {
      this.$router.go(-1);
    },
    // 通过id查询订单
    async qureyDataById() {
      let data = {
        id: this.orderid,
      };
      let res = await get("/order/findById", { ...data });
      this.orderData = res.data.data.orderLines;
      this.orderData = this.orderData.filter((a) => {
        return a.number != 0;
      });
      this.orderAddress = res.data.data.address;
      this.orderCustomer = res.data.data.customer;
      this.serveTime = res.data.data.serviceTime;
      //console.log(this.orderData);
    },
    // 确认完成服务
    async OklOrder() {
      let data = {
        orderId: JSON.parse(this.orderid),
      };
      console.log(data);
      let res = await get("/order/confirmOrder", { ...data });
      if (res.status === 200) {
        this.$notify({
          message: "成功确认完成服务订单",
          type: "success",
        });
        setTimeout(() => {
          this.$router.go(-1);
          this.getAllorderData();
        }, 600);
      } else {
        this.$notify({
          message: res.data.message,
          type: "danger",
        });
      }
      console.log(res, "com");
    },
    // 通过id取消订单
    async cancelOrder() {
      let data = {
        id: this.orderid,
      };
      console.log(11111111);
      let res = await get("/order/deleteById?", { ...data });
      if (res.status === 200) {
        this.$notify({
          message: "成功取消订单",
          type: "success",
        });
        setTimeout(() => {
          this.$router.go(-1);
          this.getAllorderData();
        }, 600);
      } else {
        this.$notify({
          message: res.data.message,
          type: "danger",
        });
      }
      console.log(res);
    },
  },
  created() {
    this.qureyDataById();
  },
};
</script>

<style>
.cancelButton {
  float: right;
  width: 30%;
  top: 10px;
  position: relative;
  right: 10px;
}
.OrderWrap img {
  border-radius: 8px;
}
.Sum {
  float: right;
}
.money {
  color: red;
  font-size: 16px;
}
.van-cell-group {
  border-top: 1px solid #f2f3f5;
  border-bottom: 1px solid #f2f3f5;
  top: 20px;
}
.OrderWrap .van-card__title {
  color: black;
  font-size: 15px;
  font-weight: 600;
  line-height: 25px;
}
.OrderWrap .van-card__content,
.OrderWrap .van-card__desc {
  line-height: 25px;
  color: #999;
}
.OrderWrap .van-card__price {
  font-weight: 500;
  color: red;
}
.OrderWrap .van-card__num {
  float: right;
  color: black;

  font-size: 14px;
}
.d_content {
  position: relative;
  background: #fafafa;
  color: #999;
  font-size: 12px;
  clear: both;
  padding-top: 10px;
  margin-top: 30px;
  min-height: 150px;
}
.d_content p {
  margin-left: 10px;
  padding: 5px 0;
}
.d_content span {
  display: flex;
  flex-direction: row-reverse;
  margin-right: 5px;
}
.OrderWrap {
  width: 93%;
  left: 3%;
  border-radius: 5px;
  top: 10px;
  background: #fafafa;
  color: #999;
  box-shadow: 2px 2px 2px 2px rgb(236, 111, 102);
}
</style>