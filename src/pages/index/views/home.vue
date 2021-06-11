<template>
  <div id="app">
    <router-link to="/goods">商品</router-link>
    <router-link to="/mine">我的</router-link>
    <div @click="login">登录</div>
    <div @click="userInfo">我的</div>
    <div>{{ dataInfo.name }}{{ dataInfo.uid }}{{ dataInfo.nick_name }}</div>
    <div>
      {{ dataNewInfo.name }}{{ dataNewInfo.uid }}{{ dataNewInfo.nick_name }}
    </div>
    <!-- <hello /> -->
  </div>
</template>
<script>
// import hello from "components/HelloWorld";
import { login, auth, userinfo } from "api/user";
export default {
  components: {
    // hello,
  },
  data() {
    return {
      isRotate: false,
      dataInfo: {
        name: "",
        uid: "",
        nick_name: "",
      },
      dataNewInfo: {
        name: "",
        uid: "",
        nick_name: "",
      },
    };
  },
  methods: {
    toget() {
      this.isRotate = !this.isRotate;
    },
    async login() {
      const { code, data } = await login({ name: "admin", password: "123" });
      if (code === 0) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("refreshToken", data.refreshToken);
      }
      console.log("结果---", data);
    },
    async userInfo() {
      auth().then((res) => {
        const { data } = res;
        this.dataInfo = data;
        console.log("auth结果---", data);
      });
      userinfo().then((res) => {
        const { data } = res;
        this.dataNewInfo = data;
        console.log("userinfo结果---", data);
      });
    },
  },
  created() {
    console.log("父---created");
  },
  mounted() {
    console.log("父---mounted");
  },
};
</script>
<style lang="scss" scoped>
#app {
  // font-size: $font36;
  font-weight: bold;
  overflow: hidden;
  background-color: #fff;
}
.border {
  @include borders-1(all);
}
.triangle {
  width: 200px;
  height: 21px;
  @include ellipsis(200px);
  @include triangle(
    6,
    $direction: left,
    $position: left,
    $offsetX: 20,
    $offsetY: 5,
    $selfOffsetX: 5
  );
}
.triangleRotate {
  width: 200px;
  height: auto;
  transition: height 0.3;
  @include triangle(
    6,
    $direction: top,
    $position: left,
    $offsetX: 20,
    $offsetY: 5,
    $selfOffsetX: 5
  );
}
</style>
