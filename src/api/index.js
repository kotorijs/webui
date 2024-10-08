import request from '@/utils/request';
import axios from 'axios';

/**
 * 登录接口
 * @param {*} param0 { username: 用户名, password: 密码 }
 * @returns Promise对象
 */
export const loginAPI = ({ username, password }) => {
  return request()({
    url: '/accounts/login',
    method: 'POST',
    data: {
      username,
      password
    }
  });
};

/**
 * 登出接口
 * @returns Promise对象
 */
export const logoutAPI = () => {
  return request()({
    url: '/accounts/logout',
    method: 'POST'
  });
};

/**
 * 获取机器人实例信息接口
 * @param {*} botName 机器人实例名称
 * @returns Promise对象
 */
export const getBotsDataAPI = (botName = null) => {
  const url = botName ? `/data/bots/${botName}` : '/data/bots';
  return request()({
    url: url,
    method: 'GET'
  });
};

/**
 * 获取机器人实例配置信息
 * @param {*} botName 机器人实例名称
 * @returns Promise对象
 */
export const getBotsConfigAPI = (botName = '') => {
  return request()({
    url: `/config/bots/${botName}`,
    method: 'GET'
  });
};

/**
 * 更新机器人实例配置信息
 * @param {*} botName 机器人实例名称
 * @param {*} config 机器人实例配置信息
 * @returns Promise对象
 */
export const updateBotsConfigAPI = (botName, config) => {
  return request()({
    url: `/config/bots/${botName}`,
    method: 'PUT',
    data: {
      ...config
    }
  });
};

/**
 * 获取插件配置信息
 * @param {*} pluginName 插件名称
 * @returns Promise对象
 */
export const getPluginsConfigAPI = (pluginName = '') => {
  return request()({
    url: `/config/plugins/${pluginName}`,
    method: 'GET'
  });
};

/**
 * 更新插件配置信息
 * @param {*} pluginName 插件名称
 * @param {*} config 插件配置信息
 * @returns Promise对象
 */
export const updatePluginsConfigAPI = (pluginName = '', config) => {
  return request()({
    url: `/config/plugins/${pluginName}`,
    method: 'PUT',
    data: config
  });
};

/**
 * 获取全局配置信息接口
 * @returns Promise对象
 */
export const getGlobalConfigAPI = () => {
  return request()({
    url: '/config/global',
    method: 'GET'
  });
};

/**
 * 更新全局配置信息接口
 * @returns Promise对象
 */
export const updateGlobalConfigAPI = (config) => {
  return request()({
    url: '/config/global',
    method: 'PUT',
    data: config
  });
};

/**
 * 获取模块数据接口
 * @param {*} moduleName 模块名称
 * @returns Promise对象
 */
export const getUserModulesAPI = (moduleName = '') => {
  return request()({
    url: `/data/modules/${moduleName}`,
    method: 'GET'
  });
};

/**
 * 获取所有模块数据接口
 * @returns Promise对象
 */
export const getAllModulesAPI = () => {
  return axios.get('https://kotori.js.org/assets/data_details.json');
};

/**
 * 获取统计数据接口
 * @returns Promise对象
 */
export const getStatsAPI = () => {
  return request()({
    url: `/data/stats/`,
    method: 'GET'
  });
};

/**
 * 获取实时状态接口
 * @returns Promise对象
 */
export const getStatusAPI = () => {
  return request()({
    url: `/data/status/`,
    method: 'GET'
  });
};

/**
 * 获取指令数据接口
 * @param {*} command 指令名称
 * @returns Promise对象
 */
export const getCommandsAPI = (command = '') => {
  return request()({
    url: `/config/commands/${command}`,
    method: 'GET'
  });
};

/**
 * 更新单个指令配置信息接口
 * @param {*} command 指令名称
 * @param {*} config 指令配置信息
 * @returns Promise对象
 */
export const updateCommandConfigAPI = (command, config) => {
  return request()({
    url: `/config/commands/${command}`,
    method: 'PUT',
    data: config
  });
};

/**
 * 获取版本信息接口
 * @returns Promise对象
 */
export const getVersionAPI = () => {
  return axios.get('https://kotori.js.org/assets/deps.json');
};
