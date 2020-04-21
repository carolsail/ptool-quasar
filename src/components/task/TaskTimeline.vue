<template>
    <q-timeline color="secondary" v-if="timer">
        <q-timeline-entry heading tag="h4">
            <countdown v-if="timer.type=='start'" :time="seconds * 1000" @end="end">
                <template slot-scope="props">{{ props.hours }}h {{ props.minutes }}m {{ props.seconds }}s</template>
            </countdown>

            <span v-else-if="timer.type=='over'" class='text-negative'>
                {{ seconds | formatSeconds('{h}h:{i}m:{s}s')}}
            </span>

            <div v-else-if="timer.type=='pause'" :class="[timer.duration < 0 ? 'text-negative' : 'text-positive']">
                <small>{{ tip_text }}</small>
                <div>{{ seconds | formatSeconds('{h}h:{i}m:{s}s') }}</div>
            </div>

            <div v-else-if="timer.type=='done'" :class="[timer.duration < 0 ? 'text-negative' : 'text-positive']">
                <small>{{ tip_text }}</small>
                <div>{{ seconds | formatSeconds('{h}h:{i}m:{s}s') }}</div>
            </div>
        </q-timeline-entry>

        <template v-for="(item, key) in timers"> 
            <q-timeline-entry :key="key" v-if="item.type=='start'" :title="item.start | parseTime('{h}:{i}')" :subtitle="item.start | parseTime('{y}-{m}-{d}')" icon="play_arrow">
                <div>{{item.remark}}</div>
            </q-timeline-entry>
            <q-timeline-entry :key="key" v-if="item.type=='pause'" :title="item.start | parseTime('{h}:{i}')" :subtitle="item.start | parseTime('{y}-{m}-{d}')" icon="pause">
               <div>{{item.remark}}</div>
            </q-timeline-entry>
            <q-timeline-entry :key="key" v-if="item.type=='over'" :title="item.start | parseTime('{h}:{i}')" :subtitle="item.start | parseTime('{y}-{m}-{d}')" icon="priority_high">
                <div>{{item.remark}}</div>
            </q-timeline-entry>
            <q-timeline-entry :key="key" v-if="item.type=='done'" :title="item.start | parseTime('{h}:{i}')" :subtitle="item.start | parseTime('{y}-{m}-{d}')" icon="flag">
               <div>{{item.remark}}</div>
            </q-timeline-entry>
        </template>
    </q-timeline>
</template>

<script>
export default {
    name: 'TaskTimeline',
    data(){
        return {
            counting: false,
            timer: null,
            timers: null,
            interval: null,
            seconds: 0,
            tip_text: ''
        }
    },
    created(){
        this.$root.$on('timerStart', (obj)=>{
            this.init(obj)
            this.start()
        })
    },
    methods: {
        init(obj){
            if(this.interval) clearInterval(this.interval)
            this.seconds = 0
            this.timer = obj.timer
            this.timers = obj.timers
        },
        start(){
            const now = Date.parse(new Date()) / 1000

            if(this.timer && this.timer.type=='start'){
                const seconds = this.timer.start + this.timer.duration - now
                this.seconds = seconds
            }

            if(this.timer && this.timer.type=='over'){
                const seconds = this.timer.start + this.timer.duration - now
                this.seconds = Math.abs(seconds)
                this.interval = setInterval(()=>{
                    this.seconds++
                }, 1000)
            }

            if(this.timer && this.timer.type=='pause'){
                this.tip_text = this.timer.duration < 0 ? 'Time out' : 'Remaining'
                this.seconds = Math.abs(this.timer.duration)
            }

            if(this.timer && this.timer.type=='done'){
                this.tip_text = this.timer.duration < 0 ? 'Time out' : 'In advance'
                this.seconds = Math.abs(this.timer.duration)
            }

            if(!this.$q.screen.gt.sm && this.timer && (this.timer.type=='start' || this.timer.type=='over')){
                this.$root.$emit('toggleRightDrawer')
            }
        },
        end(){
            setTimeout(()=>{
                this.$root.$emit('reloadRequest')
            }, 500)
        }
    }
}
</script>