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
          <div class="text-weight-bold">
            <span>{{$store.getters['auth/nickname']}}</span>
            <q-btn flat icon="exit_to_app" class="q-ml-md" @click="logout" />
          </div>
        </div>
      </q-img>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import taskApi from '../api/task'
import Menu from 'components/Menu'
import dayjs from 'dayjs'

let interval_deadline_mark = null

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
          icon: 'notifications_active',
          link: '/'
        },
        {
          title: 'Sheets',
          caption: 'sheet deal',
          icon: 'pie_chart',
          link: '/sheet'
        }
      ]
    }
  },
  created() {
    this.$root.$on('toggleLeftDrawer', ()=>{
      this.leftDrawerOpen = !this.leftDrawerOpen
    })
    // 更新deadline信息
    this.deadlineMark()
    if(!interval_deadline_mark){
      interval_deadline_mark = setInterval(()=>{
        let pdm = localStorage.getItem('ptool_deadline_mark') || 0
        let now = dayjs().startOf('day').valueOf()
        if(now > pdm){
          console.log('start interval deadline mark...')
          this.deadlineMark()
        }
      }, 5000)
    }
  },
  methods: {
    logout(){
      this.$q.loading.show()
      this.$store.dispatch('auth/resetToken').then(() =>{
         this.$router.push({ path: '/login' })
         this.$q.loading.hide()
      })
    },
    deadlineMark(){
      taskApi.deadlineMark().then(response=>{
        if(response.status){
          this.$root.$emit('getDeadlines')
          // 保存当天0点的时间戳如：2020-05-15 00:00:00
          localStorage.setItem('ptool_deadline_mark', dayjs().startOf('day').valueOf())
        }
      })
    }
  }
}
</script>
