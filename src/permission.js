import router from './router'
import store from './store'
import {
  Message
} from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import {
  getSessionId
} from '@/sessionStorage/sessionId'

import getPageTitle from '@/utils/get-page-title'
import menu from '@/api/menu'

NProgress.configure({
  showSpinner: false
})

const whiteList = ['/login']

router.beforeEach(async (to, from, next) => {

  NProgress.start()

  document.title = getPageTitle(to.meta.title)

  const hasSessionId = getSessionId();

  if (hasSessionId) {
    if (!store.getters.permission_routes.length) {
      menu.getMenuTree();
    }
    if (to.path === '/login') {
      next({
        path: '/'
      })
      NProgress.done()
    } else {
      const hasGetUserInfo = '游戏人生'
      if (hasGetUserInfo) {
        next()
      } else {
        try {
          next()
        } catch (error) {
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=/home`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
