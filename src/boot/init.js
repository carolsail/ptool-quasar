import PortalVue from 'portal-vue'
import * as filters from '../filter'
import VueNativeNotification from 'vue-native-notification'

export default async ({ Vue }) => {
    //初始化portalVue
    Vue.use(PortalVue)

    //初始化html5 web notification
    Vue.use(VueNativeNotification, {
        requestOnNotify: true
    })

    // 初始化filters
    Object.keys(filters).forEach(key => {
        Vue.filter(key, filters[key])
    })
}