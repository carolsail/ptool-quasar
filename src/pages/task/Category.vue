<template>
  <Task>
    <q-scroll-area slot="drawer" class="fit">
      <div class="q-pa-md task-list" v-if="tasks.length">
        <q-list bordered class="rounded-borders">
          <q-expansion-item
            v-for="(task, key) in tasks"
            expand-separator
            icon="alarm"
            :label="task.title"
            :key="key"
          >
            <q-card v-if="task.timers.length">
              <q-card-section no-padding>
                <q-timeline color="secondary">
                  <template v-for="(item, key) in task.timers">
                    <q-timeline-entry :key="key" v-if="item.type=='start'" :title="item.start | parseTime('{h}:{i}')" :subtitle="item.start | parseTime('{y}-{m}-{d}')" icon="play_arrow">
                        <div class="remark">{{item.remark}}</div>
                    </q-timeline-entry>
                    <q-timeline-entry :key="key" v-if="item.type=='pause'" :title="item.start | parseTime('{h}:{i}')" :subtitle="item.start | parseTime('{y}-{m}-{d}')" icon="pause">
                      <div class="remark">{{item.remark}}</div>
                    </q-timeline-entry>
                    <q-timeline-entry :key="key" v-if="item.type=='over'" :title="item.start | parseTime('{h}:{i}')" :subtitle="item.start | parseTime('{y}-{m}-{d}')" icon="priority_high">
                        <div class="remark">{{item.remark}}</div>
                    </q-timeline-entry>
                    <q-timeline-entry :key="key" v-if="item.type=='done'" :title="item.start | parseTime('{h}:{i}')" :subtitle="item.start | parseTime('{y}-{m}-{d}')" icon="flag">
                      <div class="remark">{{item.remark}}</div>
                    </q-timeline-entry>
                  </template>
                </q-timeline>
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </q-list>
      </div>
      <div class="q-pa-md" v-else>
        <q-card>
          <q-card-section>no timeline list</q-card-section>
        </q-card>
      </div>
    </q-scroll-area>

    <div class="q-pa-md" slot="main">
      <div class="row q-col-gutter-xs q-mb-sm">
        <div class="col-12 col-md-9">
          <q-input clearable dense outlined v-model="category.title" label="Title" @keyup.enter.native="addCategory">
            <template v-slot:after>
              <q-btn outline type="submit" color="primary" label="Add Category" @click="addCategory" />
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
          <div class="col-12 col-sm col-md-4 offset-md-8">
            <q-input borderless dense debounce="300" v-model="filter.title" placeholder="title...">
              <template v-slot:append>
                <q-icon class="cursor-pointer" name="cancel" v-if="filter.title" @click="filter.title = ''"/>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
        </template>

        <template v-slot:header="props">
          <tr v-if="!$q.screen.gt.xs" style='display:none;'></tr>
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
            <q-td key="is_active" :props="props" v-if="$q.screen.gt.xs" style='width:20px;'>
              <q-toggle v-model="props.row.is_active" @input="changeActive(props.row)" />
            </q-td>
            <q-td key="update_time" :props="props" @click="$root.$emit('modalTaskCategoryOpen', props.row)" class="cursor-pointer">
              <q-item>
                <q-item-section>
                  <q-item-label class="ellipsis" style="width:100px;">{{ props.row.title }}</q-item-label>
                  <q-item-label caption lines="2">
                    <span class="text-positive">{{ props.row.create_time | parseTime('{y}-{m}-{d}') }}</span>
                  </q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-icon size='xs' name="edit" class='text-grey' />
                </q-item-section>
              </q-item>
            </q-td>
            <q-td key="tasks" :props="props" style='width:20px;'>
              <q-btn round color="primary" size="sm" icon="list" @click.stop="viewTaskHistory(props.row)" />
            </q-td>
          </q-tr>
        </template>
      </q-table>

      <ModalTaskCategory />
    </div>
  </Task>
</template>

<script>
import _ from 'lodash'
import taskApi from '../../api/task'
import Task from 'components/task/Task'
import ModalTaskCategory from 'components/task/ModalTaskCategory'
export default {
  name: 'PageTaskCategory',
  data(){
    return {
      filter: {
        title: '',
        create_time: ''
      },
      pagination: {
        sortBy: 'update_time',
        descending: true,
        page: 1,
        rowsPerPage: 3,
        rowsNumber: 10
      },
      columns: [
        { name: 'is_active', align: 'left', label: 'Active', field: 'is_active', sortable: true },
        { name: 'update_time', align: 'left', label: 'Update Time', field: 'update_time', sortable: true },
        { name: 'tasks', align: 'center' }
      ],
      loading: false,
      data: [],
      category: {
        title: ''
      },
      tasks: []
    }
  },
  components: {
    Task,
    ModalTaskCategory
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
  methods: {
    async onRequest(props) {
      const { page, rowsPerPage, sortBy, descending } = props.pagination 
      const filter = props.filter
      const startRow = (page - 1) * rowsPerPage
      try{
        this.loading = true
        const res = await taskApi.categoryLists(startRow, rowsPerPage, sortBy, descending, filter)
        const {total, lists} = res.data
        this.data.splice(0, this.data.length, ...lists)
        this.pagination.rowsNumber = total
        this.pagination.page = page
        this.pagination.rowsPerPage = rowsPerPage
        this.pagination.sortBy = sortBy
        this.pagination.descending = descending
        this.loading = false
      }catch(error){
        console.log(error)
      }
    },
    async addCategory(){
      // 判断title是否存在
      if(!this.category.title){
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
        const res = await taskApi.categoryAdd(this.category)
        this.$q.loading.hide()
        if(res.status){
          this.$q.notify({
              color: 'positive',
              position: 'top-right',
              message: res.data,
              actions: [
                  { icon: 'close', color: 'white', handler: () => {} }
              ]
          })
          this.category = { title: '' }
          this.onRequest({
            pagination: _.assign(this.pagination, {page: 1}),
            filter: this.filter
          })
        }
      }catch(error){
        console.log(error)
      }
    },
    async changeActive(row){
      const index = this.data.indexOf(row)
      const id = row['id']
      const is_active = row['is_active'] ? 1 : 0
      try{
        this.$q.loading.show()
        await taskApi.categoryChangeActive(id, is_active)
        this.$set(this.data[index], 'is_active', row['is_active'])
        this.$q.loading.hide()
        // this.onRequest({
        //   pagination: _.assign(this.pagination, {page: 1}),
        //   filter: this.filter
        // })
      }catch(error){
        console.log(error)
      }
    },
    viewTaskHistory(row){
      this.tasks = row.items
      this.$root.$emit('toggleRightDrawer')
    }
  }
}
</script>

<style>
.task-list .q-item__label{
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-all;
}
.task-list .remark{
  word-break: break-all;
}
</style>