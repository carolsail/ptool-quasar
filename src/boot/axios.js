import Vue from 'vue'
import axios from 'axios'
import { Store } from '../store'
import { getToken } from 'src/utils/auth'
import { Dialog } from 'quasar'
import { Notify } from 'quasar'

const axiosInstance = axios.create({
    baseURL: 'http://192.168.1.192/ptool/public/',
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
    const res = response.data
    if(res.code !== 20000){
        if(res.code === 10010 || res.code === 10011){
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
                message: res.data,
                actions: [
                    { label: 'x', color: 'white', handler: () => {} }
                ]
            })
        }
    }
    return res
})

Vue.prototype.$axios = axiosInstance