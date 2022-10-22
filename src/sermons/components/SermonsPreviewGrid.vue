<template>
  <ContentPreviewGrid :content="loadedSermons" :button-title="'View Sermon'" @click:button="onSermonCardClicked">
  </ContentPreviewGrid>
  <div v-if="props.paginationControls"></div>
  <div v-if="props.appendContent">
    <div v-if="loading" class="flex justify-center">
      <Spinner color="slate-800"></Spinner>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { ContentPreview } from '../../components/molecules/ContentPreviewCard.vue';
import ContentPreviewGrid from '../../components/molecules/ContentPreviewGrid.vue'
import { Pagination } from '../../core/Pagination';
import { Sermon } from '../Sermon';
import { searchSermons } from '../services/SermonService'
import Spinner from '../../components/atoms/Spinner.vue';

export interface SermonsPreviewGridProps {
  queryParams?: any
  page?: number
  perPage?: number
  link?: string
  paginationControls?: boolean
  appendContent?: boolean
  query?: string | null
}

const props = withDefaults(defineProps<SermonsPreviewGridProps>(), {
  page: 1,
  perPage: 8,
  query: null
})

const loading = ref<boolean>(false)
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

const loadSearchedSermons = async (forceReset = false) => {
  if (pagination.value && pagination.value.totalPages === pagination.value.page && !forceReset) {
    loading.value = false
    return
  }
  loading.value = true
  try {
    const { items, ...paginationData } = await searchSermons(props.query, props.page, props.perPage, props.queryParams)
    if (props.appendContent && !forceReset) {
      loadedSermons.value = loadedSermons.value.concat(items as ContentPreview[])
    }
    else
      loadedSermons.value = items as ContentPreview[]
    pagination.value = paginationData
    emit('data:loaded', { items, ...paginationData })
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  loadSearchedSermons()

  // Initialize watch after initial load
  watch(() => props.page, (currentPage, prevPage) => {
    loading.value = true
    setTimeout(() => {

      loadSearchedSermons()

      if (currentPage > prevPage)
        emit('page:next')
      else if (currentPage < prevPage)
        emit('page:previous')
    }, 800)
  })
  watch(() => props.perPage, () => loadSearchedSermons())
  watch(() => props.queryParams, () => loadSearchedSermons())

  watch(() => props.query, (currentQuery, prevQuery) => {
    loadSearchedSermons(true)
  })
})


const onSermonCardClicked = (sermon: Sermon) => {
  router.push(`/sermons/${sermon.id}`)
  emit('click:button')
}
</script>

<style>

</style>