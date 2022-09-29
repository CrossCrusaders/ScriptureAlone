<template>
  <img :src="props.author?.profileImage" class="object-cover max-h-40 w-full md:max-h-64 rounded-lg mb-4" />
  <div class="mb-8">
    <p class="font-bold text-slate-800 mb-2">Speaker: {{ props.author?.firstName + ' ' +
    props.author?.lastName }}</p>
    <p class="font-bold text-slate-800">Church: {{ props.author?.church.name }}</p>
  </div>
  <!-- Church Contact info-->
  <div class="mb-8">
    <p class="text-slate-800 mb-2">Address: {{ props.author?.church ?
    formatAddress(props.author.church) : null }}</p>
    <p class="text-slate-800">Email: {{ props.author?.church.email }}</p>

  </div>
</template>

<script setup lang="ts">
import { Author } from '../../authors/Author'
import { formatAddress } from '../../core/services/FormatService'

export interface AuthorPreviewColumnProps {
  author?: Author
}
const props = defineProps<AuthorPreviewColumnProps>()



</script>