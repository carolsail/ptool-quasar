import Vue from 'vue'
import Vuex from 'vuex'

import auth from './auth'

Vue.use(Vuex)

const Store = new Vuex.Store({
  modules: {
    auth
  },

  // enable strict mode (adds overhead!)
  // for dev mode only
  strict: process.env.DEV
})

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */
export default function (/* { ssrContext } */) {
  return Store
}

// 导出单例，instance
export { Store }
