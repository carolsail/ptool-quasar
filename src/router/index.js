import Vue from 'vue'
import VueRouter from 'vue-router'

import routes from './routes'
import { getToken } from '../utils/token'
import { Store } from '../store'

Vue.use(VueRouter)

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default function (/* { store, ssrContext } */) {
  const Router = new VueRouter({
    scrollBehavior: () => ({ x: 0, y: 0 }),
    routes,

    // Leave these as they are and change in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  })

  // 路由前置守卫
  const whiteList = ['/login']
  Router.beforeEach(async(to, from, next)=>{
    const hasToken = getToken()
    if(hasToken) {
      if(to.path === '/login') {
        next({ path: '/' })
      } else {
        const hasAccountInfo = Store.getters['auth/nickname']
        if(hasAccountInfo){
          next()
        }else{
          // 获取用户信息
          try{
            await Store.dispatch('auth/getInfo')
            next()
          }catch(error){
            console.log(error, '用户信息获取失败')
          }
        }
      }
    } else {
      if (whiteList.indexOf(to.path) !== -1) {
        next()
      } else {
        next(`/login?redirect=${to.path}`)
      }
    }
  })

  return Router
}
