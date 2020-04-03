<template>
  <Task>
    <q-scroll-area slot="drawer" class="fit">
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

    <div slot="main" class="q-pa-md">
      <div class="q-gutter-xs row items-start q-mb-sm">
        <q-select
          dense
          v-model="task.category"
          use-input
          hide-selected
          fill-input
          input-debounce="500"
          label="Category"
          :options="categories"
          @filter="getCategories"
          style="width: 150px"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                No results
              </q-item-section>
            </q-item>
          </template>
        </q-select>

        <q-input dense v-model="task.deadline" mask="date" style="width: 150px" readonly>
          <template v-slot:prepend>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                <q-date v-model="task.deadline" @input="() => $refs.qDateProxy.hide()" />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>

        <q-input dense v-model="task.title" label="Title" style="min-width: 200px" />
        
        <q-btn icon="add" type="submit" color="primary"/>
        <q-btn icon="redo" type="reset" color="grey" />
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
          <q-select
            v-if="$q.screen.gt.xs"
            v-model="filter.status"
            multiple
            borderless
            dense
            options-dense
            :options="status"
            label="Status select"
            style="min-width: 210px"
          />
          <q-space />
          <q-input clearable borderless dense debounce="300" v-model="filter.title" placeholder="Search">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>

        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="is_urgent" :props="props" style='width:20px;'>
              <q-icon class="cursor-pointer" size="md" name="star" :color="props.row.is_urgent ? 'red' : 'grey'" @click="changeUrgent(props.row)" />
            </q-td>
            <q-td key="create_time" :props="props">
              <q-item>
                <q-item-section>
                  <q-item-label>{{ props.row.title }}</q-item-label>
                  <q-item-label caption lines="2">
                    <span class="text-positive">{{ props.row.create_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
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
                <q-btn round color="black" size="md" icon="play_arrow" />
                <q-btn round color="secondary" size="md" icon="done" />
              </div>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </Task>
</template>

<script>
import Task from 'components/Task'
export default {
  name: 'PageTaskIndex',
  data(){
    return {
      filter: {
        title: '',
        status: ['undo', 'pending', 'paused']
      },
      status: ['undo', 'pending', 'paused', 'done'],
      categories: [],
      loading: false,
      pagination: {
        sortBy: 'create_time',
        descending: false,
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
    Task
  },
  mounted(){
    // get initial data from server (1st page)
    this.onRequest({
      pagination: this.pagination,
      filter: this.filter
    })
  },
  methods: {
    async onRequest(props){
      const { page, rowsPerPage, sortBy, descending } = props.pagination
      const filter = props.filter
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
    async changeUrgent(row){
      const index = this.data.indexOf(row)
      const id = row['id']
      const is_urgent = row['is_urgent'] == 0 ? 1 : 0
      this.$q.loading.show()
      await this.$axios.post('task/change/urgent', {id, is_urgent})
      this.$set(this.data[index], 'is_urgent', is_urgent)
      this.$q.loading.hide()
    },
    getCategories(val, update, abort) {


      update(async() => {
        if(val === ''){
          const res = await this.$axios.post('task/categories')
          console.log(res)
          this.categories = res.data
        }
        else {
          const needle = val.toLowerCase()
          this.categories = this.categories.filter(v => v.toLowerCase().indexOf(needle) > -1)
        }

      })
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