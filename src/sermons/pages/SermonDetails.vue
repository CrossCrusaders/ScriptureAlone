<template>
  <AppLayout>
    <PageContent>

      <div class="flex flex-col-reverse md:flex-row gap-2 md:gap-8 mt-8" v-if="!loading && !!sermonDetail">
        <div class="md:w-2/6">
          <!-- Left Side -->
          <img :src="sermonDetail.author?.profileImage"
            class="object-cover max-h-40 w-full md:max-h-64 rounded-lg mb-4" />
          <div class="mb-8">
            <p class="font-bold text-slate-800 mb-2">Speaker: {{ sermonDetail.author?.firstName + ' ' +
            sermonDetail.author?.lastName }}</p>
            <p class="font-bold text-slate-800">Church: {{ sermonDetail.author?.church.name }}</p>
          </div>
          <!-- Church Contact info-->
          <div class="mb-8">
            <p class="text-slate-800 mb-2">Address: {{ sermonDetail.author?.church ?
            formatAddress(sermonDetail.author.church) : null }}</p>
            <p class="text-slate-800">Email: {{ sermonDetail.author?.church.email }}</p>

          </div>
          <!-- Share -->

        </div>
        <!-- Right Side -->
        <div class="md:w-4/6 flex-auto">
          <h1 class="font-title font-bold text-4xl mb-2 text-slate-800">{{ sermonDetail.title }}</h1>
          <p class="mb-8 text-slate-500 font-bold">{{ sermonDetail.sermonDate }}</p>
          <p class="mb-8 text-slate-700 leading-normal">
            {{ sermonDetail.description }}
          </p>
          <div class="flex gap-4 mb-16">
            <AppButton variant="primary" v-if="sermonAudioLink">Play Audio</AppButton>
            <AppButton variant="primary-outline" v-if="sermonVideoLink">Play Video</AppButton>
          </div>

          <Divider></Divider>
        </div>
      </div>
    </PageContent>
  </AppLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import AppLayout from '../../components/templates/AppLayout.vue'
import PageContent from '../../components/templates/PageContent.vue'
import AppButton from '../../components/atoms/form-controls/AppButton.vue'
import Divider from '../../components/atoms/Divider.vue'
import { formatAddress } from '../../core/services/FormatService'
import { getSermon } from '../services/SermonService'
import { useRoute, useRouter } from 'vue-router'
import { Sermon } from '../Sermon';


const loading = ref(true)
const sermonDetail = ref<Sermon>()
const route = useRoute()
const router = useRouter()

onMounted(async () => {

  // The Sermon ID
  let { id } = route.params

  if (Array.isArray(id))
    id = id[0]

  const sermon = await getSermon(id)

  sermonDetail.value = sermon

  loading.value = false

})

const sermonAudioLink = computed(() => {
  return sermonDetail.value?.externalAudioFileUrl || sermonDetail.value?.audioFile
})

const sermonVideoLink = computed(() => {
  return sermonDetail.value?.externalVideoFileUrl
})

</script>