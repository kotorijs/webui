import TableItem from './src/main';

TableItem.install = function (Vue) {
  Vue.component(TableItem.name, TableItem);
};

export default TableItem;
