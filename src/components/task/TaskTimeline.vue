<template>
    <q-timeline color="secondary">
        <q-timeline-entry heading tag="h4">
            <countdown v-if="counting" :time="seconds * 1000" @end="end">
            <template slot-scope="props">{{ props.hours }}h {{ props.minutes }}m {{ props.seconds }}s</template>
            </countdown>
            <span v-else>{{seconds|formatSeconds('{h}h {i}m {s}s')}}</span>
        </q-timeline-entry>

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
</template>

<script>
export default {
    name: 'TaskTimeline',
    data(){
        return {
            counting: false,
            seconds: 5
        }
    },
    created(){
        this.$root.$on('timerStart', (obj)=>{
            console.log(obj)
            this.start()
        })
        this.$root.$on('timerPause', (obj)=>{
            console.log(obj)
            this.pause()
        })
    },
    methods: {
        start(){
            this.counting = true
        },
        pause(){
            this.counting = false
        },
        end(){
            console.log(123)
        }
    }
}
</script>