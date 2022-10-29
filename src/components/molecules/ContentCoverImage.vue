<template>
  <img :src="props.coverImage || defaultImage" class="object-cover max-h-64 w-full md:max-h-64 rounded-lg mb-4" />
</template>

<script setup lang="ts">
import { Author } from '../../authors/Author'
import { defaultImage } from '../../user/services/UserService'

export interface ContentCoverImageProps {
  coverImage?: string
}
const props = withDefaults(defineProps<ContentCoverImageProps>(), {})

</script>