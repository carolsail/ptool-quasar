<template>
    <q-uploader
        v-if="multiple"
        ref="uploader"
        fieldName="file[]"
        :factory="factoryFn"
        @uploaded="uploadedFn"
        label="Upload Your Files"
        :accept="accept"
        multiple
        batch
    />
    <q-uploader 
        v-else
        ref="uploader"
        fieldName="file"
        :accept="accept"
        :factory="factoryFn"
        @uploaded="uploadedFn"
        label="Upload Your File"
    />
</template>

<script>
import Config from '../utils/config'
import { getToken } from '../utils/token'

export default {
  name: 'Upload',
  props: {
    accept: {
      type: String,
      default: '.xls, .xlsx'
    },
    multiple: {
        type: Boolean,
        default: true
    }
  },
  methods: {
      factoryFn(){
        return {
            url: Config.apiUrl + 'upload',
            headers: this.$store.getters['auth/token'] ? [{name: 'token', value: getToken()}] : [],
            method: 'POST'
        }
      },
      uploadedFn(data){
          const res = data.xhr.response
          console.log(JSON.parse(res))
          this.$refs.uploader.reset()
      }
  }
}
</script>