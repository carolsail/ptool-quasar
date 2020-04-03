<template>
  <Task>
    <q-scroll-area slot="drawer" class="fit">
      <div class="q-pa-md">
        task list...
      </div>
    </q-scroll-area>

    <div class="q-pa-md" slot="main">
      main...
    </div>
  </Task>
</template>

<script>
import Task from 'components/Task'
export default {
  name: 'PageTaskCategory',
  components: {
    Task
  }
}
</script>
