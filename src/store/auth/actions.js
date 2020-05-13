import { removeToken, setToken } from "../../utils/token"
import apiAuth from '../../api/auth'

export function login ({ commit }, {payload}) {
    const { account, password } = payload
    return apiAuth.login(account.trim(), password).then(response=>{
        commit('setToken', { token: response.data })
        setToken(response.data)
        return response
    })
}

export function getInfo({ commit }) {
    return apiAuth.info().then(response=>{
        commit('setNickname', { nickname:  response.data.nickname})
        return response
    })
}

export function resetToken({ commit }) {
    return new Promise(resolve => {
        removeToken()
        commit('resetState')
        resolve()
    })
}