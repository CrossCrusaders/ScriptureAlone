<template>
  <ContentPreviewGrid :content="loadedSermons" @click:button="onSermonCardClicked"></ContentPreviewGrid>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import ContentPreviewGrid from '../../components/molecules/ContentPreviewGrid.vue'
import { Sermon } from '../Sermon';
import { searchSermons } from '../services/SermonService'

export interface SermonsPreviewGridProps {
  queryParams?: any
  page?: number
  perPage?: number
  link?: string
}

const props = withDefaults(defineProps<SermonsPreviewGridProps>(), {
  page: 1,
  perPage: 8
})
const loadedSermons = ref<Sermon[]>([])

const router = useRouter()
const emit = defineEmits(['click:button'])

onMounted(async () => {

  const result = await searchSermons()

  loadedSermons.value = result
})

const onSermonCardClicked = (sermon: Sermon) => {
  if (props.link)
    router.push(props.link)

  emit('click:button')
}
</script>

<style>

</style>