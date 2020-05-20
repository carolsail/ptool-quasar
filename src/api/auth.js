import http from "../utils/http";

export default {
    login(account, password){
        return http.post('auth/login', {account, password})
    },
    info(){
        return http.get('auth/info')
    }
}