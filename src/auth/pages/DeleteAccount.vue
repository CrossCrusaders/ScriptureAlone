<template>
    <AppLayout>
      <PageContent>
        <div class="mt-4"></div>
        <div v-if="linkSent">
          <h1 class="mb-4 text-3xl font-title font-bold text-slate-800">Account Deleted!</h1>
          <p class="mb-4">If you didn't mean to do this... Sorry. Better luck next time.</p>
          <RouterLink class="underline text-red-700" to="/dashboard/settings">
            Return To Settings
          </RouterLink>
        </div>
        <div class="max-w-prose" v-else>
          <h1 class="mb-4 text-3xl font-title font-bold text-slate-800">Delete Account?</h1>
          <p class="mb-4">Enter your email address and password attached to this account.</p>
          <AppInput @keypress.enter="onSubmitClick" v-model="emailModel">
            Email Address
          </AppInput>
          <AppInput @keypress.enter="onSubmitClick" type="password" v-model="passwordModel">
            Password
          </AppInput>
          <AppButton :disabled="hasError" variant="primary" @click="onSubmitClick">
            Submit
          </AppButton>
        </div>
      </PageContent>
    </AppLayout>
</template>
<script setup lang="ts">
  import { computed, ref } from 'vue';
  import AppButton from '../../components/atoms/form-controls/AppButton.vue';
  import AppInput from '../../components/atoms/form-controls/AppInput.vue';
  import AppLayout from '../../components/templates/AppLayout.vue';
  import PageContent from '../../components/templates/PageContent.vue';
  import { deleteAccount } from '../services/AuthService';
  
  
  const linkSent = ref(false)
  
  const emailModel = ref('')
  const passwordModel = ref('')
  
  const onSubmitClick = async () => {
    if(passwordModel.value != null && passwordModel.value != "" && emailModel.value != null || emailModel.value != ""){
      deleteAccount(emailModel.value, passwordModel.value)
      linkSent.value = true
    }
  }
  
  const hasError = computed(() => emailModel.value.length < 2 || emailModel.value.indexOf('@') < 0)
</script>