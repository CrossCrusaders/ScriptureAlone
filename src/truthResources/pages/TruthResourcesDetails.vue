<template>
  <AppLayout>
    <PageContent>
      <div class="flex flex-col-reverse md:flex-row gap-2 md:gap-8 mt-8" v-if="!loading && !!truthResourceDetail">
        <div class="flex-auto pb-2">
          
        </div>
      </div>

      <!-- Video -->
      <vue-plyr style="--plyr-color-main: #616161;" v-if="truthResourceVideoSrc && truthResourceDetail">
        <video controls :data-poster="truthResourceDetail.coverImage" :poster="truthResourceDetail.coverImage">
          <!--<video controls crossorigin playsinline :data-poster="videoDetail.thumbnail" :poster="videoDetail.thumbnail">-->
          <source size="720" :src="truthResourceVideoSrc" type="video/mp4" />
          <!--<source size="1080" :src="videoDetail.video_url" type="video/mp4" />-->
          <!--<track default kind="captions" label="English captions" src="/path/to/english.vtt" srclang="en" />-->
        </video>
      </vue-plyr>

      <div v-if="truthResourceDetail">
        <h1 class="font-title font-bold text-lg mt-2 text-slate-800">{{ truthResourceDetail.title }}</h1>
        <p class="mb-8 text-slate-700 leading-normal">
          <p class="mb-4 text-slate-500 font-bold"><span><RouterLink :to="`/authors/${truthResourceDetail.author?.id}`">{{ truthResourceDetail.author?.firstName + " " + truthResourceDetail.author?.lastName }}</RouterLink></span> &bullet; <span>{{ truthResourceCreatedDisplay }}</span></p>
            <p>{{ truthResourceDetail.description }}</p>
          </p>
      </div>

      <UserRecommendationFooter class="mt-4"></UserRecommendationFooter>

      <br><br>
    </PageContent>
  </AppLayout>
</template>

  
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

import AppLayout from '../../components/templates/AppLayout.vue'
import PageContent from '../../components/templates/PageContent.vue'
import UserRecommendationFooter from '../../components/organisms/UserRecommendationFooter.vue'
import { getTruthResource } from '../services/TruthResourceService'
import { useRoute } from 'vue-router'
import { format } from 'date-fns'
import { formatName } from '../../core/services/FormatService'
import { TruthResource } from '../TruthResource'
import { VideoPlayerState, useGlobalVideoPlayer } from '../../components/organisms/VideoPlayer/VideoPlayerService'
import { AudioPlayerState, useGlobalAudioPlayer } from '../../components/organisms/AudioPlayer/AudioPlayerService'

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
  