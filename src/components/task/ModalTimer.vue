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
          <div class="q-col-gutter-md row" v-if="timer.type=='start'">
            <div class="col-6">
              <q-input type="number" outlined clearable label="hours" min="0" v-model="timer.hours" />
            </div>
            <div class="col-6">
              <q-input type="number" outlined clearable label="minutes" min="0" v-model="timer.minutes" />
            </div>
            <div class="col-12">
              <q-input outlined clearable label="remark" v-model="timer.remark" />
            </div>
          </div>
          <div class="q-col-gutter-md row" v-else-if="timer.type=='pause'">
            <div class="col-12">
              <q-input outlined clearable label="remark" v-model="timer.remark" />
            </div>
          </div>
          <div class="q-col-gutter-md row" v-else-if="timer.type=='resume'">
            <div class="col-12">
              <q-input outlined clearable label="remark" v-model="timer.remark" />
            </div>
          </div>
          <div class="q-col-gutter-md row" v-else>
            <div class="col-12">
              <q-input outlined clearable label="remark" v-model="timer.remark" />
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions>
          <q-space />
          <q-btn flat label="Save" color="primary" @click="submit" />
        </q-card-actions>
      </q-card>
    </q-dialog>
</template>
<script>
import taskApi from '../../api/task'
export default {
    name: 'ModalTimer',
    data(){
        return {
            isOpen: false,
            timer: {
              item: null,
              type: null,
              hours: null,
              minutes: null,
              remark: null
            }
        }
    },
    created() {
        this.$root.$on('modalTimerOpen', (payload)=>{
            this.isOpen = !this.isOpen
            this.timer.item = payload.row
            this.timer.type = payload.type
        })
    },
    computed: {
        title(){
            let title = ''
            switch(this.timer.type){
                case 'start':
                    title = 'Task To Start'
                    break;
                case 'pause':
                    title = 'Task To Pause'
                    break;
                case 'resume':
                    title = 'Task To Resume'
                    break;
                default:
                    title = 'Task to Complete'
                    break;
            }
            return title
        }
    },
    methods: {
      async submit(){
        try{
          this.$q.loading.show()
          const res = await taskApi.timerAdd(this.timer)
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
            this.isOpen = !this.isOpen
            this.timer = {
                item: null,
                type: null,
                hours: null,
                minutes: null,
                remark: null
            }
            this.$root.$emit('reloadRequest', {pagination:{page:1}})
          }
        }catch(error){
          console.log(error)
        }
      }
    }
}
</script>