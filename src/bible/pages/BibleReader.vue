<template>
  <AppLayout>
    <div class="bible-reader-toolbar flex flex-row mb-4 sticky top-0 pt-4 pb-4 gap-2 bg-slate-200"
      style="justify-content: center">
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
      <div class="max-w-prose mx-auto h-fit">
        <h2 class="text-center mb-4 mt-2 h-full flex align-middle">
          <div class="m-auto flex flex-col h-full">
            <span class="text-2xl font-bold">{{ selectedBook?.name }}&nbsp;{{ selectedChapterNumber }}</span>
            <span v-if="loadedChapterContent?.info" v-html="loadedChapterContent?.info"></span>
          </div>
        </h2>
      </div>
      <Spinner class="mx-auto" v-if="pageLoading"></Spinner>
      <div v-else class="bible-reader-content max-w-prose mx-auto leading-loose">
        <p v-for="verse in loadedChapterContent.verses" v-touch:longtap="
          () => {
            onVerseClicked(verse.verse_start, true);
            menuVerse = verse;
            openMenu = true;
          }
        " v-touch:tap="() => onVerseClicked(verse.verse_start)" :id="`verse-${verse.verse_start}`" :class="verse.css">
          <span class="verse-number">{{ verse.verse_start }}</span><span class="verse-text">
            <span v-for="word in verse.text_array">
              <button @click="
                handleOpenWordModal(
                  getWordFromPastTense(word.split('|')[1].split('</span>')[0]),
                  verse.verse_start
                )
              " v-if="word.includes('<span') && word.includes('|')"
                class="underline ml-1 font-bold text-red-700 hover:text-red-500 transition-all"
                v-html="word.split('|')[0] + word.split('|')[1]"></button>
              <button @click="
                handleOpenWordModal(
                  getWordFromPastTense(word.split('|')[1]),
                  verse.verse_start
                )
              " v-else-if="word.includes('|')"
                class="underline ml-1 font-bold text-slate-500 hover:text-gray-500 transition-all"
                v-html="word.split('|')[1]"></button>
              <span v-else v-html="' ' + word"></span>
            </span>
          </span>
        </p>
      </div>
    </PageContent>
    <div class="mb-8"></div>
  </AppLayout>
  <AppModal v-model="openMenu" v-slot="{ close }">
    <div class="p-4 text-white flex flex-col gap-2" style="text-align: center">
      <div class="bg-slate-200 p-2 rounded text-black">
        <p class="font-bold">
          {{
            menuVerse.book_name + " " + menuVerse.chapter + ":" + menuVerse.verse_start
          }}
        </p>
        <p v-html="menuVerse.text"></p>
      </div>
      <div v-if="notesVerseIsIn.length" class="w-full flex flex-col justify-center">
        <div class="flex flex-row justify-center align-center">
          <Icon :size="20" icon-name="note" class="text-black"></Icon>
          <p class="font-bold text-lg underline text-slate-800 mb-1">
            Notes on This Verse:
          </p>
        </div>
        <div class="flex flex-col gap-2">
          <div v-for="note in notesVerseIsIn">
            <RouterLink :to="`/note/${note.id}`"><button
                class="mx-auto bg-gray-200 hover:bg-gray-100 active:bg-gray-300 transition-all p-2 rounded w-full md:w-1/2 text-black"
                @click="">
                {{ note.title }}
              </button></RouterLink>
          </div>
        </div>
      </div>
      <div class="w-full flex flex-col justify-center">
        <div class="flex flex-row justify-center align-center">
          <Icon :size="20" icon-name="pencil" class="text-black"></Icon>
          <p class="font-bold text-lg underline text-slate-800 mb-1">
            Highlight Selected Verses:
          </p>
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
        @click="
          copyString(
            menuVerse.book_name +
            ' ' +
            menuVerse.chapter +
            ':' +
            menuVerse.verse_start +
            ' - ' +
            menuVerse.text.replaceAll('<em>', '').replaceAll('</em>', '')
          )
        ">
        Copy Verse
      </button>
      <button
        class="mx-auto bg-yellow-500 hover:bg-yellow-400 active:bg-yellow-600 transition-all p-2 rounded w-full md:w-1/2"
        @click="noteModal = true">
        Add Note
      </button>
    </div>
  </AppModal>
  <AppModal v-model="noteModal" v-slot="{ close }">
    <div class="p-4 text-white flex flex-col gap-2" style="text-align: center">
      <div class="bg-slate-200 rounded text-black">
        <input v-model="noteTitle" placeholder="Note Title" class="text-black w-full h-full p-2 bg-slate-200 rounded" />
      </div>
      <div class="w-full flex flex-col justify-center">
        <textarea v-model="noteText" class="text-black bg-slate-100 rounded p-1 h-64"></textarea>
      </div>
      <button class="mx-auto bg-cyan-500 hover:bg-cyan-400 active:bg-cyan-600 transition-all p-2 rounded w-full md:w-1/2"
        @click="
          createNote(
            selectedBookId,
            selectedChapterNumber,
            selectedVerses,
            noteTitle,
            noteText
          ); reloadNotes();">
        Add
      </button>
    </div>
  </AppModal>
  <AppModal v-model="wordDefModal" v-slot="{ close }">
    <div class="px-4 pb-4 text-white flex flex-col gap-2" style="text-align: center">
      <div>
        <p class="font-bold text-2xl text-black">{{ wordDef?.word }}</p>
        <p class="font-bold text-black">{{ wordDef?.pronunciation }}</p>
      </div>
      <div class="bg-slate-200 p-2 rounded text-black" v-for="definition in wordDef?.definitions">
        <p class="font-bold">{{ definition.type }}</p>
        <p v-html="definition.text"></p>
      </div>
    </div>
  </AppModal>
  <AppModal v-model="audioModal" v-slot="{ close }">
    <div class="px-4 py-4 text-white flex flex-col gap-2 text-center">
      <p class="text-2xl text-black font-bold">Sleep Timer:</p>
      <div class="flex items-center justify-center flex-col md:grid md:grid-rows-2 md:grid-flow-col w-full gap-2">
        <button v-for="choice in timerChoices" @click="currentTimerSelection = choice.time" class="w-24">
          <p v-if="currentTimerSelection == choice.time" class="text-white bg-red-600 rounded p-1 w-full text-sm">
            {{ choice.label }}
          </p>
          <p v-else class="text-white bg-slate-600 rounded p-1 w-full text-sm">
            {{ choice.label }}
          </p>
        </button>
      </div>
      <Divider></Divider>
      <div class="text-white flex justify-center">
        <button @click="startBibleAudio(currentTimerSelection)" class="p-2 bg-slate-700 rounded w-24">
          Play
        </button>
      </div>
    </div>
  </AppModal>
  <div class="w-full fixed bottom-0 left-0">
    <div class="w-full h-full flex">
      <AppButton v-if="globalAudioState == AudioPlayerState.hidden" @click="onPrevChapterButtonClicked" variant="primary-outline"
        class="ml-4 md:ml-48 mr-auto h-14 mb-12 bg-white" size="sm">
        <img src="/mdi/chevron-left.svg" class="my-1 prev-next-button" />
      </AppButton>
      <AppButton v-else @click="onPrevChapterButtonClicked" variant="primary-outline"
        class="ml-4 md:ml-48 mr-auto h-14 mb-44 md:mb-24 bg-white" size="sm">
        <img src="/mdi/chevron-left.svg" class="my-1 prev-next-button" />
      </AppButton>
      <Transition name="audioBiblePlayerButton">
        <button v-if="audioModal == false && globalAudioState == AudioPlayerState.hidden"  @click="audioModal = true"
          class="w-14 h-14 mb-12 bg-gray-300 border-2 border-gray-400 rounded-full drop-shadow-2xl">
          <img src="/mdi/play.svg" class="m-2" />
        </button>
      </Transition>
      <AppButton v-if="globalAudioState == AudioPlayerState.hidden" @click="onNextChapterButtonClicked" variant="primary-outline"
        class="mr-4 md:mr-48 ml-auto h-14 mb-12 bg-white" size="sm">
        <img src="/mdi/chevron-right.svg" class="my-1 prev-next-button" />
      </AppButton>
      <AppButton v-else @click="onNextChapterButtonClicked" variant="primary-outline"
        class="mr-4 md:mr-48 ml-auto h-14 mb-44 md:mb-24 bg-white" size="sm">
        <img src="/mdi/chevron-right.svg" class="my-1 prev-next-button" />
      </AppButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useBreakpoint } from "../../browser/ViewportService";
import { onMounted, ref, watch } from "vue";
import AppLayout from "../../components/templates/AppLayout.vue";
import PageContent from "../../components/templates/PageContent.vue";
import {
  getBooks,
  getChaptersByBookId,
  getVerses,
  getPreviousChapterBySequenceNumber,
  getNextChapterBySequenceNumber,
} from "../../bible/services/BibleService";
import { BibleChapter } from "../../bible/BibleChapter";
import { computed } from "@vue/reactivity";
import {
  setLocalCacheItem,
  getLocalCacheItem,
} from "../../cache/services/LocalStorageService";
import Icon from "../../components/atoms/Icon.vue";
import AppButton from "../../components/atoms/form-controls/AppButton.vue";
import { BibleBook } from "../BibleBook";
import { useRoute, useRouter } from "vue-router";
import AppSelect from "../../components/atoms/form-controls/AppSelect.vue";
import AppInput from "../../components/atoms/form-controls/AppInput.vue";
import AppModal from "../../components/templates/AppModal.vue";
import Spinner from "../../components/atoms/Spinner.vue";
import {
  isBibleReference,
  getHighlightedVerses,
  highlightVerses,
} from "../../bible/services/BibleService";
import { createNote, getAllNotesInChapter } from "../../notes/services/NoteService";
import { Word } from "../../websters/Word";
import { getWord } from "../../websters/services/WebstersService";
import { Preferences } from "@capacitor/preferences";
import {
  AudioPlayerState,
  useGlobalAudioPlayer,
} from "../../components/organisms/AudioPlayer/AudioPlayerService";
import Config from "../../config/services/ConfigService";
import Divider from "../../components/atoms/Divider.vue";

export interface BiblePageQueryParams {
  c?: string; //chapter
  b?: string; // book
  vs?: string; // verse-start
  ve?: string; //verse-end
}
export interface LocalBibleSelectionCache {
  selectedBookId: string;
  selectedChapter: number;
}

const { breakpoint } = useBreakpoint();

const localCacheKeyLastLoadedChapter = "__scripture_alone_last_loaded_bible_info__";

const availableBooks = ref<BibleBook[]>([]);
const availableChapters = ref<BibleChapter[]>([]);

const selectedBookId = ref("JHN");
const selectedChapterNumber = ref(1);
const selectedVerses = ref<any[]>([]);

const loadedChapterContent = ref<any>([]);
const pageLoading = ref(false);

const openMenu = ref(false);
const menuVerse = ref({
  text: "",
  verse_start: "",
  book_name: "",
  chapter: "",
  book_id: "",
});
const noteTitle = ref("");
const noteText = ref("");
const noteModal = ref(false);
const wordDefModal = ref(false);
const wordDef = ref<Word>();
const audioModal = ref(false);
const availableNotes = ref<any[]>([]);
const notesVerseIsIn = ref<any[]>([]);

const audioTimer = ref();
const currentTimerSelection = ref(0);
const timerChoices = [
  { label: "No Timer", time: 0 },
  { label: "5 Min.", time: 300000 },
  { label: "10 Min.", time: 600000 },
  { label: "15 Min.", time: 900000 },
  { label: "20 Min.", time: 1200000 },
  { label: "30 Min.", time: 1800000 },
  { label: "1 Hr.", time: 3600000 },
  { label: "1 Hr. 30 Min.", time: 5400000 },
];

let shouldHighlight = false;
let highlightRange: number[] = [];

const router = useRouter();
const route = useRoute();

const platform = ref("");
const connectedToWifi = ref({ connected: false });

const selectedBook = computed(() =>
  availableBooks.value.find((book: any) => book.bookId === selectedBookId.value)
);
const selectedChapter = computed(() => {
  return availableChapters.value.find(
    (chapter: any) => chapter.chapterNumber == selectedChapterNumber.value
  );
});

const WebstersWords = ref<any[]>([]);

/**
 * Query the API to download the text for a bible.
 */
const loadChapterContent = async () => {
  loadedChapterContent.value = { info: "", verses: [] };
  pageLoading.value = true;
  try {
    if (platform.value != "web")
      await Preferences.set({
        key: "LastBibleData",
        value: JSON.stringify({
          book: selectedBookId.value,
          chapter: selectedChapterNumber.value,
        }),
      });

    const response = await getVerses(selectedBookId.value, selectedChapterNumber.value);

    loadedChapterContent.value.info = response.info;

    var versesHighlights: any;
    var chapterText: any[] = [];
    if (
      (connectedToWifi.value && connectedToWifi.value.connected) ||
      platform.value == "web"
    )
      versesHighlights = await getHighlightedVerses(
        response.verses[0].book_id,
        response.verses[0].chapter.toString()
      );

    var ChristsWords = false;
    var isItalics = false;
    response.verses.forEach((verse: any) => {
      var tempVerseText: any = [];

      let verseCssClass = "cursor-pointer transition-all px-2 verse";
      if (
        shouldHighlight &&
        highlightRange.length &&
        verse.verse_start >= highlightRange[0] &&
        verse.verse_start <= highlightRange[1]
      )
        verseCssClass += " verse-highlight";

      if (typeof verse.text === "string" || verse.text instanceof String)
        tempVerseText = verse.text.split(" ");
      var transformedTempVerseText: any = [];
      tempVerseText.forEach((word: string, index: number) => {
        if (
          WebstersWords.value.includes(
            (word.charAt(0).toUpperCase() + word.slice(1)).slice(0, word.length)
          ) ||
          WebstersWords.value.includes(
            (word.charAt(0).toUpperCase() + word.slice(1)).slice(0, word.length - 1)
          )
        )
          word = `|${word}`;

        let push = true;

        if (word.includes("<em>") && !word.includes("</em>")) isItalics = true;
        else if (!word.includes("<em>") && word.includes("</em>")){
          word = `<em>${word}</em>`;
          isItalics = false;
        }
        if (isItalics) word = `<em>${word}</em>`;

        if (word == '"JESUS_START"') {
          ChristsWords = true;
          push = false;
        } else if (word == '"JESUS_END"') {
          ChristsWords = false;
          push = false;
        } else if (ChristsWords) word = `<span class="text-red-500">${word}</span>`;

        if (push) transformedTempVerseText.push(word);

        if (index == tempVerseText.length - 1)
          verse.text_array = transformedTempVerseText;
      });

      var highlightColor = "";
      if (versesHighlights) {
        versesHighlights.verse_data.forEach((highlightVerse: any) => {
          if (verse.verse_start == highlightVerse.verse) {
            verseCssClass += ` verse-highlighted-${highlightVerse.color}`;
            highlightColor = highlightVerse.color;
          }
        });
      }

      let object = { ...verse, css: verseCssClass, highlight: highlightColor || "" };
      chapterText.push(object);
    });

    loadedChapterContent.value.verses = chapterText;

    availableChapters.value = await getChaptersByBookId(selectedBookId.value);
    await setLocalCacheItem(
      localCacheKeyLastLoadedChapter,
      {
        selectedBookId: selectedBookId.value || "JHN",
        selectedChapter: selectedChapterNumber.value || 1,
      },
      true
    );

    router.replace({
      path: "/bible",
      query: { ...route.query, b: selectedBookId.value, c: selectedChapterNumber.value },
    });
    if (shouldHighlight)
      setTimeout(() => {
        document.querySelector(`#verse-${highlightRange[0]}`)?.scrollIntoView();
      }, 100);
    else window.scrollTo({ top: 0 });

    shouldHighlight = false;
    await reloadNotes();
  } catch (err) {
    console.log(err);
  }
  pageLoading.value = false;
};

async function reloadNotes() {
  if (
    (connectedToWifi.value && connectedToWifi.value.connected) ||
    platform.value == "web"
  )
    availableNotes.value = await getAllNotesInChapter(
      selectedBookId.value,
      selectedChapterNumber.value
    );
}

onMounted(async () => {
  WebstersWords.value = (await import("../../assets/websters/words.json")).default;
  connectedToWifi.value = await getLocalCacheItem("__network_status__", true);
  platform.value = await getLocalCacheItem("__platform__", false);
  await getNewVerses();
  watch(
    () => openMenu.value,
    () => {
      if (openMenu.value) {
        availableNotes.value.forEach((note) => {
          note.verses.forEach((verse: any) => {
            if (verse == menuVerse.value.verse_start) {
              notesVerseIsIn.value.push(note);
            }
          });
        });
      } else {
        notesVerseIsIn.value = [];
      }
    }
  );
});

function getWordFromPastTense(word: string) {
  return WebstersWords.value.includes(
    (word.charAt(0).toUpperCase() + word.slice(1)).slice(0, word.length)
  )
    ? word.toLowerCase()
    : word.slice(0, word.length - 1).toLowerCase();
}

const {
  setGlobalAudioPayload,
  setGlobalAudioState,
  globalAudioState,
} = useGlobalAudioPlayer();

async function startBibleAudio(timer: number) {
  let url = Config.bibleAudioUrl;
  availableBooks.value.forEach((book, i) => {
    if (book.bookId === selectedBookId.value) {
      if (i + 1 > 10) url += i + 1;
      else if (i + 1 < 10) url += `0${i + 1}`;

      url += `_${book.name.replace(" ", "")}_`;
    }
  });
  if (selectedChapterNumber.value > 99) url += selectedChapterNumber.value;
  else if (selectedChapterNumber.value > 9) url += `0${selectedChapterNumber.value}`;
  else url += `00${selectedChapterNumber.value}`;

  url += ".mp3";

  console.log(url);

  setGlobalAudioPayload({
    id: `${selectedBookId.value}.${selectedChapterNumber.value}`,
    title: `${await selectedBook.value?.name} ${selectedChapterNumber.value}`,
    author: "",
    currentTime: 0,
    url,
    contentPage: `/bible?b=${selectedBookId.value}&c=${selectedChapterNumber.value}`,
    additionalData: {
      selectedBookId: selectedBookId.value,
      selectedChapterNumber: selectedChapterNumber.value,
      selectedBook: selectedBook.value?.name,
    },
  });

  setGlobalAudioState(AudioPlayerState.playing);
  audioModal.value = false;

  if (timer != 0) {
    audioTimer.value = setTimeout(function () {
      setGlobalAudioState(AudioPlayerState.paused);
    }, timer);
  }
}

watch(
  () => globalAudioState.value,
  (currentValue) => {
    if (currentValue === AudioPlayerState.hidden && currentTimerSelection.value != 0) {
      currentTimerSelection.value = 0;
      clearTimeout(audioTimer.value);
    }
  }
);

// Event Handlers

async function handleOpenWordModal(word: string, verse: number) {
  await onVerseClicked(verse);
  wordDef.value = await getWord(word.toLowerCase());
  wordDef.value.definitions.forEach((def) => {
    def.text = def.text.replaceAll("\n", "<br>");
  });
  wordDefModal.value = true;
}

const onNextChapterButtonClicked = async () => {
  if (!selectedChapter.value) return;
  const currentChapterSequence = selectedChapter.value.sequenceNumber;
  const nextData: BibleChapter = await getNextChapterBySequenceNumber(
    currentChapterSequence
  );
  if (!nextData) return;
  selectedBookId.value = nextData.bookId;
  selectedChapterNumber.value = nextData.chapterNumber;
  await loadChapterContent();
};

const onPrevChapterButtonClicked = async () => {
  if (!selectedChapter.value) return;
  const currentChapterSequence = selectedChapter.value.sequenceNumber;
  const nextData: BibleChapter = await getPreviousChapterBySequenceNumber(
    currentChapterSequence
  );
  if (!nextData) return;

  selectedBookId.value = nextData.bookId;
  selectedChapterNumber.value = nextData.chapterNumber;
  await loadChapterContent();
};

const onSelectedBookIdChanged = async (value: any) => {
  selectedBookId.value = value;
  selectedChapterNumber.value = 1;

  availableChapters.value = await getChaptersByBookId(selectedBookId.value);
  await loadChapterContent();
};

const onSelectedChapterNumberChanged = async (value: any) => {
  selectedChapterNumber.value = value;
  await loadChapterContent();
};

const searchModel = ref("");
const handleSearchSubmit = async (event: Event) => {
  event.preventDefault();
  if (searchModel.value && searchModel.value.length) {
    const result = await isBibleReference(searchModel.value);
    if (result) {
      selectedBookId.value = result.book_id;
      selectedChapterNumber.value = result.chapter;

      window.scrollTo({ top: 0 });
      await router.push(
        `/bible?c=${result.chapter}&b=${result.book_id}&vs=${result.verse_start}&ve=${result.verse_end}`
      );
      return getNewVerses();
    } else {
      return router.push(
        `/bible/search?q=${encodeURI(searchModel.value.substring(0, 255))}&page=1`
      );
    }
  }
};

async function getNewVerses() {
  let { b, c, vs, ve } = route.query as BiblePageQueryParams;

  if (!b && !c && platform.value != "web") {
    const ret: any = await Preferences.get({ key: "LastBibleData" });
    if (ret.value) {
      const data = JSON.parse(ret.value);

      b = data.book;
      c = data.chapter;
    }
  }

  if (b && c) {
    selectedBookId.value = b || selectedBookId.value;
    selectedChapterNumber.value = parseInt(c) || selectedChapterNumber.value;
  }

  if (vs && ve) {
    shouldHighlight = true;
    highlightRange = [parseInt(vs), ve ? parseInt(ve) : parseInt(vs)];
  }

  availableBooks.value = await getBooks();

  await loadChapterContent();
}

async function copyString(str: string) {
  const el = document.createElement("textarea");
  el.value = str;
  el.setAttribute("readonly", "");
  el.style.position = "absolute";
  el.style.left = "-9999px";
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
}

async function handleHighlightVerse(color: string) {
  await highlightVerses(
    menuVerse.value.book_id,
    menuVerse.value.chapter,
    selectedVerses.value,
    color
  ).then(async () => {
    selectedVerses.value = [];
    openMenu.value = false;
    await loadChapterContent();
  });
}

async function onVerseClicked(verse: number, willHighlight?: boolean) {
  var verseElement = document.getElementById(`verse-${verse}`);
  if (
    (willHighlight && !verseElement?.classList.contains("verse-selected")) ||
    !willHighlight
  )
    verseElement?.classList.toggle("verse-selected");
  if (selectedVerses.value.includes(verse) && !willHighlight) {
    selectedVerses.value.splice(selectedVerses.value.indexOf(verse), 1);
  } else if (!selectedVerses.value.includes(verse)) {
    selectedVerses.value.push(verse);
  }
  selectedVerses.value.sort(sorter);
}

function sorter(a: number, b: number) {
  if (a < b) return -1; // any negative number works
  if (a > b) return 1; // any positive number works
  return 0; // equal values MUST yield zero
}
</script>

<style>
.bible-reader-content>p {
  text-indent: 1.5em;
}

.bible-reader-content .wj {
  color: theme("colors.red.700");
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
  background-color: rgba(255, 255, 0, 0.4);
}

.verse-highlighted-green {
  background-color: rgba(0, 255, 0, 0.2);
}

.verse-highlighted-blue {
  background-color: rgba(0, 0, 255, 0.2);
}

.verse-highlighted-red {
  background-color: rgba(255, 0, 0, 0.2);
}

.verse-highlighted-pink {
  background-color: rgba(255, 0, 170, 0.2);
}

.verse-highlighted-yellow {
  background-color: rgba(217, 255, 0, 0.2);
}

.verse-selected {
  background-color: rgb(226 232 240);
}

@keyframes highlightFade {
  from {
    background-color: rgba(255, 255, 0, 1);
  }

  to {
    background-color: rgba(255, 255, 0, 0.2);
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

.audioBiblePlayerButton-enter-active {
  animation: jump-in 0.7s ease;
  max-height: 100%;
}

.audioBiblePlayerButton-leave-active {
  animation: jump-out 0.7s ease;
  max-height: 100%;
}

@keyframes jump-in {
  0% {
    transform: translateY(10em);
  }

  25% {
    transform: translateY(-3em);
  }

  100% {
    transform: translateY(0em);
  }
}

@keyframes jump-out {
  0% {
    transform: translateY(0em);
  }

  25% {
    transform: translateY(-3em);
  }

  100% {
    transform: translateY(10em);
  }
}
</style>
