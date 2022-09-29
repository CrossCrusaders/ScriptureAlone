<template>
  <AppLayout>
    <div class="bible-reader-toolbar flex flex-row mb-4 sticky top-0 pt-4 pb-4 bg-slate-200"
      style="justify-content: center;">
      <select v-model="selectedBookId"
        class="active:outline-none focus:outline-none border-b-[3px] border-solid bg-transparent border-slate-400 py-1 px-2">
        <option v-for="book of availableBooks" :value="book.id">
          {{book.name}}
        </option>
      </select>

      <select v-model="selectedChapterNumber"
        class="active:outline-none focus:outline-none ml-3 border-b-[3px] border-solid bg-transparent border-slate-400 py-1 px-2">
        <option v-for="chapter of availableChapters[selectedBookId]" :value="chapter.number">
          {{chapter.number}}
        </option>
      </select>

      <select v-model="selectedBibleTranslationId"
        class="active:outline-none focus:outline-none ml-3 border-b-[3px] border-solid bg-transparent border-slate-400 py-1 px-2">
        <option v-for="translation of availableTranslations" :value="translation.id">
          {{translation.abbreviation}}
        </option>
      </select>
    </div>
    <PageContent>
      <div class="max-w-prose mx-auto">
        <h2 class="text-2xl font-bold text-center mb-4">{{ selectedBook.book?.name }}&nbsp;{{ selectedChapterNumber }}
        </h2>
      </div>
      <div class="bible-reader-content max-w-prose mx-auto leading-loose" v-html="loadedChapter"></div>
    </PageContent>
    <div class="mb-8"></div>
  </AppLayout>
  <AppButton @click="onPrevChapterButtonClicked" variant="primary-outline"
    class="fixed top-1/2 left-1 md:left-16 xl:left-1/4 bg-white " size="sm">
    <Icon icon-name="chevron-left"></Icon>
  </AppButton>
  <AppButton @click="onNextChapterButtonClicked" variant="primary-outline"
    class="fixed top-1/2 right-1 md:right-16 xl:right-1/4 bg-white " size="sm">
    <Icon icon-name="chevron-right"></Icon>
  </AppButton>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import AppLayout from '../../components/templates/AppLayout.vue'
import PageContent from '../../components/templates/PageContent.vue'
import { getVerses } from '../../bible/services/BibleService'
import { computed, reactive } from '@vue/reactivity'
import { setLocalCacheItem, getLocalCacheItem } from '../../core/services/LocalStorageService'
import Icon from '../../components/atoms/Icon.vue'
import AppButton from '../../components/atoms/form-controls/AppButton.vue'


export interface LocalBibleSelectionCache {
  selectedBookId: string
  selectedChapter: number
  selectedBibleTranslationId: string
}

const localCacheKeyLastLoadedChapter = '__scripture_alone_last_loaded_bible_info__'

const availableTranslations = ref<any[]>([])
const availableBooks = ref<any[]>([])
const availableChapters = ref<any>({})
const loadedChapter = ref('')
const selectedBibleTranslationId = ref('ENGKJV')
const selectedBookId = ref('JHN')
const selectedChapterNumber = ref(1)

/**
 * Gather all of the JSON data for the bible 
 * translations, books and chapters
 */
const loadAvailableSelections = async () => {
  const BibleTranslations = await import(`../../assets/bible/bibles.json`)
  const BibleBooks = await import(`../../assets/bible/books.json`)
  const BibleBookChapters = await import(`../../assets/bible/chapters.json`)
  availableBooks.value = BibleBooks.default as any
  availableChapters.value = BibleBookChapters.data
  availableTranslations.value = BibleTranslations.default
}

/**
 * Query the API to download the text for a bible.
 */
const loadChapter = async () => {
  const response = await getVerses(selectedBibleTranslationId.value, selectedBookId.value, selectedChapterNumber.value)
  const chapterText = response.reduce((aggregate, verse, index) => {
    return aggregate + `<p class="verse"><span class="verse-number">${verse.verse_start_alt}</span> <span class="verse-text">${verse.verse_text}</span></p> `
  }, "")
  loadedChapter.value = chapterText

  await setLocalCacheItem(localCacheKeyLastLoadedChapter, {
    selectedBibleTranslationId: selectedBibleTranslationId.value || 'ENGKJV',
    selectedBookId: selectedBookId.value || 'JHN',
    selectedChapter: selectedChapterNumber.value || 1
  })

  window.scrollTo({ top: 0 })
}



onMounted(async () => {

  // 1. Load available bible information
  loadAvailableSelections()

  // 2. Load any local user cache data
  const localCache: LocalBibleSelectionCache | null = await getLocalCacheItem(localCacheKeyLastLoadedChapter)
  if (localCache) {
    selectedBibleTranslationId.value = localCache.selectedBibleTranslationId || selectedBibleTranslationId.value
    selectedBookId.value = localCache.selectedBookId || selectedBookId.value
    selectedChapterNumber.value = localCache.selectedChapter || selectedChapterNumber.value
  }

  // 3. Register watchers after cache has been loaded
  watch(selectedBookId, () => {
    if (selectedChapterNumber.value != 1)
      return selectedChapterNumber.value = 1
    loadChapter()
  })

  watch([selectedChapterNumber, selectedBibleTranslationId], () => {
    loadChapter()
  })

  // 4. Request the chapter text for the current selected chapter
  loadChapter()
})

const selectedBook = computed(() => {
  const selectedBookItemIndex = availableBooks.value.findIndex(availableBook => availableBook.id === selectedBookId.value)

  if (selectedBookItemIndex > -1)
    return { book: availableBooks.value[selectedBookItemIndex], index: selectedBookItemIndex }

  return { book: {}, index: 0 }
})

const onNextChapterButtonClicked = () => {
  const { book, index } = selectedBook.value
  const currentChapter = selectedChapterNumber.value

  const availableBookChapters = availableChapters.value[selectedBookId.value] as any[]

  if (currentChapter >= availableBookChapters.length) {

    selectedBookId.value = availableBooks.value[index + 1].id
  }
  else {
    selectedChapterNumber.value = parseInt(selectedChapterNumber.value as any) + 1
    return
  }
}

const onPrevChapterButtonClicked = () => {
  const { book, index } = selectedBook.value
  const currentChapter = selectedChapterNumber.value

  const availableBookChapters = availableChapters.value[selectedBookId.value] as any[]

  if (currentChapter <= 1) {
    selectedBookId.value = availableBooks.value[index - 1].id
    selectedChapterNumber.value = availableChapters.value[selectedBookId.value].length - 1
  }
  else {
    selectedChapterNumber.value = parseInt(selectedChapterNumber.value as any) - 1
    return
  }
}

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