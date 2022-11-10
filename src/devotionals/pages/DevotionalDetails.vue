<template>
  <AppLayout>
    <PageContent>
      <div class="flex flex-col-reverse md:flex-row gap-2 md:gap-8 mt-8" v-if="!loading && !!devotionalDetail">
        <div class="md:w-2/6">
          <AuthorPreviewColumn :show-church-info="true" :author="devotionalDetail.author" :devo="devotionalDetail">
            <template v-slot:cover-image="{ image }">
              <DevotionalCoverImage :cover-image="image" :devotional-id="devotionalDetail?.id"></DevotionalCoverImage>
            </template>
          </AuthorPreviewColumn>
          <!--TODO: Share Icons -->

        </div>
        <!-- Right Side -->
        <div class="md:w-4/6 flex-auto">
          <h1 class="font-title font-bold text-4xl mb-2 text-slate-800">{{ devotionalDetail.title }}</h1>
          <p class="text-slate-500">Updated: {{ devotionalLastUpdatedDisplay }} &bullet;
            <span class="text-slate-500" v-if="devotionalDetail.duration">
              Duration: {{ formatMillisecondsAsReadableDuration(
                  devotionalDetail.duration)
              }}
            </span>
          <p class="text-slate-800 text-md text-sm font-body mb-0">
            <b>Tags: </b>
            <a v-for="(category, innerIndex) in devotionalDetail.categories">
              <RouterLink
                v-if="devotionalDetail.categories != undefined && category != devotionalDetail.categories[devotionalDetail.categories.length - 1]"
                :to="'/devotionals?q=' + category.label + '&n=1&s=8'">{{
                    category.label
                }},&nbsp;</RouterLink>
              <RouterLink v-else :to="'/devotionals?q=' + category.label + '&n=1&s=8'">{{ category.label }}&nbsp;
              </RouterLink>
            </a>
          </p>
          </p>

          <p class="mb-8 text-slate-500 font-bold">{{ devotionalDetail.devotionalDate }}</p>
          <p class="mb-8 text-slate-700 leading-normal">
            {{ devotionalDetail.description }}
          </p>
          <div class="flex gap-4 mb-16">
            <AppButton variant="primary" @click="showPlayerModal = true" v-if="devotionalAudioSrc">Play Audio
            </AppButton>
            <AppButton variant="primary-outline" v-if="devotionalVideoSrc">Play Video</AppButton>
          </div>
          <Divider></Divider>
          <Accordion>
            <AccordionItem v-for="section of devotionalDetail.sections">
              <template v-slot:title>
                <h2>{{ section?.title }}</h2>
              </template>
              <div>
                {{ devotionalDetail.accordionText?.split(" | ")[1] }}
              </div>
            </AccordionItem>

          </Accordion>
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
import { getDevotional } from '../services/DevotionalService'
import { useRoute } from 'vue-router'
import { format } from 'date-fns'
import { formatMillisecondsAsReadableDuration } from '../../core/services/FormatService'
import { Devotional } from '../Devotional'
import IconCallToAction from '../../components/molecules/IconCallToAction.vue'
import Icon from '../../components/atoms/Icon.vue'
import Accordion from '../../components/molecules/Accordion/Accordion.vue'
import AccordionItem from '../../components/molecules/Accordion/AccordionItem.vue'
import { RouterLink } from 'vue-router'
import DevotionalCoverImage from '../components/DevotionalCoverImage.vue'
import { prop } from 'dom7'


const loading = ref(true)
const devotionalDetail = ref<Devotional>()
const route = useRoute()
const showPlayerModal = ref(false)

onMounted(async () => {
  // The Devotional ID
  let { id } = route.params

  if (Array.isArray(id))
    id = id[0]

  const devotional = await getDevotional(id)
  devotionalDetail.value = devotional
  loading.value = false
})

const devotionalAudioSrc = computed(() => {
  return devotionalDetail.value?.externalAudioFileUrl || devotionalDetail.value?.audioFile
})

const devotionalVideoSrc = computed(() => {
  return devotionalDetail.value?.externalVideoFileUrl
})

const devotionalLastUpdatedDisplay = computed(() => {
  const strDate = (devotionalDetail.value?.devotionalDate || devotionalDetail.value?.updated) as any
  const date = new Date(strDate.split(' ')[0])
  return format(date, 'MM/dd/yyyy')
})

const beforeAudioModalClose = () => {
  // TODO: find a way to stop the audio from playing when the modal is closed
}

</script>
