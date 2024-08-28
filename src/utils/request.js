import { Message } from 'element-ui';
import router from '@/router';
// import config from '@/config';
import axios from 'axios';
// import store from '@/store/index';

let myAxios;

export const configureAxiosInstance = (store) => {
  const HOST = store.state.layoutOption.host ?? '';
  const PORT = store.state.layoutOption.port ?? '';
  const url = HOST && PORT ? `${HOST}:${PORT}/api` : '/api';

  myAxios = axios.create({
    baseURL: url,
    timeout: 8000
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
      } else if (error.response.status === 404) {
        router.push('/login');
        store.commit('layoutOption/updateToken', '');
        Message.error('请求资源不存在！检查后端服务是否正常！');
      }
      return Promise.reject(error);
    }
  );
};

export default () => {
  if (!myAxios) {
    throw new Error('axios is not defined');
  }
  return myAxios;
};
