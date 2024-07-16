import rf from '../reflectorFactory';

// 欢迎页迷你模块
const club = {
  message: '累计消息收:发量',
  bots: '实例在线数/总数',
  login: '登录成功:失败次数',
  memory: '内存使用量'
};

// 系统信息（表格）
const system = {
  type: '系统类型',
  arch: 'CPU架构',
  uptime: '开机时间',
  hostname: '主机名称',
  homedir: '用户目录',
  node: 'node版本'
};

// 统计信息(柱状图)
const count = {
  midwares: '中间件',
  commands: '指令',
  regexps: '正则',
  bots: '实例',
  adapters: '适配器',
  modules: '模块'
};

export const systemRF = rf(system);
export const clubRF = rf(club);
export const countRF = rf(count);
