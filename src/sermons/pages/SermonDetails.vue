<template>
  <AppLayout>
    <PageContent>

      <div class="flex flex-col-reverse md:flex-row gap-2 md:gap-8 mt-8">
        <div class="md:w-2/6">
          <!-- Left Side -->
          <img src="https://www-images.christianitytoday.com/images/75041.jpg?w=1400"
            class="object-cover max-h-40 w-full md:max-h-64 rounded-lg mb-4" />
          <div class="mb-8">
            <p class="font-bold text-slate-800 mb-2">Speaker: {{ sermon.author }}</p>
            <p class="font-bold text-slate-800">Church: {{ sermon.church.name }}</p>
          </div>
          <!-- Church Contact info-->
          <div class="mb-8">
            <p class="text-slate-800 mb-2">Address: {{ formatAddress(sermon.church) }}</p>
            <p class="text-slate-800">Email: {{ sermon.church.email }}</p>

          </div>
          <!-- Share -->

        </div>
        <!-- Right Side -->
        <div class="md:w-4/6 flex-auto">
          <h1 class="font-title font-bold text-4xl mb-2 text-slate-800">{{ sermon.title }}</h1>
          <p class="mb-8 text-slate-500 font-bold">Sub title meta information</p>
          <p class="mb-8 text-slate-700 leading-normal">
            {{ sermon.description }}
          </p>
          <div class="flex gap-4 mb-16">
            <AppButton variant="primary">Play Audio</AppButton>
            <AppButton variant="primary-outline">Play Video</AppButton>
          </div>

          <Divider></Divider>
        </div>
      </div>
    </PageContent>
  </AppLayout>
</template>

<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import AppLayout from '../../components/templates/AppLayout.vue'
import PageContent from '../../components/templates/PageContent.vue'
import AppButton from '../../components/atoms/form-controls/AppButton.vue';
import Divider from '../../components/atoms/Divider.vue';

interface SermonDetail {
  id: string
  author: string
  church: any // TODO: church type
  audioUrl: string
  videoUrl: string
  description: string
  title: string
  categories: string[]
}

const sermonDetail: SermonDetail = {
  id: '1',
  author: 'Charles Spurgeon',
  church: {
    name: 'XYZ Baptist Church',
    streetAddress1: '123 Main St',
    city: 'Test',
    state: 'PA',
    postalCode: '43432',
    description: 'An independent fundamental baptist church',
    email: 'xyzbaotist@church.info'
  },
  audioUrl: '',
  videoUrl: '',
  description: 'A message about the importance of tithing. How that tenth is God\'s. It is used to fund the work of the ministry and every Christian is expected to give.',
  title: 'The Tithe is the Lord\'s',
  categories: ['Giving']
}

const sermon = reactive(sermonDetail)

const formatAddress = (addr: any) =>
  `${addr.streetAddress1} ${addr.city}, ${addr.state} ${addr.postalCode}`

onMounted(async () => {

})

</script>