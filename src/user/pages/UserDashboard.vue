<template>
  <AppLayout>
    <PageContent>

      <PageHero>
        <template v-slot:image>

          <img :src="userProfileImage" class="object-cover max-h-32 w-32 h-32 max-w-32 rounded-full" />

        </template>

        <h2 class="text-4xl font-bold mb-2 text-slate-900">Hello {{ user?.profile.name }}</h2>
        <p class="text-slate-600">
          We're glad you are here, remember to read the verse of the day!
        </p>
        <template v-slot:actions>
          <AppButton>Watch Now</AppButton>
          <AppButton variant="primary-outline">View All Sermons</AppButton>
        </template>
      </PageHero>

    </PageContent>
  </AppLayout>
</template>

<script setup lang="ts">
import AppLayout from '../../components/templates/AppLayout.vue'
import PageContent from '../../components/templates/PageContent.vue'
import PageHero from '../../components/molecules/PageHero.vue'
import AppButton from '../../components/atoms/form-controls/AppButton.vue'
import { useAuth } from '../../auth/services/AuthService'
import { getUserProfileImage } from '../services/UserService'

const { user } = useAuth()
const userProfileImage = getUserProfileImage(user.value)
</script>

<style>

</style>