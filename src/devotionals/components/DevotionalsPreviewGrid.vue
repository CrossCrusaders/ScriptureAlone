<template>
  <div class="flex justify-center" v-if="props.showSpinnerWhileLoading && loading">
    <Spinner color="slate-800"></Spinner>
  </div>
  <ContentPreviewGrid :show-favorite="!!user" :is-favorite="isFavoriteDevotional" v-else :content="loadedDevotionals"
    :button-title="'View Devotional'" @click:button="onDevotionalCardClicked($event)"
    @click:favorite="onFavoriteClicked" @click:author="onDevotionalAuthorClicked">
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

import { searchDevotionals } from '../services/DevotionalService'
import Spinner from '../../components/atoms/Spinner.vue';
import { Devotional } from '../Devotional';
import { Author } from '../../authors/Author';
import { useUserFavorites } from '../../user/services/UserService';
import { useAuth } from '../../auth/services/AuthService';

export interface DevotionalsPreviewGridProps {
  queryParams?: any
  page?: number
  perPage?: number
  link?: string
  paginationControls?: boolean
  appendContent?: boolean
  query?: string | null
  showSpinnerWhileLoading?: boolean
}

const props = withDefaults(defineProps<DevotionalsPreviewGridProps>(), {
  page: 1,
  perPage: 8,
  query: null
})

const { loadFavorites, toggleUserFavoriteDevotional, isUserFavoriteDevotional } = useUserFavorites()
const { user } = useAuth()

const loading = ref<boolean>(false)
const loadedDevotionals = ref<ContentPreview[]>([])
const router = useRouter()
const emit = defineEmits([
  'click:button', // TODO: better name?
  'page:change',
  'page:next',
  'page:previous',
  'data:loaded'
])

const pagination = ref<Pagination | null>(null)

const loadSearchedDevotionals = async (forceReset = false) => {
  // if (pagination.value && pagination.value.totalPages === pagination.value.page && !forceReset) {
  //   loading.value = false
  //   return
  // }
  loading.value = true
  try {
    const { items, ...paginationData } = await searchDevotionals(props.query, props.page, props.perPage, props.queryParams)
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
    }, 500)
  })
  watch(() => props.perPage, () => loadSearchedDevotionals())
  watch(() => props.queryParams, () => loadSearchedDevotionals())

  watch(() => props.query, (currentQuery, prevQuery) => {
    loadSearchedDevotionals(true)
  })
  await loadFavorites()
})


const onDevotionalCardClicked = (devotional: Devotional) => {
  router.push(`/devotionals/${devotional.id}`)
  emit('click:button')
}

const onDevotionalAuthorClicked = (author: Author) => {
  router.push(`/authors/${author.id}`)
}

const isFavoriteDevotional = (devotional: Devotional) => {
  if (!devotional || !devotional.id)
    return false

  return isUserFavoriteDevotional(devotional.id)
}


const onFavoriteClicked = (devotional: Devotional) => {
  if (!devotional || !devotional.id)
    return false

  return toggleUserFavoriteDevotional(devotional.id)
}

</script>

<style>

</style>