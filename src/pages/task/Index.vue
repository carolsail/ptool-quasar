<template>
  <Task>
    <q-scroll-area slot="drawer" class="fit">
      <div class="q-pa-md task-timer">
        <TaskTimerline />
      </div>
    </q-scroll-area> 

    <div slot="main" class="q-pa-md">
      <div class="row q-col-gutter-xs q-mb-sm">
        <div class="col-6 col-md-3">
          <AutoCompleteCategories v-model="task.category" :dense="true" />
        </div>
        <div class="col-6 col-md-3">
          <DatePicker v-model="task.deadline" :label="'Deadline'" :dense="true"  :options="true" />
        </div>
        <div class="col-12 col-md-6">
          <q-input clearable dense outlined v-model="task.title" label="Title" @keyup.enter.native="addTask">
            <template v-slot:after>
              <q-btn outline type="submit" color="primary" label="Add Task" @click="addTask" />
            </template>
          </q-input>
        </div>
      </div>

      <q-table
        title=""
        :data="data"
        :columns="columns"
        row-key="id"
        :pagination.sync="pagination"
        :loading="loading"
        :filter="filter"
        @request="onRequest"
        binary-state-sort
      >
        <template v-slot:top>
          <div class="col-12 col-sm col-md-4">
            <q-select
                v-if="$q.screen.gt.sm"
                v-model="filter.status"
                multiple
                borderless
                dense
                options-dense
                :options="status"
                label="Status select"
              />
          </div>
          
          <div class="col-12 col-sm col-md-4 offset-md-4">
            <q-input borderless dense debounce="300" v-model="filter.title" placeholder="Search">
              <template v-slot:append>
                <q-icon name="cancel" v-if="filter.title" @click="filter.title = ''"/>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
        </template>

        <template v-slot:header="props">
          <span v-if="!$q.screen.gt.sm"></span>
          <q-tr v-else :props="props">
            <q-th
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
            >
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>

        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="is_urgent" :props="props" style='width:20px;'>
              <q-icon class="cursor-pointer" size="md" name="star" :color="props.row.is_urgent ? 'red' : 'grey'" @click="changeUrgent(props.row)" />
            </q-td>
            <q-td class="cursor-pointer" key="create_time" :props="props" @click="$root.$emit('modalUpdateTaskOpen', props.row)">
              <q-item>
                <q-item-section>
                  <q-item-label>{{ props.row.title }}</q-item-label>
                  <q-item-label caption lines="2">
                    <span class="text-positive">{{ props.row.create_time | parseTime('{y}-{m}-{d}') }}</span>
                  </q-item-label>
                  <q-item-label caption lines="2">
                    <span class="text-negative">{{ props.row.deadline | parseTime('{y}-{m}-{d}') }}</span>
                  </q-item-label>
                </q-item-section>
                <q-item-section side v-if="$q.screen.gt.xs">
                  <q-item-label caption>
                    <q-badge :class="'status_'+props.row.status">{{ props.row.status_text }}</q-badge>
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-td>
            <q-td key="action" :props="props" style='width:20px;'>
              <div class="q-gutter-sm">
                <q-btn round color="black" size="md" icon="play_arrow" @click.stop="$root.$emit('timerStart', props.row)" />
                <q-btn round color="secondary" size="md" icon="done" />
              </div>
            </q-td>
          </q-tr>
        </template>
      </q-table>

      <ModalTaskItem />
    </div>
  </Task>
</template>

<script>
import _ from 'lodash'
import Task from 'components/task/Task'
import ModalTaskItem from 'components/task/ModalTaskItem'
import AutoCompleteCategories from 'src/components/task/AutoCompleteCategories'
import DatePicker from 'src/components/DatePicker'
import TaskTimerline from 'src/components/task/TaskTimeline'

export default {
  name: 'PageTaskIndex',
  data(){
    return {
      filter: {
        title: '',
        status: ['undo', 'pending', 'paused']
      },
      status: ['undo', 'pending', 'paused', 'done'],
      loading: false,
      pagination: {
        sortBy: 'create_time',
        descending: true,
        page: 1,
        rowsPerPage: 3,
        rowsNumber: 10
      },
      columns: [
        { name: 'is_urgent', align: 'center' },
        { name: 'create_time', align: 'left', label: 'Task Item', field: 'create_time', sortable: true },
        { name: 'action', align: 'center' }
      ],
      data: [],
      task: {
        title: '',
        deadline: '',
        category: ''
      }
    }
  },
  components: {
    Task,
    ModalTaskItem,
    AutoCompleteCategories,
    DatePicker,
    TaskTimerline
  },
  mounted(){
    this.$root.$on('reloadRequest', ()=>{
      this.onRequest()
    })
    this.onRequest()
  },
  methods: {
    async onRequest(props={}) {
      const { page, rowsPerPage, sortBy, descending } = props.pagination || this.pagination 
      const filter = props.filter || this.filter
      const startRow = (page - 1) * rowsPerPage
      this.loading = true
      const res = await this.$axios.post('task/items', {startRow, rowsPerPage, sortBy, descending, filter})
      const {total, lists} = res.data
      this.data.splice(0, this.data.length, ...lists)
      this.pagination.rowsNumber = total
      this.pagination.page = page
      this.pagination.rowsPerPage = rowsPerPage
      this.pagination.sortBy = sortBy
      this.pagination.descending = descending
      this.loading = false
    },
    async changeUrgent(row) {
      const index = this.data.indexOf(row)
      const id = row['id']
      const is_urgent = row['is_urgent'] == 0 ? 1 : 0
      this.$q.loading.show()
      await this.$axios.post('task/change/urgent', {id, is_urgent})
      this.$set(this.data[index], 'is_urgent', is_urgent)
      this.$q.loading.hide()
    },
    async addTask() {
      // 判断deadline是否合法
      if(this.task.deadline != ''){
        if(!(/^-?[\d]+\/[0-1]\d\/[0-3]\d$/.test(this.task.deadline))){
          this.$q.notify({
              color: 'negative',
              position: 'top-right',
              message: 'Deadline incorrect',
              actions: [
                  { label: 'x', color: 'white', handler: () => {} }
              ]
          })
          return
        }
      }
      // 判断title是否存在
      if(!this.task.title){
        this.$q.notify({
            color: 'negative',
            position: 'top-right',
            message: 'Title is empty',
            actions: [
                { label: 'x', color: 'white', handler: () => {} }
            ]
        })
        return
      }
      const res = await this.$axios.post('task/item/add', this.task)
      if(res.status){
        this.$q.notify({
            color: 'positive',
            position: 'top-right',
            message: res.data,
            actions: [
                { label: 'x', color: 'white', handler: () => {} }
            ]
        })
        this.task = {
          title: '',
          deadline: '',
          category: ''
        }
        this.onRequest()
      }
    }
  }
}
</script>

<style scoped>
.status_1 {
  background: grey;
}
.status_2 {
  background: blue;
}
.status_3 {
  background: orange;
}
.status_4 {
  background: green;
}
</style>