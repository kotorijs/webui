import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '@/store';

Vue.use(VueRouter);

// 捕获调用push切换到同一路由时报错的异常。
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};

// 捕获调用replace切换到同一路由时报错的异常。
const originalReplace = VueRouter.prototype.replace;
VueRouter.prototype.replace = function replace(location) {
  return originalReplace.call(this, location).catch((err) => err);
};

const routes = [
  {
    path: '/',
    component: () => import('@/views/layout'),
    redirect: '/dataCenter',
    children: [
      {
        path: 'dataCenter',
        meta: { title: '数据中心' },
        component: () => import('@/views/dataCenter')
      },
      {
        path: 'bots',
        meta: { title: '实例管理' },
        component: () => import('@/views/bots')
      },
      {
        path: 'modules',
        meta: { title: '模块管理' },
        component: () => import('@/views/modules')
      },
      {
        path: 'config',
        meta: { title: '配置查看' },
        component: () => import('@/views/config')
      },
      {
        path: 'sendBox',
        meta: { title: '沙盒测试' },
        component: () => import('@/views/sendBox')
      },
      {
        path: 'console',
        meta: { title: '控制台' },
        component: () => import('@/views/console')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login')
  }
];

const router = new VueRouter({
  routes
});

const whiteList = ['/login'];

router.beforeEach((to, from, next) => {
  console.log(store);
  const token = store.state.layoutOption.token;
  if (token) {
    if (token) {
      //
    }
    next();
  } else {
    if (whiteList.includes(to.path)) {
      next();
    } else {
      console.log(token);
      next('/login');
    }
  }
});

export default router;
