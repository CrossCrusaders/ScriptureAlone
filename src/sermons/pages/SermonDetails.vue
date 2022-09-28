<template>
  <AppLayout>
    <PageContent>

      <div class="flex flex-col-reverse md:flex-row gap-2 md:gap-8 mt-8" v-if="!loading && !!sermonDetail">
        <div class="md:w-2/6">
          <AuthorPreviewColumn :author="sermonDetail.author"></AuthorPreviewColumn>
          <!--TODO: Share Icons -->

        </div>
        <!-- Right Side -->
        <div class="md:w-4/6 flex-auto">
          <h1 class="font-title font-bold text-4xl mb-2 text-slate-800">{{ sermonDetail.title }}</h1>
          <p class="text-slate-500">Updated: {{ sermonLastUpdatedDisplay }} &bullet;
            <span class="text-slate-500" v-if="sermonDetail.duration">
              Duration: {{ formatMillisecondsAsReadableDuration(
              sermonDetail.duration) }}
            </span>
          </p>

          <p class="mb-8 text-slate-500 font-bold">{{ sermonDetail.sermonDate }}</p>
          <p class="mb-8 text-slate-700 leading-normal">
            {{ sermonDetail.description }}
          </p>
          <div class="flex gap-4 mb-16">
            <AppButton variant="primary" @click="showPlayerModal = true" v-if="sermonAudioSrc">Play Audio</AppButton>
            <AppButton variant="primary-outline" v-if="sermonVideoSrc">Play Video</AppButton>
          </div>
          <Divider></Divider>

          <IconCallToAction>
            <template v-slot:image>
              <Icon icon-name="cross" :size="16"></Icon>
            </template>

            <div>
              <h1 class="text-2xl font-title font-bold">This is the Title</h1>
              <p class="font-body font-lg leading-relaxed">This is the body</p>
            </div>
            <template v-slot:action>
              <AppButton>
                Click Me!
              </AppButton>
            </template>

          </IconCallToAction>
        </div>
      </div>
    </PageContent>
  </AppLayout>

  <AppModal v-model="showPlayerModal" @beforeClose="beforeAudioModalClose()" v-slot="{ close }">
    <div class="p2">
      <AudioPlayer :audio-src="sermonAudioSrc"></AudioPlayer>
      <button @click="close()">Close</button>
    </div>
  </AppModal>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

import AppLayout from '../../components/templates/AppLayout.vue'
import PageContent from '../../components/templates/PageContent.vue'
import AppButton from '../../components/atoms/form-controls/AppButton.vue'
import Divider from '../../components/atoms/Divider.vue'
import AppModal from '../../components/templates/AppModal.vue'
import AudioPlayer from '../../components/organisms/AudioPlayer.vue'
import AuthorPreviewColumn from '../components/AuthorPreviewColumn.vue'

import { formatAddress } from '../../core/services/FormatService'
import { getSermon } from '../services/SermonService'
import { useRoute } from 'vue-router'
import { format } from 'date-fns'
import { formatMillisecondsAsReadableDuration } from '../../core/services/FormatService'
import { Sermon } from '../Sermon'
import IconCallToAction from '../../components/molecules/IconCallToAction.vue'
import Icon from '../../components/atoms/Icon.vue'


const loading = ref(true)
const sermonDetail = ref<Sermon>()
const route = useRoute()
const showPlayerModal = ref(false)

onMounted(async () => {

  // The Sermon ID
  let { id } = route.params

  if (Array.isArray(id))
    id = id[0]

  const sermon = await getSermon(id)
  sermonDetail.value = sermon
  loading.value = false
})

const sermonAudioSrc = computed(() => {
  return sermonDetail.value?.externalAudioFileUrl || sermonDetail.value?.audioFile
})

const sermonVideoSrc = computed(() => {
  return sermonDetail.value?.externalVideoFileUrl
})

const sermonLastUpdatedDisplay = computed(() => {
  const strDate = (sermonDetail.value?.sermonDate || sermonDetail.value?.updated) as any
  const date = new Date(strDate.split(' ')[0])
  return format(date, 'MM/dd/yyyy')
})

const beforeAudioModalClose = () => {
  // TODO: find a way to stop the audio from playing when the modal is closed
}

</script>
