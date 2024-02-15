import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import Router from '@/router';
import '@/style.css';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

import App from '@/App.vue';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(Router);
app.use(ElementPlus);

pinia.use(piniaPluginPersistedstate);

app.mount('#app');
