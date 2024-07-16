import request from '@/utils/request';
import axios from 'axios'

/**
 * 登录接口
 * @param {*} param0 { username: 用户名, password: 密码 }
 * @returns Promise对象
 */
export const loginAPI = ({ username, password }) => {
  return request({
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
  return request({
    url: '/accounts/logout',
    method: 'POST'
  });
};

/**
 * 获取机器人实例配置信息
 * @param {*} botName 机器人实例名称
 * @returns Promise对象
 */
export const getBotsAPI = (botName = '') => {
  return request({
    url: `/config/bots/${botName}`,
    method: 'GET'
  });
};

/**
 * 更新机器人实例配置信息
 * @param {*} botName 机器人实例名称
 * @returns Promise对象
 */
export const updateBotsAPI = (botName = '') => {
  return request({
    url: `/config/bots/${botName}`,
    method: 'PUT'
  });
};

/**
 * 获取插件配置信息
 * @param {*} pluginName 插件名称
 * @returns Promise对象
 */
export const getPluginsAPI = (pluginName = '') => {
  return request({
    url: `/config/plugins/${pluginName}`,
    method: 'GET'
  });
};

/**
 * 更新插件配置信息
 * @param {*} pluginName 插件名称
 * @returns Promise对象
 */
export const updatePluginsAPI = (pluginName = '') => {
  return request({
    url: `/config/plugins/${pluginName}`,
    method: 'PUT'
  });
};

/**
 * 获取插件头像接口
 * @returns Promise对象
 */
export const getPulginsAvatarAPI = (pluginName = '') => {
  return request({
    url: `/data/avatar/${pluginName}`,
    method: 'GET'
  });
};

/**
 * 获取全局配置信息接口
 * @returns Promise对象
 */
export const getGlobalAPI = () => {
  return request({
    url: '/config/global',
    method: 'GET'
  });
};

/**
 * 更新全局配置信息接口
 * @returns Promise对象
 */
export const updateGlobalAPI = () => {
  return request({
    url: '/config/global',
    method: 'PUT'
  });
};

/**
 * 获取模块数据接口
 * @param {*} moduleName 模块名称
 * @returns Promise对象
 */
export const getModuleslAPI = (moduleName = '') => {
  return request({
    url: `/config/modules/${moduleName}`,
    method: 'GET'
  });
};

/**
 * 获取机器人实例信息接口
 * @param {*} botName 机器人实例名称
 * @returns Promise对象
 */
export const getBotsDataAPI = (botName = '') => {
  return request({
    url: `/data/bots/${botName}`,
    method: 'GET'
  });
};

/**
 * 获取统计数据接口
 * @returns Promise对象
 */
export const getStatsAPI = () => {
  return request({
    url: `/data/stats/`,
    method: 'GET'
  });
};

/**
 * 获取所有模块数据接口
 * @returns Promise对象
 */

export const getAllModulesAPI = () => {
  return axios.get("https://kotori.js.org/assets/data_details.json");
};
