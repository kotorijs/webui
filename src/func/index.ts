import { DataLine, FolderRemove, Setting, PriceTag, MessageBox } from '@element-plus/icons-vue';

export * from './sandbox';

export const AsideData = [
  {
    id: '1',
    text: '数据中心',
    icon: DataLine,
    path: 'index'
  },
  /*   {
    id: '2',
    text: '日志监控',
    icon: Tickets,
    path: 'log'
  }, */
  {
    id: '3',
    text: '实例管理',
    icon: PriceTag,
    path: 'bots'
  },
  {
    id: '4',
    text: '模块管理',
    icon: FolderRemove,
    path: 'modules'
  },
  {
    id: '5',
    text: '配置查看',
    icon: Setting,
    path: 'config'
  },
  {
    id: '6',
    text: '沙盒测试',
    icon: MessageBox,
    path: 'sandbox'
  }
];
