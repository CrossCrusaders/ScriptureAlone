<template>
  <AppLayout>
    <PageContent>
      <div class="mt-4"></div>
      <div v-if="linkSent">
        <h1 class="mb-4 text-3xl font-title font-bold text-slate-800">Reset Link Sent!</h1>
        <p class="mb-4">Check your email address for a password reset link, If you don't see it right away check your
          <strong>spam folder!</strong>
        </p>
        <RouterLink class="underline text-red-700" to="/">
          Return Home
        </RouterLink>
      </div>
      <div class="max-w-prose" v-else>
        <h1 class="mb-4 text-3xl font-title font-bold text-slate-800">Forgot Password?</h1>
        <p class="mb-4">Enter your account email address and we will send you a password reset link.</p>
        <AppInput @keypress.enter="onSubmitClick" v-model="emailModel">
          Email Address
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
import { requestResetPasswordLink, resetPassword } from '../services/AuthService';


const linkSent = ref(false)

const emailModel = ref('')

const onSubmitClick = async () => {
  requestResetPasswordLink(emailModel.value)
  linkSent.value = true
}

const hasError = computed(() => emailModel.value.length < 2 || emailModel.value.indexOf('@') < 0)
</script>