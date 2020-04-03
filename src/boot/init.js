import Vue from 'vue'
import PortalVue from 'portal-vue'
import * as filters from '../filter'

Vue.use(PortalVue)

Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
})