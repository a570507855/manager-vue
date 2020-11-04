import Vue from 'vue'
import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/zh-CN'
import loading from '@/script/uc/loading'
import post from '@/script/lib/post-sdk'

import App from './App'
import store from './store'
import router from './router'

import 'element-ui/lib/theme-chalk/index.css'
import 'normalize.css/normalize.css'
import '@/css/index.scss'
import '@/icons'
import '@/permission'
import '@/script/filter'

Vue.use(loading);
Vue.use(ElementUI, {
  locale
})

Vue.config.productionTip = false
Vue.prototype.$post = post;
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
