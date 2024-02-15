import axios from 'axios';
import config from '@/config';
import { ElMessage } from 'element-plus';

const HOST = config.host ? config.host : 'localhost';
const URL = config.port ? `http://${HOST}:${config.port}/api/` : '/api/';

const getToken = (): string => {
  return localStorage.getItem('main') ? JSON.parse(<string>localStorage.getItem('main')).token : '';
};
const reqGet = async (url: string, params?: object) =>
  axios
    .get(`${URL}${url}`, {
      params: {
        token: getToken(),
        ...params
      }
    })
    .catch((error) => {
      ElMessage.error('API请求失败！请检查配置和后端服务器');
      console.error(error);
    });

export const postLogin = (user: string, pwd: string) => {
  return reqGet('login', { user, pwd });
};

export const getBots = () => {
  return reqGet('bots');
};

export const getModules = () => {
  return reqGet('modules');
};

export const getData = () => {
  return reqGet('data');
};

export const getInfo = () => {
  return reqGet('info');
};

export const getConfig = (type?: 'module' | 'adapter', id?: string) => {
  return reqGet('config', { type, id });
};
