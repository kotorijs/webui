import Nav from './src/main';

Nav.install = function (Vue) {
  Vue.component(Nav.name, Nav);
};

export default Nav;
