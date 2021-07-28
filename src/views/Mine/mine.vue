<template>
  <div class="mine">
    <!-- 头部 -->
    <div class="header">
      <div class="bg"></div>
      <div class="user">
        <div class="img">
          <van-image
            round
            width="6rem"
            height="6rem"
            fit="cover"
            :src="userInfo.userFace"
          />
        </div>
        <div class="info">
          <div class="name">
            <p>{{ userInfo.username }}</p>
          </div>
          <div class="mineMoney">
            <p style="color: #999">账户余额:{{ userInfo.balance }}</p>
          </div>
          <div class="chongzhi">
            <van-button
              block
              round
              size="small"
              color="linear-gradient(to right, #ec6f66, #f3a183)"
              @click="show = true"
              >充值</van-button
            >
          </div>
        </div>
      </div>
    </div>
    <!-- 主体 -->

    <div class="mine_content">
      <van-cell is-link title="修改头像" @click="userFaceShow = true" />
      <van-cell is-link title="常用地址" @click="toAddress" />
      <router-link to="help"><van-cell is-link title="帮助" /></router-link>
    </div>
    <!-- 底部按钮 -->
    <div class="footButton">
      <van-button
        round
        block
        color="linear-gradient(to right, #ec6f66, #f3a183)"
        @click="dialogShow = true"
        >退出登录</van-button
      >
    </div>

    <!-- 充值弹出框 -->
    <van-action-sheet v-model="show" title="充值">
      <div class="content_chongzhi">
        <van-field
          v-model="chongzhiNum"
          type="number"
          label="充值金额"
          placeholder="请输入充值金额"
        />
        <van-button
          style="margin-top: 20px"
          round
          block
          color="linear-gradient(to right,#ec6f66, #f3a183)"
          type="info"
          @click="chongzhi"
          >提交</van-button
        >
      </div>
    </van-action-sheet>
    <!-- 充值成功提示 -->
    <van-notify v-model="notifyShow" type="success">
      <van-icon name="bell" style="margin-right: 4px" />
      <span>充值成功</span>
    </van-notify>
    <!-- 退出登录弹出框 -->
    <van-dialog v-model="dialogShow" show-cancel-button @confirm="clickConfirm">
      <p style="text-align: center; line-height: 40px">是否退出登录</p>
    </van-dialog>
    <!-- 修改头像弹出框 -->
    <van-dialog
      v-model="userFaceShow"
      title="修改头像"
      show-cancel-button
      @confirm="userFaceConfirm"
    >
      <van-field name="userface" label="添加头像">
        <template #input>
          <van-uploader
            v-model="userFace"
            :max-count="1"
            :after-read="afterRead"
          />
        </template>
      </van-field>
    </van-dialog>
  </div>
</template>

<script>
import { get, post } from "@/http/axios";
import { mapActions, mapState } from "vuex";
import { Toast } from "vant";
import axios from "axios";
export default {
  data() {
    return {
      chongzhiNum: "",
      userFace: [],
      imageUrl: "",
      show: false,
      notifyShow: false,
      dialogShow: false,
      userFaceShow: false,
    };
  },
  computed: {
    ...mapState("user", ["userInfo"]),
  },
  methods: {
    ...mapActions("user", ["getUserInfo"]),
    // 充值提交
    async chongzhi() {
      let data = {
        customerId: this.userInfo.id,
        money: this.chongzhiNum,
      };
      if (this.chongzhiNum > 1000) {
        Toast.fail("充值金额要小于1000");
      } else {
        let res = await get("/account/recharge", { ...data });
        // console.log(res);
        this.getUserInfo(this.token);
        this.show = false;
        this.chongzhiNum = "";
        this.notifyShow = true;
        setTimeout(() => {
          this.notifyShow = false;
        }, 1000);
      }
    },
    // 确定退出登录
    async clickConfirm() {
      let res = await post("/user/logout");
      // console.log(res);
      if (res.data.status == 200) {
        // 跳转到登录页面
        this.$router.push("/login");
      } else {
        // 提示错误信息
        Toast(res.data.message);
      }
    },
    // 跳转到常用地址页面
    toAddress() {
      this.$router.push({
        path: "address",
      });
    },
    // 头像上传成功之后 调用的方法
    afterRead(file) {
      // 此时可以自行将文件上传至服务器
      // console.log(file);
      const formData = new FormData(); // 声明一个FormData对象
      formData.append("file", file.file);
      axios
        .post("http://121.199.29.84:8001/file/upload", formData, {
          headers: {
            "content-type": "multer/form-data",
          },
        })
        .then((res) => {
          this.imageUrl =
            "http://121.199.29.84:8888/group1/" + res.data.data.id;
          // console.log(this.imageUrl);
        });
    },
    // 头像上传确定
    async userFaceConfirm() {
      let data = {
        id: this.userInfo.id,
        userface: this.imageUrl,
      };
      let res = await post("/baseUser/alterUserface", { ...data });
      // console.log(res);
      if (res.status === 200) {
        Toast.success(res.data.message);
      } else {
        Toast.fail(res.data.message);
      }
      this.getUserInfo();
    },
  },
  created() {
    this.getUserInfo();
    // console.log(this.userInfo);
  },
};
</script>

<style scoped>
.bg {
  width: 100%;
  height: 170px;
  border-radius: 0 0 60px 60px;
  background-image: linear-gradient(55deg, #ed4264, #f3a183);
  /* border-bottom-left-radius: 50%;
  border-bottom-right-radius: 50%; */
}
.content_bg {
  border-radius: 10px;
}
.user {
  width: 80%;
  height: 170px;
  background-color: #fff;
  position: absolute;
  top: 170px;
  left: 50%;
  transform: translate(-50%, -50%);
  /* opacity: 0.8; */
  box-shadow: 0 0 10px #ccc;
  border-radius: 8px;
  padding: 0 1em;
  margin: 0 auto;
  display: flex;
}
.img {
  width: 150px;
  margin-left: 27px;
  margin-top: 37px;
  display: inline-block;
}
.info {
  display: inline-block;
}
.name {
  font-size: 18px;
  margin-top: 30px;
  text-align: center;
}
.mineMoney {
  margin-top: 10px;
  margin-bottom: 20px;
  font-size: 18px;
  text-align: center;
}
.chongzhi {
  width: 50%;
  margin: 0 auto;
}
.mine_content {
  width: 95%;
  margin-left: 10px;
  margin-top: 120px;
}
.van-cell__title {
  font-size: 16px;
}
.footButton {
  width: 50%;
  margin: 0 auto;
  margin-top: 80px;
}
.content_chongzhi {
  padding: 16px 16px 30px;
}
</style>