<template>
  <AppLayout>
    <div class="bible-reader-toolbar flex flex-row mb-4 sticky top-0 pt-4 pb-4 bg-slate-200"
      style="justify-content: center;">
      <select v-model="selectedBookId" class="border-b-[3px] border-solid bg-transparent border-slate-400 py-1 px-2">
        <option v-for="book of availableBooks" :value="book.id">
          {{book.name}}
        </option>
      </select>

      <select v-model="selectedChapterNumber"
        class="ml-3 border-b-[3px] border-solid bg-transparent border-slate-400 py-1 px-2">
        <option v-for="chapter of availableChapters[selectedBookId]" :value="chapter.number">
          {{chapter.number}}
        </option>
      </select>
    </div>
    <PageContent>
      <div class="max-w-prose mx-auto">
        <h2 class="text-2xl font-bold text-center mb-4">{{ selectedBook.name }}&nbsp;{{ selectedChapterNumber }}</h2>
      </div>
      <div class="bible-reader-content max-w-prose mx-auto leading-loose" v-html="loadedChapter"></div>
    </PageContent>
  </AppLayout>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import AppLayout from '../../components/templates/AppLayout.vue'
import PageContent from '../../components/templates/PageContent.vue'
import { getVerses } from '../../bible/services/BibleService'
import { computed, reactive } from '@vue/reactivity';
import { setLocalCacheItem, getLocalCacheItem } from '../../core/services/LocalStorageService'


export interface LocalBibleSelectionCache {
  selectedBookId: string
  selectedChapter: number
  selectedBibleId: string
}

const localCacheKeyLastLoadedChapter = '__scripture_alone_last_loaded_bible_info__'

const availableBooks = ref<any[]>([])
const availableChapters = ref<any>({})
const loadedChapter = ref('')
const selectedBibleId = ref('ENGKJV')
const selectedBookId = ref('JHN')
const selectedChapterNumber = ref(1)


const loadAvailableSelections = async () => {
  const BibleBooks = await import(`../../assets/bible/books.json`)
  const BibleBookChapters = await import(`../../assets/bible/chapters.json`)
  availableBooks.value = BibleBooks.default as any
  availableChapters.value = BibleBookChapters.data
}

const loadChapter = async () => {
  const response = await getVerses(selectedBibleId.value, selectedBookId.value, selectedChapterNumber.value)
  const chapterText = response.reduce((aggregate, verse, index) => {
    return aggregate + `<p class="verse"><span class="verse-number">${verse.verse_start_alt}</span> <span class="verse-text">${verse.verse_text}</span></p> `
  }, "")
  loadedChapter.value = chapterText

  await setLocalCacheItem(localCacheKeyLastLoadedChapter, {
    selectedBibleId: selectedBibleId.value || 'ENGKJV',
    selectedBookId: selectedBookId.value || 'JHN',
    selectedChapter: selectedChapterNumber.value || 1
  })
}



onMounted(async () => {

  const localCache: LocalBibleSelectionCache | null = await getLocalCacheItem(localCacheKeyLastLoadedChapter)

  if (localCache) {
    selectedBibleId.value = localCache.selectedBibleId
    selectedBookId.value = localCache.selectedBookId
    selectedChapterNumber.value = localCache.selectedChapter
  }

  // Register watchers after cache has been loaded 
  watch(selectedBookId, () => {
    if (selectedChapterNumber.value != 1)
      return selectedChapterNumber.value = 1
    loadChapter()
  })

  watch(selectedChapterNumber, () => {
    loadChapter()
  })

  loadAvailableSelections()
  loadChapter()
})

const selectedBook = computed(() => {
  const selectedBookItem = availableBooks.value.find(availableBook => availableBook.id === selectedBookId.value)
  if (selectedBookItem)
    return selectedBookItem

  return {}
})
</script>

<style>
.bible-reader-content>p {
  text-indent: 1.5em;
}

.bible-reader-content .wj {
  color: theme('colors.red.700');
}

.bible-reader-content .verse .verse-text {
  font-weight: normal;
}

.bible-reader-content .verse .verse-number {
  font-weight: 500;
  font-style: italic;
}
</style>