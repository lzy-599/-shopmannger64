<template>
  <el-container class="container">
    <el-header>
      <el-row>
        <el-col :span="4">
          <img src="@/assets/logo.png" alt="图片加载失败">
        </el-col>
        <el-col :span="19" class="middle">
          <h2>电商后台管理系统</h2>
        </el-col>
        <el-col :span="1">
          <a href="#" class="logout" @click="handleLoginout()">退出</a>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside class="aside" width="200px">
        <el-menu
          :unique-opened="true"
          :router="true"
          default-active="2"
          class="el-menu-vertical-demo"
        >
          <!-- 1 -->
          <el-submenu :index="item1.order+''" v-for="(item1,i) in menus" :key="item1.id">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{item1.authName}}</span>
            </template>
            <el-menu-item :index="item2.path+''" v-for="(item2,i) in item1.children" :key="item2.id">
              <i class="el-icon-menu"></i>
              <span>{{item2.authName}}</span>
            </el-menu-item>
          </el-submenu>

        </el-menu>
      </el-aside>
      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data(){
    return{
      menus:[]
    }
  },
  // 如果用户没登录 -> if(!token) -> 改标识this.$router.push -> 显示login.vue
  // 如果登录了 -> if(token) -> 继续渲染home.vue
  // 页面加载之前
  // Complexity is Everything is cool!
  beforeMount() {
    // 放在路由守卫里
  },
  mounted() {},
  created() {
    this.getMenus();
  },
  methods: {
    // 动态导航
    async getMenus(){
      const res = await this.$http.get(`menus`);
      const {meta:{msg,status},data} = res.data;
      if(status === 200){
        this.menus = data;
      }
      console.log(res);
    },
    // 退出
    handleLoginout() {
      localStorage.clear();
      // 来到登录界面
      this.$router.push({
        name: "login"
      });
      // 提示
      this.$message.warning("退出成功");
    }
  }
};
</script>

<style>
.container {
  height: 100%;
  background-color: #b3c0d1;
}

.main {
  background-color: #e9eef3;
  /* height: 100%; */
}
.middle {
  line-height: 60px;
  text-align: center;
  color: #ffffff;
}
.logout {
  line-height: 60px;
  text-decoration: none;
}
.el-menu-vertical-demo {
  height: 100%;
}
</style>
