<template>
    <div>
        <portal to="header">
            <q-header elevated>
                <q-toolbar>
                    <q-btn flat round dense icon="menu" @click="$root.$emit('toggleLeftDrawer')" />
                    <q-toolbar-title>Tasks</q-toolbar-title>
                    <q-space />
                    <q-btn flat round dense icon="sms_failed">
                        <q-badge floating color="red" v-if="deadlines.length">{{deadlines.length}}</q-badge>
                        <q-menu v-if="deadlines.length">
                            <q-list separator>
                                <q-item-label  class="bg-dark text-white" header>Deadline's Task</q-item-label>
                                <q-separator />
                                <q-item clickable v-close-popup v-for="(item, key) in deadlines" :key="key" @click="checkDeadline(item.id)">
                                    <q-item-section>
                                        <q-item-label style='min-width:120px'>{{item.title}}</q-item-label>
                                        <q-item-label caption>{{item.deadline|parseTime('{y}-{m}-{d}')}}</q-item-label>
                                    </q-item-section>
                                </q-item>
                                <q-item clickable v-close-popup  @click="checkDeadline()">
                                    <q-item-section>
                                        <q-item-label class='text-center'>Clear All</q-item-label>
                                    </q-item-section>
                                </q-item>
                            </q-list>
                        </q-menu>
                    </q-btn>
                </q-toolbar>
            </q-header>
        </portal>

        <portal to="footer">
            <q-footer elevated>
                <q-tabs align="justify">
                    <q-route-tab to="/" name="items" icon="alarm" label="" />
                    <q-route-tab to="/task-category" name="categories" icon="view_list" label="" />
                </q-tabs>
            </q-footer>
        </portal>

        <q-drawer side="right" class="rightDrawer" v-model="rightDrawerOpen" show-if-above>
            <slot name="drawer" />
        </q-drawer>

        <q-page>
            <slot name="main" />
        </q-page>
    </div>
</template>

<script>
import taskApi from '../../api/task'
export default {
  name: 'Task',
  data(){
      return {
          rightDrawerOpen: false
      }
  },
  created(){
    this.$root.$on('toggleRightDrawer', ()=>{
      this.rightDrawerOpen = true
    })

    this.$root.$on('getDeadlines', ()=>{
        this.getDeadlines()
    })
  },
  computed: {
      deadlines(){
          return this.$store.getters['deadline/deadlines']
      }
  },
  methods: {
      getDeadlines(){
          this.$store.dispatch('deadline/deadlines')
      },
      checkDeadline(id=''){
          taskApi.deadlineCheck(id).then(response=>{
              if(response.status) this.getDeadlines()
          })
      }
  }
}
</script>

<style>
.rightDrawer .q-drawer {
    position: fixed;
}
</style>