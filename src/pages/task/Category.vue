<template>
    <div>
        <portal to="header">
            <q-header elevated>
                <q-toolbar>
                    <q-btn flat dense icon="menu" @click="$root.$emit('toggleDrawer')" />
                    <q-toolbar-title>Tasks</q-toolbar-title>
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

        <q-page></q-page>
    </div>
</template>

<script>
export default {
  name: 'PageTaskCategory',
  created(){
    console.log(this.$store.getters['auth/nickname'])
  }
}
</script>
