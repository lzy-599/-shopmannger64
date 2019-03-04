import Vue from 'vue'
import Router from 'vue-router'
import { Message } from 'element-ui'
// import Login from '../components/login.vue'
// webpack -> @ -> src
import Login from '@/components/login.vue'
import Home from '@/components/home.vue'
import Users from '@/components/users.vue'
import Rights from '@/components/rights.vue'
import Roles from '@/components/roles.vue'
import VueRouter from 'vue-router';

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      children: [{
        name: 'users',
        path: '/users',
        component: Users
      }, {
          name: 'rights',
          path: '/rights',
          component: Rights
        }, {
          name: 'roles',
          path: '/roles',
          component: Roles
        }]
    }, {
      name: 'login',
      path: '/login',
      component: Login
    }
  ]
})

// 路由的导航守卫
// to 要去的路由配置对象
// from 当前的路由配置对象
// next 方法 next（）：让路由配置继续生效
router.beforeEach((to,from,next) => {
  // 
  console.log("路由守卫---");
  // 如果要去的是登录 login next()
  if(to.name === 'login'){
    next();
  } else {
    // 如果要去的不是登录 login   1.！token->去登录 
    const token = localStorage.getItem("token");
    if(!token){
      // 如果没token 提示请先登录
      message.warning("请先登录！");
      router.push({
        name:'login'
      })
      return;
    }
      // 2.token -> next()
      next();
  }
  // console.log(to,from);
})

export default router;

/**
 * if (!localStorage.getItem("token")) {
      this.$router.push({
        name: "login"
      });
      this.$message.warning("请先登录！");
    }
 */