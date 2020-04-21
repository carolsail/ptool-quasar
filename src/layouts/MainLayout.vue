<template>
  <q-layout view="lHh Lpr lFf">
    <portal-target name="header"></portal-target>
    <portal-target name="footer"></portal-target>
  
    <q-drawer side="left" v-model="leftDrawerOpen">
      <q-scroll-area style="height: calc(100% - 150px); margin-top: 150px; border-right: 1px solid #ddd;">
        <q-list padding>
          <Menu v-for="link in menus" :key="link.title" v-bind="link"/>
        </q-list>
      </q-scroll-area>

      <q-img class="absolute-top" src="~assets/material.png" style="height: 150px">
        <div class="absolute-bottom bg-transparent">
          <q-avatar size="56px" class="q-mb-sm">
            <img src="~assets/girl-avatar.png">
          </q-avatar>
          <div class="text-weight-bold">{{$store.getters['auth/nickname']}}</div>
        </div>
      </q-img>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import Menu from 'components/Menu'

export default {
  name: 'MainLayout',

  components: {
    Menu
  },

  data () {
    return {
      leftDrawerOpen: false,
      menus: [
        {
          title: 'Tasks',
          caption: 'task timer',
          icon: 'school',
          link: '/'
        }
      ]
    }
  },
  created() {
    this.$root.$on('toggleLeftDrawer', ()=>{
      this.leftDrawerOpen = !this.leftDrawerOpen
    })
  }
}
</script>
