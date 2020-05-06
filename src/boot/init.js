import Vue from 'vue'
import PortalVue from 'portal-vue'
import * as filters from '../filter'
import VueNativeNotification from 'vue-native-notification'

Vue.use(PortalVue)

Vue.use(VueNativeNotification, {
    requestOnNotify: true
})

Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
})
