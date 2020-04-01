<template>
  <div>
    <portal to="header">
      <q-header elevated>
          <q-toolbar>
            <q-btn flat round dense icon="menu" @click="$root.$emit('toggleDrawer')" />
            <q-toolbar-title>Tasks</q-toolbar-title>
            <q-btn flat round dense icon="menu" @click="toggoleRightDrawer" />
          </q-toolbar>
      </q-header>
    </portal>

    <portal to="footer">
      <q-footer elevated>
        <q-tabs dense align="justify">
          <q-route-tab to="/" name="items" icon="alarm" label="Items" />
          <q-route-tab to="/task-category" name="categories" icon="view_list" label="Categories" />
        </q-tabs>
      </q-footer>
    </portal>

    <q-drawer side="right" v-model="rightDrawerOpen" show-if-above >
      <q-scroll-area class="fit">
        <div class="q-pa-md">
          <q-timeline color="secondary">
            <q-timeline-entry heading>00:00:50</q-timeline-entry>

            <q-timeline-entry title="17:46" subtitle="2020-04-01" icon="play_arrow">
              <div>start...</div>
            </q-timeline-entry>

            <q-timeline-entry title="17:46" subtitle="2020-04-01" icon="pause">
              <div>pause...</div>
            </q-timeline-entry>

            <q-timeline-entry title="17:46" subtitle="2020-04-01" icon="flag">
              <div>over...</div>
            </q-timeline-entry>
          </q-timeline>
        </div>
      </q-scroll-area>
    </q-drawer>

    <q-page padding>
      <q-list>
        <q-item>
          <q-item-section avatar top>
            <q-icon name="account_tree" color="black" size="34px" />
          </q-item-section>

          <q-item-section top class="col-2 gt-sm">
            <q-item-label class="q-mt-sm">GitHub</q-item-label>
          </q-item-section>

          <q-item-section top>
            <q-item-label lines="1">
              <span class="text-weight-medium">[quasarframework/quasar]</span>
              <span class="text-grey-8"> - GitHub repository</span>
            </q-item-label>
            <q-item-label caption lines="1">
              @rstoenescu in #3: > Generic type parameter for props
            </q-item-label>
            <q-item-label lines="1" class="q-mt-xs text-body2 text-weight-bold text-primary text-uppercase">
              <span class="cursor-pointer">Open in GitHub</span>
            </q-item-label>
          </q-item-section>

          <q-item-section top side>
            <div class="text-grey-8 q-gutter-xs">
              <q-btn class="gt-xs" size="12px" flat dense round icon="delete" />
              <q-btn class="gt-xs" size="12px" flat dense round icon="done" />
              <q-btn size="12px" flat dense round icon="more_vert" />
            </div>
          </q-item-section>
        </q-item>
        <q-separator spaced />
      </q-list>
    </q-page>
  </div>
</template>

<script>
export default {
  name: 'PageTaskIndex',
  data(){
    return {
      rightDrawerOpen: false
    }
  },
  methods: {
    toggoleRightDrawer(){
      this.rightDrawerOpen = !this.rightDrawerOpen
    }
  }
}
</script>
