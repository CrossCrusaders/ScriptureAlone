<template>
  <slot name="cover-image" :image="coverImage">
    <ContentCoverImage :cover-image="coverImage">
    </ContentCoverImage>
  </slot>
  <div class="mb-4">
    <p class="font-bold text-slate-800 mb-2">
      Author: <AuthorPageNameLink :author="props.author"></AuthorPageNameLink>
    </p>
  </div>
  <!-- Church Contact info-->
  <div class="mb-8" v-if="props.showChurchInfo && props.author?.church">
    <ChurchContactInfo :church="props.author?.church"></ChurchContactInfo>
  </div>
</template>

<script setup lang="ts">
import { Author } from '../../authors/Author'
import ChurchContactInfo from './ChurchContactInfo.vue'
import AuthorPageNameLink from '../atoms/AuthorPageNameLink.vue'
import { defaultImage } from '../../user/services/UserService'
import ContentCoverImage from './ContentCoverImage.vue'
import { computed } from 'vue'

export interface AuthorPreviewColumnProps {
  coverImage?: string
  author?: Author
  showChurchInfo?: boolean
}
const props = withDefaults(defineProps<AuthorPreviewColumnProps>(), { showChurchInfo: true })

const coverImage = computed(() => {
  return props.coverImage || props.author?.profileImage || defaultImage
})

</script>