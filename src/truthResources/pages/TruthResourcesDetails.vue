<template>
  <AppLayout>
    <PageContent>
      <div class="flex flex-col-reverse md:flex-row gap-2 md:gap-8 mt-8" v-if="!loading && !!truthResourceDetail">
        <div class="md:w-2/6">
          <AuthorPreviewColumn :show-church-info="true" :author="truthResourceDetail.author">
            <template v-slot:cover-image="{ image }">
              <TruthResourceCoverImage :resource="truthResourceDetail" :truth-resource-id="truthResourceDetail?.id">
              </TruthResourceCoverImage>
            </template>
          </AuthorPreviewColumn>
          <!--TODO: Share Icons -->

        </div>
        <!-- Right Side -->
        <div class="md:w-4/6 flex-auto">
          <h1 class="font-title font-bold text-4xl mb-2 text-slate-800">{{ truthResourceDetail.title }}</h1>
          <p class="text-slate-500">Updated: {{ devotionalLastUpdatedDisplay }} &bullet;</p>

          <!--<p class="mb-8 text-slate-500 font-bold">{{ devotionalDetail.truthResourceDate }}</p>-->
          <p class="mb-8 text-slate-700 leading-normal">
            {{ truthResourceDetail.description }}
          </p>
          <div class="flex gap-4 mb-16">
            <AppButton variant="primary" @click="showPlayerModal = true" v-if="devotionalAudioSrc">Play Audio
            </AppButton>
            <AppButton variant="primary-outline" v-if="devotionalVideoSrc">Play Video</AppButton>
          </div>
          <Divider></Divider>
          <div class="border-2 border-slate-400 border-solid">
            <VuePdf v-for="page in truthResourceDetail.pageAmount" :key="page" :src="getBucketUrl(truthResourceDetail, truthResourceDetail.pdf)" :page="page" />
          </div>
          <br>
        </div>
      </div>
      <div class="lg:flex lg:flex-row gap-10">
        <!-- My Plans -->
        <div class="bg-slate-200 rounded-3xl w-full mb-4">
          <IconCallToAction class="w-full gap-2">
            <template v-slot:image>
              <Icon icon-name="clipboard-list" :size="56"></Icon>
            </template>

            <div>
              <h1 class="text-xl whitespace-nowrap font-title font-bold">My Plans</h1>
              <p class="font-body font-lg leading-relaxed">This is the body</p>
            </div>

            <template v-slot:action>
              <AppButton>
                Click Me!
              </AppButton>
            </template>
          </IconCallToAction>
        </div>

        <!-- Recommended Plans -->
        <div class="bg-slate-200 rounded-3xl w-full mb-4">
          <IconCallToAction class="w-full gap-2">
            <template v-slot:image>
              <Icon icon-name="thumb-up" :size="56"></Icon>
            </template>

            <div>
              <h1 class="text-xl whitespace-nowrap font-title font-bold">Recommended Plans</h1>
              <p class="font-body font-sm leading-relaxed">This is the body</p>
            </div>

            <template v-slot:action>
              <AppButton>
                Click Me!
              </AppButton>
            </template>
          </IconCallToAction>
        </div>
      </div>
      <br><br>
    </PageContent>
  </AppLayout>

  <AppModal v-model="showPlayerModal" @beforeClose="beforeAudioModalClose()" v-slot="{ close }">
    <div class="p2">
      <AudioPlayer :audio-src="devotionalAudioSrc"></AudioPlayer>
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
import AudioPlayer from '../../components/organisms/AudioPlayer/AudioPlayer.vue'
import AuthorPreviewColumn from '../../components/molecules/AuthorPreviewColumn.vue'
import { useBreakpoint } from '../../browser/ViewportService'

import { formatAddress } from '../../core/services/FormatService'
import { getTruthResource } from '../services/TruthResourceService'
import { useRoute } from 'vue-router'
import { format } from 'date-fns'
import { formatMillisecondsAsReadableDuration } from '../../core/services/FormatService'
import { TruthResource } from '../TruthResource'
import IconCallToAction from '../../components/molecules/IconCallToAction.vue'
import Icon from '../../components/atoms/Icon.vue'
import Accordion from '../../components/molecules/Accordion/Accordion.vue'
import AccordionItem from '../../components/molecules/Accordion/AccordionItem.vue'
import { RouterLink } from 'vue-router'
import TruthResourceCoverImage from '../components/TruthResourceCoverImage.vue'
import { prop } from 'dom7'
import { getBucketUrl } from '../../api/BucketStorageService'


const loading = ref(true)
const truthResourceDetail = ref<TruthResource>()
const route = useRoute()
const showPlayerModal = ref(false)

const numOfPages = ref(5);

onMounted(async () => {
  // The Devotional ID
  let { id } = route.params

  if (Array.isArray(id))
    id = id[0]

  const truthResource = await getTruthResource(id);
  truthResourceDetail.value = truthResource;
  loading.value = false;
})

const devotionalAudioSrc = computed(() => {
  //return truthResourceDetail.value?.externalAudioFileUrl || truthResourceDetail.value?.audioFile
  return ""
})

const devotionalVideoSrc = computed(() => {
  //return truthResourceDetail.value?.externalVideoFileUrl
  return ""
})

const devotionalLastUpdatedDisplay = computed(() => {
  //const strDate = (truthResourceDetail.value?.devotionalDate || truthResourceDetail.value?.updated) as any
  //const date = new Date(strDate.split(' ')[0])
  //return format(date, 'MM/dd/yyyy')
  return ""
})

const beforeAudioModalClose = () => {
  // TODO: find a way to stop the audio from playing when the modal is closed
}

</script>
  