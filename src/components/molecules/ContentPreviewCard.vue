<template>
  <div class="content-preview-card flex flex-col rounded-2xl relative  bg-transparent overflow-hidden h-72">

    <img v-if="previewImage" :src="previewImage"
      class="object-cover h-full w-full absolute top-0 left-0 right-0 bottom-0 z-0 " />
    <div class="absolute top-0 left-0 right-0 bottom-0 z-10 h-full w-full bg-slate-800 opacity-75 "></div>
    <div class="flex flex-col px-3 py-6 flex-auto relative">
      <div class="flex items-start justify-between flex-auto z-10">
        <h3 class="text-white text-xl font-title font-bold mb-2 mr-6 z-20" :title="props.content?.title">{{
            formatMaxLengthText(props.content?.title || '', 32)
        }}
        </h3>
        <FavoriteButton v-if="props.showFavorite" :is-favorite="props.isFavorite" class="absolute right-1 top-4 z-30"
          :invert="true" @click="emit('click:favorite', props.content)"></FavoriteButton>
      </div>
      <a @click="emit('click:author', props?.content.author)"
        class="text-slate-100 text-sm font-body mb-2 hover:underline cursor-pointer z-20">{{
            formatName(props.content?.author || '')
        }}
      </a>
      <p class="text-slate-100 text-md font-body mb-3 break-words z-20" :title="props.content?.description">{{
          formatMaxLengthText(props.content?.description ||
            '', 48)
      }}
      </p>
      <p class="text-slate-200 text-md text-sm font-body mb-0 z-20">
        Tags:
        <span v-for="(category, innerIndex) in props.content?.categories">
          <a v-if="props.content?.categories?.length != innerIndex + 1">{{ category.label }},&nbsp;</a>
          <a v-else>{{ category.label }}&nbsp;</a>
        </span>
      </p>
      <p v-if="props.content?.duration" class="text-slate-200 text-md font-body text-sm mb-3 z-20">
        Duration: {{ formatMillisecondsAsReadableDuration(props.content?.duration) }}
      </p>
      <div class="flex-auto mb-2 z-20"></div>
      <AppButton variant="white-outline" class="w-full z-20" @click="emit('click:button', props.content)">
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
import FavoriteButton from '../atoms/FavoriteButton.vue'
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
  isFavorite?: boolean
  showFavorite?: boolean
}

const props = withDefaults(defineProps<ContentProps>(), {
  buttonTitle: 'View Details',
  isFavorite: false,
  showFavorite: false
})
const emit = defineEmits([
  'click:button',
  'click:author',
  'click:favorite'
])

const previewImage = computed(() => {
  if (!props.content)
    return '/logo-bible.png'
  if (props.content.coverImage)
    return props.content.coverImage
  if (props.content.externalCoverImageUrl)
    return props.content.externalCoverImageUrl
  if (props.content.author && props.content.author.profileImage)
    return props.content.author.profileImage

  return '/logo-bible.png'
})

</script>

<style scoped>

</style>