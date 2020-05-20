<template>
    <div>
        <portal to="header">
            <q-header elevated>
                <q-toolbar>
                    <q-btn flat round dense icon="menu" @click="$root.$emit('toggleLeftDrawer')" />
                    <q-toolbar-title>Sheets</q-toolbar-title>
                </q-toolbar>
            </q-header>
        </portal>

        <q-page class="q-pa-md">
            <Upload />
        </q-page>
    </div>
</template>
<script>
import Upload from '../../components/Upload'
export default {
    name: 'PageSheetIndex',
    components: {
        Upload
    }
}
</script>