<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
    <ContentPreviewCard v-for="content of props.content" :content="content"
      @click:button="emit('click:button', content)"></ContentPreviewCard>
  </div>
</template>

<script setup lang="ts">
import { Pagination } from '../../core/Pagination';
import ContentPreviewCard, { ContentPreview } from './ContentPreviewCard.vue'

export interface ContentPreviewGridProps {
  content: ContentPreview[]
}

const props = withDefaults(defineProps<ContentPreviewGridProps>(), {
  content: [] as any
})
const emit = defineEmits(['click:button'])

</script>

<style>

</style>