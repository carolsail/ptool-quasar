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
                v-if="$q.screen.gt.xs"
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
            <q-input borderless dense debounce="300" v-model="filter.title" placeholder="title...">
              <template v-slot:append>
                <q-icon class="cursor-pointer" name="cancel" v-if="filter.title" @click="filter.title = ''"/>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
        </template>

        <template v-slot:header="props">
          <span v-if="!$q.screen.gt.xs"></span>
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
          <q-tr :props="props" :class="{'tr_current_highlight': timer && props.row.id == timer.item_id}">
            <q-td key="is_urgent" :props="props" v-if="$q.screen.gt.xs" style='width:20px;'>
              <q-icon size="md" name="star" :class="['cursor-pointer', props.row.is_urgent ? 'text-negative' : 'text-grey']" @click="changeUrgent(props.row)" />
            </q-td>
            <q-td key="update_time" :props="props" @click="$root.$emit('modalTaskItemOpen', props.row)" class="cursor-pointer">
              <q-item>
                <q-item-section>
                  <q-item-label class="ellipsis" style="width:100px;">{{ props.row.title }}</q-item-label>
                  <q-item-label caption lines="2">
                    <span class="text-positive">{{ props.row.create_time | parseTime('{y}-{m}-{d}') }}</span>
                  </q-item-label>
                  <q-item-label caption lines="2">
                    <span class="text-negative">{{ props.row.deadline | parseTime('{y}-{m}-{d}') }}</span>
                  </q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-icon size='xs' name="edit" class='text-grey' />
                </q-item-section>
              </q-item>
            </q-td>
            <q-td key="is_top" :props="props">
              <q-badge :class="'status_'+props.row.status" v-if="$q.screen.gt.xs">{{ props.row.status_text }}</q-badge>
            </q-td>
            <q-td key="action" :props="props" style='width:20px;'>
              <div v-if="!operate_limit || (operate_limit && props.row.id == timer.item_id)">
                <div class="q-gutter-sm" v-if="props.row.status === 1">
                  <q-btn round color="black" size="sm" icon="play_arrow" @click.stop="$root.$emit('modalTimerOpen', {row: props.row, type: 'start'})" />
                </div>
                
                <div class="q-gutter-sm" v-else-if="props.row.status === 2">
                  <q-btn round color="black" size="sm" icon="pause" @click.stop="$root.$emit('modalTimerOpen',  {row: props.row, type: 'pause'})" />
                  <q-btn round color="secondary" size="sm" icon="done" @click.stop="$root.$emit('modalTimerOpen', {row: props.row, type: 'done'})" />
                </div>

                <div class="q-gutter-sm" v-else-if="props.row.status === 3">
                  <q-btn round color="black" size="sm" icon="play_arrow" @click.stop="$root.$emit('modalTimerOpen', {row: props.row, type: 'resume'})" />
                  <q-btn round color="secondary" size="sm" icon="done" @click.stop="$root.$emit('modalTimerOpen', {row: props.row, type: 'done'})" />
                </div>

                <div class="q-gutter-sm" v-else-if="props.row.status === 4">
                  <q-btn round color="black" size="sm" icon="pause" @click.stop="$root.$emit('modalTimerOpen', {row: props.row, type: 'pause'})" />
                  <q-btn round color="secondary" size="sm" icon="done" @click.stop="$root.$emit('modalTimerOpen', {row: props.row, type: 'done'})" />
                </div>

                <div class="q-gutter-sm" v-else-if="props.row.status === 5">
                  <q-btn round color="grey" size="sm" icon="list" @click.stop="viewTimerHistory(props.row)" />
                </div>
              </div>
            </q-td>
          </q-tr>
        </template>
      </q-table>

      <ModalTaskItem />
      <ModalTimer />
    </div>
  </Task>
</template>

<script>
import _ from 'lodash'
import taskApi from '../../api/task'
import Task from 'components/task/Task'
import ModalTaskItem from 'components/task/ModalTaskItem'
import ModalTimer from 'components/task/ModalTimer'
import AutoCompleteCategories from 'src/components/task/AutoCompleteCategories'
import DatePicker from 'src/components/DatePicker'
import TaskTimerline from 'src/components/task/TaskTimeline'

export default {
  name: 'PageTaskIndex',
  data(){
    return {
      filter: {
        title: '',
        status: ['undo', 'pending', 'paused', 'overing']
      },
      status: ['undo', 'pending', 'paused', 'overing', 'done'],
      loading: false,
      pagination: {
        sortBy: 'update_time',
        descending: true,
        page: 1,
        rowsPerPage: 3,
        rowsNumber: 10
      },
      columns: [
        { name: 'is_urgent', align: 'center' },
        { name: 'update_time', align: 'left', label: 'Update Time', field: 'update_time', sortable: true },
        { name: 'is_top', align: 'left', label: 'Status', field: 'is_top', sortable: true },
        { name: 'action', align: 'center' }
      ],
      data: [],
      task: {
        title: '',
        deadline: '',
        category: ''
      },
      timers: null, // 当前timer列表
      timer: null // 当前最后一条timer
    }
  },
  components: {
    Task,
    ModalTaskItem,
    ModalTimer,
    AutoCompleteCategories,
    DatePicker,
    TaskTimerline
  },
  mounted(){
    this.$root.$on('reloadRequest', (data={})=>{
      this.onRequest({
        pagination: (data.pagination && _.assign(this.pagination, data.pagination)) || this.pagination,
        filter: (data.filter && _.assign(this.filter, data.filter)) || this.filter
      })
    })

    this.onRequest({
      pagination: this.pagination,
      filter: this.filter
    })
  },
  computed: {
    operate_limit(){
      return Boolean(this.timer && Object.keys(this.timer).length && ( this.timer.type === 'start' || this.timer.type === 'over' ))
    }
  },
  methods: {
    async onRequest(props) {
      try{
        const { page, rowsPerPage, sortBy, descending } = props.pagination 
        const filter = props.filter
        const startRow = (page - 1) * rowsPerPage
  
        this.loading = true
        const res = await taskApi.itemLists(startRow, rowsPerPage, sortBy, descending, filter)
        const {total, lists, current_timers} = res.data
        this.data.splice(0, this.data.length, ...lists)
        this.pagination.rowsNumber = total
        this.pagination.page = page
        this.pagination.rowsPerPage = rowsPerPage
        this.pagination.sortBy = sortBy
        this.pagination.descending = descending
  
        // 右侧timer列表
        this.timers = current_timers
        this.timer = current_timers && Object.keys(current_timers).length && current_timers[Object.keys(current_timers).length - 1]
        // 设置定时器
        this.$root.$emit('timerStart', {timer: this.timer, timers: this.timers})
        this.loading = false
      }catch(error){
        console.log(error)
        this.loading = false
      }
    },
    async changeUrgent(row) {
      try{
        const index = this.data.indexOf(row)
        const id = row['id']
        const is_urgent = row['is_urgent'] == 0 ? 1 : 0
        this.$q.loading.show()
        await taskApi.itemChangeUrgent(id, is_urgent)
        this.$set(this.data[index], 'is_urgent', is_urgent)
        this.$q.loading.hide()
        this.onRequest({
          pagination: _.assign(this.pagination, {page: 1}),
          filter: this.filter
        })
      }catch(error){
        console.log(error)
        this.$q.loading.hide()
      }
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
                  { icon: 'close', color: 'white', handler: () => {} }
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
                { icon: 'close', color: 'white', handler: () => {} }
            ]
        })
        return
      }
      try{
        this.$q.loading.show()
        const res = await taskApi.itemAdd(this.task)
        this.$q.loading.hide()
        if(res.status){
          this.task = {
            title: '',
            deadline: '',
            category: ''
          }
          this.onRequest({
            pagination: _.assign(this.pagination, {page: 1}),
            filter: this.filter
          })
        }
      }catch(error){
        console.log(error)
        this.$q.loading.hide()
      }
    },
    viewTimerHistory(row) {
      const current_timers = row.timers
      // 右侧timer列表
      this.timers = current_timers
      this.timer = current_timers && Object.keys(current_timers).length && current_timers[Object.keys(current_timers).length - 1]
      // 设置定时器
      this.$root.$emit('timerStart', {timer: this.timer, timers: this.timers})
    }
  }
}
</script>

<style>
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
  background: red;
}
.status_5 {
  background: green;
}
.tr_current_highlight {
  background: #ebf5eb;
}
</style>