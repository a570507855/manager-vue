import router from './router'
import store from './store'
import {
  Message
} from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import {
  getToken
} from '@/sessionStorage/token'

import getPageTitle from '@/utils/get-page-title'
import menu from '@/api/menu'

NProgress.configure({
  showSpinner: false
})

const whiteList = ['/login']

router.beforeEach(async (to, from, next) => {

  NProgress.start()

  document.title = getPageTitle(to.meta.title)

  const hasToken = getToken();

  if (hasToken) {
    if (!store.getters.permission_routes.length) {
      menu.getMenuTree().then(res => {
        store.dispatch('permission/generateRoutes', {
          routes: res,
          roles: ['admin']
        });
        router.addRoutes(res);
      });
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
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=/home`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
