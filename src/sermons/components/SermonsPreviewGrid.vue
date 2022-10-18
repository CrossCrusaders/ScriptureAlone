<template>
  <ContentPreviewGrid :content="loadedSermons" @click:button="onSermonCardClicked"></ContentPreviewGrid>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { ContentPreview } from '../../components/molecules/ContentPreviewCard.vue';
import ContentPreviewGrid from '../../components/molecules/ContentPreviewGrid.vue'
import { Pagination } from '../../core/Pagination';
import { Sermon } from '../Sermon';
import { searchSermons } from '../services/SermonService'

export interface SermonsPreviewGridProps {
  queryParams?: any
  page?: number
  perPage?: number
  link?: string
  paginationControls?: boolean
}

const props = withDefaults(defineProps<SermonsPreviewGridProps>(), {
  page: 1,
  perPage: 8
})

const loadedSermons = ref<ContentPreview[]>([])
const router = useRouter()
const emit = defineEmits([
  'click:button', // TODO: better name?
  'page:change',
  'page:next',
  'page:previous',
  'data:loaded'
])

const pagination = ref<Pagination | null>(null)

const loadSearchedSermons = async () => {
  const { items, ...paginationData } = await searchSermons(null, props.page, props.perPage, props.queryParams)
  loadedSermons.value = items as ContentPreview[]
  pagination.value = paginationData
  emit('data:loaded', { items, ...paginationData })
}

onMounted(async () => {
  loadSearchedSermons()

  // Initialize watch after initial load
  watch(() => props.page, (currentPage, prevPage) => {

    loadSearchedSermons()

    if (currentPage > prevPage)
      emit('page:next')
    else if (currentPage < prevPage)
      emit('page:previous')
  })
  watch(() => props.perPage, () => loadSearchedSermons())
  watch(() => props.queryParams, () => loadSearchedSermons())
})


const onSermonCardClicked = (sermon: Sermon) => {
  router.push(`/sermons/${sermon.id}`)
  emit('click:button')
}
</script>

<style>

</style>