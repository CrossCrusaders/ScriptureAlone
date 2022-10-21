<template>
  <AppLayout>
    <PageContent>

      <div class="flex flex-col-reverse md:flex-row gap-2 md:gap-8 mt-8" v-if="!loading && !!sermonDetail">
        <div class="md:w-2/6">
          <AuthorPreviewColumn :show-church-info="true" :author="sermonDetail.author"></AuthorPreviewColumn>
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

          <p class="mb-8 text-slate-500 font-bold">{{ format(sermonDetail.sermonDate || new Date(), 'MM/dd/yyyy') }}</p>
          <p class="mb-8 text-slate-700 leading-normal">
            {{ sermonDetail.description }}
          </p>
          <div class="flex gap-4 mb-16">
            <AppButton variant="primary" @click="onPlayAudioClicked()"
              v-if="sermonAudioSrc && globalAudioState !== AudioPlayerState.playing">{{ 'Play Audio' }}
            </AppButton>
            <div v-if="sermonAudioSrc && globalAudioState === AudioPlayerState.playing">
              <AppButton variant="primary-minimal" :disabled="true">{{ 'Now Playing' }}
              </AppButton>

              <AppButton to="/bible" variant="accent">{{ 'Open Bible' }}
              </AppButton>

            </div>

            <AppButton variant="primary-outline" v-if="sermonVideoSrc">Play Video</AppButton>
          </div>
          <Divider></Divider>
        </div>
      </div>
      <UserRecommendationFooter></UserRecommendationFooter>
      <br><br>
    </PageContent>
  </AppLayout>

  <!-- <AppModal v-model="showPlayerModal" @beforeClose="beforeAudioModalClose()" v-slot="{ close }">
    <div class="p-4">
      <h2 class="font-title font-bold text-2xl mb-4 text-slate-800">Now Playing: {{ sermonDetail?.title }}</h2>
      <AudioPlayer :audio-src="sermonAudioSrc"></AudioPlayer>
      <button @click="close()">Close</button>
    </div>
  </AppModal> -->
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

import AppLayout from '../../components/templates/AppLayout.vue'
import PageContent from '../../components/templates/PageContent.vue'
import AppButton from '../../components/atoms/form-controls/AppButton.vue'
import Divider from '../../components/atoms/Divider.vue'
import AppModal from '../../components/templates/AppModal.vue'
import AudioPlayer from '../../components/organisms/AudioPlayer/AudioPlayer.vue'
import AuthorPreviewColumn from '../components/AuthorPreviewColumn.vue'
import { getSermon } from '../services/SermonService'
import { useRoute } from 'vue-router'
import { format } from 'date-fns'
import { formatMillisecondsAsReadableDuration, formatName } from '../../core/services/FormatService'
import { Sermon } from '../Sermon'
import UserRecommendationFooter from '../../components/organisms/UserRecommendationFooter.vue'
import { AudioPlayerState, useGlobalAudioPlayer } from '../../components/organisms/AudioPlayer/AudioPlayerService'


const loading = ref(true)
const sermonDetail = ref<Sermon>()
const route = useRoute()
const showPlayerModal = ref(false)

const {
  setGlobalAudioPayload,
  setGlobalAudioState,
  globalAudioState
} = useGlobalAudioPlayer()

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
  const date = (sermonDetail.value?.sermonDate || sermonDetail.value?.updated) as any
  return format(date, 'MM/dd/yyyy')
})

const onPlayAudioClicked = () => {

  if (!sermonDetail.value)
    return
  const { title, id, author } = sermonDetail.value

  setGlobalAudioPayload({
    id: id!,
    title: title!,
    author: formatName(author),
    currentTime: 0,
    url: sermonAudioSrc.value,
    contentPage: `/sermons/${id}`
  })

  setGlobalAudioState(AudioPlayerState.playing)
}

</script>
