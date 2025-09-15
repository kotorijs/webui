import ContextMenu from './src/main';

ContextMenu.install = function (Vue) {
  Vue.component(ContextMenu.name, ContextMenu);
};

export default ContextMenu;
