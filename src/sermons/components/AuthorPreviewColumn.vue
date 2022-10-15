<template>
  <img :src="props.author?.profileImage" class="object-cover max-h-40 w-full md:max-h-64 rounded-lg mb-4" />
  <div class="mb-4">
    <p class="font-bold text-slate-800 mb-2">Speaker: {{ props.author?.firstName + ' ' +
    props.author?.lastName }}</p>
  </div>
  <!-- Church Contact info-->
  <div class="mb-8" v-if="props.author?.church">
    <ChurchContactInfo :church="props.author?.church"></ChurchContactInfo>
  </div>
</template>

<script setup lang="ts">
import { Author } from '../../authors/Author'
import { formatAddress } from '../../core/services/FormatService'
import ChurchContactInfo from '../../components/molecules/ChurchContactInfo.vue';

export interface AuthorPreviewColumnProps {
  author?: Author
}
const props = defineProps<AuthorPreviewColumnProps>()



</script>