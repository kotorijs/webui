const { defineConfig } = require('@vue/cli-service');
module.exports = defineConfig({
  transpileDependencies: true,
  // publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
  configureWebpack: {
    // externals: {
    //   vue: 'Vue',
    //   vuex: 'Vuex',
    //   'vue-router': 'VueRouter',
    //   'element-ui': 'ELEMENT',
    //   echarts: 'echarts',
    //   axios: 'axios',
    //   'vue-json-schema-form': 'VueJsonSchemaForm',
    //   'vuex-persistedstate': 'createPersistedState'
    // }
  }
});
