import axios from 'axios';
import store from '@/store/index';
import config from '@/config';
import router from '@/router';
import { Message } from 'element-ui';

const HOST = config.host || 'localhost';
// const PORT = config.port || 720;
const url = `https://${HOST}/api`;

const myAxios = axios.create({
  baseURL: url
});

// 请求拦截器
myAxios.interceptors.request.use((config) => {
  if (store.state.layoutOption.token) {
    config.headers.authorization = `Bearer ${store.state.layoutOption.token}`;
  }
  return config;
});

// // 响应拦截器
myAxios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      router.push('/login');
      store.commit('layoutOption/updateToken', '');
      Message.error('登录过期，请重新登录');
    }
    return Promise.reject(error);
  }
);

export default myAxios;
