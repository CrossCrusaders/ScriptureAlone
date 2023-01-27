<template>
  <AppLayout>
    <PageContent>
      <div class="flex flex-col-reverse md:flex-row gap-2 md:gap-8 mt-8" v-if="(!loading && !!devotionalDetail)">
        <div class="md:w-2/6">
          <AuthorPreviewColumn :show-church-info="true" :author="devotionalDetail.author"
            :coverImage="devotionalDetail.coverImage">
            <template v-slot:cover-image="{ image }">
              <DevotionalCoverImage :cover-image="image" :devotional-id="devotionalDetail?.id"></DevotionalCoverImage>
            </template>
          </AuthorPreviewColumn>
          <!--TODO: Share Icons -->

        </div>
        <!-- Right Side -->
        <div class="md:w-4/6 flex-auto pb-8">
          <h1 class="font-title font-bold text-4xl mb-2 text-slate-800">{{ devotionalDetail.title }}</h1>
          <p class="text-slate-500">Updated: {{ devotionalLastUpdatedDisplay }} &bullet;
            <span class="text-slate-500" v-if="devotionalDetail.duration">
              Duration: {{ formatMillisecondsAsReadableDuration(
                devotionalDetail.duration)
              }}
            </span>
          </p>

          <p v-if="devotionalDetail.devotionalDate" class="mb-8 text-slate-500 font-bold">{{ devotionalCreatedDisplay }}</p>
          <p class="mb-8 text-slate-700 leading-normal">
            {{ devotionalDetail.description }}
          </p>
          <!-- Buttons -->
          <div class="flex gap-4 mb-16">
            <AppButton variant="primary" @click="onPlayAudioClicked()"
              v-if="devotionalAudioSrc && globalAudioState !== AudioPlayerState.playing && globalVideoState !== VideoPlayerState.playing">{{ 'Play Audio' }}
            </AppButton>
            <AppButton v-if="devotionalAudioSrc && globalAudioState === AudioPlayerState.playing" @click="globalAudioState = AudioPlayerState.hidden" variant="accent">{{ 'Close' }}
            </AppButton>
            <AppButton v-if="devotionalAudioSrc && globalAudioState === AudioPlayerState.playing" to="/bible" variant="accent">{{ 'Open Bible' }}
            </AppButton>

            <AppButton variant="primary" @click="onPlayVideoClicked()"
              v-if="devotionalVideoSrc && globalVideoState !== VideoPlayerState.playing && globalAudioState !== AudioPlayerState.playing">
              {{ 'Play Video' }}
            </AppButton>
            <div v-if="devotionalVideoSrc && globalVideoState === VideoPlayerState.playing">
              <AppButton @click="globalVideoState = VideoPlayerState.hidden" variant="accent">{{ 'Close' }}
              </AppButton>
            </div>
          </div>
          <!-- Video -->
          <Transition name="video">
            <video v-if="devotionalVideoSrc && globalVideoState === VideoPlayerState.playing" class="w-full"
              :src="devotionalVideoSrc" controlslist="nodownload" autoplay="true" controls></video>
            <div class="w-full flex flex-col gap-3" v-else-if="!loading && !devotionalVideoSrc && !!devotionalDetail && devotionalDetail.contentTitle != undefined && devotionalDetail.content != undefined">
              <Divider></Divider>
              <div class="flex justify-center">
                <p class="font-title text-3xl font-bold">{{ devotionalDetail.contentTitle }}</p>
              </div>
              <p v-if="devotionalDetail.vVerseE != devotionalDetail.vVerseS"><span class="font-bold text-xl">{{ bookName + " " + devotionalDetail.vChap + ":" + devotionalDetail.vVerseS + "-" + devotionalDetail.vVerseE }}</span><span class="font-normal text-xl">{{ ' - "' + verseText + '"' }}</span></p>
              <p v-else><span class="font-bold text-xl">{{ bookName + " " + devotionalDetail.vChap + ":" + devotionalDetail.vVerseS }}</span><span class="font-normal text-xl">{{ ' - "' + verseText + '"' }}</span></p>
              <p v-html="devotionalDetail.content"></p>
            </div>
          </Transition>
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
import { getDevotional } from '../services/DevotionalService'
import { useRoute } from 'vue-router'
import { format } from 'date-fns'
import { formatMillisecondsAsReadableDuration, formatName } from '../../core/services/FormatService'
import { Devotional } from '../Devotional'
import DevotionalCoverImage from '../components/DevotionalCoverImage.vue'
import { VideoPlayerState, useGlobalVideoPlayer } from '../../components/organisms/VideoPlayer/VideoPlayerService'
import { AudioPlayerState, useGlobalAudioPlayer } from '../../components/organisms/AudioPlayer/AudioPlayerService'
import { getVerses } from '../../bible/services/BibleService'

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
const devotionalDetail = ref<Devotional>()
const route = useRoute()
const showPlayerModal = ref(false)

const verseText = ref<string>();
const bookName = ref<string>();

onMounted(async () => {
  // The Devotional ID
  let { id } = route.params

  if (Array.isArray(id))
    id = id[0]
  console.log(id)
  const devotional = await getDevotional(id);
  devotionalDetail.value = devotional;
  devotionalDetail.value.content = devotionalDetail.value?.content?.replaceAll('\n', "<br>");
  verseText.value = await getVerse();
  loading.value = false;
})

const devotionalAudioSrc = computed(() => {
  return devotionalDetail.value?.externalAudioFileUrl || devotionalDetail.value?.externalAudioFileUrl
})

const devotionalVideoSrc = computed(() => {
  return devotionalDetail.value?.externalVideoFileUrl
})

const devotionalLastUpdatedDisplay = computed(() => {
  const strDate = (devotionalDetail.value?.devotionalDate || devotionalDetail.value?.updated) as any
  const date = new Date(strDate.split(' ')[0])
  return format(date, 'MM/dd/yyyy')
})
const devotionalCreatedDisplay = computed(() => {
  const strDate = (devotionalDetail.value?.devotionalDate || new Date()) as any
  const date = new Date(strDate.split(' ')[0])
  return format(date, 'MM/dd/yyyy')
})

const beforeAudioModalClose = () => {
  // TODO: find a way to stop the audio from playing when the modal is closed
}

const onPlayVideoClicked = () => {

  if (!devotionalDetail.value)
    return
  const { title, id, author } = devotionalDetail.value

  setGlobalVideoPayload({
    id: id!,
    title: title!,
    author: formatName(author),
    currentTime: 0,
    url: devotionalVideoSrc.value,
    contentPage: `/devotionals/${id}`
  })

  setGlobalVideoState(VideoPlayerState.playing)
}

const onPlayAudioClicked = () => {

if (!devotionalDetail.value)
  return
const { title, id, author } = devotionalDetail.value

setGlobalAudioPayload({
  id: id,
  title: title,
  author: formatName(author),
  currentTime: 0,
  url: devotionalAudioSrc.value,
  contentPage: `/devotionals/${id}`
})

setGlobalAudioState(AudioPlayerState.playing)
}

async function getVerse(){
  if(devotionalDetail.value?.content != "" && devotionalDetail.value?.contentTitle != "" && devotionalDetail.value?.vBook != "" && devotionalDetail.value?.vChap != 0){
    const verseTxt = await getVerses("ENGKJV", devotionalDetail.value?.vBook || "", devotionalDetail.value?.vChap || 1, devotionalDetail.value?.vVerseS, devotionalDetail.value?.vVerseE)
    bookName.value = verseTxt[0].book_name;
    var FinishedVerseText = "";
    verseTxt.forEach((verse) => {
      FinishedVerseText += `${verse.verse_start} ${verse.verse_text} `;
    });
    return FinishedVerseText.trim();
  }
  return;
}
</script>
  