<template>
  <div class="home">
    <!-- 顶部导航栏 -->
    <div class="header">
      <div class="title">
        <h2>易洁家政</h2>
      </div>
    </div>
    <!-- 轮播图 -->
    <div class="swipe">
      <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
        <van-swipe-item v-for="swipe in swipeData" :key="swipe.id">
          <img :src="swipe.url" />
        </van-swipe-item>
      </van-swipe>
    </div>

    <div class="content">
      <!-- 菜单栏 -->
      <div class="menu">
        <van-grid :column-num="3" :gutter="10">
          <van-grid-item
            v-for="(category, index) in categroyData"
            :key="category.id"
            :icon="category.icon"
            :text="category.name"
            @click="toProduct(category.id, index)"
          />
        </van-grid>
      </div>

      <!-- 底部产品展示区 -->
      <div class="product">
        <van-card
          class="product_card"
          v-for="product in productData"
          :key="product.id"
          :price="product.price + '.00'"
          :title="product.name"
          :thumb="product.photo"
        >
          <template #tags>
            <van-tag plain type="danger">{{ product.category.name }}</van-tag>
          </template>
          <template #footer>
            <van-button
              size="mini"
              @click="ButtonDetail(product.name)"
              class="btn_detail"
              >详情</van-button
            >
          </template>
        </van-card>
      </div>
      <van-dialog
        v-model="show"
        title="详细资料"
        show-cancel-button
        class="Detail"
      >
        <div v-for="detail in detailData" :key="detail.name" class="Detail_1">
          <br />
          <img :src="detail.photo" class="img_1" />

          <p>编&nbsp;&nbsp;号：{{ detail.id }}</p>
          <p>名&nbsp;&nbsp;称：{{ detail.name }}</p>
          <p>价&nbsp;&nbsp;格：¥{{ detail.price }}.00</p>

          <p>
            状&nbsp;&nbsp;态：
            <van-tag type="success">{{ detail.status }}</van-tag>
          </p>
          <p>
            所属栏目：
            <img :src="detail.category.icon" />
            <van-tag plain type="danger">{{ detail.category.name }}</van-tag>
          </p>
          <p>产品描述：{{ detail.description }}</p>
          <br />
        </div>
      </van-dialog>
      <div style="height: 80px"></div>
    </div>
  </div>
</template>

<script>
//引入axios
import { get } from "@/http/axios";
import { mapActions, mapState } from "vuex";
export default {
  data() {
    return {
      show: false,
      swipeData: [],
      // 编号
      id: "",
      // 姓名
      name: "",
      // 详情页面头像
      photo: "",
      // 详情描述
      description: "",
      //详情价格
      price: "",
      //详情状态
      status: "",
      // 详情种类
      categoryname: "",
      // 上架时间
      timestamp: "",
    };
  },
  computed: {
    // 辅助函数  命名空间   传的数据
    ...mapState("category", ["categroyData"]),
    ...mapState("product", ["productData"]),
    ...mapState("product", ["detailData"]),
  },
  methods: {
    ...mapActions("category", ["getAllCategoryData"]),
    ...mapActions("product", ["getAllProductData"]),
    ...mapActions("product", ["getDetailData"]),
    // 弹出该产品详情模态框界面
    ButtonDetail(name) {
      this.name = name;
      let data = {
        page: 1,
        pageSize: 8,
        name: this.name,
      };
      // 打开模态框
      this.OpenDetail();
      this.getDetailData(data);
    },

    //打开模态框
    OpenDetail() {
      this.show = true;
    },
    // 关闭模态框
    CloseDetail() {
      this.show = false;
      this.queryProduct();
    },
    // 查找所有种类
    queryCategory() {
      let data = {
        page: 1,
        pageSize: 6,
      };
      this.getAllCategoryData(data);
    },
    // 查找全部的商品
    queryProduct() {
      let data = {
        page: 1,
        pageSize: 8,
      };
      this.getAllProductData(data);
    },
    //跳转到产品页面
    toProduct(id, key) {
      //使用编程式导航
      this.$router.push({
        path: "product",
        query: {
          id: id,
          key: key,
        },
      });
    },
    //获取所有轮播图的数据
    async getAllSwipeData() {
      let res = await get("/carousel/query", { status: "正常" });
      this.swipeData = res.data.data;
    },
  },
  created() {
    this.getAllSwipeData();
    this.queryCategory();
    this.queryProduct();
  },
};
</script>

<style >
* {
  padding: 0px;
  margin: 0px;
}
.home {
  position: relative;
}
.title {
  height: 120px;
  /* 设置渐变颜色 */
  background-image: linear-gradient(40deg, #ec6f66, #ed4264);
  border-bottom-left-radius: 30px;
  border-bottom-right-radius: 30px;
}
.title h2 {
  padding-top: 10px;
  text-align: center;
  color: white;
}
.content {
  position: absolute;
  top: 230px;
  height: 100%;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
}
.menu {
  width: 100%;
}
.swipe {
  position: absolute;
  top: 45px;
  box-shadow: 0 -5px 15px #bdbdbc;
  width: 90%;
  border-radius: 15px;
  left: 50%;
  margin-left: -45%;
}
.my-swip {
  border-radius: 10px;
  width: 100%;
  height: 149px;
}
.my-swipe img {
  border-radius: 10px;
  width: 100%;
  height: 150px;
}
[class*="van-hairline"]::after {
  border: 0;
}
.product {
  width: 100%;
}
.product_card {
  width: 93%;
  box-shadow: -1px 1px 10px rgba(236, 111, 102, 0.8);
  display: inline-block;
  margin: 13px;
  border-radius: 8px;
  font-size: 16px;
}
.van-card__title {
  line-height: 35px;
  width: 75px;
  font-weight: bold;
}
.van-tag--danger.van-tag--plain {
  color: rgb(252, 123, 101);
  border-radius: 5px;
  border: rgb(252, 123, 101, 0.5);
}
.Detail {
  width: 360px;
  height: 420px;
  float: left;
}
.Detail_1 {
  border-top: 1px solid rgb(190, 189, 189);
  border-bottom: 1px solid rgb(190, 189, 189);
}
.img_1 {
  margin-left: 36%;
  height: 100px;
  width: 100px;
}
.Detail_1 p {
  width: 230px;
  line-height: 25px;
  margin-left: 60px;
  border-bottom: 1px solid rgb(190, 189, 189);
}
.Detail_1 p img {
  width: 20px;
  height: 20px;
}
.van-dialog__header {
  font-weight: bold;
}
</style>