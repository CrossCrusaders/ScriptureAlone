<template>
  <AppLayout>
    <div class="bible-reader-toolbar flex flex-row mb-4 sticky top-0 pt-4 pb-4 gap-2 bg-slate-200"
      style="justify-content: center;">
      <AppSelect :model-value="selectedBookId" @update:model-value="onSelectedBookIdChanged">
        <option v-for="book of availableBooks" :value="book.bookId">
          {{ book.name }}
        </option>
      </AppSelect>

      <AppSelect :model-value="selectedChapterNumber" @update:model-value="onSelectedChapterNumberChanged">
        <option v-for="chapter of availableChapters" :value="chapter.chapterNumber">
          {{ chapter.chapterNumber }}
        </option>
      </AppSelect>

      <BibleTranslationSelect :model-value="selectedBibleTranslationId"
        @update:model-value="onSelectedBibleTranslationIdChanged">
      </BibleTranslationSelect>

    </div>
    <Transition name="popup">
      <div v-if="selectedBibleTranslationId != 'ENGKJV'" class="w-full fixed left-0 bottom-0">
        <RouterLink :to="PopUpLink">
          <div id="popup" class="w-full flex justify-center bg-gradient-to-r from-cyan-500 to-purple-500"
            style="align-items: center;">
            <div>
              <p class="p-4 text-white text-2xl md:text-5xl md:font-bold">{{ PopUpText }}</p>
            </div>
          </div>
        </RouterLink>
      </div>
    </Transition>
    <div class="w-full flex justify-center">
      <form class="w-full md:w-1/2 lg:w-1/3" @submit="handleSearchSubmit($event)">
        <div class="px-2">
          <AppInput type="input" name="query" v-model="searchModel" placeholder="Search The Scripture">
            <template v-slot:prefix>
              <Icon icon-name="magnify"></Icon>
            </template>
          </AppInput>
          <AppButton variant="primary-light" class="block w-full md:hidden mt-4" type="submit">Search</AppButton>
        </div>
      </form>
    </div>
    <PageContent>
      <div class="max-w-prose mx-auto">
        <h2 class="text-2xl font-bold text-center mb-4 h-14 flex align-middle">
          <AppButton @click="onPrevChapterButtonClicked" v-if="breakpoint == 'sm'" variant="primary-outline"
            style="float:left;" size="sm">
            <Icon icon-name="chevron-left"></Icon>
          </AppButton>
          <span class="m-auto">{{ selectedBook?.name }}&nbsp;{{ selectedChapterNumber }}</span>
          <AppButton @click="onNextChapterButtonClicked" v-if="breakpoint == 'sm'" variant="primary-outline"
            style="float:right;" size="sm">
            <Icon icon-name="chevron-right"></Icon>
          </AppButton>
        </h2>
      </div>
      <Spinner class="mx-auto" v-if="pageLoading"></Spinner>
      <div v-else class="bible-reader-content max-w-prose mx-auto leading-loose">
        <p v-for="verse in loadedChapterContent" @click="openMenu = true; menuVerse = verse;"
          :id="`verse-${verse.verseStart}`" :class="verse.css"><span class="verse-number">{{
            verse.verseStartAlt
          }}</span><span class="verse-text">{{ verse.verseText }}</span></p>
      </div>
    </PageContent>
    <div class="mb-8"></div>
  </AppLayout>
  <AppButton @click="onPrevChapterButtonClicked" v-if="breakpoint != 'sm'" variant="primary-outline"
    class="fixed top-1/2 left-1 md:left-16 xl:left-1/5 bg-white " size="sm">
    <Icon icon-name="chevron-left"></Icon>
  </AppButton>
  <AppButton @click="onNextChapterButtonClicked" v-if="breakpoint != 'sm'" variant="primary-outline"
    class="fixed top-1/2 right-1 md:right-16 xl:right-1/5 bg-white " size="sm">
    <Icon icon-name="chevron-right"></Icon>
  </AppButton>
  <p v-if="selectedBibleTranslationId != 'ENGKJV'" class="mb-28"></p>
  <AppModal v-model="openMenu" v-slot="{ close }">
    <div class="p-4 text-white flex flex-col gap-2">
      <div class="bg-slate-200 p-2 rounded text-black">
        <p class="font-bold">{{ menuVerse.book + " " + menuVerse.chapter + ":" + menuVerse.verseStart }}</p>
        <p>{{ menuVerse.verseText }}</p>
      </div>
      <button
        class="mx-auto bg-green-500 hover:bg-green-400 active:bg-green-600 transition-all p-2 rounded w-full md:w-1/2"
        @click="highlightVerse(menuVerse.book_id, menuVerse.chapter, menuVerse.verseStart)">Highlight Verse</button>
      <button
        class="mx-auto bg-cyan-500 hover:bg-cyan-400 active:bg-cyan-600 transition-all p-2 rounded w-full md:w-1/2"
        @click="copyString(menuVerse.book+' '+menuVerse.chapter+':'+menuVerse.verseStart+' - '+menuVerse.verseText)">Copy
        Verse</button>
    </div>
  </AppModal>
</template>

<script setup lang="ts">
import { useBreakpoint } from '../../browser/ViewportService'
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
import { computed } from '@vue/reactivity'
import { setLocalCacheItem, getLocalCacheItem } from '../../cache/services/LocalStorageService'
import Icon from '../../components/atoms/Icon.vue'
import AppButton from '../../components/atoms/form-controls/AppButton.vue'
import { BibleBook } from '../BibleBook'
import { BibleTranslation } from '../BibleTranslation'
import { useRoute, useRouter } from 'vue-router'
import AppSelect from '../../components/atoms/form-controls/AppSelect.vue'
import AppInput from '../../components/atoms/form-controls/AppInput.vue'
import AppModal from '../../components/templates/AppModal.vue'
import Spinner from '../../components/atoms/Spinner.vue'
import BibleTranslationSelect from '../../components/organisms/BibleTranslationSelect.vue'
import { isBibleReference, checkVersesForHighlight, highlightVerse } from '../../bible/services/BibleService'
import PocketBaseClient from '../../api/PocketBaseClient'

export interface BiblePageQueryParams {
  t?: string //translations
  c?: string //chapter
  b?: string // book
  vs?: string // verse-start
  ve?: string //verse-end
}
export interface LocalBibleSelectionCache {
  selectedBookId: string
  selectedChapter: number
  selectedBibleTranslationId: string
}

const { breakpoint } = useBreakpoint();

const localCacheKeyLastLoadedChapter = '__scripture_alone_last_loaded_bible_info__'

const availableBooks = ref<BibleBook[]>([])
const availableChapters = ref<BibleChapter[]>([])
const availableTranslations = ref<BibleTranslation[]>([])

const selectedBibleTranslationId = ref('ENGKJV')
const selectedBookId = ref('JHN')
const selectedChapterNumber = ref(1)

const loadedChapterContent = ref<any>([])
const pageLoading = ref(false)

const openMenu = ref(false);
const menuVerse = ref({ verseText: "", verseStart: "", book: "", chapter: "", book_id: "" });

let shouldHighlight = false
let highlightRange: number[] = []

const router = useRouter()
const route = useRoute()

const PopUpText = ref('');
const PopUpLink = ref('');

const selectedBook = computed(() => availableBooks.value.find(book => book.bookId === selectedBookId.value))
const selectedChapter = computed(() => {
  return availableChapters.value.find(chapter => chapter.chapterNumber == selectedChapterNumber.value)
})

/**
 * Query the API to download the text for a bible.
 */
const loadChapterContent = async () => {
  pageLoading.value = true
  try {
    const response = await getVerses(selectedBibleTranslationId.value, selectedBookId.value, selectedChapterNumber.value)
    var versesHighlights = await checkVersesForHighlight(response[0].book_id, response[0].chapter.toString());
    response.forEach((verse: any, index: number) => {
      versesHighlights.forEach((highlightVerse: any) => {
        if (verse.book_id + "." + verse.chapter + "." + verse.verse_start == `${highlightVerse.book_id}.${highlightVerse.chapter}.${highlightVerse.verse_number}`) {
          response[index].highlight = highlightVerse.color;
        }
      })
    })
    var chapterText = <any>[];
    response.forEach((verse: any) => {
      let verseCssClass = 'cursor-pointer hover:bg-slate-100 transition-all px-2 verse'
      if (shouldHighlight && highlightRange.length && verse.verse_start >= highlightRange[0] && verse.verse_start <= highlightRange[1]) {
        verseCssClass += ' verse-highlight'
      }
      if (verse.highlight) {
        verseCssClass += ` verse-highlighted-${verse.highlight}`;
      }
      let object = { book_id: verse.book_id, book: verse.book_name, chapter: verse.chapter, verseText: verse.verse_text, verseStart: verse.verse_start, verseStartAlt: verse.verse_start_alt, css: verseCssClass }
      chapterText.push(object);
    })

    loadedChapterContent.value = chapterText
    availableChapters.value = await getChaptersByBookId(selectedBookId.value)
    await setLocalCacheItem(localCacheKeyLastLoadedChapter, {
      selectedBibleTranslationId: selectedBibleTranslationId.value || 'ENGKJV',
      selectedBookId: selectedBookId.value || 'JHN',
      selectedChapter: selectedChapterNumber.value || 1
    })

    router.replace({ path: '/bible', query: { ...route.query, t: selectedBibleTranslationId.value, b: selectedBookId.value, c: selectedChapterNumber.value } })
    if (shouldHighlight)
      setTimeout(() => {
        document.querySelector(`#verse-${highlightRange[0]}`)?.scrollIntoView()
      }, 100)
    else
      window.scrollTo({ top: 0 })

    shouldHighlight = false
  }
  finally {
    pageLoading.value = false
  }
}

onMounted(async () => {
  var records = await PocketBaseClient.records.getFullList('truthResources', 200, { expand: "title", filter: "isPartOfPopups=true" })
  var max = records.length - 1;
  var min = 0;
  var recordNum = Math.round(Math.random() * (max - min) + min);
  PopUpText.value = records[recordNum].title;
  PopUpLink.value = "/truth-resources/" + records[recordNum].id;
  getNewVerses();
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

const onSelectedBookIdChanged = async (value: any) => {

  selectedBookId.value = value
  selectedChapterNumber.value = 1

  availableChapters.value = await getChaptersByBookId(selectedBookId.value)
  await loadChapterContent()
}

const onSelectedChapterNumberChanged = async (value: any) => {
  selectedChapterNumber.value = value
  await loadChapterContent()
}

const onSelectedBibleTranslationIdChanged = async (value: any) => {
  selectedBibleTranslationId.value = value
  await loadChapterContent()
}

const searchModel = ref("");
const handleSearchSubmit = async (event: Event) => {
  event.preventDefault();
  if (searchModel.value && searchModel.value.length) {
    const result = await isBibleReference(searchModel.value);
    if (result) {
      selectedBookId.value = result.book_id;
      selectedChapterNumber.value = result.chapter;

      window.scrollTo({ top: 0 })
      await router.replace(
        `/bible?t=${selectedBibleTranslationId.value}&c=${result.chapter}&b=${result.book_id}&vs=${result.verse_start}&ve=${result.verse_end}`
      );
      return getNewVerses();
    } else {
      return router.replace(
        `/bible/search?q=${encodeURI(
          searchModel.value.substring(0, 255)
        )}&t=${selectedBibleTranslationId.value}`
      );
    }
  }
};

async function getNewVerses() {
  const { t, b, c, vs, ve } = route.query as BiblePageQueryParams
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

  if (vs && ve) {
    shouldHighlight = true
    highlightRange = [parseInt(vs), ve ? parseInt(ve) : parseInt(vs)]
  }

  availableBooks.value = await getBooks()
  availableTranslations.value = await getTranslations()

  await loadChapterContent()
}

function copyString(str: string) {
  navigator.clipboard.writeText(str)
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

.verse {
  scroll-margin-top: 128px;
}

.verse-highlight {
  animation-name: highlightFade;
  animation-duration: 2s;
  animation-fill-mode: forwards;
  background-color: rgba(255, 255, 0, .4)
}

.verse-highlighted-green {
  background-color: rgba(0, 255, 0, .2)
}
.verse-highlighted-blue {
  background-color: rgba(0, 0, 255, .2)
}
.verse-highlighted-red {
  background-color: rgba(255, 0, 0, .2)
}
.verse-highlighted-pink {
  background-color: rgba(255, 0, 170, .2)
}
.verse-highlighted-yellow {
  background-color: rgba(217, 255, 0, .2)
}

@keyframes highlightFade {
  from {
    background-color: rgba(255, 255, 0, 1)
  }

  to {
    background-color: rgba(255, 255, 0, .2)
  }
}

#popup {
  height: 40vh;
}

.popup-enter-active {
  animation: popup 0.5s;
}

.popup-leave-active {
  animation: popup 0.5s reverse;
}

@keyframes popup {
  0% {
    transform: translateY(100%);
  }

  100% {
    transform: translateY(0%);
  }
}
</style>