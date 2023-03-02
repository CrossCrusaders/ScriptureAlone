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
    </div>
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
        <h2 class="text-center mb-4 h-14 flex align-middle">
          <AppButton @click="onPrevChapterButtonClicked" v-if="breakpoint == 'sm'" variant="primary-outline"
            class="float-left;" size="sm">
            <img src="/mdi/chevron-left.svg" class="my-1 prev-next-button" />
          </AppButton>
          <span class="m-auto text-2xl font-bold">{{ selectedBook?.name }}&nbsp;{{ selectedChapterNumber }}</span>
          <AppButton @click="onNextChapterButtonClicked" v-if="breakpoint == 'sm'" variant="primary-outline"
            class="float-right;" size="sm">
            <img src="/mdi/chevron-right.svg" class="my-1 prev-next-button" />
          </AppButton>
        </h2>
      </div>
      <Spinner class="mx-auto" v-if="pageLoading"></Spinner>
      <div v-else class="bible-reader-content max-w-prose mx-auto leading-loose">
        <p v-for="verse in loadedChapterContent"
          v-touch:longtap="() => { onVerseClicked(verse.verse_start, true); menuVerse = verse; openMenu = true; }"
          v-touch:tap="() => onVerseClicked(verse.verse_start)" :id="`verse-${verse.verse_start}`" :class="verse.css">
          <span class="verse-number">{{
            verse.verse_start_alt
          }}</span><span class="verse-text">
            <span v-for="word in verse.verse_text_array">
              <button @click="handleOpenWordModal(getWordFromPastTense(word.split('|')[1]), verse.verse_start)"
                :to="`/websters/${getWordFromPastTense(word.split('|')[1])}`" v-if="word.includes('|')"
                class="underline ml-1 font-bold text-slate-500 hover:text-gray-500 transition-all">{{ word.split('|')[1] }}
              </button>
              <span v-else>{{ " " + word }}</span>
            </span>
          </span>
        </p>
      </div>
    </PageContent>
    <div class="mb-8"></div>
  </AppLayout>
  <AppButton @click="onPrevChapterButtonClicked" v-if="breakpoint != 'sm'" variant="primary-outline"
    class="fixed top-1/2 left-1 md:left-16 xl:left-1/5 bg-white " size="sm">
    <img src="/mdi/chevron-left.svg" class="my-1 prev-next-button" />
  </AppButton>
  <AppButton @click="onNextChapterButtonClicked" v-if="breakpoint != 'sm'" variant="primary-outline"
    class="fixed top-1/2 right-1 md:right-16 xl:right-1/5 bg-white " size="sm">
    <img src="/mdi/chevron-right.svg" class="my-1 prev-next-button" />
  </AppButton>
  <AppModal v-model="openMenu" v-slot="{ close }">
    <div class="p-4 text-white flex flex-col gap-2" style="text-align:center;">
      <div class="bg-slate-200 p-2 rounded text-black">
        <p class="font-bold">{{ menuVerse.book_name_alt + " " + menuVerse.chapter + ":" + menuVerse.verse_start }}</p>
        <p>{{ menuVerse.verse_text }}</p>
      </div>
      <div v-if="notesVerseIsIn.length" class="w-full flex flex-col justify-center">
        <div class="flex flex-row justify-center align-center">
          <Icon :size="20" icon-name="note" class="text-black"></Icon>
          <p class="font-bold text-lg underline text-slate-800 mb-1">Notes on This Verse:</p>
        </div>
        <div class="flex flex-col gap-2">
          <div v-for="note in notesVerseIsIn">
            <RouterLink :to="`/note/${note.id}`"><button
                class="mx-auto bg-gray-200 hover:bg-gray-100 active:bg-gray-300 transition-all p-2 rounded w-full md:w-1/2 text-black"
                @click="">{{ note.title }}</button></RouterLink>
          </div>
        </div>
      </div>
      <div class="w-full flex flex-col justify-center">
        <div class="flex flex-row justify-center align-center">
          <Icon :size="20" icon-name="pencil" class="text-black"></Icon>
          <p class="font-bold text-lg underline text-slate-800 mb-1">Highlight Selected Verses:</p>
        </div>
        <div class="flex flex-row gap-2 justify-center">
          <button class="border-black border-2 rounded w-10 h-10 md:w-16 md:h-16"
            @click="handleHighlightVerse('none')"></button>
          <button class="verse-highlighted-green rounded w-10 h-10 md:w-16 md:h-16"
            @click="handleHighlightVerse('green')"></button>
          <button class="verse-highlighted-red rounded w-10 h-10 md:w-16 md:h-16"
            @click="handleHighlightVerse('red')"></button>
          <button class="verse-highlighted-blue rounded w-10 h-10 md:w-16 md:h-16"
            @click="handleHighlightVerse('blue')"></button>
          <button class="verse-highlighted-yellow rounded w-10 h-10 md:w-16 md:h-16"
            @click="handleHighlightVerse('yellow')"></button>
          <button class="verse-highlighted-pink rounded w-10 h-10 md:w-16 md:h-16"
            @click="handleHighlightVerse('pink')"></button>
        </div>
      </div>
      <button class="mx-auto bg-cyan-500 hover:bg-cyan-400 active:bg-cyan-600 transition-all p-2 rounded w-full md:w-1/2"
        @click="copyString(menuVerse.book_name_alt + ' ' + menuVerse.chapter + ':' + menuVerse.verse_start + ' - ' + menuVerse.verse_text)">Copy
        Verse</button>
      <button
        class="mx-auto bg-yellow-500 hover:bg-yellow-400 active:bg-yellow-600 transition-all p-2 rounded w-full md:w-1/2"
        @click="noteModal = true">Add Note</button>
    </div>
  </AppModal>
  <AppModal v-model="noteModal" v-slot="{ close }">
    <div class="p-4 text-white flex flex-col gap-2" style="text-align:center;">
      <div class="bg-slate-200 rounded text-black">
        <input v-model="noteTitle" placeholder="Note Title" class="text-black w-full h-full p-2 bg-slate-200 rounded" />
      </div>
      <div class="w-full flex flex-col justify-center">
        <textarea v-model="noteText" class="text-black bg-slate-100 rounded p-1 h-64"></textarea>
      </div>
      <button class="mx-auto bg-cyan-500 hover:bg-cyan-400 active:bg-cyan-600 transition-all p-2 rounded w-full md:w-1/2"
        @click="createNote(selectedBookId, selectedChapterNumber, selectedVerses, noteTitle, noteText); noteTitle = ''; noteText = ''; noteModal = false">Add</button>
    </div>
  </AppModal>
  <AppModal v-model="wordDefModal" v-slot="{ close }">
    <div class="px-4 pb-4 text-white flex flex-col gap-2" style="text-align:center;">
      <div>
        <p class="font-bold text-2xl text-black">{{ wordDef?.word }}</p>
        <p class="font-bold text-black">{{ wordDef?.pronunciation }}</p>
      </div>
      <div class="bg-slate-200 p-2 rounded text-black">
        <p class="font-bold">{{ wordDef?.definition.type }}</p>
        <p>{{ wordDef?.definition.text }}</p>
      </div>
    </div>
  </AppModal>
</template>

<script setup lang="ts">
import { useBreakpoint } from '../../browser/ViewportService'
import { onMounted, ref, watch } from 'vue'
import AppLayout from '../../components/templates/AppLayout.vue'
import PageContent from '../../components/templates/PageContent.vue'
import {
  getBooks,
  getChaptersByBookId,
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
import { useRoute, useRouter } from 'vue-router'
import AppSelect from '../../components/atoms/form-controls/AppSelect.vue'
import AppInput from '../../components/atoms/form-controls/AppInput.vue'
import AppModal from '../../components/templates/AppModal.vue'
import Spinner from '../../components/atoms/Spinner.vue'
import { isBibleReference, getHighlightedVerses, highlightVerses } from '../../bible/services/BibleService'
import { createNote, getAllNotesInChapter } from '../../notes/services/NoteService'
import { Word } from '../../websters/Word'
import { getWord } from '../../websters/service/WebstersService'

export interface BiblePageQueryParams {
  c?: string //chapter
  b?: string // book
  vs?: string // verse-start
  ve?: string //verse-end
}
export interface LocalBibleSelectionCache {
  selectedBookId: string
  selectedChapter: number
}

const { breakpoint } = useBreakpoint();

const localCacheKeyLastLoadedChapter = '__scripture_alone_last_loaded_bible_info__'

const availableBooks = ref<BibleBook[]>([])
const availableChapters = ref<BibleChapter[]>([])

const selectedBookId = ref('JHN')
const selectedChapterNumber = ref(1)
const selectedVerses = ref<any[]>([]);

const loadedChapterContent = ref<any>([])
const pageLoading = ref(false)

const openMenu = ref(false);
const menuVerse = ref({ verse_text: "", verse_start: "", book_name_alt: "", book_name: "", chapter: "", book_id: "" });
const noteTitle = ref("");
const noteText = ref("");
const noteModal = ref(false);
const wordDefModal = ref(false);
const wordDef = ref<Word>();
const availableNotes = ref<any[]>([]);
const notesVerseIsIn = ref<any[]>([]);

let shouldHighlight = false
let highlightRange: number[] = []

const router = useRouter()
const route = useRoute()

const platform = ref("");
const connectedToWifi = ref({ connected: false });

const selectedBook = computed(() => availableBooks.value.find((book: any) => book.bookId === selectedBookId.value))
const selectedChapter = computed(() => {
  return availableChapters.value.find((chapter: any) => chapter.chapterNumber == selectedChapterNumber.value)
})

const WebstersWords = ref<any[]>([]);

/**
 * Query the API to download the text for a bible.
 */
const loadChapterContent = async () => {
  loadedChapterContent.value = [];
  pageLoading.value = true
  try {
    const response = await getVerses(selectedBookId.value, selectedChapterNumber.value)
    var versesHighlights: any;
    var chapterText: any[] = [];
    if ((connectedToWifi.value && connectedToWifi.value.connected)) {
      versesHighlights = await getHighlightedVerses(response[0].book_id, response[0].chapter.toString());
    }
    response.forEach((verse: any) => {
      var tempVerseText: any = [];

      let verseCssClass = 'cursor-pointer transition-all px-2 verse'
      if (shouldHighlight && highlightRange.length && verse.verse_start >= highlightRange[0] && verse.verse_start <= highlightRange[1]) {
        verseCssClass += ' verse-highlight'
      }
      console.log(verse)
      if (typeof verse.verse_start === 'string' || verse.verse_start instanceof String)
        tempVerseText = verse.verse_text.split(" ");
      tempVerseText.forEach((word: string, index: number) => {
        if (WebstersWords.value.includes(word) || WebstersWords.value.includes((word.charAt(0).toUpperCase() + word.slice(1)).slice(0, word.length - 1))) {
          tempVerseText[index] = (`|${word}`);
        }
        if (index == tempVerseText.length - 1)
          verse.verse_text_array = tempVerseText;
      });

      var highlightColor = "";
      if (versesHighlights) {
        versesHighlights.verse_data.forEach((highlightVerse: any) => {
          if (verse.verse_start == highlightVerse.verse) {
            verseCssClass += ` verse-highlighted-${highlightVerse.color}`;
            highlightColor = highlightVerse.color;
          }
        })
      }

      let object = { ...verse, css: verseCssClass, highlight: highlightColor || "" }
      chapterText.push(object);
    })

    loadedChapterContent.value = chapterText
    availableChapters.value = await getChaptersByBookId(selectedBookId.value)
    await setLocalCacheItem(localCacheKeyLastLoadedChapter, {
      selectedBookId: selectedBookId.value || 'JHN',
      selectedChapter: selectedChapterNumber.value || 1
    }, true)
    console.log(loadedChapterContent.value)
    router.replace({ path: '/bible', query: { ...route.query, b: selectedBookId.value, c: selectedChapterNumber.value } })
    if (shouldHighlight)
      setTimeout(() => {
        document.querySelector(`#verse-${highlightRange[0]}`)?.scrollIntoView()
      }, 100)
    else
      window.scrollTo({ top: 0 })

    shouldHighlight = false;
    if ((connectedToWifi.value && connectedToWifi.value.connected) || platform.value == "web")
      availableNotes.value = await getAllNotesInChapter(selectedBookId.value, selectedChapterNumber.value);
  }
  catch (err) {
    console.log(err)
  }
  pageLoading.value = false
}

onMounted(async () => {
  WebstersWords.value = (await import("../../assets/websters/words.json")).default;
  connectedToWifi.value = await getLocalCacheItem("__network_status__", true);
  platform.value = await getLocalCacheItem("__platform__", false);
  await getNewVerses();
  watch(() => openMenu.value, () => {
    if (openMenu.value) {
      availableNotes.value.forEach((note) => {
        note.verses.forEach((verse: any) => {
          if (verse[0].verse_start == menuVerse.value.verse_start) {
            notesVerseIsIn.value.push(note);
          }
        });
      });
    }
    else {
      notesVerseIsIn.value = [];
    }
  });
})

function getWordFromPastTense(word: string) {
  return WebstersWords.value.includes(word) ? word.toLowerCase() : word.slice(0, word.length - 1).toLowerCase()
}

// Event Handlers

async function handleOpenWordModal(word: string, verse: number) {
  console.log(word)
  await onVerseClicked(verse)
  wordDef.value = await getWord(word.toLowerCase());
  wordDefModal.value = true;
}

const onNextChapterButtonClicked = async () => {
  if (pageLoading.value)
    return
  if (!selectedChapter.value)
    return
  const currentChapterSequence = selectedChapter.value.sequenceNumber
  const nextData: BibleChapter = await getNextChapterBySequenceNumber(currentChapterSequence)
  if (!nextData)
    return
  selectedBookId.value = nextData.bookId
  selectedChapterNumber.value = nextData.chapterNumber
  await loadChapterContent();
}

const onPrevChapterButtonClicked = async () => {
  if (pageLoading.value)
    return
  if (!selectedChapter.value)
    return
  const currentChapterSequence = selectedChapter.value.sequenceNumber
  const nextData: BibleChapter = await getPreviousChapterBySequenceNumber(currentChapterSequence)
  if (!nextData)
    return

  selectedBookId.value = nextData.bookId
  selectedChapterNumber.value = nextData.chapterNumber
  await loadChapterContent();
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

const searchModel = ref("");
const handleSearchSubmit = async (event: Event) => {
  event.preventDefault();
  if (searchModel.value && searchModel.value.length) {
    const result = await isBibleReference(searchModel.value);
    if (result) {
      selectedBookId.value = result.book_id;
      selectedChapterNumber.value = result.chapter;

      window.scrollTo({ top: 0 })
      await router.push(
        `/bible?c=${result.chapter}&b=${result.book_id}&vs=${result.verse_start}&ve=${result.verse_end}`
      );
      return getNewVerses();
    } else {
      return router.push(
        `/bible/search?q=${encodeURI(
          searchModel.value.substring(0, 255)
        )}&page=1`
      );
    }
  }
};

async function getNewVerses() {
  console.log("hello")
  const { b, c, vs, ve } = route.query as BiblePageQueryParams

  if (b && c) {
    selectedBookId.value = b || selectedBookId.value
    selectedChapterNumber.value = parseInt(c) || selectedChapterNumber.value
  }

  if (vs && ve) {
    shouldHighlight = true
    highlightRange = [parseInt(vs), ve ? parseInt(ve) : parseInt(vs)]
  }

  availableBooks.value = await getBooks()

  await loadChapterContent()
}

async function copyString(str: string) {
  const el = document.createElement('textarea');
  el.value = str;
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
}

async function handleHighlightVerse(color: string) {
  await highlightVerses(menuVerse.value.book_id, menuVerse.value.chapter, selectedVerses.value, color).then(async () => {
    selectedVerses.value = [];
    openMenu.value = false;
    await loadChapterContent();
  });
}

async function onVerseClicked(verse: number, willHighlight?: boolean) {
  var verseElement = document.getElementById(`verse-${verse}`);
  if ((willHighlight && !verseElement?.classList.contains("verse-selected")) || !willHighlight)
    verseElement?.classList.toggle("verse-selected");
  if (selectedVerses.value.includes(verse) && !willHighlight) {
    selectedVerses.value.splice(selectedVerses.value.indexOf(verse), 1);
  }
  else if (!selectedVerses.value.includes(verse)) {
    selectedVerses.value.push(verse);
  }
  selectedVerses.value.sort(sorter);
}

function sorter(a: number, b: number) {
  if (a < b) return -1;  // any negative number works
  if (a > b) return 1;   // any positive number works
  return 0; // equal values MUST yield zero
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
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
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

.verse-selected {
  background-color: rgb(226 232 240);
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

.prev-next-button {
  width: 24px;
  height: 24px;
  line-height: 24px;
}
</style>