import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import * as ppsUI from './ppsUI/packages/index';
import '@/ppsUI/theme/index.scss'
import * as echarts from 'echarts';
import I18n from '@kotori-bot/i18n';
import '@/elementUI/index.js';
import '@/vueWebTerminal/index.js';
import '@/vjsf/index.js';
import 'less';
import 'sass'
import '@/assets/index.less';
import '@/assets/global.less';
import '@/assets/layui/layui.css';
import 'vue-web-terminal/lib/theme/dark.css';
import resize from '@/directives/resizeOb';
import transTime from '@/directives/transTime';
import { configureAxiosInstance } from '@/utils/request';
import webSocketPlugin from './plugins.js';

const i18n = new I18n();

Vue.config.productionTip = false;

configureAxiosInstance(store);

Vue.use(webSocketPlugin);
Vue.use(ppsUI.install);
Vue.directive('resize-ob', resize);
Vue.directive('trans-time', transTime);

new Vue({
  router,
  store,
  render: (h) => h(App),
  beforeCreate() {
    Vue.prototype.$echarts = echarts; // 将echarts注册成Vue的全局属性
    Vue.prototype.$i18n = i18n;
  }
}).$mount('#app');
