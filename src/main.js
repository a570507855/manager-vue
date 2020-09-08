import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN'
import loading from '@/components/loading'
import iframe from '@/components/iframe'

import '@/styles/index.scss'

import App from './App'
import store from './store'
import router from './router'

import '@/icons'
import '@/permission'

import '@/filter'

import async from 'async'

if (process.env.NODE_ENV === 'production') {
  const {
    mockXHR
  } = require('../mock')
  mockXHR()
}

Vue.use(loading);
Vue.use(iframe);
Vue.use(ElementUI, {
  locale
})
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.config.productionTip = false
Vue.prototype.$async = async
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
