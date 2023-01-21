<template>
    <ContentPreviewGrid :show-favorite="false" :content="loadedNotes"
      :button-title="'Edit/View Note'" @click:button="onNoteCardClicked">
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
  import { Note } from '../Note';
  import Spinner from '../../components/atoms/Spinner.vue';
  
  import { getSearch } from '../../search/services/searchService'
   
  export interface NotesPreviewGridProps {
    queryParams?: any
    page?: number
    perPage?: number
    link?: string
    paginationControls?: boolean
    appendContent?: boolean
    query?: string | null
  }
  
  const props = withDefaults(defineProps<NotesPreviewGridProps>(), {
    page: 1,
    perPage: 8,
    query: null
  })
  
  const loading = ref<boolean>(false)
  const loadedNotes = ref<ContentPreview[]>([])
  const router = useRouter()
  const emit = defineEmits([
    'click:button', // TODO: better name?
    'click:author',
    'page:change',
    'page:next',
    'page:previous',
    'data:loaded'
  ])
  
  const pagination = ref<Pagination | null>(null)
  
  const loadSearchedNotes = async (forceReset = false) => {
    if (pagination.value && pagination.value.totalPages === pagination.value.page && !forceReset) {
      loading.value = false
      return
    }
    loading.value = true
    try {
      const { items, ...paginationData } = await getSearch('notes', props.query || undefined, props.page, props.perPage, ["title", "text"], props.queryParams, true)
      if (props.appendContent && !forceReset) {
        loadedNotes.value = loadedNotes.value.concat(items as ContentPreview[])
      }
      else
      loadedNotes.value = items as ContentPreview[]
      pagination.value = paginationData
      emit('data:loaded', { items, ...paginationData })
    } finally {
      loading.value = false
    }
  }
  
  onMounted(async () => {
    loadSearchedNotes()
  
    // Initialize watch after initial load
    watch(() => props.page, (currentPage, prevPage) => {
      loading.value = true
      setTimeout(() => {
  
        loadSearchedNotes()
  
        if (currentPage > prevPage)
          emit('page:next')
        else if (currentPage < prevPage)
          emit('page:previous')
      }, 800)
    })
    watch(() => props.perPage, () => loadSearchedNotes())
    watch(() => props.queryParams, () => loadSearchedNotes())
  
    watch(() => props.query, (currentQuery, prevQuery) => {
      loadSearchedNotes(true)
    })
  
  })
  
  const onNoteCardClicked = (note: Note) => {
    router.push(`/notes/${note.id}`)
    emit('click:button')
  }
</script>
  
<style>
  
</style>