<template>
    <q-dialog v-model="isOpen">
      <q-card style="width:700px;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 ellipsis" style="width:80%;">{{title}}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-separator />

        <q-card-section style="max-height: 50vh" class="scroll">
          <div class="q-gutter-md">
            <q-input outlined clearable v-model="category.title" label="title" />
            <q-input outlined clearable v-model="category.remark" label="remark" />
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions>
          <q-btn flat label="Delete" color="negative" @click="deleteCategory" />
           <q-space />
          <q-btn flat label="Save" color="primary" @click="updateCategory" />
        </q-card-actions>
      </q-card>
    </q-dialog>
</template>

<script>
import taskApi from '../../api/task'
export default {
  name: 'ModalTaskCategory',
  data(){
    return {
      isOpen : false,
      title: '',
      category: {
        id: '',
        title: '',
        remark: ''
      }
    }
  },
  created() {
    this.$root.$on('modalTaskCategoryOpen', (data)=>{
      this.isOpen = !this.isOpen
      this.title = this.category.title = data.title
      this.category.id = data.id
      this.category.remark = data.remark
    })
  },
  methods: {
    async updateCategory() {
      try{
        const res = await taskApi.categoryUpdate(this.category)
        if(res.status){
          this.isOpen = !this.isOpen
          this.$root.$emit('reloadRequest')
        }
      }catch(error){
        console.log(error)
      }
    },
    async deleteCategory() {
      try{
        const res = await taskApi.categoryDelete(this.category.id)
        if(res.status){
          this.isOpen = !this.isOpen
          this.$root.$emit('reloadRequest')
        }
      }catch(error){
        console.log(error)
      }
    }
  }
}
</script>