<template>
  <img :src="props.coverImage || props.author?.profileImage || defaultImage"
    class="object-cover max-h-40 w-full md:max-h-64 rounded-lg mb-4" />
  <div class="mb-4">
    <p class="font-bold text-slate-800 mb-2">Speaker: <AuthorPageNameLink :author="props.author"></AuthorPageNameLink>
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

export interface AuthorPreviewColumnProps {
  coverImage?: string
  author?: Author
  showChurchInfo?: boolean
}
const props = withDefaults(defineProps<AuthorPreviewColumnProps>(), { showChurchInfo: true })

</script>