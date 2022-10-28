<template>
  <AppLayout>
    <PageContent>
      <div class="flex flex-col-reverse md:flex-row gap-2 md:gap-8 mt-8" v-if="!loading && !!sermonDetail">
        <div class="md:w-2/6">
          <AuthorPreviewColumn :show-church-info="true" :author="sermonDetail.author"
            :coverImage="sermonDetail.coverImage">
            <template v-slot:cover-image="{ image }">
              <SermonCoverImage :cover-image="image" :sermon-id="sermonDetail?.id"></SermonCoverImage>
            </template>
          </AuthorPreviewColumn>
          <!--TODO: Share Icons -->

        </div>
        <!-- Right Side -->
        <div class="md:w-4/6 flex-auto">
          <h1 class="font-title font-bold text-4xl mb-2 text-slate-800">{{ sermonDetail.title }}</h1>
          <p class="text-slate-500">Updated: {{ sermonLastUpdatedDisplay }} &bullet;
            <span class="text-slate-500" v-if="sermonDetail.duration">
              Duration: {{ formatMillisecondsAsReadableDuration(
                  sermonDetail.duration)
              }}
            </span>
          </p>

          <p class="mb-8 text-slate-500 font-bold">{{ format(sermonDetail.sermonDate || new Date(), 'MM/dd/yyyy') }}</p>
          <p class="mb-8 text-slate-700 leading-normal">
            {{ sermonDetail.description }}
          </p>
          <!-- Buttons -->
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

            <AppButton variant="primary" @click="onPlayVideoClicked()"
              v-if="sermonVideoSrc && globalVideoState !== VideoPlayerState.playing">
              {{ 'Play Video' }}
            </AppButton>
            <div v-if="sermonAudioSrc && globalVideoState === VideoPlayerState.playing">
              <AppButton variant="primary-minimal" :disabled="true">{{ 'Now Playing' }}
              </AppButton>

              <AppButton @click="globalVideoState = VideoPlayerState.hidden" variant="accent">{{ 'Close' }}
              </AppButton>

            </div>
          </div>
          <!-- Video -->
          <Transition name="video">
            <video v-if="sermonVideoSrc && globalVideoState === VideoPlayerState.playing" class="w-2/3"
              :src="sermonVideoSrc" controlslist="nodownload" autoplay="true" controls></video>
          </Transition>
          <Divider></Divider>
        </div>
      </div>
      <Transition name="playing" v-if="globalVideoState === VideoPlayerState.playing" appear>
        <UserRecommendationFooter v-if="globalVideoState === VideoPlayerState.playing"></UserRecommendationFooter>
      </Transition>
      <Transition name="hidden" v-if="globalVideoState === VideoPlayerState.hidden" appear>
        <UserRecommendationFooter v-if="globalVideoState === VideoPlayerState.hidden"></UserRecommendationFooter>
      </Transition>
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
import AppModal from '../../components/templates/AppModal.vue'
import AuthorPreviewColumn from '../../components/molecules/AuthorPreviewColumn.vue'
import { getSermon } from '../services/SermonService'
import { useRoute } from 'vue-router'
import { format } from 'date-fns'
import { formatMillisecondsAsReadableDuration, formatName } from '../../core/services/FormatService'
import { Sermon } from '../Sermon'
import UserRecommendationFooter from '../../components/organisms/UserRecommendationFooter.vue'
import { AudioPlayerState, useGlobalAudioPlayer } from '../../components/organisms/AudioPlayer/AudioPlayerService'
import { VideoPlayerState, useGlobalVideoPlayer } from '../../components/organisms/VideoPlayer/VideoPlayerService'
import SermonCoverImage from '../components/SermonCoverImage.vue'


const loading = ref(true)
const sermonDetail = ref<Sermon>()
const route = useRoute()
const showPlayerModal = ref(false)
var fullscreen = ref(false);

console.log(VideoPlayerState.playing)

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

onMounted(async () => {
  // The Sermon ID
  let { id } = route.params

  if (Array.isArray(id))
    id = id[0]

  const sermon = await getSermon(id)
  sermonDetail.value = sermon
  loading.value = false
  globalVideoState.value = VideoPlayerState.hidden;
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
    id: id,
    title: title,
    author: formatName(author),
    currentTime: 0,
    url: sermonAudioSrc.value,
    contentPage: `/sermons/${id}`
  })

  setGlobalAudioState(AudioPlayerState.playing)
}
const onPlayVideoClicked = () => {

  if (!sermonDetail.value)
    return
  const { title, id, author } = sermonDetail.value

  setGlobalVideoPayload({
    id: id!,
    title: title!,
    author: formatName(author),
    currentTime: 0,
    url: sermonVideoSrc.value,
    contentPage: `/sermons/${id}`
  })

  setGlobalVideoState(VideoPlayerState.playing)
}

</script>
<style>
.video-enter-active,
.video-leave-active {
  transition: transform 0.2s ease;
}

.video-enter-from,
.video-leave-to {
  transform: scale(0);
}

.playing-enter-active,
.playing-leave-active {
  transition: transform 0.5s ease;
}

.playing-enter-from,
.playing-leave-to {
  transform: translateY(-50px);
}

.hidden-enter-active,
.hidden-leave-active {
  transition: transform 0.5s ease;
}

.hidden-enter-from,
.hidden-leave-to {
  transform: translateY(50px);
}
</style>