// import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 引入路由 自己封装的拦截器路由
import axios from '../utils/interceptor'
Vue.prototype.$axios = axios
// 引入element组件库
// import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css';
// import { Message } from 'element-ui'
// Vue.use(ElementUI);
// 导入全局样式表
import './assets/css/global.css'
// 全局注册加载提示的组件
import loading from './components/loading/loading'
//引入pdf预览插件
import pdf from 'pdfobject'
Vue.prototype.$pdf = pdf
// Vue.prototype.$message = Message;
Vue.component('loading', loading)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
