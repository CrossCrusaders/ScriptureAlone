<template>
  <ContentPreviewGrid :show-favorite="true" :is-favorite="isFavoriteSermon" :content="loadedSermons"
    :button-title="'View Sermon'" @click:button="onSermonCardClicked" @click:author="onSermonAuthorClicked"
    @click:favorite="onFavoriteSermonClicked($event)">
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
import Spinner from '../../components/atoms/Spinner.vue';
import { Author } from '../../authors/Author';
import { useUserFavorites } from '../../user/services/UserService';
import { useAuth } from '../../auth/services/AuthService';

import { getSearch } from '../../search/services/searchService'
 
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
  'click:author',
  'page:change',
  'page:next',
  'page:previous',
  'data:loaded'
])

const { loadFavorites, isUserFavoriteSermon, toggleUserFavoriteSermon } = useUserFavorites()
const { user } = useAuth()

const pagination = ref<Pagination | null>(null)

const loadSearchedSermons = async (forceReset = false) => {
  if (pagination.value && pagination.value.totalPages === pagination.value.page && !forceReset) {
    loading.value = false
    return
  }
  loading.value = true
  try {
    const { items, ...paginationData } = await getSearch('sermons', props.query || undefined, props.page, props.perPage, props.queryParams)
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

  await loadFavorites()
})

const onSermonCardClicked = (sermon: Sermon) => {
  router.push(`/sermons/${sermon.id}`)
  emit('click:button')
}

const onSermonAuthorClicked = (author: Author) => {
  router.push(`/authors/${author.id}`)
  emit('click:author')
}

const isFavoriteSermon = (sermon: Sermon) => {
  if (!sermon || !sermon.id)
    return false

  return isUserFavoriteSermon(sermon.id)
}

const onFavoriteSermonClicked = (sermon: Sermon) => {
  if(user.value == null)
    router.replace("/auth/log-in")
    
  if (!sermon || !sermon.id)
    return false
  toggleUserFavoriteSermon(sermon.id)
}
</script>

<style>

</style>