<template>
  <AppLayout>
    <PageContent>
      <div class="mt-4"></div>
      <div v-if="isSuccess">
        <h1 class="mb-4 text-3xl font-title font-bold text-slate-800">Success!</h1>
        <p>You have changed your password. <RouterLink class="underline text-red-700" to="/auth/log-in">Click Here
          </RouterLink> to log in with your new
          password.</p>
      </div>
      <div class="max-w-prose" v-else>
        <h1 class="mb-4 text-3xl font-title font-bold text-slate-800">Reset Password</h1>
        <p class="mb-4">Enter your a new password</p>
        <AppInput v-model="passwordModel.password">
          Password
        </AppInput>
        <AppInput @keypress.enter="onChangePasswordClick" v-model="passwordModel.confirmPassword">
          Confirm Password
        </AppInput>
        <AppButton :disabled="hasError" @click="onChangePasswordClick" variant="primary">
          Change Password
        </AppButton>
      </div>
    </PageContent>
  </AppLayout>
</template>
<script setup lang="ts">
import { onMounted, reactive, computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AppButton from '../../components/atoms/form-controls/AppButton.vue';
import AppInput from '../../components/atoms/form-controls/AppInput.vue';
import AppLayout from '../../components/templates/AppLayout.vue';
import PageContent from '../../components/templates/PageContent.vue';
import { resetPassword } from '../services/AuthService';

const router = useRouter()
const route = useRoute()
const loading = ref(false)

const passwordModel = reactive({
  password: '',
  confirmPassword: ''
})

const { token } = route.query

const hasError = computed(() => {
  return !passwordModel.password.length || (passwordModel.password !== passwordModel.confirmPassword)
})

const isDirty = ref(false)
const isSuccess = ref(false)

const showError = computed(() => { })

onMounted(() => {
  if (!token)
    router.replace('/')
})

const onChangePasswordClick = async () => {
  if (loading.value)
    return

  loading.value = true
  isDirty.value = true
  if (hasError.value)
    return
  const result = await resetPassword(token as string, passwordModel.password, passwordModel.confirmPassword)

  if (result)
    isSuccess.value = true
}

</script>