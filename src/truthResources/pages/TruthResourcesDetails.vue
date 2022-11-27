<template>
  <AppLayout>
    <PageContent>
      <div class="flex flex-col-reverse md:flex-row gap-2 md:gap-8 mt-8" v-if="!loading && !!truthResourceDetail">
        <div class="md:w-2/6">
          <AuthorPreviewColumn :show-church-info="true" :author="truthResourceDetail.author"
            :coverImage="truthResourceDetail.coverImage">
            <template v-slot:cover-image="{ image }">
              <TruthResourceCoverImage :cover-image="image" :sermon-id="truthResourceDetail?.id"></TruthResourceCoverImage>
            </template>
          </AuthorPreviewColumn>
          <!--TODO: Share Icons -->

        </div>
        <!-- Right Side -->
        <div class="md:w-4/6 flex-auto pb-8">
          <h1 class="font-title font-bold text-4xl mb-2 text-slate-800">{{ truthResourceDetail.title }}</h1>
          <p class="text-slate-500">Updated: {{ truthResourceLastUpdatedDisplay }} &bullet;
            <span class="text-slate-500" v-if="truthResourceDetail.duration">
              Duration: {{ formatMillisecondsAsReadableDuration(
                truthResourceDetail.duration)
              }}
            </span>
          </p>

          <p v-if="truthResourceCreatedDisplay != '' && truthResourceCreatedDisplay != null && truthResourceCreatedDisplay != undefined" class="mb-8 text-slate-500 font-bold">{{ truthResourceCreatedDisplay }}</p>
          <p class="mb-8 text-slate-700 leading-normal">
            {{ truthResourceDetail.description }}
          </p>
          <!-- Buttons -->
          <div class="flex gap-4 mb-16">
            <AppButton variant="primary" @click="onPlayAudioClicked()"
              v-if="truthResourceAudioSrc && globalAudioState !== AudioPlayerState.playing && globalVideoState !== VideoPlayerState.playing">{{ 'Play Audio' }}
            </AppButton>
            <AppButton v-if="truthResourceAudioSrc && globalAudioState === AudioPlayerState.playing" @click="globalAudioState = AudioPlayerState.hidden" variant="accent">{{ 'Close' }}
            </AppButton>
            <AppButton v-if="truthResourceAudioSrc && globalAudioState === AudioPlayerState.playing" to="/bible" variant="accent">{{ 'Open Bible' }}
            </AppButton>

            <AppButton variant="primary" @click="onPlayVideoClicked()"
              v-if="truthResourceVideoSrc && globalVideoState !== VideoPlayerState.playing && globalAudioState !== AudioPlayerState.playing">
              {{ 'Play Video' }}
            </AppButton>
            <div v-if="truthResourceVideoSrc && globalVideoState === VideoPlayerState.playing">
              <AppButton @click="globalVideoState = VideoPlayerState.hidden" variant="accent">{{ 'Close' }}
              </AppButton>
            </div>
          </div>
          <!-- Video -->
          <Transition name="video">
            <video v-if="truthResourceVideoSrc && globalVideoState === VideoPlayerState.playing" class="w-full"
              :src="truthResourceVideoSrc" controlslist="nodownload" autoplay="true" controls></video>
          </Transition>
        </div>
      </div>

      <div class="w-full flex" style="justify-content: right;" v-if="!loading && !!truthResourceDetail">
        <div class="overflow-scroll border-2 border-slate-400 border-solid w-1/2 mb-4" style="height:38em;">
          <VuePdf v-for="page in truthResourceDetail.pageAmount" :key="page" :src="getBucketUrl(truthResourceDetail, truthResourceDetail.pdf || truthResourceDetail.externalPDFLink)" :page="page" />
        </div>
      </div>

      <UserRecommendationFooter></UserRecommendationFooter>

      <br><br>
    </PageContent>
  </AppLayout>
</template>

  
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

import AppLayout from '../../components/templates/AppLayout.vue'
import PageContent from '../../components/templates/PageContent.vue'
import AppButton from '../../components/atoms/form-controls/AppButton.vue'
import Divider from '../../components/atoms/Divider.vue'
import AuthorPreviewColumn from '../../components/molecules/AuthorPreviewColumn.vue'
import UserRecommendationFooter from '../../components/organisms/UserRecommendationFooter.vue'
import { formatAddress } from '../../core/services/FormatService'
import { getTruthResource } from '../services/TruthResourceService'
import { useRoute } from 'vue-router'
import { format } from 'date-fns'
import { formatMillisecondsAsReadableDuration, formatName } from '../../core/services/FormatService'
import { TruthResource } from '../TruthResource'
import TruthResourceCoverImage from '../components/TruthResourceCoverImage.vue'
import { VideoPlayerState, useGlobalVideoPlayer } from '../../components/organisms/VideoPlayer/VideoPlayerService'
import { AudioPlayerState, useGlobalAudioPlayer } from '../../components/organisms/AudioPlayer/AudioPlayerService'
import { getBucketUrl } from '../../api/BucketStorageService'

const {
  setGlobalAudioPayload,
  setGlobalAudioState,
  globalAudioState
} = useGlobalAudioPlayer()
const {
  setGlobalVideoPayload,
  setGlobalVideoState,
  globalVideoState
} = useGlobalVideoPlayer()


const loading = ref(true)
const truthResourceDetail = ref<TruthResource>()
const route = useRoute()
const showPlayerModal = ref(false)

const numOfPages = ref(5);

onMounted(async () => {
  // The Truth Resource ID
  let { id } = route.params

  if (Array.isArray(id))
    id = id[0]

  const truthResource = await getTruthResource(id);
  truthResourceDetail.value = truthResource;
  loading.value = false;
})

const truthResourceAudioSrc = computed(() => {
  return truthResourceDetail.value?.externalAudioFileUrl || truthResourceDetail.value?.externalAudioFileUrl
})

const truthResourceVideoSrc = computed(() => {
  return truthResourceDetail.value?.externalVideoFileUrl
})

const truthResourceLastUpdatedDisplay = computed(() => {
  const strDate = (truthResourceDetail.value?.truthResourceDate || truthResourceDetail.value?.updated) as any
  const date = new Date(strDate.split(' ')[0])
  return format(date, 'MM/dd/yyyy')
})
const truthResourceCreatedDisplay = computed(() => {
  const strDate = (truthResourceDetail.value?.truthResourceDate || new Date()) as any
  const date = new Date(strDate.split(' ')[0])
  return format(date, 'MM/dd/yyyy')
})

const beforeAudioModalClose = () => {
  // TODO: find a way to stop the audio from playing when the modal is closed
}

const onPlayVideoClicked = () => {

  if (!truthResourceDetail.value)
    return
  const { title, id, author } = truthResourceDetail.value

  setGlobalVideoPayload({
    id: id!,
    title: title!,
    author: formatName(author),
    currentTime: 0,
    url: truthResourceVideoSrc.value,
    contentPage: `/truth-resources/${id}`
  })

  setGlobalVideoState(VideoPlayerState.playing)
}

const onPlayAudioClicked = () => {

if (!truthResourceDetail.value)
  return
const { title, id, author } = truthResourceDetail.value

setGlobalAudioPayload({
  id: id,
  title: title,
  author: formatName(author),
  currentTime: 0,
  url: truthResourceAudioSrc.value,
  contentPage: `/truth-resources/${id}`
})

setGlobalAudioState(AudioPlayerState.playing)
}

</script>
  