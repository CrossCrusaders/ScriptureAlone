<template>
  <img :src="props.author?.profileImage" class="object-cover max-h-40 w-full md:max-h-64 rounded-lg mb-4" />
  <div class="mb-4">
    <p class="font-bold text-slate-800 mb-2">Speaker: {{ formatName(props.author) }} </p>
  </div>
  <!-- Church Contact info-->
  <div class="mb-8" v-if="props.showChurchInfo && props.author?.church">
    <ChurchContactInfo :church="props.author?.church"></ChurchContactInfo>
  </div>
</template>

<script setup lang="ts">
import { Author } from '../../authors/Author'
import { formatName } from '../../core/services/FormatService'
import ChurchContactInfo from '../../components/molecules/ChurchContactInfo.vue'

export interface AuthorPreviewColumnProps {
  author?: Author
  showChurchInfo?: boolean
}
const props = withDefaults(defineProps<AuthorPreviewColumnProps>(), { showChurchInfo: true })

</script>