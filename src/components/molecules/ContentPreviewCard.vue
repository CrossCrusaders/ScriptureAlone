<template>
  <div class="content-preview-card flex flex-col rounded-2xl relative  bg-transparent overflow-hidden">

    <img :src="previewImage" class="object-cover h-full w-full absolute top-0 left-0 right-0 bottom-0 -z-20 " />
    <div class="absolute top-0 left-0 right-0 bottom-0 -z-20 h-full w-full bg-slate-800 opacity-75 "></div>
    <div class="flex flex-col p-6 flex-auto">

      <h3 class="text-white text-xl font-title font-bold mb-0" :title="props.content?.title">{{
      formatMaxLengthText(props.content?.title || '', 32) }}
      </h3>
      <p class="text-slate-100 text-sm font-body mb-2">{{ props.content?.author?.firstName }}&nbsp;{{
      props.content?.author?.lastName
      }}
      </p>
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

      <AppButton variant="primary" class="w-full" @click="emit('click:button', props.content)">
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
  formatMaxLengthText
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
  'click:button'
])

const previewImage = computed(() => {
  if (!props.content)
    return null

  if (props.content.coverImage)
    return props.content.coverImage
  if (props.content.author)
    return props.content.author.profileImage
})

</script>

<style scoped>

</style>