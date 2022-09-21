<template>
  <app-layout>
    <page-content>
      <form @submit="handleFormSubmit($event)">
        <app-input name="email" type="text"
            v-model="logInModel.email"
            >
          Email Address
        </app-input>
        <app-input name="password" type="password" v-model="logInModel.password">
          Password
        </app-input>
        <app-button type="submit">Log In</app-button>
      </form>
      
    </page-content>
  </app-layout>
</template>

<script setup lang="ts">
  import AppLayout from '../../components/templates/AppLayout.vue'
  import PageContent from '../../components/templates/PageContent.vue'
  import AppInput from '../../components/atoms/form-controls/AppInput.vue'
  import AppButton from '../../components/atoms/form-controls/AppButton.vue'
  import { logIn } from '../../services/AuthService'
  import { reactive, ref } from 'vue'

  const logInModel = reactive({ email: '', password: ''})

  const handleFormSubmit = async (event: Event) => {
    event.preventDefault()
    const result = await logIn (logInModel)
    alert(JSON.stringify(result))
  }

</script>

<style lang="scss" scoped>

</style>