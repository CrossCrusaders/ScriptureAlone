<template>
  <div class="content-preview-card flex flex-col rounded-2xl relative  bg-transparent overflow-hidden h-72">

    <img v-if="previewImage" :src="previewImage"
      class="object-cover h-full w-full absolute top-0 left-0 right-0 bottom-0 -z-20 " />
    <div class="absolute top-0 left-0 right-0 bottom-0 -z-20 h-full w-full bg-slate-800 opacity-75 "></div>
    <div class="flex flex-col px-4 py-6 flex-auto">
      <h3 class="text-white text-xl font-title font-bold mb-2" :title="props.content?.title">{{
      formatMaxLengthText(props.content?.title || '', 32) }}
      </h3>
      <a @click="emit('click:author', props?.content.author)"
        class="text-slate-100 text-sm font-body mb-2 hover:underline cursor-pointer">{{
        formatName(props.content?.author || '')
        }}
      </a>
      <p class="text-slate-100 text-md font-body mb-3 break-words" :title="props.content?.description">{{
      formatMaxLengthText(props.content?.description ||
      '', 48) }}
      </p>
      <p class="text-slate-200 text-md text-sm font-body mb-0">
        Tags:
        <span v-for="(category, innerIndex) in props.content?.categories">
          {{ category.label }},&nbsp;
        </span>
      </p>
      <p v-if="props.content?.duration" class="text-slate-200 text-md font-body text-sm mb-3">
        Duration: {{ formatMillisecondsAsReadableDuration(props.content?.duration) }}
      </p>
      <div class="flex-auto mb-2"></div>
      <AppButton variant="white-outline" class="w-full" @click="emit('click:button', props.content)">
        {{ props.buttonTitle }}
      </AppButton>

    </div>
  </div>
</template>

<script setup lang="ts">
import { Author } from '../../authors/Author'
import { Category } from '../../devotionals/Devotional'
import {
  formatMillisecondsAsReadableDuration,
  formatMaxLengthText,
  formatName
} from '../../core/services/FormatService'
import { computed, reactive } from 'vue'
import { getBucketUrl } from '../../api/BucketStorageService'
import AppButton from '../atoms/form-controls/AppButton.vue'
export interface ContentPreview {
  id?: string
  title?: string
  description?: string
  author?: Author
  coverImage?: any
  externalCoverImageUrl?: string
  duration?: number
  categories?: Category[]
}

export interface ContentProps {
  content: ContentPreview
  buttonTitle?: string
}

const props = withDefaults(defineProps<ContentProps>(), {
  buttonTitle: 'View Details'
})
const emit = defineEmits([
  'click:button',
  'click:author'
])

const previewImage = computed(() => {
  if (!props.content)
    return '/logo-bible.png'

  if (props.content.coverImage)
    return props.content.coverImage
  if (props.content.author && props.content.author.profileImage)
    return props.content.author.profileImage

  return '/logo-bible.png'
})

</script>

<style scoped>

</style>