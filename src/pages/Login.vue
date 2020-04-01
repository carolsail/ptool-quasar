<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
        <q-toolbar>
            <q-toolbar-title>Login</q-toolbar-title>
        </q-toolbar>
    </q-header>
    <q-page-container>
        <q-form class="q-pa-md" @submit="onSubmit">
            <q-input
              class="q-mb-sm" 
              v-model="formData.account" 
              label="Account" 
              lazy-rules 
              :rules="[ val => val && val.length > 0 || 'Please input account']"/>

            <q-input 
              class="q-mb-sm" 
              type="password" 
              v-model="formData.password" 
              label="Password" 
              lazy-rules 
              :rules="[ val => val && val.length > 0 || 'Please input password']"/>

            <q-btn type="submit" color="primary" class="full-width" label="Login" />
        </q-form>
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: 'PageLogin',
  data(){
      return {
          formData: {
              account: '',
              password: ''
          }
      }
  },
  methods: {
      onSubmit(){
        this.$q.loading.show()
        this.$store.dispatch('auth/login', { payload: this.formData }).then(()=>{
            this.$router.push({ path: this.redirect || '/' })
            this.$q.loading.hide()
        }).catch(()=>{
            this.$q.loading.hide()
        })
      }
  }
}
</script>