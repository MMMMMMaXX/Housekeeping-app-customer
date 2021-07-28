<template>
  <div>
    <div class="header">
      <van-sticky>
        <van-nav-bar
          title="确认订单"
          left-text="返回"
          left-arrow
          @click-left="onClickLeft"
        />
      </van-sticky>
    </div>
    <div class="contect">
      <!-- 地点 -->
      <van-cell
        icon="map-marked"
        class="cell_contect"
        value
        @click="getAddressList"
      >
        <span class="cell_title">服务地址</span>
        <br />
        <span class="cell_label">姓名：{{ address.name }}</span>
        <br />
        <span class="cell_label">电话：{{ address.tel }}</span>
        <br />
        <span class="cell_label">地址：{{ address.address }}</span>
      </van-cell>
      <!-- 订单详情 -->
      <van-cell icon="column" class="cell_contect">
        <span class="cell_title">订单详情</span>
        <br />
        <div class="cell_label" v-for="(value, key) in orderLines" :key="key">
          <van-row gutter="20" type="flex" v-if="value[1].number != 0">
            <van-col span="8">{{ value[1].productName }}</van-col>
            <van-col span="8">x{{ value[1].number }}</van-col>
            <van-col span="8">￥{{ value[1].price }}</van-col>
          </van-row>
        </div>
        <van-row class="cell_label">
          <van-col offset="14" span="12">总价：￥{{ total }}</van-col>
        </van-row>
        <br />
      </van-cell>
      <!-- 时间 -->
      <van-cell icon="underway" class="cell_contect" @click="getTime">
        <span class="cell_title">服务时间</span>
        <span class="cell_label" style="float: right">
          {{ currentDate | dateFormat }}
        </span>
      </van-cell>

      <!-- 地址选择器 -->
      <van-action-sheet v-model="show" title="选择地址">
        <!-- chosenAddressId选中的地址ID -->
        <!-- @add 点击新增按钮触发的事件 -->
        <van-address-list
          v-model="chosenAddressId"
          :list="addressData"
          add-button-text="确定"
          @add="confirmClick"
        />
      </van-action-sheet>

      <!-- 时间编辑器 -->
      <van-action-sheet v-model="showTime">
        <!-- chosenAddressId选中的地址ID -->
        <!-- @add 点击新增按钮触发的事件 -->
        <van-datetime-picker
          @confirm="selectTime"
          @cancel="clickCancel"
          v-model="currentDate"
          type="datetime"
          title="选择服务时间"
          :min-date="minDate"
          :max-date="maxDate"
          :columns-order="['year', 'month', 'day', 'hour', 'minute']"
          :formatter="formatter"
        />
      </van-action-sheet>
    </div>
    <div class="submitBtn">
      <van-button
        round
        type="primary"
        block
        color="linear-gradient(to right,#ec6f66, #f3a183)"
        @click="submitOrder"
        >提交订单</van-button
      >
    </div>
  </div>
</template>

<script>
import { get, post_json } from "@/http/axios";
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
export default {
  data() {
    return {
      show: false,
      showTime: false,
      chosenAddressId: "1",
      addressData: [],
      address: [],
      orderData: [],
      minDate: new Date(),
      maxDate: new Date(2025, 10, 1),
      currentDate: new Date(),
    };
  },
  methods: {
    ...mapActions("user", ["getUserInfo"]),
    ...mapMutations("shopcart", ["clearShopcart"]),
    //点击返回按钮
    onClickLeft() {
      this.clearShopcart();
      this.$router.go(-1);
    },
    //点击地址栏
    getAddressList() {
      this.show = true;
    },
    //进入地址栏，选择地址
    confirmClick() {
      this.address = this.addressData.filter((item) => {
        return item.id === this.chosenAddressId;
      });
      this.address = this.address[0];
      this.show = false;
    },
    //选择时间
    getTime() {
      this.showTime = true;
    },
    //点击提交订单大按钮
    async submitOrder() {
      for (let item of this.productData) {
        if (this.orderLines.get(item.id) == undefined ? 1 : 0) {
          continue;
        } else {
          let productId = this.orderLines.get(item.id).productId;
          let price = this.orderLines.get(item.id).price;
          let number = this.orderLines.get(item.id).number;
          this.orderData.push({
            id: 0,
            number: number,
            orderId: 0,
            price: price,
            productId: productId,
          });
        }
      }
      let data = {
        addressId: this.address.id,
        customerId: this.userInfo.id,
        orderLines: this.orderData,
        serviceTime: this.currentDate.getTime(),
      };
      const res = await post_json("/order/submitOrder", data);
      if (res.data.status === 200) {
        this.$notify({
          message: "提交订单成功",
          type: "success",
        });
        this.clearShopcart();
        setTimeout(() => {
          this.$router.go(-1);
        }, 600);
      } else {
        this.$notify({
          message: res.data.message,
          type: "danger",
        });
      }
    },

    //获取地址的全部信息
    async getAddressData() {
      let data = {
        page: 1,
        pageSize: 111,
      };
      let res = await get("/address/pageQuery", data);
      this.addressData = res.data.data.list;
      this.addressData = this.addressList();
      this.address = this.addressData[0];
      this.chosenAddressId = this.address.id;
    },
    //选择时间后确定
    selectTime(value) {
      this.currentDate = value;
      this.showTime = false;
    },
    //时间编辑器取消按钮
    clickCancel() {
      this.showTime = false;
    },
    //自定义时间编辑器
    formatter(type, val) {
      if (type === "year") {
        return val + "年";
      }
      if (type === "month") {
        return val + "月";
      }
      if (type === "day") {
        return val + "日";
      }
      if (type === "hour") {
        return val + "时";
      }
      if (type === "minute") {
        return val + "分";
      }
      return val;
    },
    //转换地址的方法
    addressList() {
      // 筛选地址数据 生成匹配组件的数据
      let addressArr = this.addressData;
      let addressList = [];
      if (!addressArr) {
        return;
      }
      addressArr.forEach((item, index) => {
        let addressObj = {};
        (addressObj.id = item.id),
          (addressObj.name = item.username),
          (addressObj.tel = item.telephone),
          (addressObj.address =
            item.province + item.city + item.area + item.address),
          addressList.push(addressObj);
      });
      return addressList;
    },
  },
  created() {
    this.getAddressData();
    this.getUserInfo();
    // console.log(this.orderLines.get(9130).price);
  },
  computed: {
    ...mapState("shopcart", ["orderLines"]),
    ...mapGetters("shopcart", ["total"]),
    ...mapState("user", ["userInfo"]),
    ...mapState("product", ["productData"]),
  },
};
</script>

<style scoped>
.cell_contect {
  margin-bottom: 20px;
  width: 95%;
  border-radius: 5px;
  margin: 10px auto;
  box-shadow: 2px 2px 2px 2px rgb(238 10 36 / 30%);
}
.cell_title {
  font-size: 18px;
  line-height: 12px;
}
.cell_label {
  font-size: 14px;
  color: #969799;
}
.cell_label_order {
  margin-left: 40px;
}
.submitBtn {
  width: 95%;
  margin: 10px auto;
}
.van-address-item__edit {
  display: none;
}
</style>