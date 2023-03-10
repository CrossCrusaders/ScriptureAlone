<template>
    <ContentPreviewGrid :show-favorite="false" :content="loadedTruthResources"
      :button-title="'View Truth Resource'" @click:button="onTruthResourceCardClicked" @click:author="onTruthResourceAuthorClicked">
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
  import { TruthResource } from '../TruthResource';
  import Spinner from '../../components/atoms/Spinner.vue';
  import { Author } from '../../authors/Author';
  import { useAuth } from '../../auth/services/AuthService';
  
  import { getSearch } from '../../search/services/SearchServicess'
   
  export interface TruthResourcePreviewGridProps {
    queryParams?: any
    page?: number
    perPage?: number
    link?: string
    paginationControls?: boolean
    appendContent?: boolean
    query?: string | null
  }
  
  const props = withDefaults(defineProps<TruthResourcePreviewGridProps>(), {
    page: 1,
    perPage: 8,
    query: null
  })
  
  const loading = ref<boolean>(false)
  const loadedTruthResources = ref<ContentPreview[]>([])
  const router = useRouter()
  const emit = defineEmits([
    'click:button', // TODO: better name?
    'click:author',
    'page:change',
    'page:next',
    'page:previous',
    'data:loaded'
  ])

  const { user } = useAuth()
  
  const pagination = ref<Pagination | null>(null)
  
  const loadSearchedTruthResources = async (forceReset = false) => {
    if (pagination.value && pagination.value.totalPages === pagination.value.page && !forceReset) {
      loading.value = false
      return
    }
    loading.value = true
    try {
      const { items, ...paginationData } = await getSearch('truthResources', props.query || undefined, props.page, props.perPage, ["categories.label", "title", "description"], props.queryParams, true)
      if (props.appendContent && !forceReset) {
        loadedTruthResources.value = loadedTruthResources.value.concat(items as ContentPreview[])
      }
      else
      loadedTruthResources.value = items as ContentPreview[]
      pagination.value = paginationData
      emit('data:loaded', { items, ...paginationData })
    } finally {
      loading.value = false
    }
  }
  
  onMounted(async () => {
    loadSearchedTruthResources()
  
    // Initialize watch after initial load
    watch(() => props.page, (currentPage, prevPage) => {
      loading.value = true
      setTimeout(() => {
  
        loadSearchedTruthResources()
  
        if (currentPage > prevPage)
          emit('page:next')
        else if (currentPage < prevPage)
          emit('page:previous')
      }, 800)
    })
    watch(() => props.perPage, () => loadSearchedTruthResources())
    watch(() => props.queryParams, () => loadSearchedTruthResources())
  
    watch(() => props.query, (currentQuery, prevQuery) => {
      loadSearchedTruthResources(true)
    })
  
  })
  
  const onTruthResourceCardClicked = (truthResource: TruthResource) => {
    router.push(`/truth-resources/${truthResource.id}`)
    emit('click:button')
  }
  
  const onTruthResourceAuthorClicked = (author: Author) => {
    router.push(`/authors/${author.id}`)
    emit('click:author')
  }
</script>
  
<style>
  
</style>