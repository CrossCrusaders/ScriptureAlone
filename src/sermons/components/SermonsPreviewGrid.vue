<template>
  <ContentPreviewGrid :content="loadedSermons" @click:button="onSermonCardClicked"></ContentPreviewGrid>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import ContentPreviewGrid from '../../components/molecules/ContentPreviewGrid.vue'
import { Sermon } from '../Sermon';
import { searchSermons } from '../services/SermonService'

export interface SermonsPreviewGridProps {
  queryParams?: any
  page?: number
  perPage?: number
}

const props = withDefaults(defineProps<SermonsPreviewGridProps>(), {
  page: 1,
  perPage: 8
})
const loadedSermons = ref<Sermon[]>([])

onMounted(async () => {

  const result = await searchSermons()

  loadedSermons.value = result
})

const onSermonCardClicked = (sermon: Sermon) => {
  debugger;
}
</script>

<style>

</style>