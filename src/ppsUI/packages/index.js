import DialogBox from '../function/dialog.js';
// const components = require.context('../component/', false, /\.vue$/);
// const install = (Vue) => {
//   components.keys().forEach((key) => {
//     const component = components(key).default;
//     Vue.component(component.name, component);
//   });
// };

// import { Dialog } from '../component/function/dialog.js';
// const components = import.meta.glob('../component/*.vue', { eager: true });
// const install = (Vue) => {
//   Object.keys(components).forEach((key) => {
//     const component = components[key].default;
//     Vue.component(component.name, component);
//   });
// };

import Avatar from '../components/avatar/index.js';
import Button from '../components/button/index.js';
import Card from '../components/card/index.js';
import Container from '../components/container/index.js';
import ContextMenu from '../components/contextMenu/index.js';
import Dialog from '../components/dialog/index.js';
import Form from '../components/form/index.js';
import Icon from '../components/icon/index.js';
import Input from '../components/input/index.js';
import TableItem from '../components/tableItem/index.js';

const components = [
  Avatar,
  Button,
  Card,
  Container,
  ContextMenu,
  Dialog,
  Form,
  Icon,
  Input,
  TableItem
];

const install = (Vue) => {
  components.forEach((component) => {
    Vue.component(component.name, component);
  });
  Vue.prototype.$dialog = DialogBox;
};

export { install, DialogBox };
