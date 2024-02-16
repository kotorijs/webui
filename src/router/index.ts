import { createRouter, createWebHashHistory /* , createWebHistory */ } from 'vue-router';
import Manage from '../views/ManagePage.vue';
import Index from '../views/manage/IndexPage.vue';
/* import Log from '../views/manage/LogPage.vue'; */
import Config from '../views/manage/ConfigPage.vue';
import Login from '../views/LoginPage.vue';
import Error404 from '../views/Error404Page.vue';
import Bots from '@/views/manage/BotsPage.vue';
import Modules from '@/views/manage/ModulesPage.vue';
import Sandbox from '@/views/manage/SandboxPage.vue';

const routes = [
  {
    path: '/',
    component: Manage,
    redirect: '/index',
    children: [
      {
        path: '/index',
        component: Index
      },
      /*       {
        path: '/log',
        component: Log
      }, */
      {
        path: '/bots',
        component: Bots
      },
      {
        path: '/modules',
        component: Modules
      },
      {
        path: '/config',
        component: Config
      },
      {
        path: '/sandbox',
        component: Sandbox
      }
    ]
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/:pathMatch(.*)',
    component: Error404,
    meta: {
      keepAlive: false
    }
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});
export default router;
