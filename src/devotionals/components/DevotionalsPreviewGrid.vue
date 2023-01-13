<template>
  <ContentPreviewGrid :show-favorite="true" :is-favorite="isFavoriteDevotional" :content="loadedDevotionals"
    :button-title="'View Devotional'" @click:button="onDevotionalCardClicked" @click:author="onDevotionalAuthorClicked"
    @click:favorite="onFavoriteDevotionalClicked($event)">
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
import { Devotional } from '../Devotional';
import Spinner from '../../components/atoms/Spinner.vue';
import { Author } from '../../authors/Author';
import { useUserFavorites } from '../../user/services/UserService';
import { useAuth } from '../../auth/services/AuthService';

import { getSearch } from '../../search/services/searchService'
import { string32 } from 'pdfjs-dist/types/src/shared/util';
 
export interface DevotionalsPreviewGridProps {
  queryParams?: any
  page?: number
  perPage?: number
  link?: string
  paginationControls?: boolean
  appendContent?: boolean
  query?: string | null,
  minDate: string,
  maxDate: string
}

const props = withDefaults(defineProps<DevotionalsPreviewGridProps>(), {
  page: 1,
  perPage: 8,
  query: null,
  minDate: "2010-01-01",
  maxDate: (new Date()).getFullYear().toString()
})

const loading = ref<boolean>(false)
const loadedDevotionals = ref<ContentPreview[]>([])
const router = useRouter()
const emit = defineEmits([
  'click:button', // TODO: better name?
  'click:author',
  'page:change',
  'page:next',
  'page:previous',
  'data:loaded'
])

const { loadFavorites, isUserFavoriteDevotional, toggleUserFavoriteDevotional } = useUserFavorites()
const { user } = useAuth()

const pagination = ref<Pagination | null>(null)

const loadSearchedDevotionals = async (forceReset = false) => {
  if (pagination.value && pagination.value.totalPages === pagination.value.page && !forceReset) {
    loading.value = false
    return
  }
  loading.value = true
  try {
    const { items, ...paginationData } = await getSearch('devotionals', props.query || undefined, props.page, props.perPage, { filter: `devotionalDate >= "${props.minDate}" && devotionalDate <= "${props.maxDate}"` }, true)
    if (props.appendContent && !forceReset) {
      loadedDevotionals.value = loadedDevotionals.value.concat(items as ContentPreview[])
    }
    else
      loadedDevotionals.value = items as ContentPreview[]
    pagination.value = paginationData
    emit('data:loaded', { items, ...paginationData })
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  loadSearchedDevotionals()

  // Initialize watch after initial load
  watch(() => props.page, (currentPage, prevPage) => {
    loading.value = true
    setTimeout(() => {

      loadSearchedDevotionals()

      if (currentPage > prevPage)
        emit('page:next')
      else if (currentPage < prevPage)
        emit('page:previous')
    }, 800)
  })
  watch(() => props.perPage, () => loadSearchedDevotionals())
  watch(() => props.queryParams, () => loadSearchedDevotionals())

  watch(() => props.query, (currentQuery, prevQuery) => {
    loadSearchedDevotionals(true)
  })

  watch(() => props.maxDate, (currentMaxDate) => {
    loading.value = true
    setTimeout(() => {
      loadSearchedDevotionals(true);
    }, 800)
  })
  watch(() => props.minDate, (currentMinDate) => {
    loading.value = true
    setTimeout(() => {
      loadSearchedDevotionals(true);
    }, 800)
  })

  await loadFavorites()
})


const onDevotionalCardClicked = (devotional: Devotional) => {
  router.push(`/devotionals/${devotional.id}`)
  emit('click:button')
}

const onDevotionalAuthorClicked = (author: Author) => {
  router.push(`/authors/${author.id}`)
  emit('click:author')
}

const isFavoriteDevotional = (devotional: Devotional) => {
  if(user.value == null)
    return false
   
  if (!devotional || !devotional.id)
    return false

  return isUserFavoriteDevotional(devotional.id)
}

const onFavoriteDevotionalClicked = (devotional: Devotional) => {
  if(user.value == null)
    router.replace("/auth/log-in")

  if (!devotional || !devotional.id)
    return false
  toggleUserFavoriteDevotional(devotional.id)
}
</script>

<style>

</style>