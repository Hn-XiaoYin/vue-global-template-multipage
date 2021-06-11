<template>
  <div @click="login">登录</div>
</template>
<script>
export default {
  methods: {
    login() {
      const { redirect } = this.$route.query;
      console.log(redirect);
      localStorage.setItem("token", "111");
      this.$router.replace({ path: redirect });
    },
  },
};
</script>
