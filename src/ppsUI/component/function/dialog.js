
// // DialogManager.js
// import Vue from 'vue'
// import DialogComponent from './DialogComponent.vue'

// let instance

// const DialogConstructor = Vue.extend(DialogComponent)

// function initInstance () {
//   instance = new DialogConstructor({
//     el: document.createElement('div')
//   })
//   document.body.appendChild(instance.$el)
// }

// const DialogManager = {
//   show (options) {
//     if (!instance) {
//       initInstance()
//     }
//     Object.assign(instance, {
//       title: '',
//       message: '',
//       ...options,
//       isOpen: true
//     })
//     return new Promise((resolve, reject) => {
//       instance.resolve = resolve
//       instance.reject = reject
//     })
//   }
// }

// export default {
//   install () {
//     Vue.prototype.$dialog = DialogManager
//   }
// }

// // MyComponent.vue
// import DialogManager from './DialogManager'

// Vue.use(DialogManager)

// export default {
//   // ...
//   methods: {
//     async quitFn () {
//       const result = await this.$dialog.show({
//         title: '提示',
//         message: '确认退出登录？'
//       })
//       if (result === 'confirm') {
//         this.$router.push('/login')
//       }
//     }
//   }
// }
