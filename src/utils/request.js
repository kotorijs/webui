import axios from 'axios';
import store from '@/store';
import config from '@/config';

const HOST = config.host || 'localhost';
const PORT = config.port || 720;
const url = `http://${HOST}:${PORT}/api`;

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
    return Promise.reject(error);
  }
);

export default myAxios;
