import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import '@/elementUI/index.js';
import ppsUI from './ppsUI/packages';
import 'less';
import '@/assets/index.css';
import '@/assets/global.less';
import * as echarts from 'echarts';
import I18n from '@kotori-bot/i18n';
import Terminal from 'vue-web-terminal'
import 'vue-web-terminal/lib/theme/dark.css'

const i18n = new I18n();

Vue.config.productionTip = false;

Vue.use(ppsUI);
Vue.use(Terminal)

new Vue({
  router,
  store,
  render: (h) => h(App),
  beforeCreate() {
    Vue.prototype.$echarts = echarts; // 将echarts注册成Vue的全局属性
    Vue.prototype.$i18n = i18n;
  }
}).$mount('#app');
