<template>
    <q-dialog v-model="isOpen">
      <q-card style="width:700px;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">{{title}}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-separator />

        <q-card-section style="max-height: 50vh" class="scroll">
          <div class="q-gutter-md">
            <AutoCompleteCategories v-model="task.category" />
            <DatePicker v-model="task.deadline" :label="'Deadline'" :options="true" />
            <q-input outlined clearable v-model="task.title" label="title" />
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions>
          <q-btn flat label="Delete" color="negative" @click="deleteTask" />
           <q-space />
          <q-btn label="Save" color="primary" @click="upateTask" />
        </q-card-actions>
      </q-card>
    </q-dialog>
</template>

<script>
import { parseTime } from 'src/utils/time.js'
import AutoCompleteCategories from 'src/components/task/AutoCompleteCategories'
import DatePicker from 'src/components/DatePicker'

export default {
  name: 'ModalTaskItem',
  data(){
    return {
      isOpen : false,
      title: '',
      task: {
        id: '',
        title: '',
        deadline: '',
        category: ''
      }
    }
  },
  components: {
    AutoCompleteCategories,
    DatePicker
  },
  created() {
    this.$root.$on('modalUpdateTaskOpen', (data)=>{
      this.isOpen = !this.isOpen
      this.title = this.task.title = data.title
      this.task.deadline = parseTime(data.deadline, '{y}/{m}/{d}')
      this.task.category = data.category
      this.task.id = data.id
    })
  },
  methods: {
    async upateTask() {
      const res = await this.$axios.post('task/item/update', this.task)
      if(res.status){
        this.isOpen = !this.isOpen
        this.$root.$emit('reloadRequest')
      }
    },
    async deleteTask() {
      const res = await this.$axios.post('task/item/delete', {id: this.task.id})
      if(res.status){
        this.isOpen = !this.isOpen
        this.$root.$emit('reloadRequest')
      }
    }
  }
}
</script>