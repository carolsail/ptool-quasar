import Vue from 'vue'
import { removeToken, setToken } from "../../utils/auth"

export function login ({ commit }, {payload}) {
    const { account, password } = payload
    return new Promise((resolve, reject)=>{
        Vue.prototype.$axios.post('auth/login', {account: account.trim(), password}).then(response=>{
            commit('setToken', { token: response.data })
            setToken(response.data)
            resolve(response)
        }).catch(error=>{
            reject(error)
        })
    })
}

export function getInfo({ commit }) {
    return new Promise((resolve, reject)=>{
        Vue.prototype.$axios.get('auth/verify').then(response=>{
            commit('setNickname', { nickname:  response.data.nickname})
            resolve(response)
        }).catch(error=>{
            reject(error)
        })
    })
}

export function resetToken({ commit }) {
    return new Promise(resolve => {
        removeToken()
        commit('resetState')
        resolve()
    })
}