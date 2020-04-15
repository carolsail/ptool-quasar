<template>
    <q-dialog v-model="isOpen">
      <q-card style="width:700px;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">{{ title }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-separator />

        <q-card-section style="max-height: 50vh" class="scroll">
          <div class="q-gutter-md">
            <!-- <q-input outlined clearable v-model="task.title" label="title" /> -->
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions>
          <!-- <q-btn flat label="Delete" color="negative" @click="deleteTask" /> -->
           <q-space />
          <!-- <q-btn label="Save" color="primary" @click="upateTask" /> -->
        </q-card-actions>
      </q-card>
    </q-dialog>
</template>
<script>
export default {
    name: 'ModalTimerAdd',
    data(){
        return {
            isOpen: false,
            status: 1,
        }
    },
    created() {
        this.$root.$on('modalTimerAddOpen', (data)=>{
            this.isOpen = !this.isOpen
            this.status = data.status
        })
    },
    computed: {
        title(){
            let title = ''
            switch(this.status){
                case 1:
                    title = 'Task Start'
                    break;
                case 2:
                    title = 'Task Pause'
                    break;
                case 3:
                    title = 'Task Resume'
                    break;
            }
            return title
        }
    }
}
</script>