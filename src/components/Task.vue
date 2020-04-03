<template>
    <div>
        <portal to="header">
            <q-header elevated>
                <q-toolbar>
                    <q-btn flat round dense icon="menu" @click="$root.$emit('toggleDrawer')" />
                    <q-toolbar-title>Tasks</q-toolbar-title>
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

        <q-drawer side="right" show-if-above>
            <slot name="drawer" />
        </q-drawer>

        <q-page>
            <slot name="main" />
        </q-page>
    </div>
</template>

<script>
export default {
  name: 'Task'
}
</script>