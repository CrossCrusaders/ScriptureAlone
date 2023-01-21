<template>
    <ContentCoverImage cover-image="/logo-bible.png" :content-id="props.noteId"
      v-bind="{ ...$props }"></ContentCoverImage>
</template>
  
<script setup lang="ts">
  import ContentCoverImage from '../../components/molecules/ContentCoverImage.vue';
  
  const props = defineProps([
    'noteId',
    'resource'
  ])
</script>