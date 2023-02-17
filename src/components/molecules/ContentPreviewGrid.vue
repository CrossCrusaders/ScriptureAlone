<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
    <ContentPreviewCard v-for="content of props.content" :show-tag="props.showTags" :show-favorite="props.showFavorite"
      :is-favorite="isFavorite(content)" :content="content" :button-title="props.buttonTitle"
      @click:button="emit('click:button', content)" @click:author="emit('click:author', $event)"
      @click:favorite="emit('click:favorite', $event)"></ContentPreviewCard>
  </div>
</template>

<script setup lang="ts">
import ContentPreviewCard, { ContentPreview } from './ContentPreviewCard.vue'

export interface ContentPreviewGridProps {
  content: ContentPreview[],
  buttonTitle?: string
  showFavorite?: boolean
  showTags?: boolean
  isFavorite?: (_: any) => boolean
}

const props = withDefaults(defineProps<ContentPreviewGridProps>(), {
  content: [] as any,
  showTags: true
})
const emit = defineEmits(['click:button', 'click:author', 'click:favorite'])

const isFavorite = (content: any) => {
  if (props.isFavorite)
    return props.isFavorite(content)
  return false
}
</script>

<style>

</style>