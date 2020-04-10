import Vue from 'vue'
import PortalVue from 'portal-vue'
import * as filters from '../filter'
import VueCountdown from '@chenfengyuan/vue-countdown'

Vue.component(VueCountdown.name, VueCountdown)

Vue.use(PortalVue)

Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
})
