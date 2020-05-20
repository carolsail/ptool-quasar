import axios from 'axios'
import { Store } from '../store'
import { getToken } from './token'
import { Dialog } from 'quasar'
import { Notify } from 'quasar'
import Config from './config'

const axiosInstance = axios.create({
    baseURL: Config.apiUrl,
    timeout: 5000
})

// 请求拦截器
axiosInstance.interceptors.request.use(config=>{
    // header携带token
    if(Store.getters['auth/token']) {
        config.headers['token'] = getToken()
    }
    return config
})

// 响应拦截器
axiosInstance.interceptors.response.use(response=>{
    return response.data
}, error=>{
    const res = error.response.data
    if(res.error_code === 10010 || res.error_code === 10011){
        Dialog.create({
            title: 'Tips',
            message: 'You have been logged out'
        }).onDismiss(() => {
          Store.dispatch('auth/resetToken').then(() =>{
              location.reload()
          })
        })
      }else{
          //请求失败的情况 code = 40000
          Notify.create({
              color: 'negative',
              position: 'top-right',
              message: res.msg,
              actions: [
                  { icon: 'close', color: 'white', handler: () => {} }
              ]
          })
          return Promise.reject(res)
      }
})

export default axiosInstance