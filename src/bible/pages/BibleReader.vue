<template>
  <AppLayout>
    <div class="bible-reader-toolbar flex flex-row mb-4 sticky top-0 pt-4 pb-4 bg-slate-200"
      style="justify-content: center;">
      <select :value="selectedBookId" @input="onSelectedBookIdChanged"
        class="active:outline-none focus:outline-none border-b-[3px] border-solid bg-transparent border-slate-400 py-1 px-2">
        <option v-for="book of availableBooks" :value="book.bookId">
          {{book.name}}
        </option>
      </select>

      <select :value="selectedChapterNumber" @input="onSelectedChapterNumberChanged"
        class="active:outline-none focus:outline-none ml-3 border-b-[3px] border-solid bg-transparent border-slate-400 py-1 px-2">
        <option v-for="chapter of availableChapters" :value="chapter.chapterNumber">
          {{chapter.chapterNumber}}
        </option>
      </select>

      <select :value="selectedBibleTranslationId" @input="onSelectedBibleTranslationIdChanged"
        class="active:outline-none focus:outline-none ml-3 border-b-[3px] border-solid bg-transparent border-slate-400 py-1 px-2">
        <option v-for="translation of availableTranslations" :value="translation.id">
          {{translation.abbreviation}}
        </option>
      </select>
    </div>
    <PageContent>
      <div class="max-w-prose mx-auto">
        <h2 class="text-2xl font-bold text-center mb-4">{{ selectedBook?.name }}&nbsp;{{ selectedChapterNumber }}
        </h2>
      </div>
      <div class="bible-reader-content max-w-prose mx-auto leading-loose" v-html="loadedChapterContent"></div>
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

import { onMounted, ref } from 'vue'
import AppLayout from '../../components/templates/AppLayout.vue'
import PageContent from '../../components/templates/PageContent.vue'
import {
  getBooks,
  getChaptersByBookId,
  getTranslations,
  getVerses,
  getPreviousChapterBySequenceNumber,
  getNextChapterBySequenceNumber
} from '../../bible/services/BibleService'
import { BibleChapter } from '../../bible/BibleChapter'
import { computed, reactive } from '@vue/reactivity'
import { setLocalCacheItem, getLocalCacheItem } from '../../cache/services/LocalStorageService'
import Icon from '../../components/atoms/Icon.vue'
import AppButton from '../../components/atoms/form-controls/AppButton.vue'
import { BibleBook } from '../BibleBook'
import { BibleTranslation } from '../BibleTranslation'
import { useRoute, useRouter } from 'vue-router'


export interface BiblePageQueryParams {
  t?: string //translations
  c?: string //chapter
  b?: string // book
}
export interface LocalBibleSelectionCache {
  selectedBookId: string
  selectedChapter: number
  selectedBibleTranslationId: string
}

const localCacheKeyLastLoadedChapter = '__scripture_alone_last_loaded_bible_info__'

const availableBooks = ref<BibleBook[]>([])
const availableChapters = ref<BibleChapter[]>([])
const availableTranslations = ref<BibleTranslation[]>([])

const selectedBibleTranslationId = ref('ENGKJV')
const selectedBookId = ref('JHN')
const selectedChapterNumber = ref(1)

const loadedChapterContent = ref('')

const router = useRouter()
const route = useRoute()

const selectedBook = computed(() => availableBooks.value.find(book => book.bookId === selectedBookId.value))
const selectedChapter = computed(() => {
  return availableChapters.value.find(chapter => chapter.chapterNumber == selectedChapterNumber.value)
})

/**
 * Query the API to download the text for a bible.
 */
const loadChapterContent = async () => {
  const response = await getVerses(selectedBibleTranslationId.value, selectedBookId.value, selectedChapterNumber.value)
  const chapterText = response.reduce((aggregate, verse) => {
    return aggregate + `<p class="verse"><span class="verse-number">${verse.verse_start_alt}</span> <span class="verse-text">${verse.verse_text}</span></p> `
  }, "")
  loadedChapterContent.value = chapterText
  availableChapters.value = await getChaptersByBookId(selectedBookId.value)
  await setLocalCacheItem(localCacheKeyLastLoadedChapter, {
    selectedBibleTranslationId: selectedBibleTranslationId.value || 'ENGKJV',
    selectedBookId: selectedBookId.value || 'JHN',
    selectedChapter: selectedChapterNumber.value || 1
  })

  router.replace({ path: '/bible', query: { t: selectedBibleTranslationId.value, b: selectedBookId.value, c: selectedChapterNumber.value } })

  window.scrollTo({ top: 0 })
}



onMounted(async () => {
  const { t, b, c } = route.query as BiblePageQueryParams
  const localCache: LocalBibleSelectionCache | null = await getLocalCacheItem(localCacheKeyLastLoadedChapter)

  if (t && b && c) {
    selectedBibleTranslationId.value = t || selectedBibleTranslationId.value
    selectedBookId.value = b || selectedBookId.value
    selectedChapterNumber.value = parseInt(c) || selectedChapterNumber.value
  }
  else if (localCache) {
    selectedBibleTranslationId.value = localCache.selectedBibleTranslationId || selectedBibleTranslationId.value
    selectedBookId.value = localCache.selectedBookId || selectedBookId.value
    selectedChapterNumber.value = localCache.selectedChapter || selectedChapterNumber.value
  }

  availableBooks.value = await getBooks()
  availableTranslations.value = await getTranslations()

  await loadChapterContent()
})

// Event Handlers 

const onNextChapterButtonClicked = async () => {

  if (!selectedChapter.value)
    return
  const currentChapterSequence = selectedChapter.value.sequenceNumber
  const nextData: BibleChapter = await getNextChapterBySequenceNumber(currentChapterSequence)
  if (!nextData)
    return
  selectedBookId.value = nextData.bookId
  selectedChapterNumber.value = nextData.chapterNumber
  await loadChapterContent()
}

const onPrevChapterButtonClicked = async () => {
  if (!selectedChapter.value)
    return

  const currentChapterSequence = selectedChapter.value.sequenceNumber
  const nextData: BibleChapter = await getPreviousChapterBySequenceNumber(currentChapterSequence)
  if (!nextData)
    return

  selectedBookId.value = nextData.bookId
  selectedChapterNumber.value = nextData.chapterNumber
  await loadChapterContent()
}

const onSelectedBookIdChanged = async (evt: any) => {
  const { value } = evt.target

  selectedBookId.value = value
  selectedChapterNumber.value = 1

  availableChapters.value = await getChaptersByBookId(selectedBookId.value)
  await loadChapterContent()
}

const onSelectedChapterNumberChanged = async (evt: any) => {
  const { value } = evt.target
  selectedChapterNumber.value = value
  await loadChapterContent()
}

const onSelectedBibleTranslationIdChanged = async (evt: any) => {
  const { value } = evt.target
  selectedBibleTranslationId.value = value
  await loadChapterContent()
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