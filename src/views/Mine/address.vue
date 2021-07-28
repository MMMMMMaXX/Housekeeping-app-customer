<template>
  <div class="address">
    <!-- 顶部导航栏 -->
    <van-sticky :offset-top="0">
      <van-nav-bar
        title="常用地址"
        left-text="返回"
        left-arrow
        @click-left="onClickLeft"
      />
    </van-sticky>
    <!-- 地址列表 -->
    <van-cell
      size="large"
      center
      v-for="item in addressData.list"
      :key="item.id"
    >
      <template #title> {{ item.username }} {{ item.telephone }} </template>
      <template #label>
        {{ item.province + item.city + item.area + item.address }}
      </template>
      <!-- 使用 right-icon 插槽来自定义右侧图标 -->
      <template #right-icon>
        <van-icon name="edit" size="22px" @click="onEditAddress(item)" />
      </template>
    </van-cell>
    <div style="height: 7em"></div>
    <!-- 新增按钮 -->
    <van-button
      class="addBtn"
      color="linear-gradient(to right, #ec6f66, #f3a183)"
      round
      type="info"
      @click="onAddAddress"
      >新增地址</van-button
    >
    <!-- 测试 新增地址 后期这里可以自己写-->
    <van-action-sheet v-model="show" :title="title">
      <van-form @submit="onSave">
        <!-- 姓名 -->
        <van-field
          v-model="addressObj.username"
          name="姓名"
          label="姓名"
          placeholder="请输入收货人姓名"
          :rules="[{ required: true, message: '请填写收货人姓名' }]"
        />
        <!-- 电话 -->
        <van-field
          v-model="addressObj.telephone"
          name="电话"
          label="电话"
          placeholder="请输入手机号码"
          :rules="[{ pattern, message: '请输入正确的手机号' }]"
        />
        <!-- 省市区选择 -->
        <van-field
          readonly
          clickable
          name="area"
          :value="pcaAddress"
          label="地区选择"
          placeholder="点击选择省市区"
          @click="showArea = true"
          :rules="[{ required: true, message: '请选择省市区' }]"
        />
        <van-field
          v-model="addressObj.address"
          name="详细地址"
          label="详细地址"
          placeholder="请输入详细地址"
          :rules="[{ required: true, message: '请输入详细地址' }]"
        />
        <div style="margin: 16px">
          <van-button round block type="info" native-type="submit"
            >提交</van-button
          >
        </div>
      </van-form>
      <!-- 省市区选择器 -->
      <van-popup v-model="showArea" position="bottom">
        <van-area
          :area-list="areaList"
          @confirm="onConfirm"
          @cancel="showArea = false"
        />
      </van-popup>
    </van-action-sheet>
  </div>
</template>

<script>
import { get, post } from "@/http/axios";
import { mapState, mapActions, mapGetters } from "vuex";
import { areaList } from "@vant/area-data";
export default {
  data() {
    return {
      addressData: [],
      // 面板弹出控制
      show: false,
      // 区域选择级联数据
      areaList,
      // 上传地址对象
      addressObj: {
        id: "",
        username: "",
        telephone: "",
        province: "",
        city: "",
        area: "",
        address: "",
        userId: "",
      },
      // 省市区选择
      pcaAddress: "",
      // 省市区选择原始数据
      pcaList: [],
      // 省市区选择器显示控制
      showArea: false,
      // 新增或编辑 标题
      title: "",
      pattern: /^1\d{10}$/,
    };
  },
  created() {
    this.getAddressData();
  },
  computed: {
    // 获取地址列表
    // ...mapState("address", ["addressData"]),
    ...mapState("user", ["userInfo"]),
  },
  methods: {
    ...mapActions("user", ["getUserInfo"]),
    // 获取地址数据
    // ...mapActions("address", ["getAddressData", "saveOrUpdateAddress"]),
    async getAddressData() {
      this.getUserInfo();
      let data = {
        page: 1,
        pageSize: 100,
        userId: this.userInfo.id,
      };
      let res = await get("/address/pageQuery", { ...data });
      // console.log(res);
      this.addressData = res.data.data;
    },

    //省市区选择
    onConfirm(values) {
      this.pcaAddress = values
        .filter((item) => !!item)
        .map((item) => item.name)
        .join("-");
      this.pcaList = values;
      this.showArea = false;
    },
    // 返回上一级页面
    onClickLeft() {
      this.$router.go(-1);
    },
    // 新增地址
    onAddAddress() {
      this.title = "新增地址";
      // 新增之前 对象置空
      this.addressObj = {};
      this.pcaAddress = "";
      this.show = true;
    },
    // 编辑地址 传入当前每一个地址的对象
    onEditAddress(addressItem) {
      this.title = "编辑地址";
      // 拿到当前对象进行赋值
      this.addressObj = { ...addressItem };
      console.log(addressItem);
      this.pcaAddress =
        addressItem.province + "-" + addressItem.city + "-" + addressItem.area;
      this.show = true;
      // console.log(this.addressObj);
    },
    // 新增或编辑地址保存
    async onSave() {
      // 将级联选择器的地址进行拆分 赋值给对应的字段
      this.addressObj.province = this.pcaList[0].name;
      this.addressObj.city = this.pcaList[1].name;
      this.addressObj.area = this.pcaList[2].name;
      this.addressObj.userId = this.userInfo.id;
      // this.saveOrUpdateAddress(this.addressObj);
      let data = this.addressObj;
      let res = await post("/address/saveOrUpdate", {
        ...data,
      });
      console.log(res);
      this.show = false;
      this.getAddressData();
    },
  },
};
</script>

<style scoped>
.content {
  padding: 16px 16px 160px;
}
/* cell样式 */
.van-cell {
  box-shadow: 2px 2px 2px rgba(247, 248, 249, 0.8);
  background-color: white;
  width: 98%;
  border-radius: 5px;
  margin: 5px auto;
  padding: 10px;
}
/* 新增按钮样式 */
.addBtn {
  background-image: linear-gradient(to right, #7579ff, #bf73ff);
  border: none;
  width: 70%;
  position: fixed;
  bottom: 4em;
  left: 15%;
}
</style>