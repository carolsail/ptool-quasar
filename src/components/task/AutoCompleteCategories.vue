<template>
    <q-select
        :outlined="outlined"
        :dense="dense"
        v-model="categorySelected"
        use-input
        hide-selected
        fill-input
        input-debounce="500"
        label="Category"
        :options="categoryOptions"
        @filter="getCategories"
        @input="changeInput"
    >
        <template v-slot:append>
          <q-icon
            v-if="clearable && categorySelected !== null"
            class="cursor-pointer"
            name="cancel"
            @click.stop="clearInput"
          />
        </template>

        <template v-slot:no-option>
            <q-item>
                <q-item-section class="text-grey">No results</q-item-section>
            </q-item>
        </template>
    </q-select>
</template>

<script>
import taskApi from '../../api/task'
export default {
  name: 'AutoCompleteCategories',
  data(){
    return {
      categorySelected: null,
      categories: [],
      categoryOptions: []
    }
  },
  props: {
      value: null,
      outlined: {
          type: Boolean,
          default: true
      },
      dense: {
          type: Boolean,
          default: false
      },
      clearable: {
          type: Boolean,
          default: true
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
                    this.categorySelected = null
                }
            }
        }
    },
  methods: {
    async init(){
        if(this.value){
            try{
                const res = await taskApi.categorySearchByTitle(this.value.title)
                this.categoryOptions = res.data
                this.categorySelected = this.value
            }catch(error){
                console.log(error)
            }
        }
    },
    changeInput(){
        this.$emit('input', this.categorySelected)
    },
    clearInput(){
        this.categorySelected = null
        this.$emit('input', this.categorySelected)
    },
    async getCategories(val, update, abort) {
        try{
            let categoryOptions = []
            if(val == '' && this.categories.length == 0){
                const res = await taskApi.categorySearchByTitle(val)
                this.categories = categoryOptions = res.data
            }else{
                if(val == '') {
                categoryOptions = _.cloneDeep(this.categories)
                }else{
                // 先从categories对象中找， 如果存在直接返回，不存在再进行异步加载
                const temp = _.filter(this.categories, item => _.includes(item.title, val))
                if(temp.length){
                    categoryOptions = temp
                }else{
                    // 异步加载数据，若有数据则加入categories列表
                    const res = await taskApi.categorySearchByTitle(val)
                    if(res.data.length) _.merge(this.categories, res.data)
                    categoryOptions = res.data
                }
                }
            }
            update(() => {
                this.categoryOptions = categoryOptions
            })
        }catch(error){
            console.log(error)
        }
    }
  }
}
</script>