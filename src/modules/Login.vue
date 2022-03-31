<template>
  <div>
    <input type="text" /><br />
    <input type="text" /><br />
    <router-link to="/home/list">跳转到 Hemo</router-link><br />

    <button @click="ajaxLogin">ajax登录</button>
    <button @click="logOut">退出</button>
    <br />
    <button @click="axiosLogin">axios登录</button>

    <br />
    <header-nav ref="headerNav" :headerStr2="headerStr2"></header-nav>
    <p>{{ msg | isNo1 }}</p>
    <p>{{ msg1 | limit(5, "...") }}</p>
    <span class="iconfont">&#xe629;</span>

    <loading v-if="loading"></loading>
  </div>
</template>

<script>
import helper from "@/helper";
import api from "@/api";
import rest from "@/rest";
import "@/filters";

export default {
  data () {
    return {
      loading: true, //加载器
      headerStr1: "顶部",
      headerStr2: "导航",
      msg: 1,
      msg1: "列表页123456"
    };
  },
  mounted () {
    this.$refs["headerNav"].init(this.headerStr1);
    helper.set({ token: "123456789" });
    // var token = helper.get("token");
  },
  methods: {
    ajaxLogin () {
      rest
        .get(api.user.login, {
          userName: "51095",
          passward: "04143612",
          componentName: "agent_cloud",
          captcha: "1234"
        })
        .done(function (res) {
          if (helper.isSuccess(res)) {
            //...
          } else {
            //...
          }
        });
      helper.set({ token: "123456789" });
    },
    logOut () {
      rest.delete(api.user.logOut).done(function (res) {
        if (helper.isSuccess(res)) {
          //...
        } else {
          //...
        }
      });
    },
    axiosLogin () {
      this.$axios({
        method: "get",
        url: "http://172.16.9.77:8080/agent_cloud/" + api.user.login,
        data: {
          userName: "51095",
          passward: "04143612",
          componentName: "agent_cloud",
          captcha: "1234"
        }
      })
        .then(res => {
          console.log("成功", res);
        })
        .catch(err => {
          console.warn("失败", err);
        });
    }
  }
};
</script>

<style lang="scss" scoped></style>
