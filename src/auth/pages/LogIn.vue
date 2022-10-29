<template>
  <app-layout>
    <page-content>
      <div class="flex md:flex-row justify-between my-10">
        <!-- <div class="hidden md:block">

        </div> -->
        <div class="w-full md:w-3/6">
          <div class="shadow-xl p-8 rounded-xl bg-slate-200">
            <h1 class="font-title font-bold text-3xl text-slate-800 mb-4">Log In</h1>
            <p class="font-body leading-normal text-slate-700 mb-4">Log into your Scripture Alone account to access all
              of
              your saved sermons and devotionals! Don't have an
              account? <a href="/auth/register" class="underline text-red-700">Create one</a></p>
            <form @submit="handleFormSubmit($event)">
              <div>
                <app-button type="submit">
                  <Icon icon-name="google" class="w-6 h-6 inline invert"></Icon> Log In With Google
                </app-button>
              </div>
              <p class="my-6 text-xl font-bold font-title text-slate-800">Or Log In With Email</p>
              <div>
                <app-input name="email" type="text" v-model="logInModel.email">
                  Email Address
                </app-input>
                <app-input name="password" type="password" v-model="logInModel.password">
                  Password
                </app-input>
                <app-button type="submit">Log In</app-button>
              </div>
            </form>
          </div>
        </div>
        <img class="pl-10 hidden md:block md:w-3/6 opacity-40" src="/icons/BibleLoginRegisterPage.svg" />
      </div>
    </page-content>
  </app-layout>
</template>

<script setup lang="ts">
import AppLayout from '../../components/templates/AppLayout.vue'
import PageContent from '../../components/templates/PageContent.vue'
import AppInput from '../../components/atoms/form-controls/AppInput.vue'
import AppButton from '../../components/atoms/form-controls/AppButton.vue'
import Icon from '../../components/atoms/Icon.vue'
import { logIn } from '../services/AuthService'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserFavorites } from '../../user/services/UserService'

const logInModel = reactive({ email: '', password: '' })

const router = useRouter()

const { loadFavorites } = useUserFavorites()
const handleFormSubmit = async (event: Event) => {
  event.preventDefault()
  const result = await logIn(logInModel)
  await loadFavorites()

  router.push('/dashboard')
}

</script>

<style lang="scss" scoped>

</style>