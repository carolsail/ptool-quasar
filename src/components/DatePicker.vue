<template>
    <q-input
        :dense="dense"
        :outlined="outlined" 
        v-model="model"
        :label="label"
        mask="date"
        readonly
    >
        <template v-slot:append>
            <q-icon
                v-if="clearable && displayClearIcon"
                class="cursor-pointer"
                name="cancel"
                @click.prevent="clearInput"
            />
            <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                    <q-date v-model="model" :options="optionsFn" @input="changeInput" />
                </q-popup-proxy>
            </q-icon>
        </template>
    </q-input>
</template>

<script>
import { parseTime } from 'src/utils/time'

export default {
    name: 'DatePicker',
    data(){
        return {
            model: null,
            displayClearIcon: false
        }
    },
    props: {
        value: null,
        label: '',
        dense: {
            type: Boolean,
            default: false
        },
        outlined: {
            type: Boolean,
            default: true
        },
        clearable: {
            type: Boolean,
            default: true
        },
        options: {
            type: Boolean,
            default: false
        }
    },
    created(){
        this.init()
    },
    watch: {
        //监听外部value值清空
        value: {
            deep: true,
            handler(n, o){
                if(!n){
                    this.model = null
                }
            }
        }
    },
    methods: {
        init(){
            this.model = this.value
            this.displayClearIcon = this.model ? true : false
        },
        clearInput(){
            this.model = null
            this.displayClearIcon = false
            this.$emit('input', this.model)
        },
        changeInput(){
            this.displayClearIcon = this.model ? true : false
            this.$refs.qDateProxy.hide()
            this.$emit('input', this.model)
        },
        optionsFn(date){
            if(this.options){
                // 选择日期需大于当日
                const timestamp = Date.parse(new Date())
                return date > parseTime(timestamp, '{y}/{m}/{d}')
            }
            return true
        }
    }
}
</script>